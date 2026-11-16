import {execFileSync} from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import {
  downloadWhisperModel,
  installWhisperCpp,
  transcribe,
} from "@remotion/install-whisper-cpp";

const WHISPER_VERSION = "1.5.5";
const MODEL = "small";
const WHISPER_FOLDER = "whisper.cpp";
const AUDIO = "public/narracion.wav";
const AUDIO_16K = "public/narracion-16k.wav";
const OUTPUT = "public/captions.json";

const root = process.cwd();

if (!fs.existsSync(AUDIO)) {
  throw new Error(`Missing ${AUDIO}. Run "npm run build:audio" first.`);
}

console.log("Converting narration to 16 kHz mono WAV...");
execFileSync(
  "ffmpeg",
  ["-y", "-i", AUDIO, "-ar", "16000", "-ac", "1", "-c:a", "pcm_s16le", AUDIO_16K],
  {stdio: "inherit"},
);

console.log(`Installing whisper.cpp ${WHISPER_VERSION}...`);
await installWhisperCpp({
  version: WHISPER_VERSION,
  to: path.join(root, WHISPER_FOLDER),
  printOutput: true,
});

console.log(`Downloading Whisper model "${MODEL}"...`);
await downloadWhisperModel({
  model: MODEL,
  folder: path.join(root, WHISPER_FOLDER),
  printOutput: true,
});

console.log("Transcribing narration in Spanish...");
const whisperCppOutput = await transcribe({
  inputPath: path.resolve(AUDIO_16K),
  whisperPath: path.join(root, WHISPER_FOLDER),
  whisperCppVersion: WHISPER_VERSION,
  model: MODEL,
  language: "es",
  tokenLevelTimestamps: true,
  additionalArgs: ["--split-on-word"],
  printOutput: true,
});

const DTW_OFFSET_MS = -150;

const captions = whisperCppOutput.transcription
  .filter((item) => item.text.trim() !== "")
  .map((item) => {
    const token = item.tokens.find((word) => word.t_dtw >= 0);
    const startMs = token
      ? Math.max(0, token.t_dtw * 10 + DTW_OFFSET_MS)
      : item.offsets.from;
    return {
      text: item.text,
      startMs,
      endMs: startMs,
      timestampMs: token ? startMs : null,
      confidence: item.tokens[0].p,
    };
  });

if (captions.length === 0) {
  throw new Error("Whisper returned no captions.");
}

const timing = JSON.parse(
  fs.readFileSync(path.join(root, "src", "narration-timing.json"), "utf8"),
);
const guion = fs.readFileSync(path.join(root, "scripts", "guion.txt"), "utf8");
const sections = guion
  .split(/\n\s*\n/)
  .map((section) => section.trim())
  .filter(Boolean);

if (sections.length !== timing.sections.length) {
  throw new Error("guion.txt and narration-timing.json have different section counts.");
}

const normalize = (text) =>
  text
    .toLocaleLowerCase("es")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "");

const levenshtein = (a, b) => {
  const dp = Array.from({length: a.length + 1}, () => Array(b.length + 1).fill(0));
  for (let i = 0; i <= a.length; i++) dp[i][0] = i;
  for (let j = 0; j <= b.length; j++) dp[0][j] = j;
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      dp[i][j] = Math.min(
        dp[i - 1][j] + 1,
        dp[i][j - 1] + 1,
        dp[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1),
      );
    }
  }
  return dp[a.length][b.length];
};

const substitutionCost = (known, heard) => {
  const a = normalize(known);
  const b = normalize(heard);
  if (a === b) return 0;
  return levenshtein(a, b) / Math.max(a.length, b.length, 1);
};

const mergeCost = (known, first, second) => {
  const a = normalize(known);
  const b = normalize(first) + normalize(second);
  if (!a || !b) return 1;
  return Math.min(1, levenshtein(a, b) / Math.max(a.length, b.length));
};

const alignWords = (knownWords, heardWords) => {
  const n = knownWords.length;
  const m = heardWords.length;
  const dp = Array.from({length: n + 1}, () => Array(m + 1).fill(Infinity));
  const back = Array.from({length: n + 1}, () => Array(m + 1).fill(null));
  dp[0][0] = 0;

  const relax = (i, j, cost, step) => {
    if (cost < dp[i][j]) {
      dp[i][j] = cost;
      back[i][j] = step;
    }
  };

  for (let i = 0; i <= n; i++) {
    for (let j = 0; j <= m; j++) {
      if (!Number.isFinite(dp[i][j])) continue;
      if (i < n && j < m) {
        relax(i + 1, j + 1, dp[i][j] + substitutionCost(knownWords[i], heardWords[j].text), {
          i,
          j,
          span: 1,
        });
      }
      if (i < n && j + 1 < m) {
        relax(
          i + 1,
          j + 2,
          dp[i][j] + mergeCost(knownWords[i], heardWords[j].text, heardWords[j + 1].text),
          {i, j, span: 2},
        );
      }
      if (j < m) {
        relax(i, j + 1, dp[i][j] + 0.85, {i, j, span: 0});
      }
    }
  }

  const actions = [];
  let i = n;
  let j = m;
  while (i > 0 || j > 0) {
    const step = back[i][j];
    if (!step) throw new Error("Could not align Whisper output with guion.txt.");
    actions.push(step);
    i = step.i;
    j = step.j;
  }

  return actions.reverse();
};

const corrected = [];
let sectionIndex = 0;
for (const section of sections) {
  const boundary = timing.sections[sectionIndex + 1]?.sceneStartMs ?? Infinity;
  const heard = captions.filter(
    (caption) =>
      caption.startMs < boundary &&
      caption.startMs >= timing.sections[sectionIndex].narrationStartMs - 200,
  );
  const knownWords = section.split(/\s+/).filter(Boolean);
  const actions = alignWords(knownWords, heard);

  for (const action of actions) {
    if (action.span === 0) continue;
    const heardSlice = heard.slice(action.j, action.j + action.span);
    const first = heardSlice[0];
    const last = heardSlice[heardSlice.length - 1];
    corrected.push({
      text: `${corrected.length === 0 ? "" : " "}${knownWords[action.i]}`,
      startMs: first.startMs,
      endMs: last.endMs,
      timestampMs: first.timestampMs,
      confidence: Math.min(...heardSlice.map((word) => word.confidence ?? 0)),
    });
  }
  sectionIndex++;
}

for (let index = 0; index < corrected.length; index++) {
  const word = corrected[index];
  const nextStart = corrected[index + 1]?.startMs ?? Infinity;
  const estimated = Math.max(220, Math.min(900, 140 + normalize(word.text).length * 60));
  word.endMs = Math.max(
    word.startMs + 60,
    Math.min(nextStart, word.startMs + estimated),
  );
}

fs.writeFileSync(OUTPUT, `${JSON.stringify(corrected, null, 2)}\n`);
fs.rmSync(AUDIO_16K, {force: true});

console.log(`Wrote ${OUTPUT} (${corrected.length} words)`);

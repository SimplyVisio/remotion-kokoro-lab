#!/usr/bin/env python3
"""Generate Spanish narration with Kokoro and write scene timing metadata.

Usage:
  python scripts/tts.py "$(cat scripts/guion.txt)" public/narracion.wav

Sections are separated by blank lines. Each section becomes one scene. A
constant lead-in, gap and tail make room for the scene crossfades, and the
scene boundaries are placed at the midpoint of each gap.
"""

import argparse
import json
import re
import subprocess
from pathlib import Path

import numpy as np
import soundfile as sf
from kokoro import KPipeline

SAMPLE_RATE = 24000
LEAD_IN_MS = 400
GAP_MS = 750
TAIL_MS = 800


def ms_to_samples(ms: int) -> int:
    return round((ms / 1000) * SAMPLE_RATE)


def split_sections(text: str) -> list[str]:
    return [s.strip() for s in re.split(r"\n\s*\n", text.strip()) if s.strip()]


def synthesize(pipeline: KPipeline, text: str, voice: str, speed: float) -> np.ndarray:
    chunks = [
        result.audio.numpy()
        for result in pipeline(text, voice=voice, speed=speed)
        if result.audio is not None
    ]
    if not chunks:
        raise RuntimeError(f"Kokoro produced no audio for: {text!r}")
    return np.concatenate(chunks).astype(np.float32)


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("text", help="Narration script (sections separated by blank lines)")
    parser.add_argument("output", help="Output WAV path")
    parser.add_argument("--voice", default="ef_dora", help="Kokoro voice (default: ef_dora)")
    parser.add_argument("--speed", type=float, default=1.0)
    parser.add_argument(
        "--timing",
        default=str(Path(__file__).resolve().parent.parent / "src" / "narration-timing.json"),
        help="Scene timing JSON output path",
    )
    args = parser.parse_args()

    sections = split_sections(args.text)
    if not sections:
        raise SystemExit("The narration script is empty.")

    pipeline = KPipeline(lang_code="e")

    lead = np.zeros(ms_to_samples(LEAD_IN_MS), dtype=np.float32)
    gap = np.zeros(ms_to_samples(GAP_MS), dtype=np.float32)
    tail = np.zeros(ms_to_samples(TAIL_MS), dtype=np.float32)

    pieces: list[np.ndarray] = [lead]
    cursor = lead.size
    section_data = []

    for index, text in enumerate(sections):
        audio = synthesize(pipeline, text, args.voice, args.speed)
        start = cursor
        pieces.append(audio)
        cursor += audio.size
        end = cursor

        section_data.append(
            {
                "index": index,
                "text": text,
                "narrationStartMs": round(start / SAMPLE_RATE * 1000),
                "narrationEndMs": round(end / SAMPLE_RATE * 1000),
            }
        )

        if index < len(sections) - 1:
            pieces.append(gap)
            cursor += gap.size
        else:
            pieces.append(tail)
            cursor += tail.size

    total_samples = sum(piece.size for piece in pieces)
    audio = np.clip(np.concatenate(pieces), -1.0, 1.0)

    output = Path(args.output)
    output.parent.mkdir(parents=True, exist_ok=True)
    raw_output = output.with_name(f"{output.stem}.raw{output.suffix}")
    sf.write(raw_output, audio, SAMPLE_RATE, subtype="PCM_16")

    subprocess.run(
        [
            "ffmpeg",
            "-y",
            "-loglevel",
            "error",
            "-i",
            str(raw_output),
            "-af",
            "loudnorm=I=-16:TP=-1.5:LRA=7",
            "-ar",
            str(SAMPLE_RATE),
            str(output),
        ],
        check=True,
    )
    raw_output.unlink()

    for index, section in enumerate(section_data):
        if index == 0:
            scene_start = 0
        else:
            previous_end = section_data[index - 1]["narrationEndMs"]
            scene_start = round((previous_end + section["narrationStartMs"]) / 2)
        section["sceneStartMs"] = scene_start

    for index, section in enumerate(section_data):
        if index < len(section_data) - 1:
            section["sceneEndMs"] = section_data[index + 1]["sceneStartMs"]
        else:
            section["sceneEndMs"] = round(total_samples / SAMPLE_RATE * 1000)

    timing = {
        "audioFile": output.name,
        "sampleRate": SAMPLE_RATE,
        "voice": args.voice,
        "totalMs": round(total_samples / SAMPLE_RATE * 1000),
        "sections": section_data,
    }

    timing_path = Path(args.timing)
    timing_path.parent.mkdir(parents=True, exist_ok=True)
    timing_path.write_text(json.dumps(timing, indent=2, ensure_ascii=False) + "\n")

    print(f"Wrote {output} ({timing['totalMs'] / 1000:.2f}s)")
    print(f"Wrote {timing_path}")
    for section in section_data:
        duration = (section["sceneEndMs"] - section["sceneStartMs"]) / 1000
        print(f"  {section['index'] + 1}. scene {duration:.2f}s")


if __name__ == "__main__":
    main()

# Remotion + Kokoro + Whisper

## Stack

- TypeScript + React + Remotion `4.0.543`.
- Preview: `npm run dev` (Remotion Studio en `http://localhost:3000`).
- Render: `npm run render` → `out/langgraph.mp4`.
- Narración local: Kokoro `0.9.4` en `.venv-tts`.
- Subtítulos: Whisper.cpp `1.5.5` + `@remotion/captions`.

## Comandos

```bash
npm run dev          # Remotion Studio
npm run lint         # ESLint + TypeScript
npm run build        # bundle de Remotion
npm run render       # render del ejemplo
npm run build:audio  # Kokoro + Whisper
bash scripts/setup.sh
```

`build:audio` requiere `.venv-tts` y FFmpeg. La primera ejecución descarga modelos y tarda varios minutos.

## Reglas de animación

- Toda animación depende de `useCurrentFrame()`, con `interpolate()` o `spring()`.
- Prohibido usar transiciones CSS, animaciones CSS o `setTimeout`.
- Usa `<Sequence>` para timing y `<Series>` para escenas consecutivas.
- Audio, video e imágenes van en `public/` y se cargan con `staticFile()`.
- Componentes reutilizables en `src/components/`; una composición por archivo.
- Carga la skill de Remotion correspondiente antes de escribir código nuevo.

## Flujo de una composición

1. Crear o editar la composición en `src/`.
2. Registrarla en `src/Root.tsx`.
3. Verificar en Studio.
4. Ejecutar `npm run lint` y renderizar a `out/` solo cuando se pida.

`src/Root.tsx` usa `calculateMetadata` para ajustar `durationInFrames` a la duración real de `public/narracion.wav`. `src/timing.ts` reparte los frames entre escenas; la última absorbe el redondeo final.

## Guion, audio y subtítulos

- `scripts/guion.txt`: una sección por escena, separadas por una línea en blanco. Mantén el número de secciones igual al número de escenas de `src/LangGraphExplainer.tsx`.
- `scripts/tts.py` sintetiza con Kokoro y escribe `public/narracion.wav` y `src/narration-timing.json`.
- `scripts/transcribe.mjs` transcribe con Whisper.cpp en español y escribe `public/captions.json`.
- No edites a mano `src/narration-timing.json` ni `public/captions.json`: son artefactos generados.
- Whisper usa `tokenLevelTimestamps` y `additionalArgs: ["--split-on-word"]`; no cambies a `splitOnWord: true` con la versión actual.
- `src/components/TikTokCaptions.tsx` usa `createTikTokStyleCaptions` y resalta la palabra activa.
- Si existe `public/musica.mp3`, se añade al 12 % con fade-out en los últimos 2 segundos. No subas música sin derechos.

## Skills de agentes

- Skills instaladas en `.agents/skills/`; `.claude/skills` es un enlace a esa carpeta.
- No se incluyen `remotion-maps` ni `remotion-saas`.
- opencode lee este archivo y descubre `.agents/skills/`.
- Claude Code lee `CLAUDE.md`, que importa este archivo, y usa `.claude/skills/`.
- Antigravity lee este archivo y descubre `.agents/skills/`.
- Para reinstalar el subconjunto: `npx skills add remotion-dev/skills --skill ...` (ver README).

## Artefactos y Git

- No versionar `out/`, `.venv-tts/`, `whisper.cpp/`, modelos, `__pycache__/` ni archivos temporales.
- Sí se versionan `public/narracion.wav`, `public/captions.json`, `src/narration-timing.json` y `examples/langgraph.mp4`.
- El MP4 de ejemplo debe quedar por debajo de 10 MB.
- Antes de publicar, ejecuta `npm run lint`, `npm run build` y revisa `git status`.

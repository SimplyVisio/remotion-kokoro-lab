# Prompts de referencia

Estos prompts reproducen el flujo usado para construir el ejemplo. Están pensados para un agente con acceso a las skills de Remotion del repositorio.

## Crear el video

```text
Usa las skills de Remotion de este repositorio.

Crea una composición llamada LangGraphExplainer, de 1920x1080 y 30 fps,
que explique LangGraph en seis escenas:

1. Hook: agentes de IA como grafos.
2. Problema: las cadenas lineales no repiten ni deciden.
3. Conceptos: nodos como funciones que modifican estado y aristas como flujo.
4. Superpoder: aristas condicionales, razonamiento, herramienta y vuelta a razonar.
5. Persistencia: memoria, checkpoints y humano en el loop.
6. Cierre: invita a instalar langgraph y empezar.

Usa un fondo oscuro, acentos turquesa y violeta, tipografía sans, nodos y
aristas dibujados con React. Toda la animación debe depender de
useCurrentFrame() con interpolate() o spring(). Usa Series para las escenas
y componentes reutilizables en src/components/. No uses animaciones CSS ni
setTimeout. Registra la composición en src/Root.tsx.
```

## Añadir narración y subtítulos

```text
Añade narración en español al video con Kokoro y subtítulos palabra a palabra
con Whisper.

Requisitos:

- Escribe el guion en scripts/guion.txt, con una sección por escena separada
  por una línea en blanco.
- Usa la voz ef_dora de Kokoro y genera public/narracion.wav a 24 kHz mono.
- Normaliza el audio con FFmpeg loudnorm a -16 LUFS y -1.5 dBTP.
- Genera src/narration-timing.json con los límites de cada escena y deja
  silencios para los fundidos.
- Transcribe con Whisper.cpp 1.5.5, modelo small, idioma es, timestamps por
  palabra. Corrige el timing con t_dtw, un offset de -150 ms y alineación
  contra el guion.
- Escribe public/captions.json y dibuja los subtítulos con
  createTikTokStyleCaptions, resaltando la palabra activa.
- Ajusta durationInFrames con calculateMetadata a la duración real del audio.
- Si existe public/musica.mp3, mézclala al 12 % con fade-out de 2 segundos.

Añade npm run build:audio y documenta la primera ejecución.
```

## Revisar y exportar

```text
Revisa la composición en Remotion Studio, comprueba que la narración y los
subtítulos están sincronizados y ejecuta npm run lint y npm run build.
Si todo pasa, renderiza el ejemplo a out/langgraph.mp4 y copia el resultado
a examples/langgraph.mp4 con un poster en examples/langgraph-poster.png.
```

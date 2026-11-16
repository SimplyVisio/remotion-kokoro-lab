import { AbsoluteFill } from "remotion";
import { Chip } from "../components/Chip";
import { SceneHeading } from "../components/SceneHeading";
import { SceneShell } from "../components/SceneShell";
import { FONTS } from "../theme";

type Props = {
  durationInFrames: number;
};

export const PersistenceScene: React.FC<Props> = ({durationInFrames}) => {
  return (
    <SceneShell durationInFrames={durationInFrames} accent="violet">
      <SceneHeading
        eyebrow="Persistencia y control"
        title="Control en cada paso"
        subtitle="El grafo recuerda, se reanuda y puede pedir permiso."
      />
      <AbsoluteFill style={{ fontFamily: FONTS.sans }}>
        <Chip
          x={500}
          y={660}
          width={420}
          height={160}
          label="Memoria"
          caption="estado persistente"
          icon="memory"
          accent="teal"
          appearAt={18}
        />
        <Chip
          x={960}
          y={660}
          width={420}
          height={160}
          label="Checkpoints"
          caption="reanudar el flujo"
          icon="checkpoint"
          accent="violet"
          appearAt={28}
        />
        <Chip
          x={1420}
          y={660}
          width={420}
          height={160}
          label="Humano en el loop"
          caption="aprobar decisiones"
          icon="human"
          accent="teal"
          appearAt={38}
        />
      </AbsoluteFill>
    </SceneShell>
  );
};

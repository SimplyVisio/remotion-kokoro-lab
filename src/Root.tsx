import {getAudioDurationInSeconds} from "@remotion/media-utils";
import type {CalculateMetadataFunction} from "remotion";
import {Composition, staticFile} from "remotion";
import {
  LangGraphExplainer,
  type LangGraphExplainerProps,
} from "./LangGraphExplainer";
import {VIDEO} from "./theme";

const getMusicSrc = async (): Promise<string | null> => {
  try {
    const response = await fetch(staticFile("musica.mp3"), {method: "HEAD"});
    return response.ok ? "musica.mp3" : null;
  } catch {
    return null;
  }
};

const calculateLangGraphMetadata: CalculateMetadataFunction<
  LangGraphExplainerProps
> = async ({props}) => {
  const audioSeconds = await getAudioDurationInSeconds(
    staticFile("narracion.wav"),
  );
  const durationInFrames = Math.max(
    1,
    Math.round(audioSeconds * VIDEO.fps),
  );
  const musicSrc = await getMusicSrc();

  return {
    durationInFrames,
    props: {...props, musicSrc},
  };
};

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="LangGraphExplainer"
        component={LangGraphExplainer}
        durationInFrames={VIDEO.durationInFrames}
        fps={VIDEO.fps}
        width={VIDEO.width}
        height={VIDEO.height}
        defaultProps={{musicSrc: null}}
        calculateMetadata={calculateLangGraphMetadata}
      />
    </>
  );
};

import { Params } from "@angular/router";
import {
  ResolvedModelList,
  retrieveResolvedModel,
} from "@baw-api/resolver-common";
import { isInstantiated } from "@helpers/isInstantiated/isInstantiated";
import { Category, menuRoute } from "@interfaces/menusInterfaces";
import { StrongRoute } from "@interfaces/strongRoute";
import { AudioRecording } from "@models/AudioRecording";
import { MediaService } from "@services/media/media.service";

export const listenRoute = StrongRoute.newRoot().add("listen");

/** The duration of audio the old client loads if no `end` is provided */
const oldClientListenSeconds = 30;

const listenRouteQueryParamResolver = (
  { audioRecordingId, start, end, padding }: Params,
  models: ResolvedModelList = {},
): Params => {
  start = isInstantiated(start)
    ? Math.max(0, Math.floor(start) - (padding ?? 0))
    : undefined;
  end = isInstantiated(end) ? Math.ceil(end) + (padding ?? 0) : undefined;

  // stop the old client requesting media past the end of the recording
  const recording = Object.values(models).find(
    (model): model is AudioRecording =>
      model instanceof AudioRecording && model.id === Number(audioRecordingId),
  );
  const windowEnd = end ?? start + oldClientListenSeconds;
  if (recording && windowEnd > recording.durationSeconds!) {
    [, end] = MediaService.clampToRecordingDuration(
      recording,
      start ?? 0,
      windowEnd,
    );
  }

  return { start, end };
};

export const listenCategory: Category = {
  icon: ["fas", "headphones"],
  label: "Listen",
  route: listenRoute,
};

export const listenMenuItem = menuRoute({
  icon: ["fas", "headphones"],
  label: "Listen",
  route: listenRoute,
  tooltip: () => "Listen to recent audio recordings",
});

export const listenRecordingMenuItem = menuRoute({
  icon: ["fas", "play"],
  label: "Play",
  // @ts-ignore: TODO: remove once strict mode is fully enabled, see https://github.com/QutEcoacoustics/workbench-client/issues/2686
  route: listenRoute.add(":audioRecordingId", listenRouteQueryParamResolver),
  tooltip: () => "Listen to an audio recording",
  // TODO #346 Show local date time of recording date using timezone where sensor was. Should show timezone on highlight?
  // @ts-ignore: TODO: remove once strict mode is fully enabled, see https://github.com/QutEcoacoustics/workbench-client/issues/2686
  breadcrumbResolve: (pageInfo) =>
    // @ts-ignore: TODO: remove once strict mode is fully enabled, see https://github.com/QutEcoacoustics/workbench-client/issues/2686
    retrieveResolvedModel(pageInfo, AudioRecording)?.id.toFixed(0),
});

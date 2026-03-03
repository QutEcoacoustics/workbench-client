import { IAudioEventGroup } from "@models/AudioEventGroup";
import { modelData } from "@test/helpers/faker";

export function generateAudioEventGroup(
  data?: Partial<IAudioEventGroup>,
): Required<IAudioEventGroup> {
  return {
    siteId: modelData.id(),
    projectIds: new Set([modelData.id()]),
    regionId: modelData.id(),
    audioEventCount: modelData.datatype.number({ min: 1, max: 100 }),
    latitude: modelData.latitude(),
    longitude: modelData.longitude(),
    locationObfuscated: true,
    ...data,
  };
}

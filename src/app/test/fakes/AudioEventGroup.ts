import { IAudioEventGroup } from "@models/AudioEventGroup";
import { modelData } from "@test/helpers/faker";

export function generateAudioEventGroup(
  data?: Partial<IAudioEventGroup>,
): Required<IAudioEventGroup> {
  return {
    siteId: modelData.id(),
    eventCount: modelData.datatype.number({ min: 1, max: 100 }),
    latitude: modelData.latitude(),
    longitude: modelData.longitude(),
    ...data,
  };
}

import { createServiceFactory, SpectatorService } from "@ngneat/spectator";
import { mockServiceProviders, validateApiFilter, validateApiFilterGroupBy } from "@test/helpers/api-common";
import { AudioEventGroup } from "@models/AudioEventGroup";
import { GroupedAudioEventsService } from "./grouped-audio-events.service";

// TODO: Enable these tests once the server endpoint is complete
// see: https://github.com/QutEcoacoustics/baw-server/issues/852
xdescribe("GroupedAudioEventsService", () => {
  let spec: SpectatorService<GroupedAudioEventsService>;

  const createService = createServiceFactory({
    service: GroupedAudioEventsService,
    providers: mockServiceProviders,
  });

  beforeEach(() => {
    spec = createService();
  });

  validateApiFilterGroupBy(
    () => spec,
    AudioEventGroup,
    "/site/group/audio_events"
  );
});

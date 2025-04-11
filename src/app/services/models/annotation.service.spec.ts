import {
  createServiceFactory,
  SpectatorService,
  SpyObject,
} from "@ngneat/spectator";
import { TagsService } from "@baw-api/tag/tags.service";
import { AudioRecordingsService } from "@baw-api/audio-recording/audio-recordings.service";
import { MediaService } from "@services/media/media.service";
import { AudioEvent } from "@models/AudioEvent";
import { generateAudioEvent } from "@test/fakes/AudioEvent";
import { of } from "rxjs";
import { Tag } from "@models/Tag";
import { AudioRecording } from "@models/AudioRecording";
import { generateAudioRecording } from "@test/fakes/AudioRecording";
import { generateTag } from "@test/fakes/Tag";
import { MockBawApiModule } from "@baw-api/baw-apiMock.module";
import { AssociationInjector } from "@models/ImplementsInjector";
import { ASSOCIATION_INJECTOR } from "@services/association-injector/association-injector.tokens";
import { AnnotationService } from "./annotation.service";

describe("AnnotationService", () => {
  let spec: SpectatorService<AnnotationService>;
  let injector: SpyObject<AssociationInjector>;

  let mockAudioEvent: AudioEvent;
  let mockRecording: AudioRecording;
  let mockTags: Tag[];

  const createService = createServiceFactory({
    service: AnnotationService,
    imports: [MockBawApiModule],
    providers: [
      { provide: TagsService, useValue: mockTagsService() },
      { provide: AudioRecordingsService, useValue: mockRecordingsService() },
      MediaService,
    ],
  });

  function mockTagsService() {
    return { filter: () => of(mockTags) };
  }

  function mockRecordingsService() {
    return { show: () => of(mockRecording) };
  }

  function setup(): void {
    spec = createService();
    injector = spec.inject(ASSOCIATION_INJECTOR);

    mockAudioEvent = new AudioEvent(generateAudioEvent(), injector);
    mockRecording = new AudioRecording(generateAudioRecording(), injector);
    mockTags = Array.from(
      { length: 5 },
      () => new Tag(generateTag(), injector),
    );
  }

  beforeEach(() => {
    setup();
  });

  it("should create", () => {
    expect(spec.service).toBeInstanceOf(AnnotationService);
  });

  describe("show", () => {
    it("should have all the same property values as the original audio event model", async () => {
      const result = await spec.service.show(mockAudioEvent);
      expect(result).toEqual(
        jasmine.objectContaining(mockAudioEvent as any),
      );
    });

    it("should resolve the associated audio recording model", async () => {
      const result = await spec.service.show(mockAudioEvent);
      expect(result.audioRecording).toEqual(mockRecording);
    });

    // TODO: this test is disabled until a upstream web components PR is merged
    // see: https://github.com/ecoacoustics/web-components/pull/222
    xit("should resolve all the associated tag models", async () => {
      const result = await spec.service.show(mockAudioEvent);
      expect(result.tags).toEqual(mockTags);
    });
  });
});

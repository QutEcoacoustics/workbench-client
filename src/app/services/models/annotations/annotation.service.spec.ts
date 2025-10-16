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
import { AssociationInjector } from "@models/ImplementsInjector";
import { ASSOCIATION_INJECTOR } from "@services/association-injector/association-injector.tokens";
import { provideMockBawApi } from "@baw-api/provide-baw-ApiMock";
import { Tagging } from "@models/Tagging";
import { generateTagging } from "@test/fakes/Tagging";
import { generateTag } from "@test/fakes/Tag";
import { AnnotationService } from "./annotation.service";
import { AnnotationSearchParameters } from "@components/annotations/components/annotation-search-form/annotationSearchParameters";

describe("AnnotationService", () => {
  let spec: SpectatorService<AnnotationService>;
  let injector: SpyObject<AssociationInjector>;

  let mockAudioEvent: AudioEvent;
  let mockRecording: AudioRecording;
  let mockTags: Tag[];

  const createService = createServiceFactory({
    service: AnnotationService,
    providers: [
      MediaService,
      provideMockBawApi(),
      { provide: TagsService, useValue: mockTagsService() },
      { provide: AudioRecordingsService, useValue: mockRecordingsService() },
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
      const result = await spec.service.show(mockAudioEvent, []);
      expect(result).toEqual(
        jasmine.objectContaining(mockAudioEvent as any),
      );
    });

    it("should resolve the associated audio recording model", async () => {
      const result = await spec.service.show(mockAudioEvent, []);
      expect(result.audioRecording).toEqual(mockRecording);
    });

    it("should resolve all the associated tag models", async () => {
      const result = await spec.service.show(mockAudioEvent, []);
      expect(result.tags).toEqual(mockTags);
    });
  });

  describe("tag priority", () => {
    it("should order an array of tags correctly", async () => {
      // Although we are filtering by 4 tags (1,2,3,4), we have explicitly
      // specified that we want to verify tag 3.
      // Therefore, when the tags are ordered from highest priority to lowest,
      // we should see that tag 3 is preferred.
      const dataModel = new AnnotationSearchParameters({
        tags: "1,2,3,4",
        taskTag: "3",
      });

      // Note there are some tags here that do not exist in the search
      // parameters.
      // We should see that the additional tags that are not in the search
      // parameters have the lowest specify.
      mockTags = [
        new Tag(generateTag({ id: 1 })),
        new Tag(generateTag({ id: 2, typeOfTag: "common_name" })),
        new Tag(generateTag({ id: 3 })),
        new Tag(generateTag({ id: 4 })),
        new Tag(generateTag({ id: 5, typeOfTag: "sounds_like" })),
        new Tag(generateTag({ id: 6, typeOfTag: "common_name" })),
        new Tag(generateTag({ id: 7, typeOfTag: "species_name" })),
        new Tag(generateTag({ id: 8, typeOfTag: "common_name" })),
      ];

      const taggings = mockTags.map((tag) =>
        new Tagging(generateTagging({ tagId: tag.id }), injector),
      );

      const testedEvent = new AudioEvent(
        generateAudioEvent({
          audioRecordingId: mockRecording.id,
          taggings,
        }),
        injector,
      );

      // Note that the sorting algorithm is stable.
      // Meaning that relative order is maintained for the filtered tags.
      const expectedIds = [3, 1, 2, 4, 6, 8, 7, 5];

      const realizedResult = await spec.service.show(testedEvent, dataModel.tagPriority);

      const realizedIds = realizedResult.tags.map(tag => tag.id);
      expect(realizedIds).toEqual(expectedIds);
    });
  });
});

import {
  createServiceFactory,
  mockProvider,
  SpectatorService,
  SpyObject,
} from "@ngneat/spectator";
import { provideMockBawApi } from "@baw-api/provide-baw-ApiMock";
import { ShallowVerificationService } from "@baw-api/verification/verification.service";
import { TaggingsService } from "@baw-api/tag/taggings.service";
import { firstValueFrom, of } from "rxjs";
import { TaggingCorrection } from "@models/data/TaggingCorrection";
import { generateTaggingCorrection } from "@test/fakes/data/TaggingCorrection";
import { modelData } from "@test/helpers/faker";
import { Tagging } from "@models/Tagging";
import { generateTagging } from "@test/fakes/Tagging";
import { AssociationInjector } from "@models/ImplementsInjector";
import { ASSOCIATION_INJECTOR } from "@services/association-injector/association-injector.tokens";
import { ConfirmedStatus, Verification } from "@models/Verification";
import { generateVerification } from "@test/fakes/Verification";
import { AudioEvent } from "@models/AudioEvent";
import { TaggingCorrectionsService } from "./tagging-corrections.service";

describe("CorrectionsService", () => {
  let spec: SpectatorService<TaggingCorrectionsService>;
  let verificationApiSpy: SpyObject<ShallowVerificationService>;
  let taggingApiSpy: SpyObject<TaggingsService>;

  let injector: AssociationInjector;
  let mockTagging: Tagging;
  let mockVerifications: Verification[];

  const createService = createServiceFactory({
    service: TaggingCorrectionsService,
    providers: [
      provideMockBawApi(),
      mockProvider(ShallowVerificationService),
      mockProvider(TaggingsService),
    ],
  });

  beforeEach(() => {
    spec = createService();

    injector = spec.inject(ASSOCIATION_INJECTOR);
    mockTagging = new Tagging(generateTagging(), injector);

    mockVerifications = modelData.randomArray(
      1,
      5,
      () => new Verification(generateVerification(), injector),
    );

    verificationApiSpy = spec.inject(ShallowVerificationService);
    verificationApiSpy.destroyUserVerification.andReturn(of(undefined));
    verificationApiSpy.createOrUpdate.andCallFake(() => of(mockVerifications[0]));

    verificationApiSpy.audioEventTagVerifications.andCallFake(() => of(mockVerifications));
    verificationApiSpy.destroyUserVerification.andCallFake(() => of(null));

    taggingApiSpy = spec.inject(TaggingsService);
    taggingApiSpy.create.andReturn(of(mockTagging));
    taggingApiSpy.destroy.andReturn(of(undefined));
  });

  it("should create", () => {
    expect(spec.service).toBeInstanceOf(TaggingCorrectionsService);
  });

  describe("create", () => {
    it("should create a new tagging and verify it as 'correct' if the tagging doesn't exist", async () => {
      const audioEvent = new AudioEvent(
        {
          taggings: [generateTagging({ tagId: 1 })],
        },
        injector,
      );

      const correction = new TaggingCorrection(
        generateTaggingCorrection({
          audioEvent,
          correctedTag: 2,
        }),
      );

      const testedRequest = spec.service.create(correction);
      await firstValueFrom(testedRequest);

      const expectedNewTagging = new Tagging({
        audioEventId: correction.audioEvent.id,
        tagId: correction.correctedTag,
      });

      const expectedVerification = new Verification({
        audioEventId: correction.audioEvent.id,
        confirmed: ConfirmedStatus.Correct,
        tagId: correction.correctedTag,
      });

      expect(taggingApiSpy.create).toHaveBeenCalledOnceWith(
        expectedNewTagging,
        correction.audioEvent.audioRecordingId,
        correction.audioEvent.id,
      );

      expect(verificationApiSpy.createOrUpdate).toHaveBeenCalledOnceWith(
        expectedVerification,
      );
    });

    it("should only verify the existing tagging as 'correct' if the tagging already exists", async () => {
      const audioEvent = new AudioEvent(
        {
          taggings: [generateTagging({ tagId: 1 })],
        },
        injector,
      );

      // Notice that the correctedTag has the same tagId as the existing tagging
      // meaning that we shouldn't attempt to create a new tagging.
      const correction = new TaggingCorrection(
        generateTaggingCorrection({
          audioEvent,
          correctedTag: 1,
        }),
      );

      const testedRequest = spec.service.create(correction);
      await firstValueFrom(testedRequest);

      const expectedVerification = new Verification({
        audioEventId: correction.audioEvent.id,
        confirmed: ConfirmedStatus.Correct,
        tagId: correction.correctedTag,
      });

      expect(taggingApiSpy.create).not.toHaveBeenCalled();

      expect(verificationApiSpy.createOrUpdate).toHaveBeenCalledOnceWith(
        expectedVerification,
      );
    });
  });

  describe("destroy", () => {
    it("should delete both the verification and tagging if the tagging only has one verification", async () => {
      const correction = new TaggingCorrection(generateTaggingCorrection());
      const taggingToRemove = modelData.id();

      // Because we mock the verifications response to return an empty array,
      // the events verifications will be empty, simulating the case where there
      // are no more verifications attached to the tagging, and it should
      // therefore be deleted.
      mockVerifications = [];

      const testedRequest = spec.service.destroy(correction, taggingToRemove);
      await firstValueFrom(testedRequest);

      expect(
        verificationApiSpy.destroyUserVerification,
      ).toHaveBeenCalledOnceWith(
        correction.audioEvent,
        correction.correctedTag,
      );

      expect(taggingApiSpy.destroy).toHaveBeenCalledOnceWith(
        taggingToRemove,
        correction.audioEvent.audioRecordingId,
        correction.audioEvent.id,
      );
    });

    it("should not delete the tagging if there are multiple verifications remaining on the tagging", async () => {
      const correction = new TaggingCorrection(generateTaggingCorrection());
      const taggingToRemove = modelData.id();

      mockVerifications = [
        new Verification(generateVerification(), injector),
        new Verification(generateVerification(), injector),
        new Verification(generateVerification(), injector),
      ];

      const testedRequest = spec.service.destroy(correction, taggingToRemove);
      await firstValueFrom(testedRequest);

      expect(
        verificationApiSpy.destroyUserVerification,
      ).toHaveBeenCalledOnceWith(
        correction.audioEvent,
        correction.correctedTag,
      );

      expect(taggingApiSpy.destroy).not.toHaveBeenCalled();
    });

    // TODO: Add expect the ensure that the tagging is only destroyed if it
    // was created as part of a correction.
    // This will require support for database backed tag corrections.
    // see: https://github.com/QutEcoacoustics/baw-server/issues/807
    xit("should not delete a tagging if it was created outside of a correction", async () => {});
  });
});

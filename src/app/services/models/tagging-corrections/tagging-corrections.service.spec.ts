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
import { modelData } from "@test/helpers/faker";
import { Tagging } from "@models/Tagging";
import { generateTagging } from "@test/fakes/Tagging";
import { AssociationInjector } from "@models/ImplementsInjector";
import { ASSOCIATION_INJECTOR } from "@services/association-injector/association-injector.tokens";
import { ConfirmedStatus, Verification } from "@models/Verification";
import { generateVerification } from "@test/fakes/Verification";
import { Annotation } from "@models/data/Annotation";
import { generateAnnotation } from "@test/fakes/data/Annotation";
import { Tag } from "@models/Tag";
import { generateTag } from "@test/fakes/Tag";
import { Id } from "@interfaces/apiInterfaces";
import { TaggingCorrectionsService } from "./tagging-corrections.service";

describe("TaggingCorrectionsService", () => {
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
    verificationApiSpy.createOrUpdate.andCallFake(() =>
      of(mockVerifications[0]),
    );

    verificationApiSpy.audioEventTagVerifications.andCallFake(() =>
      of(mockVerifications),
    );
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
      const correctTagId = modelData.id();
      const annotation = new Annotation(
        generateAnnotation({
          taggings: [generateTagging({ tagId: 1 })],
        }),
        injector,
      );

      const testedRequest = spec.service.create(annotation, correctTagId);
      await firstValueFrom(testedRequest);

      const expectedNewTagging = new Tagging({
        audioEventId: annotation.id,
        tagId: correctTagId,
      });

      const expectedVerification = new Verification({
        audioEventId: annotation.id,
        confirmed: ConfirmedStatus.Correct,
        tagId: correctTagId,
      });

      expect(taggingApiSpy.create).toHaveBeenCalledOnceWith(
        expectedNewTagging,
        annotation.audioRecordingId,
        annotation.id,
      );

      expect(verificationApiSpy.createOrUpdate).toHaveBeenCalledOnceWith(
        expectedVerification,
      );
    });

    it("should only verify the existing tagging as 'correct' if the tagging already exists", async () => {
      // Notice that the correctedTag has the same tagId as the existing tagging
      // meaning that we shouldn't attempt to create a new tagging.
      const correctTagId = modelData.id();
      const annotation = new Annotation(
        generateAnnotation({
          taggings: [generateTagging({ tagId: correctTagId })],
        }),
        injector,
      );

      const testedRequest = spec.service.create(annotation, correctTagId);
      await firstValueFrom(testedRequest);

      const expectedVerification = new Verification({
        audioEventId: annotation.id,
        confirmed: ConfirmedStatus.Correct,
        tagId: correctTagId,
      });

      expect(taggingApiSpy.create).not.toHaveBeenCalled();

      expect(verificationApiSpy.createOrUpdate).toHaveBeenCalledOnceWith(
        expectedVerification,
      );
    });
  });

  describe("destroy", () => {
    it("should delete both the verification and tagging if the tagging only has one verification", async () => {
      const tagToRemove = new Tag(generateTag(), injector);
      const taggingToRemove = new Tagging(generateTagging(), injector);

      const correctionsMap = new Map<Id<Tag>, Tagging>([
        [tagToRemove.id, taggingToRemove],
      ]);

      const annotation = new Annotation(
        generateAnnotation({ corrections: correctionsMap, }),
        injector
      );

      // Because we mock the verifications response to return an empty array,
      // the events verifications will be empty, simulating the case where there
      // are no more verifications attached to the tagging, and it should
      // therefore be deleted.
      mockVerifications = [];

      const testedRequest = spec.service.destroy(annotation, tagToRemove.id);
      await firstValueFrom(testedRequest);

      expect(
        verificationApiSpy.destroyUserVerification,
      ).toHaveBeenCalledOnceWith(annotation, tagToRemove.id);

      expect(taggingApiSpy.destroy).toHaveBeenCalledOnceWith(
        taggingToRemove,
        annotation.audioRecordingId,
        annotation.id,
      );
    });

    it("should not delete the tagging if there are multiple verifications remaining on the tagging", async () => {
      const tagToRemove = new Tag(generateTag(), injector);
      const taggingToRemove = new Tagging(generateTagging(), injector);

      const correctionsMap = new Map<Id<Tag>, Tagging>([
        [tagToRemove.id, taggingToRemove],
      ]);

      const annotation = new Annotation(
        generateAnnotation({ corrections: correctionsMap }),
        injector,
      );

      mockVerifications = [
        new Verification(generateVerification(), injector),
        new Verification(generateVerification(), injector),
        new Verification(generateVerification(), injector),
      ];

      const testedRequest = spec.service.destroy(annotation, tagToRemove.id);
      await firstValueFrom(testedRequest);

      expect(
        verificationApiSpy.destroyUserVerification,
      ).toHaveBeenCalledOnceWith(annotation, tagToRemove.id);

      expect(taggingApiSpy.destroy).not.toHaveBeenCalled();
    });

    // TODO: Add expect the ensure that the tagging is only destroyed if it
    // was created as part of a correction.
    // This will require support for database backed tag corrections.
    // see: https://github.com/QutEcoacoustics/baw-server/issues/807
    xit("should not delete a tagging if it was created outside of a correction", async () => {});
  });
});

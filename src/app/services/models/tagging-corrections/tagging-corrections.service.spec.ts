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
import { TaggingCorrectionsService } from "./tagging-corrections.service";

describe("CorrectionsService", () => {
  let spec: SpectatorService<TaggingCorrectionsService>;
  let verificationApiSpy: SpyObject<ShallowVerificationService>;
  let taggingApiSpy: SpyObject<TaggingsService>;

  let injector: AssociationInjector;
  let mockTagging: Tagging;
  let mockVerification: Verification;

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
    mockVerification = new Verification(generateVerification(), injector);

    verificationApiSpy = spec.inject(ShallowVerificationService);
    verificationApiSpy.destroyEventVerification.andReturn(of(undefined));
    verificationApiSpy.createOrUpdate.andReturn(of(mockVerification));

    taggingApiSpy = spec.inject(TaggingsService);
    taggingApiSpy.create.andReturn(of(mockTagging));
    taggingApiSpy.destroy.andReturn(of(undefined));
  });

  it("should create", () => {
    expect(spec.service).toBeInstanceOf(TaggingCorrectionsService);
  });

  describe("create", () => {
    it("should create a new tagging and verify it as 'correct'", async () => {
      const correction = new TaggingCorrection(generateTaggingCorrection());

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
  });

  describe("destroy", () => {
    it("should delete both the verification and tagging", async () => {
      const correction = new TaggingCorrection(generateTaggingCorrection());
      const taggingToRemove = modelData.id();

      const testedRequest = spec.service.destroy(correction, taggingToRemove);

      await firstValueFrom(testedRequest);

      expect(
        verificationApiSpy.destroyEventVerification,
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
  });
});

import { inject, Injectable } from "@angular/core";
import { TaggingsService } from "@baw-api/tag/taggings.service";
import { ShallowVerificationService } from "@baw-api/verification/verification.service";
import { TaggingCorrection } from "@models/data/TaggingCorrection";
import { Tagging } from "@models/Tagging";
import { ConfirmedStatus, Verification } from "@models/Verification";
import { firstValueFrom, map, Observable, switchMap } from "rxjs";

// TODO: Refactor this service with a createOrUpdate method and update methods
// once we have database backed tag corrections.
// see: https://github.com/QutEcoacoustics/baw-server/issues/807
@Injectable()
export class TaggingCorrectionsService {
  private verificationApi = inject(ShallowVerificationService);
  private taggingApi = inject(TaggingsService);

  /**
   * Corrects an incorrect tag on an audio event by verifying the existing tag
   * as "incorrect", creating a new tag that is correct, and submitting a
   * "correct" verification decision.
   */
  public create(model: TaggingCorrection): Observable<Tagging> {
    const correctTag = new Tagging({
      audioEventId: model.audioEvent.id,
      tagId: model.correctedTag,
    });

    return this.taggingApi
      .create(correctTag, model.audioEvent.audioRecordingId, model.audioEvent.id)
      .pipe(
        map((tagging: Tagging) => {
          const correctVerification = new Verification({
            audioEventId: model.audioEvent.id,
            confirmed: ConfirmedStatus.Correct,
            tagId: model.correctedTag,
          });

          const verificationRequest = this.verificationApi.createOrUpdate(correctVerification);

          firstValueFrom(verificationRequest);

          return tagging;
        }),
      );
  }

  public destroy(model: TaggingCorrection, taggingToRemove: Tagging["id"]): Observable<void | Tagging> {
    return this.verificationApi
      .destroyEventVerification(model.audioEvent, model.correctedTag)
      .pipe(
        switchMap(() => {
          return this.taggingApi.destroy(
            taggingToRemove,
            model.audioEvent.audioRecordingId,
            model.audioEvent.id,
          );
        }),
      );
  }
}

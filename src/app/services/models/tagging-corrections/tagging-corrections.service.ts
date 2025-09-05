import { inject, Injectable } from "@angular/core";
import { TaggingsService } from "@baw-api/tag/taggings.service";
import { ShallowVerificationService } from "@baw-api/verification/verification.service";
import { TaggingCorrection } from "@models/data/TaggingCorrection";
import { Tagging } from "@models/Tagging";
import { ConfirmedStatus, Verification } from "@models/Verification";
import {
  defer,
  firstValueFrom,
  iif,
  map,
  Observable,
  of,
  switchMap,
} from "rxjs";

// TODO: Refactor this service with a createOrUpdate method and update methods
// once we have database backed tag corrections.
// I cannot do a "createOrUpdate" method right now because I cannot reliably
// know what tags have been created as part of a correction.
// see: https://github.com/QutEcoacoustics/baw-server/issues/807
@Injectable()
export class TaggingCorrectionsService {
  private verificationApi = inject(ShallowVerificationService);
  private taggingApi = inject(TaggingsService);

  /**
   * Adds a tag correction to an audio event by creating a new tagging and
   * immediately verifying it as correct.
   */
  public create(model: TaggingCorrection): Observable<Tagging> {
    const correctTagging = new Tagging({
      audioEventId: model.audioEvent.id,
      tagId: model.correctedTag,
    });

    const isNewTag = model.audioEvent.taggings.every(
      (tagging) => tagging.tagId !== model.correctedTag,
    );

    // If multiple people are verifying the same dataset, it's likely that
    // they correct to the same tag, meaning that the tag already exists on the
    // audio event.
    // We therefore only want to create the new tagging if it doesn't already
    // exist.
    // If the tagging already exists, we can just add a verification to the
    // existing tagging that was previously added.
    return iif(
      () => isNewTag,
      defer(() =>
        this.taggingApi.create(
          correctTagging,
          model.audioEvent.audioRecordingId,
          model.audioEvent.id,
        ),
      ),
      defer(() => of(correctTagging)),
    ).pipe(
      map((tagging: Tagging) => {
        const correctVerification = new Verification({
          audioEventId: model.audioEvent.id,
          confirmed: ConfirmedStatus.Correct,
          tagId: model.correctedTag,
        });

        const verificationRequest =
          this.verificationApi.createOrUpdate(correctVerification);

        firstValueFrom(verificationRequest);

        return tagging;
      }),
    );
  }

  /**
   * Destroys a tag correction by removing the verification for the corrected
   * tag, and if there are no more verifications for that tag on the audio
   * event, the tagging will be removed.
   */
  public destroy(
    model: TaggingCorrection,
    taggingToRemove: Tagging["id"],
  ): Observable<void | Tagging> {
    return this.verificationApi.destroyUserVerification(
      model.audioEvent,
      model.correctedTag,
    ).pipe(
      switchMap(() => this.verificationApi.audioEventTagVerifications(model.audioEvent, model.correctedTag)),
      switchMap((newVerifications: Verification[]) => {
        if (newVerifications.length > 0) {
          // There are still other verifications for this tag on this audio event
          // so we shouldn't delete the tagging.
          return of(undefined);
        }

        // If there are no more verifications for this tag on this audio event
        // then we can delete the tagging.
        //
        // TODO: Once we have support for database backed tag corrections, we
        // should only delete the tagging if it was created as part of this
        // correction.
        // see: https://github.com/QutEcoacoustics/baw-server/issues/807
        return this.taggingApi.destroy(
          taggingToRemove,
          model.audioEvent.audioRecordingId,
          model.audioEvent.id,
        );
      }),
    );
  }
}

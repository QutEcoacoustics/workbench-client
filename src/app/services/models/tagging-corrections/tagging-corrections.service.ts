import { inject, Injectable } from "@angular/core";
import { TaggingsService } from "@baw-api/tag/taggings.service";
import { ShallowVerificationService } from "@baw-api/verification/verification.service";
import { Id } from "@interfaces/apiInterfaces";
import { Annotation } from "@models/data/Annotation";
import { Tag } from "@models/Tag";
import { Tagging } from "@models/Tagging";
import { ConfirmedStatus, Verification } from "@models/Verification";
import { defer, iif, map, Observable, of, switchMap, tap } from "rxjs";

// TODO: Refactor this service with a createOrUpdate method and update methods
// once we have database backed tag corrections.
// I cannot do a "createOrUpdate" method right now because I cannot reliably
// know what tags have been created as part of a correction.
// see: https://github.com/QutEcoacoustics/baw-server/issues/807
@Injectable({ providedIn: "root" })
export class TaggingCorrectionsService {
  private verificationApi = inject(ShallowVerificationService);
  private taggingApi = inject(TaggingsService);

  /**
   * Adds a tag correction to an audio event by creating a new tagging and
   * immediately verifying it as correct.
   */
  public create(
    model: Annotation,
    correctTagId: Id<Tag>,
  ): Observable<Tagging> {
    const isNewTag = !model.tagIds.has(correctTagId);

    const correctTagging = new Tagging({
      audioEventId: model.id,
      tagId: correctTagId,
    });

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
          model.audioRecordingId,
          model.id,
        ),
      ),
      defer(() => of(correctTagging)),
    ).pipe(
      switchMap((tagging: Tagging) => {
        const correctVerification = new Verification({
          audioEventId: model.id,
          confirmed: ConfirmedStatus.Correct,
          tagId: correctTagId,
        });

        return this.verificationApi.createOrUpdate(correctVerification).pipe(
          map(() => tagging),
          tap(() => model.addCorrection(correctTagId, tagging)),
        );
      }),
    );
  }

  /**
   * Destroys a tag correction by removing the verification for the corrected
   * tag, and if there are no more verifications for that tag on the audio
   * event, the tagging will be removed.
   */
  public destroy(
    model: Annotation,
    tagIdToRemove: Id<Tag>,
  ): Observable<void | Tagging> {
    const taggingToRemove = model.corrections.get(tagIdToRemove);
    if (!taggingToRemove) {
      throw new Error(
        `Correction for tag id '${tagIdToRemove}' not found on this annotation.`,
      );
    }

    return this.verificationApi
      .destroyUserVerification(model as any, tagIdToRemove)
      .pipe(
        switchMap(() =>
          this.verificationApi.audioEventTagVerifications(
            model as any,
            tagIdToRemove,
          ),
        ),
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
          return this.taggingApi
            .destroy(taggingToRemove, model.audioRecordingId, model.id)
            .pipe(tap(() => model.removeCorrection(tagIdToRemove)));
        }),
      );
  }
}

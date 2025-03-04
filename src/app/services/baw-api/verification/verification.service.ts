import { Injectable } from "@angular/core";
import {
  emptyParam,
  filterParam,
  id,
  IdOr,
  IdParam,
  IdParamOptional,
  option,
  ReadonlyApi,
  StandardApi,
} from "@baw-api/api-common";
import { BawApiService, Filters } from "@baw-api/baw-api.service";
import { Resolvers } from "@baw-api/resolver-common";
import { stringTemplate } from "@helpers/stringTemplate/stringTemplate";
import { AudioEvent } from "@models/AudioEvent";
import { AudioRecording } from "@models/AudioRecording";
import { User } from "@models/User";
import { Verification } from "@models/Verification";
import { CONFLICT } from "http-status";
import { catchError, map, mergeMap, Observable } from "rxjs";

const verificationId: IdParamOptional<Verification> = id;
const audioRecordingId: IdParam<AudioRecording> = id;
const audioEventId: IdParam<AudioEvent> = id;
const endpointShallow = stringTemplate`/verifications/${verificationId}${option}`;
const endpoint =
  stringTemplate`/audio_recordings/${audioRecordingId}/audio_events/${audioEventId}/verifications/${verificationId}${option}`;

@Injectable()
export class VerificationService
  implements
    ReadonlyApi<Verification, [IdOr<AudioRecording>, IdOr<AudioEvent>]>
{
  public constructor(private api: BawApiService<Verification>) {}

  public list(
    audioRecording: IdOr<AudioRecording>,
    audioEvent: IdOr<AudioEvent>
  ): Observable<Verification[]> {
    return this.api.list(
      Verification,
      endpoint(audioRecording, audioEvent, emptyParam, emptyParam)
    );
  }

  public filter(
    filters: Filters<Verification>,
    audioRecording: IdOr<AudioRecording>,
    audioEvent: IdOr<AudioEvent>
  ): Observable<Verification[]> {
    return this.api.filter(
      Verification,
      endpoint(audioRecording, audioEvent, emptyParam, filterParam),
      filters
    );
  }

  public show(
    model: IdOr<Verification>,
    audioRecording: IdOr<AudioRecording>,
    audioEvent: IdOr<AudioEvent>
  ): Observable<Verification> {
    return this.api.show(
      Verification,
      endpoint(audioRecording, audioEvent, model, emptyParam)
    );
  }
}

@Injectable()
/**
 * Service for handling shallow verification operations.
 * Implements the StandardApi interface for Verification models.
 *
 * @template Verification - The type of the verification model.
 * @template [] - The type of the filters.
 *
 * @example
 * ```typescript
 * const service = new ShallowVerificationService(apiService);
 * service.list().subscribe((verifications) => console.log(verifications));
 * ```
 *
 * @remarks
 * This service provides methods to list, filter, show, create, update, and destroy
 * verification models. It also includes a method to create or update a verification
 * model based on its existence, and a method to fetch the current user's verification
 * model for a specific audio event.
 *
 * @param api - The BawApiService instance used to make API requests.
 *
 * @method list
 * Retrieves a list of all verification models.
 * @returns Observable<Verification[]>
 *
 * @method filter
 * Filters verification models based on the provided filters.
 * @param filters - The filters to apply.
 * @returns Observable<Verification[]>
 *
 * @method show
 * Retrieves a specific verification model by its ID.
 * @param model - The ID or instance of the verification model.
 * @returns Observable<Verification>
 *
 * @method create
 * Creates a new verification model.
 * @param model - The verification model to create.
 * @returns Observable<Verification>
 *
 * @method update
 * Updates an existing verification model.
 * @param model - The verification model to update.
 * @returns Observable<Verification>
 *
 * @method destroy
 * Deletes a specific verification model by its ID.
 * @param model - The ID or instance of the verification model.
 * @returns Observable<void | Verification>
 *
 * @method createOrUpdate
 * Creates a verification model if it doesn't already exist, otherwise updates the existing model.
 * @param model - The verification model to create or update.
 * @param audioEvent - The associated audio event.
 * @param user - The user performing the operation.
 * @returns Observable<Verification>
 *
 * @method audioEventUserVerification
 * Fetches the current user's verification model for a specific audio event.
 * @param event - The audio event.
 * @param user - The user.
 * @returns Observable<Verification | null>
 */
export class ShallowVerificationService
  implements StandardApi<Verification, []>
{
  public constructor(private api: BawApiService<Verification>) {}

  public list(): Observable<Verification[]> {
    return this.api.list(Verification, endpointShallow(emptyParam, emptyParam));
  }

  public filter(filters: Filters<Verification>): Observable<Verification[]> {
    return this.api.filter(
      Verification,
      endpointShallow(emptyParam, filterParam),
      filters
    );
  }

  public show(model: IdOr<Verification>): Observable<Verification> {
    return this.api.show(Verification, endpointShallow(model, emptyParam));
  }

  public create(model: Verification): Observable<Verification> {
    return this.api.create(
      Verification,
      endpointShallow(emptyParam, emptyParam),
      (verification) => endpointShallow(verification, emptyParam),
      model
    );
  }

  public update(model: Verification): Observable<Verification> {
    return this.api.update(
      Verification,
      endpointShallow(model, emptyParam),
      model
    );
  }

  public destroy(model: IdOr<Verification>): Observable<void | Verification> {
    return this.api.destroy(endpointShallow(model, emptyParam));
  }

  /**
   * Creates a verification model if it doesn't already exist, if it already
   * exists, update the existing model.
   */
  public createOrUpdate(
    model: Verification,
    audioEvent: AudioEvent,
    user: User
  ): Observable<Verification> {
    return this.api
      .create(
        Verification,
        endpointShallow(emptyParam, emptyParam),
        (verification) => endpointShallow(verification, emptyParam),
        model,
        { disableNotification: true }
      )
      .pipe(
        // fetching the verification model here is the only way to be certain
        // that there are no race conditions
        catchError((err) => {
          if (err.status === CONFLICT) {
            const verificationModel = this.audioEventUserVerification(
              audioEvent,
              user
            );
            return verificationModel.pipe(
              mergeMap((verification) => {
                if (!verification) {
                  throw err;
                }

                const newModel = new Verification({
                  ...verification,
                  ...model,
                });

                return this.update(newModel);
              })
            );
          }

          throw err;
        })
      );
  }

  /**
   * Fetches a users verification model for a specific audio event
   *
   * @returns
   * A verification model if the user has verified the audio event.
   * If the user has not verified the audio event, null is returned.
   */
  public audioEventUserVerification(
    event: AudioEvent,
    user: User
  ): Observable<Verification | null> {
    const filter = {
      filter: {
        and: [
          { audioEventId: { eq: event.id } },
          { creatorId: { eq: user.id } },
        ],
      },
    } as const satisfies Filters<Verification>;

    return this.filter(filter).pipe(
      map((results) => (results.length > 0 ? results[0] : null))
    );
  }
}

export const verificationResolvers = new Resolvers<
  Verification,
  [IdOr<AudioRecording>, IdOr<AudioEvent>]
>([VerificationService], "verificationId", [
  "audioRecordingId",
  "audioEventId",
]).create("Verification");

export const shallowVerificationResolvers = new Resolvers<Verification, []>(
  [ShallowVerificationService],
  "verificationId"
).create("ShallowVerification");

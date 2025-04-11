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
const endpoint = stringTemplate`/audio_recordings/${audioRecordingId}/audio_events/${audioEventId}/verifications/${verificationId}${option}`;

@Injectable()
export class VerificationService implements ReadonlyApi<Verification, [IdOr<AudioRecording>, IdOr<AudioEvent>]> {
  public constructor(private api: BawApiService<Verification>) {}

  public list(audioRecording: IdOr<AudioRecording>, audioEvent: IdOr<AudioEvent>): Observable<Verification[]> {
    return this.api.list(Verification, endpoint(audioRecording, audioEvent, emptyParam, emptyParam));
  }

  public filter(
    filters: Filters<Verification>,
    audioRecording: IdOr<AudioRecording>,
    audioEvent: IdOr<AudioEvent>,
  ): Observable<Verification[]> {
    return this.api.filter(Verification, endpoint(audioRecording, audioEvent, emptyParam, filterParam), filters);
  }

  public show(
    model: IdOr<Verification>,
    audioRecording: IdOr<AudioRecording>,
    audioEvent: IdOr<AudioEvent>,
  ): Observable<Verification> {
    return this.api.show(Verification, endpoint(audioRecording, audioEvent, model, emptyParam));
  }
}

@Injectable()
export class ShallowVerificationService implements StandardApi<Verification, []> {
  public constructor(private api: BawApiService<Verification>) {}

  public list(): Observable<Verification[]> {
    return this.api.list(Verification, endpointShallow(emptyParam, emptyParam));
  }

  public filter(filters: Filters<Verification>): Observable<Verification[]> {
    return this.api.filter(Verification, endpointShallow(emptyParam, filterParam), filters);
  }

  public show(model: IdOr<Verification>): Observable<Verification> {
    return this.api.show(Verification, endpointShallow(model, emptyParam));
  }

  public create(model: Verification): Observable<Verification> {
    return this.api.create(
      Verification,
      endpointShallow(emptyParam, emptyParam),
      (verification) => endpointShallow(verification, emptyParam),
      model,
    );
  }

  public update(model: Verification): Observable<Verification> {
    return this.api.update(Verification, endpointShallow(model, emptyParam), model);
  }

  public destroy(model: IdOr<Verification>): Observable<void | Verification> {
    return this.api.destroy(endpointShallow(model, emptyParam));
  }

  // TODO: simplify when baw-server implements an upsert route
  // see: https://github.com/QutEcoacoustics/baw-server/issues/724
  /**
   * Creates a verification model if it doesn't already exist, if it already
   * exists, update the existing model.
   */
  public createOrUpdate(model: Verification, audioEvent: AudioEvent, user: User): Observable<Verification> {
    return this.api
      .create(
        Verification,
        endpointShallow(emptyParam, emptyParam),
        (verification) => endpointShallow(verification, emptyParam),
        model,
        { disableNotification: true },
      )
      .pipe(
        // fetching the verification model here is the only way to be certain
        // that there are no race conditions
        catchError((err) => {
          if (err.status === CONFLICT) {
            const verificationModel = this.audioEventUserVerification(audioEvent, user);
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
              }),
            );
          }

          throw err;
        }),
      );
  }

  /**
   * Fetches a users verification model for a specific audio event
   *
   * @returns
   * A verification model if the user has verified the audio event.
   * If the user has not verified the audio event, null is returned.
   */
  public audioEventUserVerification(event: AudioEvent, user: User): Observable<Verification | null> {
    const filter = {
      filter: {
        and: [{ audioEventId: { eq: event.id } }, { creatorId: { eq: user.id } }],
      },
      paging: {
        items: 1,
      },
    } as const satisfies Filters<Verification>;

    // the api enforces having one verification per user per audio event
    // therefore, it is safe to assume that there will only be one result
    // and return the first element of the array
    return this.filter(filter).pipe(map((results) => (results.length > 0 ? results[0] : null)));
  }
}

export const verificationResolvers = new Resolvers<Verification, [IdOr<AudioRecording>, IdOr<AudioEvent>]>(
  [VerificationService],
  "verificationId",
  ["audioRecordingId", "audioEventId"],
).create("Verification");

export const shallowVerificationResolvers = new Resolvers<Verification, []>(
  [ShallowVerificationService],
  "verificationId",
).create("ShallowVerification");

import { Injectable } from "@angular/core";
import {
  ApiCreateOrUpdate,
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
import { BawSessionService } from "@baw-api/baw-session.service";
import { Resolvers } from "@baw-api/resolver-common";
import { stringTemplate } from "@helpers/stringTemplate/stringTemplate";
import { AudioEvent } from "@models/AudioEvent";
import { AudioRecording } from "@models/AudioRecording";
import { Tag } from "@models/Tag";
import { Verification } from "@models/Verification";
import { first, map, Observable, of, switchMap } from "rxjs";

const verificationId: IdParamOptional<Verification> = id;
const audioRecordingId: IdParam<AudioRecording> = id;
const audioEventId: IdParam<AudioEvent> = id;
const endpointShallow = stringTemplate`/verifications/${verificationId}${option}`;
const endpoint =
  stringTemplate`/audio_recordings/${audioRecordingId}/audio_events/${audioEventId}/verifications/${verificationId}${option}`;

@Injectable()
export class VerificationService
  implements ReadonlyApi<Verification, [IdOr<AudioRecording>, IdOr<AudioEvent>]>
{
  public constructor(private api: BawApiService<Verification>) {}

  public list(
    audioRecording: IdOr<AudioRecording>,
    audioEvent: IdOr<AudioEvent>,
  ): Observable<Verification[]> {
    return this.api.list(
      Verification,
      endpoint(audioRecording, audioEvent, emptyParam, emptyParam),
    );
  }

  public filter(
    filters: Filters<Verification>,
    audioRecording: IdOr<AudioRecording>,
    audioEvent: IdOr<AudioEvent>,
  ): Observable<Verification[]> {
    return this.api.filter(
      Verification,
      endpoint(audioRecording, audioEvent, emptyParam, filterParam),
      filters,
    );
  }

  public show(
    model: IdOr<Verification>,
    audioRecording: IdOr<AudioRecording>,
    audioEvent: IdOr<AudioEvent>,
  ): Observable<Verification> {
    return this.api.show(
      Verification,
      endpoint(audioRecording, audioEvent, model, emptyParam),
    );
  }
}

@Injectable()
export class ShallowVerificationService
  implements StandardApi<Verification, []>, ApiCreateOrUpdate<Verification, []>
{
  public constructor(
    private api: BawApiService<Verification>,
    private session: BawSessionService,
  ) {}

  public list(): Observable<Verification[]> {
    return this.api.list(Verification, endpointShallow(emptyParam, emptyParam));
  }

  public filter(filters: Filters<Verification>): Observable<Verification[]> {
    return this.api.filter(
      Verification,
      endpointShallow(emptyParam, filterParam),
      filters,
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
      model,
    );
  }

  public update(model: Verification): Observable<Verification> {
    return this.api.update(
      Verification,
      endpointShallow(model, emptyParam),
      model,
    );
  }

  public destroy(model: IdOr<Verification>): Observable<null> {
    return this.api.destroy(endpointShallow(model, emptyParam));
  }

  /**
   * @description
   * Creates a verification model if it doesn't already exist, if it already
   * exists, update the existing model.
   */
  public createOrUpdate(model: Verification): Observable<Verification> {
    return this.api.createOrUpdate(
      Verification,
      endpointShallow(emptyParam, emptyParam),
      (verification) => endpointShallow(verification, emptyParam),
      model,
    );
  }

  /**
   * @description
   * Fetches all verifications of a specific tag for an audio event.
   * This returns verifications from **all** users.
   */
  public audioEventTagVerifications(
    audioEvent: IdOr<AudioEvent>,
    tag: IdOr<Tag>,
  ): Observable<Verification[]> {
    const eventId = typeof audioEvent === "number" ? audioEvent : audioEvent.id;
    const tagId = typeof tag === "number" ? tag : tag.id;

    const filter: Filters<Verification> = {
      filter: {
        and: [{ audioEventId: { eq: eventId } }, { tagId: { eq: tagId } }],
      },
    };

    return this.filter(filter);
  }

  /**
   * @description
   * Fetches a users verification model for a specific audio event + tag
   * combination.
   *
   * @returns
   * A verification model if the user has verified the audio event.
   * If the user has not verified the audio event, null is returned.
   */
  public showUserVerification(
    audioEvent: IdOr<AudioEvent>,
    tag: IdOr<Tag>,
  ): Observable<Verification | null> {
    const eventId = typeof audioEvent === "number" ? audioEvent : audioEvent.id;
    const tagId = typeof tag === "number" ? tag : tag.id;

    const user = this.session.currentUser;

    const filter: Filters<Verification> = {
      filter: {
        and: [
          { audioEventId: { eq: eventId } },
          { tagId: { eq: tagId } },
          { creatorId: { eq: user.id } },
        ],
      },
      paging: {
        items: 1,
      },
    };

    // the api enforces having one verification per user per audio event
    // therefore, it is safe to assume that there will only be one result
    // and return the first element of the array
    return this.filter(filter).pipe(
      map((results) => (results.length > 0 ? results[0] : null)),
    );
  }

  /**
   * @description
   * Destroys the current users verification model for a specific
   * audio event + tag combination.
   * This service method can be called without knowing the verification model or
   * the verification ID.
   */
  public destroyUserVerification(
    audioEvent: IdOr<AudioEvent>,
    tag: IdOr<Tag>,
  ): Observable<Verification | null> {
    return this.showUserVerification(audioEvent, tag).pipe(
      switchMap((verification) => {
        if (!verification) {
          return of(null);
        }

        return this.destroy(verification.id);
      }),
      first(),
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
  "verificationId",
).create("ShallowVerification");

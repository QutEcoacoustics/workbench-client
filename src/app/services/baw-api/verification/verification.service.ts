import { Inject, Injectable } from "@angular/core";
import {
  emptyParam,
  filterParam,
  id,
  IdOr,
  IdParamOptional,
  option,
  StandardApi,
} from "@baw-api/api-common";
import { BawApiService, Filters } from "@baw-api/baw-api.service";
import { BawSessionService } from "@baw-api/baw-session.service";
import { Resolvers } from "@baw-api/resolver-common";
import { stringTemplate } from "@helpers/stringTemplate/stringTemplate";
import { Verification } from "@models/Verification";
import { API_ROOT } from "@services/config/config.tokens";
import { map, Observable } from "rxjs";

// TODO: this is currently using the audio_events endpoint because the
// verifications interface doesn't currently exist
const verificationId: IdParamOptional<Verification> = id;
const endpoint = stringTemplate`/audio_events/${verificationId}${option}`;

@Injectable()
export class VerificationService implements StandardApi<Verification> {
  public constructor(
    private api: BawApiService<Verification>,
    private session: BawSessionService,
    @Inject(API_ROOT) private apiRoot: string
  ) {}

  public list(): Observable<Verification[]> {
    return this.api
      .list(Verification, endpoint(emptyParam, emptyParam))
      .pipe(
        map((models: Verification[]) =>
          models.map((model) => this.addAudioLink(model))
        )
      );
  }

  public filter(filters: Filters<Verification>): Observable<Verification[]> {
    return this.api
      .filter(Verification, endpoint(emptyParam, filterParam), filters)
      .pipe(
        map((models: Verification[]) =>
          models.map((model) => this.addAudioLink(model))
        )
      );
  }

  public show(model: IdOr<Verification>): Observable<Verification> {
    return this.api
      .show(Verification, endpoint(model, emptyParam))
      .pipe(map((responseModel) => this.addAudioLink(responseModel)));
  }

  public create(model: Verification): Observable<Verification> {
    return this.api
      .create(
        Verification,
        endpoint(emptyParam, emptyParam),
        (verification) => endpoint(verification, emptyParam),
        model
      )
      .pipe(map((responseModel) => this.addAudioLink(responseModel)));
  }

  public update(model: Verification): Observable<Verification> {
    return this.api
      .update(Verification, endpoint(model, emptyParam), model)
      .pipe(map((responseModel) => this.addAudioLink(responseModel)));
  }

  public destroy(model: IdOr<Verification>): Observable<Verification | void> {
    return this.api.destroy(endpoint(model, emptyParam));
  }

  public downloadVerificationsTableUrl(filters: Filters<Verification>): string {
    return (
      this.apiRoot +
      endpoint(emptyParam, emptyParam) +
      "events.csv?" +
      this.api.encodeFilter(filters)
    );
  }

  // because we are currently using the AudioEvents endpoint for verifications
  // we need to add the audioLink manually
  // TODO: remove this once the verification endpoint is available
  private addAudioLink(model: Verification): Verification {
    const basePath = `https://api.staging.ecosounds.org/audio_recordings/${model.audioRecordingId}/media.flac`;
    const urlParams =
      `?audio_event_id=${model.id}` +
      `&end_offset=${model.endTimeSeconds}&start_offset=${model.startTimeSeconds}` +
      `&user_token=${this.session.authToken}`;
    const audioLink = basePath + urlParams;

    model.audioLink = audioLink;
    return model;
  }
}

export const verificationResolvers = new Resolvers<Verification, []>(
  [VerificationService],
  "verificationId"
).create("Verification");

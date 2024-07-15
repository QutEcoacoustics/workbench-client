import { Injectable } from "@angular/core";
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
  ) {}

  public list(): Observable<Verification[]> {
    return this.api.list(Verification, endpoint(emptyParam, emptyParam));
  }

  // TODO: I'm only piping this through a map so that each verification model
  // has an audio URL
  public filter(filters: Filters<Verification>): Observable<Verification[]> {
    return this.api
      .filter(Verification, endpoint(emptyParam, filterParam), filters)
      .pipe(
        map((models: Verification[]) => {
          for (const model of models) {
            const basePath = `https://api.staging.ecosounds.org/audio_recordings/${model.audioRecordingId}/media.flac`;
            const urlParams =
              `?audio_event_id=${model.id}` +
              `&end_offset=${model.endTimeSeconds}&start_offset=${model.startTimeSeconds}` +
              `&user_token=${this.session.authToken}`;
            const audioLink = basePath + urlParams;

            model.audioLink = audioLink;
          }

          return models;
        }),
      );
  }

  public show(model: IdOr<Verification>): Observable<Verification> {
    return this.api.show(Verification, endpoint(model, emptyParam));
  }

  public create(model: Verification): Observable<Verification> {
    return this.api.create(
      Verification,
      endpoint(emptyParam, emptyParam),
      (verification) => endpoint(verification, emptyParam),
      model,
    );
  }

  public update(model: Verification): Observable<Verification> {
    return this.api.update(Verification, endpoint(model, emptyParam), model);
  }

  public destroy(model: IdOr<Verification>): Observable<Verification | void> {
    return this.api.destroy(endpoint(model, emptyParam));
  }
}

export const verificationResolvers = new Resolvers<Verification, []>(
  [VerificationService],
  "verificationId",
).create("Verification");

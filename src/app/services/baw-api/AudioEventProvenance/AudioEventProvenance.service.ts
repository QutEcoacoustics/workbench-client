import { Injectable } from "@angular/core";
import {
  StandardApi,
  IdOr,
  id,
  option,
  IdParamOptional,
} from "@baw-api/api-common";
import { BawApiService, Filters } from "@baw-api/baw-api.service";
import { stringTemplate } from "@helpers/stringTemplate/stringTemplate";
import { AudioEventProvenance } from "@models/AudioEventProvenance";
import { Observable, of } from "rxjs";
import { Resolvers } from "@baw-api/resolver-common";

const audioEventProvenanceId: IdParamOptional<AudioEventProvenance> = id;
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const endpoint = stringTemplate`/provenance/${audioEventProvenanceId}${option}`;

// the baw-api functionality of this model is not currently complete, therefore we are returning mock data
// TODO: remove mock data once the api is complete
@Injectable()
export class AudioEventProvenanceService
  implements StandardApi<AudioEventProvenance>
{
  public constructor(protected _api: BawApiService<AudioEventProvenance>) {}

  private mockAudioEventProvenance: AudioEventProvenance =
    new AudioEventProvenance({
      id: 1,
      name: "Mock Audio Event Provenance",
      version: "1.0",
      description: "Mock Description",
      score: 0.5,
    });

  public list(): Observable<AudioEventProvenance[]> {
    return of([this.mockAudioEventProvenance]);
    // return this.api.list(AudioEventProvenance, endpoint(emptyParam, emptyParam));
  }

  public filter(
    _filters: Filters<AudioEventProvenance>
  ): Observable<AudioEventProvenance[]> {
    return of([this.mockAudioEventProvenance]);
    // return this.api.filter(
    // AudioEventProvenance,
    // endpoint(emptyParam, filterParam),
    // filters
    // );
  }

  // since the API for this service isn't currently functional, we return a fake model
  public show(
    _model: IdOr<AudioEventProvenance>
  ): Observable<AudioEventProvenance> {
    return of(this.mockAudioEventProvenance);
    // return this.api.show(AudioEventProvenance, endpoint(model, emptyParam));
  }

  public create(
    _model: AudioEventProvenance
  ): Observable<AudioEventProvenance> {
    return of(this.mockAudioEventProvenance);
    // return this.api.create(
    // AudioEventProvenance,
    // endpoint(emptyParam, emptyParam),
    // (audioEventProvenance) => endpoint(audioEventProvenance, emptyParam),
    // model
    // );
  }

  public update(
    _model: AudioEventProvenance
  ): Observable<AudioEventProvenance> {
    return of(this.mockAudioEventProvenance);
    // return this.api.update(
    // AudioEventProvenance,
    // endpoint(model, emptyParam),
    // model
    // );
  }

  public destroy(
    _model: IdOr<AudioEventProvenance>
  ): Observable<void | AudioEventProvenance> {
    return of();
    // return this.api.destroy(endpoint(model, emptyParam));
  }
}

export const audioEventProvenanceResolvers = new Resolvers<
  AudioEventProvenance,
  [IdOr<AudioEventProvenance>]
>([AudioEventProvenanceService], "audioEventProvenanceId").create(
  "AUDIO_EVENT_PROVENANCE"
);

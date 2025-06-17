import { Injectable } from "@angular/core";
import {
  StandardApi,
  IdOr,
  id,
  option,
  IdParamOptional,
  emptyParam,
  filterParam,
} from "@baw-api/api-common";
import { BawApiService, Filters } from "@baw-api/baw-api.service";
import { stringTemplate } from "@helpers/stringTemplate/stringTemplate";
import { AudioEventProvenance } from "@models/AudioEventProvenance";
import { Observable } from "rxjs";
import { Resolvers } from "@baw-api/resolver-common";
import { TypeaheadSearchCallback } from "@shared/typeahead-input/typeahead-input.component";
import { createSearchCallback } from "@helpers/typeahead/typeaheadCallbacks";

const audioEventProvenanceId: IdParamOptional<AudioEventProvenance> = id;
const endpoint = stringTemplate`/provenances/${audioEventProvenanceId}${option}`;

// the baw-api functionality of this model is not currently complete, therefore we are returning mock data
// TODO: remove mock data once the api is complete
@Injectable()
export class AudioEventProvenanceService
  implements StandardApi<AudioEventProvenance>
{
  public constructor(protected api: BawApiService<AudioEventProvenance>) {}

  public list(): Observable<AudioEventProvenance[]> {
    return this.api.list(
      AudioEventProvenance,
      endpoint(emptyParam, emptyParam),
    );
  }

  public filter(
    filters: Filters<AudioEventProvenance>,
  ): Observable<AudioEventProvenance[]> {
    return this.api.filter(
      AudioEventProvenance,
      endpoint(emptyParam, filterParam),
      filters,
    );
  }

  public show(
    model: IdOr<AudioEventProvenance>,
  ): Observable<AudioEventProvenance> {
    return this.api.show(AudioEventProvenance, endpoint(model, emptyParam));
  }

  public create(model: AudioEventProvenance): Observable<AudioEventProvenance> {
    return this.api.create(
      AudioEventProvenance,
      endpoint(emptyParam, emptyParam),
      (audioEventProvenance) => endpoint(audioEventProvenance, emptyParam),
      model,
    );
  }

  public update(model: AudioEventProvenance): Observable<AudioEventProvenance> {
    return this.api.update(
      AudioEventProvenance,
      endpoint(model, emptyParam),
      model,
    );
  }

  public destroy(
    model: IdOr<AudioEventProvenance>,
  ): Observable<void | AudioEventProvenance> {
    return this.api.destroy(endpoint(model, emptyParam));
  }

  public typeaheadCallback(): TypeaheadSearchCallback<AudioEventProvenance> {
    return createSearchCallback(this, "name");
  }
}

export const audioEventProvenanceResolvers = new Resolvers<
  AudioEventProvenance,
  [IdOr<AudioEventProvenance>]
>([AudioEventProvenanceService], "audioEventProvenanceId").create(
  "AUDIO_EVENT_PROVENANCE",
);

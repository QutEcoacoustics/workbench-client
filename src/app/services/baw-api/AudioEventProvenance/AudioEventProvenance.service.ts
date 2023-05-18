import { Injectable } from "@angular/core";
import { StandardApi, IdOr, id, IdParam, option, emptyParam } from "@baw-api/api-common";
import { BawApiService, Filters } from "@baw-api/baw-api.service";
import { stringTemplate } from "@helpers/stringTemplate/stringTemplate";
import { AudioEventProvenance } from "@models/AudioEventProvenance";
import { Observable } from "rxjs";
import { Resolvers } from "@baw-api/resolver-common";

const audioEventProvenanceId: IdParam<AudioEventProvenance> = id;
const endpoint = stringTemplate`/provenance/${audioEventProvenanceId}${option}`;

@Injectable()
export class AudioEventProvenanceService
  implements StandardApi<AudioEventProvenance, [IdOr<AudioEventProvenance>]>
{
  public constructor(
    protected api: BawApiService<AudioEventProvenance>,
  ) {}

  public list(
    model: IdOr<AudioEventProvenance>,
  ): Observable<AudioEventProvenance[]> {
    return this.api.list(AudioEventProvenance, endpoint(model, emptyParam));
  }

  public filter(
    filters: Filters<AudioEventProvenance>,
    model: IdOr<AudioEventProvenance>,
  ): Observable<AudioEventProvenance[]> {
    return this.api.filter(
      AudioEventProvenance,
      endpoint(model, emptyParam),
      filters,
    );
  }

  public show(model: IdOr<AudioEventProvenance>): Observable<AudioEventProvenance> {
    return this.api.show(AudioEventProvenance, endpoint(model, emptyParam));
  }

  public create(model: AudioEventProvenance): Observable<AudioEventProvenance> {
    return this.api.create(
      AudioEventProvenance,
      endpoint(model, emptyParam),
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

  public destroy(model: IdOr<AudioEventProvenance>): Observable<void | AudioEventProvenance> {
    return this.api.destroy(endpoint(model, emptyParam));
  }
}

export const audioEventProvenanceResolvers = new Resolvers<
  AudioEventProvenance,
  [IdOr<AudioEventProvenance>]
>([AudioEventProvenanceService], "audioEventProvenanceId").create("AUDIO_EVENT_PROVENANCE");

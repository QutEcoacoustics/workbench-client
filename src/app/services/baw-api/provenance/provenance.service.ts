import { inject, Injectable } from "@angular/core";
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
import { Provenance } from "@models/Provenance";
import { Observable } from "rxjs";
import { Resolvers } from "@baw-api/resolver-common";
import { TypeaheadSearchCallback } from "@shared/typeahead-input/typeahead-input.component";
import { createSearchCallback } from "@helpers/typeahead/typeaheadCallbacks";

const provenanceId: IdParamOptional<Provenance> = id;
const endpoint = stringTemplate`/provenances/${provenanceId}${option}`;

@Injectable()
export class ProvenanceService implements StandardApi<Provenance> {
  protected readonly api = inject(BawApiService<Provenance>);

  public list(): Observable<Provenance[]> {
    return this.api.list(Provenance, endpoint(emptyParam, emptyParam));
  }

  public filter(filters: Filters<Provenance>): Observable<Provenance[]> {
    return this.api.filter(
      Provenance,
      endpoint(emptyParam, filterParam),
      filters,
    );
  }

  public show(model: IdOr<Provenance>): Observable<Provenance> {
    return this.api.show(Provenance, endpoint(model, emptyParam));
  }

  public create(model: Provenance): Observable<Provenance> {
    return this.api.create(
      Provenance,
      endpoint(emptyParam, emptyParam),
      (provenance) => endpoint(provenance, emptyParam),
      model,
    );
  }

  public update(model: Provenance): Observable<Provenance> {
    return this.api.update(Provenance, endpoint(model, emptyParam), model);
  }

  public destroy(model: IdOr<Provenance>): Observable<void | Provenance> {
    return this.api.destroy(endpoint(model, emptyParam));
  }

  public typeaheadCallback(): TypeaheadSearchCallback<Provenance> {
    return createSearchCallback(this, "name");
  }
}

export const provenanceResolvers = new Resolvers<
  Provenance,
  [IdOr<Provenance>]
>([ProvenanceService], "provenanceId").create("Provenance");

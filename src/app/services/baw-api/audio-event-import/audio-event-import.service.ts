import { inject, Injectable } from "@angular/core";
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
import { Resolvers } from "@baw-api/resolver-common";
import { stringTemplate } from "@helpers/stringTemplate/stringTemplate";
import { createSearchCallback } from "@helpers/typeahead/typeaheadCallbacks";
import { AudioEventImport } from "@models/AudioEventImport";
import { TypeaheadSearchCallback } from "@shared/typeahead-input/typeahead-input.component";
import { Observable } from "rxjs";

const eventImportId: IdParamOptional<AudioEventImport> = id;
const endpoint = stringTemplate`/audio_event_imports/${eventImportId}${option}`;

/**
 * Audio event import service.
 * Handles API routes pertaining to audio event imports (e.g. annotation imports).
 */
@Injectable()
export class AudioEventImportService implements StandardApi<AudioEventImport> {
  private readonly api = inject(BawApiService<AudioEventImport>);

  public list(): Observable<AudioEventImport[]> {
    return this.api.list(AudioEventImport, endpoint(emptyParam, emptyParam));
  }

  public filter(
    filters: Filters<AudioEventImport>
  ): Observable<AudioEventImport[]> {
    return this.api.filter(
      AudioEventImport,
      endpoint(emptyParam, filterParam),
      filters
    );
  }

  public show(model: IdOr<AudioEventImport>): Observable<AudioEventImport> {
    return this.api.show(AudioEventImport, endpoint(model, emptyParam));
  }

  public create(model: AudioEventImport): Observable<AudioEventImport> {
    return this.api.create(
      AudioEventImport,
      endpoint(emptyParam, emptyParam),
      (event) => endpoint(event, emptyParam),
      model
    );
  }

  public update(model: AudioEventImport): Observable<AudioEventImport> {
    return this.api.update(
      AudioEventImport,
      endpoint(model, emptyParam),
      model
    );
  }

  public destroy(
    model: IdOr<AudioEventImport>
  ): Observable<AudioEventImport | void> {
    return this.api.destroy(endpoint(model, emptyParam));
  }

  public typeaheadCallback(): TypeaheadSearchCallback<AudioEventImport> {
    return createSearchCallback(this, "name", {}, {
      include: ["id", "name"],
    });
  }
}

export const audioEventImportResolvers = new Resolvers<AudioEventImport, []>(
  [AudioEventImportService],
  "annotationId"
).create("AudioEventImport");

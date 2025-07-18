import { Injectable } from "@angular/core";
import {
  emptyParam,
  filterParam,
  id,
  IdOr,
  IdParamOptional,
  ImmutableApi,
  option,
} from "@baw-api/api-common";
import { BawApiService, Filters } from "@baw-api/baw-api.service";
import { stringTemplate } from "@helpers/stringTemplate/stringTemplate";
import { Id } from "@interfaces/apiInterfaces";
import { AudioEventImport } from "@models/AudioEventImport";
import { AudioEventImportFile } from "@models/AudioEventImportFile";
import { Observable } from "rxjs";

const eventImportId: IdParamOptional<AudioEventImport> = id;
const eventImportFileId: IdParamOptional<AudioEventImportFile> = id;

const endpoint = stringTemplate`/audio_event_imports/${eventImportId}/files/${eventImportFileId}${option}`;

@Injectable()
export class AudioEventImportFileService
  implements ImmutableApi<AudioEventImportFile, [IdOr<AudioEventImport>, ...any]>
{
  public constructor(private api: BawApiService<AudioEventImportFile>) {}

  public list(
    audioEventImport: IdOr<AudioEventImport>
  ): Observable<AudioEventImportFile[]> {
    return this.api.list(
      AudioEventImportFile,
      endpoint(audioEventImport, emptyParam, emptyParam)
    );
  }

  public filter(
    filters: Filters<AudioEventImportFile, keyof AudioEventImportFile>,
    audioEventImport: IdOr<AudioEventImport>
  ): Observable<AudioEventImportFile[]> {
    return this.api.filter(
      AudioEventImportFile,
      endpoint(audioEventImport, emptyParam, filterParam),
      filters
    );
  }

  public show(
    model: IdOr<AudioEventImportFile>,
    audioEventImport: AudioEventImport
  ): Observable<AudioEventImportFile> {
    return this.api.show(
      AudioEventImportFile,
      endpoint(audioEventImport, model, emptyParam)
    );
  }

  public destroy(
    model: IdOr<AudioEventImportFile>,
    audioEventImport: AudioEventImport,
  ): Observable<void | AudioEventImportFile> {
    return this.api.destroy(endpoint(audioEventImport, model, emptyParam));
  }

  public create(
    model: AudioEventImportFile,
    audioEventImport: AudioEventImport,
    provenanceId: Id,
  ): Observable<AudioEventImportFile> {
    const params: { commit?: boolean, provenance_id?: number } = { commit: true };
    if (provenanceId !== null) {
      params.provenance_id = provenanceId;
    }

    // unlike the dry run, we want to raise errors to the user if the api
    // responses with a 422 (unprocessable content) error
    return this.api.create(
      AudioEventImportFile,
      endpoint(audioEventImport, emptyParam, emptyParam),
      (event) => endpoint(audioEventImport, event, emptyParam),
      model,
      { params }
    );
  }

  /**
   * Similar to create, but does not result in a saved record being committed
   * to the database.
   * Specifically designed for testing if a payload passes validation.
   */
  public dryCreate(
    model: AudioEventImportFile,
    audioEventImport: AudioEventImport,
    provenanceId: Id,
  ) {
    const params: { commit?: boolean, provenance_id?: number } = {};
    if (provenanceId !== null) {
      params.provenance_id = provenanceId;
    }

    // we don't want to raise non-200 responses as errors because the api will
    // respond with a 422 (unprocessable content) error if a dry run fails
    return this.api
      .create(
        AudioEventImportFile,
        endpoint(audioEventImport, emptyParam, emptyParam),
        (event) => endpoint(audioEventImport, event, emptyParam),
        model,
        { disableNotification: true, params }
      );
  }
}

import { computed, Injectable, signal } from "@angular/core";
import { EventImportError } from "@models/AudioEventImport/ImportedAudioEvent";
import { AudioEventImportFile } from "@models/AudioEventImportFile";

// A polymorphic type interface that can be used to structurally type a queued
// file without leaking typings.
export interface ImportedFileWithErrors {
  model: Readonly<AudioEventImportFile>;
  errors: ReadonlyArray<EventImportError>;
}

@Injectable({ providedIn: "root" })
export class ImportAnnotationService {
  public importFileModel = signal<ImportedFileWithErrors[]>([]);

  public importErrors = computed<ReadonlyArray<EventImportError>>(() =>
    this.importFileModel().flatMap((model) => model.errors),
  );

  public importWarnings = computed<ReadonlyArray<EventImportError>>(() => []);
}

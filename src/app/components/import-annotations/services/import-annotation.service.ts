import { computed, Injectable, signal } from "@angular/core";
import { EventImportError } from "@models/AudioEventImport/ImportedAudioEvent";
import { AudioEventImportFile } from "@models/AudioEventImportFile";

// A polymorphic type interface that can be used to structurally type a queued
// file without leaking typings.
export interface ImportedFileWithErrors {
  model: Readonly<AudioEventImportFile>;
  errors: ReadonlyArray<EventImportError>;
}

/**
 * @description
 * Shared state for a single annotation import.
 */
@Injectable({ providedIn: "root" })
export class ImportAnnotationService {
  private importFileModel = signal<ImportedFileWithErrors[]>([]);

  public importErrors = computed<ReadonlyArray<EventImportError>>(() =>
    this.importFileModel().flatMap((model) => model.errors),
  );

  // Resets the services import state and returns a writable signal that can be
  // used to add files to the current import.
  public newInstance() {
    this.resetState();
    return this.importFileModel;
  }

  public connect() {
    return this.importFileModel.asReadonly();
  }

  private resetState() {
    // We create a new signal so that all other consumers of previous signals
    // get disconnected.
    // this.importFileModel = signal([]);
    this.importFileModel.set([]);
  }
}

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
 * Shared state for an annotation import session.
 * Use the `newInstance()` and `connect()` methods
 */
@Injectable({ providedIn: "root" })
export class ImportAnnotationService {
  // This signal is purposely private to prevent consumers of this service
  // have to either create a newInstance() or connect() to an existing instance.
  //
  // This prevents two consumers having write access to the importFileModel.
  private importFileModels = signal<ImportedFileWithErrors[]>([]);

  public importErrors = computed<ReadonlyArray<EventImportError>>(() =>
      this.importFileModels().flatMap((model) => model.errors),
    );

  /**
   * @description
   * Resets the services import state and returns a writable signal that can be
   * used to add files to the current import.
   */
  public newInstance() {
    this.resetState();
    return this.importFileModels;
  }

  /**
   * @description
   * Create a readonly signal that can be used to observe the queued files in
   * the current annotation upload.
   */
  public connect() {
    return this.importFileModels.asReadonly();
  }

  private resetState() {
    this.importFileModels.set([]);
  }
}

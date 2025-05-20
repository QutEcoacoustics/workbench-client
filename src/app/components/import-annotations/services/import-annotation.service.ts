import { computed, Injectable, signal } from "@angular/core";
import { EventImportError } from "@models/AudioEventImport/ImportedAudioEvent";
import { QueuedFile } from "../pages/add-annotations/add-annotations.component";

@Injectable({ providedIn: "root" })
export class ImportAnnotationService {
  public importFileModel = signal<ReadonlyArray<QueuedFile>>([]);

  public importErrors = computed<ReadonlyArray<EventImportError>>(() =>
    this.importFileModel().flatMap((model) => model.errors),
  );

  public importWarnings = computed<ReadonlyArray<EventImportError>>(() => []);
}

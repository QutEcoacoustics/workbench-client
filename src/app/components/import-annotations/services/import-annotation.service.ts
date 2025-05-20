import { computed, Injectable, signal } from "@angular/core";
import { EventImportError } from "@models/AudioEventImport/ImportedAudioEvent";
import { AudioEventImportFile } from "@models/AudioEventImportFile";

@Injectable({ providedIn: "root" })
export class ImportAnnotationService {
  public importFileModel = signal(new Set<Readonly<AudioEventImportFile | null>>());

  public importErrors = computed(() => {
    const foundErrors: EventImportError[] = [];
    for (const file of this.importFileModel()) {
      foundErrors.push(...file.importedEvents.flatMap((event) => event.errors));
    }

    return [];
  });
}

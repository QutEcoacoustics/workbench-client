import {
  Component,
  ElementRef,
  Inject,
  OnInit,
  ViewChild,
} from "@angular/core";
import { audioEventImportResolvers } from "@baw-api/audio-event-import/audio-event-import.service";
import { PageComponent } from "@helpers/page/pageComponent";
import {
  ImportedAudioEvent,
  EventImportError,
} from "@models/AudioEventImport/ImportedAudioEvent";
import { Id } from "@interfaces/apiInterfaces";
import { AudioEventImportFileService } from "@baw-api/audio-event-import-file/audio-event-import-file.service";
import {
  BehaviorSubject,
  catchError,
  first,
  forkJoin,
  map,
  Observable,
  of,
  takeUntil,
  throwError,
} from "rxjs";
import { AudioEventImport } from "@models/AudioEventImport";
import { AudioEventImportFile } from "@models/AudioEventImportFile";
import { ActivatedRoute, Router } from "@angular/router";
import { AbstractModel, AbstractModelWithoutId } from "@models/AbstractModel";
import { AssociationInjector } from "@models/ImplementsInjector";
import { ASSOCIATION_INJECTOR } from "@services/association-injector/association-injector.tokens";
import { ToastrService } from "ngx-toastr";
import { UnsavedInputCheckingComponent } from "@guards/input/input.guard";
import { IPageInfo } from "@helpers/page/pageInfo";
import {
  hasResolvedSuccessfully,
  retrieveResolvers,
} from "@baw-api/resolver-common";
import { TagsService } from "@baw-api/tag/tags.service";
import { ErrorCardStyle } from "@shared/error-card/error-card.component";
import { BawApiError } from "@helpers/custom-errors/baw-api-error";
import { INTERNAL_SERVER_ERROR } from "http-status";
import {
  addAnnotationImportMenuItem,
  annotationsImportCategory,
} from "../import-annotations.menu";
import { annotationImportRoute } from "../import-annotations.routes";

interface QueuedFile {
  file: Readonly<File>;

  /**
   * An audio event model that represents the file that was uploaded.
   * This can be null if the file has not been dry run yet.
   */
  model: Readonly<AudioEventImportFile | null>;

  /**
   * Errors that apply to the entire file that we cannot display in the events
   * table.
   * E.g. duplicate file uploads, names, etc...
   */
  errors: ReadonlyArray<EventImportError>;

  /**
   * Audio events that will be applied to every event row in the file.
   */
  additionalTagIds: Id[];
}

class TableRow extends AbstractModelWithoutId {
  public fileId: number;
  public eventId: number;
  public event: ImportedAudioEvent;

  public get viewUrl(): string {
    throw new Error("Method not implemented.");
  }
}

enum ImportState {
  NONE,
  SUCCESS,
  FAILURE,
  UPLOADING,

  /**
   * The final stage of the upload after the imports have been successfully
   * committed to the database.
   *
   * Transitioning to this stage allows the page to navigate without warning.
   */
  COMMITTED,
}

const audioEventImportKey = "audioEventImport";

@Component({
  selector: "baw-add-annotations",
  templateUrl: "add-annotations.component.html",
  styleUrl: "add-annotations.component.scss",
})
class AddAnnotationsComponent
  extends PageComponent
  implements OnInit, UnsavedInputCheckingComponent
{
  public constructor(
    protected tagsApi: TagsService,
    private api: AudioEventImportFileService,
    private route: ActivatedRoute,
    private router: Router,
    private notifications: ToastrService,
    @Inject(ASSOCIATION_INJECTOR) private injector: AssociationInjector
  ) {
    super();
  }

  @ViewChild("fileInput") private fileInput!: ElementRef<HTMLInputElement>;

  /** The route model that the annotation import is scoped to */
  public audioEventImport?: AudioEventImport;

  /**
   * A state machine representation that can be used to lock UI elements during
   * uploading / error states.
   */
  protected importState: ImportState = ImportState.NONE;

  // we use a BehaviorSubject for the audio event import files because users can
  // upload multiple files through the file input and new subscribers should get
  // the most recent value
  protected importFiles$ = new BehaviorSubject<QueuedFile[]>([]);

  protected errorCardStyles = ErrorCardStyle;

  // I use an object here when I should be using a readonly map because I want
  // to use the "as const" assertion to make the object immutable, get
  // bundling optimizations, have stricter type checking, and auto completion.
  private extensionMappings = { csv: "text/csv" } as const;

  public get hasUnsavedChanges(): boolean {
    return (
      this.importState !== ImportState.NONE &&
      this.importState !== ImportState.COMMITTED
    );
  }

  // a predicate to check if every import group is valid
  // this is used for form validation
  protected get canCommitUploads(): boolean {
    return this.importState === ImportState.SUCCESS;
  }

  // if the "Import Annotations" button is disabled, we want to provide some
  // feedback to the user outlining why they cannot submit the form using a
  // tooltip
  protected get uploadTooltip(): string | null {
    // by returning null, the tooltip will not be displayed
    if (this.canCommitUploads) {
      return null;
    }

    if (this.importState === ImportState.NONE) {
      return "Please select a file to upload";
    } else if (this.importState === ImportState.FAILURE) {
      return "Please fix all errors before submitting";
    } else if (this.importState === ImportState.UPLOADING) {
      return "Please wait for the current upload to complete";
    }

    // should never hit, but be safe
    return null;
  }

  public ngOnInit(): void {
    const models = retrieveResolvers(this.route.snapshot.data as IPageInfo);

    if (!hasResolvedSuccessfully(models)) {
      this.failure = true;
      return;
    }

    this.audioEventImport = models[audioEventImportKey] as AudioEventImport;
  }

  protected getEventModels = (): Observable<TableRow[]> => {
    return this.importFiles$.pipe(
      map((files: QueuedFile[]) => {
        return files.flatMap((file, fileIndex: number) => {
          return file.model?.importedEvents.map(
            (event: ImportedAudioEvent, eventIndex: number) => {
              return new TableRow({
                fileId: fileIndex + 1,
                eventId: eventIndex + 1,
                event,
              });
          });
        });
      })
    );
  };

  // typeahead returns models, we need ids for filtering
  protected getIdsFromAbstractModelArray(items: object[]): Id[] {
    return items.map((item: AbstractModel): Id => item.id);
  }

  protected handleFileChange(event: Event): void {
    const target = event.target;
    if (!(target instanceof HTMLInputElement)) {
      throw new Error("Target is not an input element");
    } else if (target.files === null) {
      // the files can be null if no files were selected
      return;
    }

    const files: FileList = target.files;
    const bufferedFiles = Array.from(files);

    // sometimes the operating system will report files such as csv files as
    // excel file types.
    // because the api cannot process excel files, it will reject it and return
    // an error.
    // to fix this, we will change the file type to the correct type using the
    // file extension.
    const filesToImport: File[] = bufferedFiles.map((file: File) => {
      const extension = this.extractFileExtension(file);

      const fileTypeMapping = this.extensionMappings[extension.toLowerCase()];
      if (fileTypeMapping) {
        return this.changeFileTypes(file, fileTypeMapping);
      }

      return file;
    });

    const newQueuedModels: QueuedFile[] = filesToImport.map((file: File) =>
      this.importFileToBufferedFile(file, null, [])
    );

    this.importFiles$.next([...this.importFiles$.value, ...newQueuedModels]);

    const updatedFiles = this.importFiles$.value.map((file) => file.file);
    this.updateFileInputFiles(updatedFiles);

    this.performDryRun();
  }

  protected hasFiles(): Observable<boolean> {
    return this.importFiles$.pipe(map((files) => files.length > 0));
  }

  protected hasRecordingErrors(
    model: ImportedAudioEvent
  ): model is ImportedAudioEvent & {
    errors: {
      audioRecordingId: Required<EventImportError["audioRecordingId"]>;
    };
  } {
    return model.errors.some((error) => "audioRecordingId" in error);
  }

  // uses a reference to the ImportGroup object and update the additional tag
  // ids property
  protected updateExtraTags(additionalTagIds: Id[]): void {
    // when the user applies "extra tags" we want to immediately set the import
    // state to "UPLOADING" so that the UI elements get locked while the extra
    // tags are applied
    this.importState = ImportState.UPLOADING;

    for (const file of this.importFiles$.value) {
      file.additionalTagIds = additionalTagIds;
    }
  }

  protected updateFileAdditionalTagIds(model: QueuedFile, tagIds: Id[]): void {
    model.additionalTagIds = tagIds;
    this.performDryRun();
  }

  protected removeBufferedFile(model: QueuedFile): void {
    this.importFiles$.next(
      this.importFiles$.value.filter(
        (file: QueuedFile) => file.file !== model.file
      )
    );

    const importedFiles = this.importFiles$.value.map((file) => file.file);
    this.updateFileInputFiles(importedFiles);

    if (importedFiles.length === 0) {
      // we transition to the "none" state if there are no files to import
      // this allows the user to navigate away from the page without a
      // warning message
      this.importState = ImportState.NONE;
    } else {
      this.performDryRun();
    }
  }

  // sends all import groups to the api if there are no errors
  protected commitImports(): Promise<void> {
    // importing invalid annotation imports results in an internal server error
    // we should therefore not submit any upload groups if there are any errors
    if (!this.canCommitUploads) {
      return;
    }

    this.importState = ImportState.UPLOADING;

    const fileUploadObservables = this.importFiles$.value.map(
      (model: QueuedFile) => this.commitFile(model)
    );

    forkJoin(fileUploadObservables)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe({
        error: () => (this.importState = ImportState.FAILURE),
        complete: () => {
          if (this.importState === ImportState.FAILURE) {
            console.error("Failed to import annotations");
            return;
          }

          this.importState = ImportState.COMMITTED;
          this.notifications.success("Successfully imported annotations");

          this.router.navigateByUrl(
            annotationImportRoute.toRouterLink({
              annotationId: this.audioEventImport.id,
            })
          );
        },
      });
  }

  private performDryRun(): void {
    this.importState = ImportState.UPLOADING;

    const models: QueuedFile[] = this.importFiles$.value;
    const fileUploadObservables = models.map((model: QueuedFile) =>
      this.dryRunFile(model)
    );

    forkJoin(fileUploadObservables)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe({
        next: (result: QueuedFile[]) => {
          this.importFiles$.next(result);
        },
        complete: () => {
          if (this.importState !== ImportState.FAILURE) {
            this.importState = ImportState.SUCCESS;
          }
        },
      });
  }

  private commitFile(model: QueuedFile): Observable<AudioEventImportFile> {
    const importFileModel = this.createAudioEventImportFile(model);

    return this.api
      .create(importFileModel, this.audioEventImport)
      .pipe(first());
  }

  private dryRunFile(queueModel: QueuedFile): Observable<QueuedFile> {
    const importFileModel = this.createAudioEventImportFile(queueModel);
    const file = queueModel.file;

    return this.api.dryCreate(importFileModel, this.audioEventImport).pipe(
      first(),
      map(
        (model: AudioEventImportFile): QueuedFile =>
          this.importFileToBufferedFile(file, model, [])
      ),
      catchError((error: BawApiError<AudioEventImportFile>) => {
        const errors = this.extractFileErrors(file, error);
        this.importState = ImportState.FAILURE;

        if (Array.isArray(error.data)) {
          return throwError(() => new Error("Expected a single model"));
        }

        const result = this.importFileToBufferedFile(file, error.data, errors);
        return of(result);
      })
    );
  }

  /**
   * Updates the file input so that it displays the correct number of uploaded
   * files and file names.
   */
  private updateFileInputFiles(files: File[]): void {
    const dataTransfer = new DataTransfer();
    for (const file of files) {
      dataTransfer.items.add(file);
    }

    this.fileInput.nativeElement.files = dataTransfer.files;
  }

  private importFileToBufferedFile(
    file: File,
    model: AudioEventImportFile,
    errors: EventImportError[]
  ): QueuedFile {
    return {
      additionalTagIds: [],
      file,
      model,
      errors,
    };
  }

  private createAudioEventImportFile(model: QueuedFile): AudioEventImportFile {
    const file = model.file;
    const additionalTagIds = model.additionalTagIds;

    return new AudioEventImportFile({ file, additionalTagIds }, this.injector);
  }

  private extractFileErrors(
    file: File,
    error: BawApiError<AudioEventImportFile>
  ): EventImportError[] {
    if (error.status === INTERNAL_SERVER_ERROR) {
      return [
        { [file.name]: "An unrecoverable internal server error occurred." },
      ];
    }

    // because we are mutating the error object (for nicer error message), I
    // create a new object so that I don't accidentally mutate the original
    // error by reference
    const newErrors: EventImportError[] = Array.isArray(error.info)
      ? error.info
      : [error.info];

    return newErrors;
  }

  private extractFileExtension(file: File): Readonly<string | undefined> {
    return file.name.split(".").pop();
  }

  private changeFileTypes(files: File, type: string): File {
    return new File([files], files.name, { type });
  }
}

AddAnnotationsComponent.linkToRoute({
  category: annotationsImportCategory,
  pageRoute: addAnnotationImportMenuItem,
  resolvers: {
    [audioEventImportKey]: audioEventImportResolvers.show,
  },
});

export { AddAnnotationsComponent };

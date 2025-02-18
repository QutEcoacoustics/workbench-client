import { Component, Inject, OnInit, ViewChild } from "@angular/core";
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
  mergeMap,
  Observable,
  of,
  takeUntil,
} from "rxjs";
import { AudioEventImport } from "@models/AudioEventImport";
import { AudioEventImportFile } from "@models/AudioEventImportFile";
import { ActivatedRoute, Router } from "@angular/router";
import { AbstractModel } from "@models/AbstractModel";
import { AssociationInjector } from "@models/ImplementsInjector";
import { ASSOCIATION_INJECTOR } from "@services/association-injector/association-injector.tokens";
import { ToastrService } from "ngx-toastr";
import { NgForm } from "@angular/forms";
import { UnsavedInputCheckingComponent } from "@guards/input/input.guard";
import { IPageInfo } from "@helpers/page/pageInfo";
import {
  hasResolvedSuccessfully,
  retrieveResolvers,
} from "@baw-api/resolver-common";
import { TagsService } from "@baw-api/tag/tags.service";
import { ErrorCardStyle } from "@shared/error-card/error-card.component";
import { BawApiError } from "@helpers/custom-errors/baw-api-error";
import { isInstantiated } from "@helpers/isInstantiated/isInstantiated";
import { INTERNAL_SERVER_ERROR } from "http-status";
import {
  addAnnotationImportMenuItem,
  annotationsImportCategory,
} from "../import-annotations.menu";
import { annotationImportRoute } from "../import-annotations.routes";

interface QueuedFile {
  file: Readonly<File>;

  model: Readonly<AudioEventImportFile>;

  /**
   * Errors that apply to the entire file that we cannot display in the events
   * table.
   * E.g. duplicate file uploads, names, etc...
   */
  errors: ReadonlyArray<EventImportError>;

  /**
   * Audio events that will be applied to every event row in the file.
   */
  additionalTagIds: ReadonlyArray<Id>;
}

enum ImportState {
  NONE,
  SUCCESS,
  FAILURE,
  UPLOADING,
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

  @ViewChild(NgForm) private form!: NgForm;

  /**
   * A state machine representation that can be used to lock UI elements during
   * uploading / error states.
   */
  protected importState: ImportState = ImportState.NONE;

  // we use a BehaviorSubject for the audio event import files because users can
  // upload multiple files through the file input and new subscribers should get
  // the most recent value
  protected importFiles$ = new BehaviorSubject<QueuedFile[]>([]);
  private importFiles: File[] = [];

  protected errorCardStyles = ErrorCardStyle;

  /** The route model that the annotation import is scoped to */
  private audioEventImport?: AudioEventImport;

  // I use an object here when I should be using a readonly map because I want
  // to use the "as const" assertion to make the object immutable, get
  // bundling optimizations, have stricter type checking, and auto completion.
  private extensionMappings = { csv: "text/csv" } as const;

  public get hasUnsavedChanges(): boolean {
    return this.hasAdditionalTags || this.importState !== ImportState.NONE;
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

  private get hasAdditionalTags(): boolean {
    return this.additionalTagIds.length > 0;
  }

  public ngOnInit(): void {
    const models = retrieveResolvers(this.route.snapshot.data as IPageInfo);

    if (!hasResolvedSuccessfully(models)) {
      this.failure = true;
      return;
    }

    this.audioEventImport = models[audioEventImportKey] as AudioEventImport;
  }

  protected getEventModels = (): Observable<ImportedAudioEvent[]> => {
    return this.importFiles$.pipe(
      mergeMap((files: QueuedFile[]) => {
        return files.map((file) => file.model.importedEvents);
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
    this.importFiles = bufferedFiles.map((file: File) => {
      const extension = this.extractFileExtension(file);

      const fileTypeMapping = this.extensionMappings[extension.toLowerCase()];
      if (fileTypeMapping) {
        return this.changeFileTypes(file, fileTypeMapping);
      }

      return file;
    });

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
  protected updateAdditionalTagIds(additionalTagIds: Id[]): void {
    this.additionalTagIds = additionalTagIds;
    this.performDryRun();
  }

  protected removeBufferedFile(model: QueuedFile): void {
    this.importFiles = this.importFiles.filter((file) => file !== model.file);
    this.performDryRun();
  }

  // sends all import groups to the api if there are no errors
  protected commitImports(): Promise<void> {
    // importing invalid annotation imports results in an internal server error
    // we should therefore not submit any upload groups if there are any errors
    if (!this.canCommitUploads) {
      return;
    }

    this.importState = ImportState.UPLOADING;

    const fileUploadObservables = this.importFiles.map((file: File) =>
      this.uploadFile(file)
    );

    forkJoin(fileUploadObservables)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe({
        complete: () => {
          this.notifications.success("Successfully imported annotations");

          this.router.navigateByUrl(
            annotationImportRoute.toRouterLink({
              annotationId: this.audioEventImport.id,
            })
          );
        },
      });
  }

  private performDryRun() {
    this.importState = ImportState.UPLOADING;

    this.clearIdentifiedEvents();

    const fileUploadObservables = this.importFiles.map((file: File) =>
      this.dryRunFile(file)
    );

    forkJoin(fileUploadObservables)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe({
        next: (result: QueuedFile[]) => {
          // if a file upload fails due to an internal server error, the
          // model will be null.
          // therefore, we need to filter out any null models.
          // the user will receive a file error that the file could not be
          // uploaded
          const instantiatedResults = result.filter((model) =>
            isInstantiated(model.model)
          );

          this.importFiles$.next(instantiatedResults);
        },
        error: () => (this.importState = ImportState.FAILURE),
        complete: () => (this.importState = ImportState.SUCCESS),
      });
  }

  private uploadFile(file: File): Observable<AudioEventImportFile> {
    const importFileModel = this.createAudioEventImportFile(file);

    return this.api
      .create(importFileModel, this.audioEventImport)
      .pipe(first());
  }

  private dryRunFile(file: File): Observable<QueuedFile> {
    const importFileModel = this.createAudioEventImportFile(file);

    return this.api.dryCreate(importFileModel, this.audioEventImport).pipe(
      first(),
      map(
        (model: AudioEventImportFile): QueuedFile =>
          this.importFileToBufferedFile(file, model, [])
      ),
      catchError((error: BawApiError<AudioEventImportFile>) => {
        const errors = this.extractFileErrors(file, error);

        if (Array.isArray(error.data)) {
          throw new Error("Expected a single model");
        }

        const result = this.importFileToBufferedFile(file, error.data, errors);
        return of(result);
      })
    );
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

  private createAudioEventImportFile(file: File): AudioEventImportFile {
    return new AudioEventImportFile(
      {
        // we can guarantee that the audio event import model is defined
        // because this page component will error if the model is not resolved
        id: this.audioEventImport!.id,
        file,
        additionalTagIds: this.additionalTagIds,
      },
      this.injector
    );
  }

  private clearIdentifiedEvents(): void {
    this.importFiles$.next([]);
    this.importErrors = [];
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

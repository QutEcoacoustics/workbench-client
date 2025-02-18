import { Component, Inject, OnInit, ViewChild } from "@angular/core";
import { audioEventImportResolvers } from "@baw-api/audio-event-import/audio-event-import.service";
import { PageComponent } from "@helpers/page/pageComponent";
import { ImportedAudioEvent } from "@models/AudioEventImport/ImportedAudioEvent";
import { BawErrorData, Id } from "@interfaces/apiInterfaces";
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
import { Tag } from "@models/Tag";
import { contains, filterAnd, notIn } from "@helpers/filters/filters";
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

interface BufferedFile {
  file: Readonly<File>;

  model: Readonly<AudioEventImportFile>;

  /**
   * Errors that apply to the entire file that we cannot display in the events
   * table.
   * E.g. duplicate file uploads, names, etc...
   */
  errors: ReadonlyArray<BawErrorData>;

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
    private api: AudioEventImportFileService,
    private tagsApi: TagsService,
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
  protected importFiles$ = new BehaviorSubject<BufferedFile[]>([]);
  private importFiles: File[] = [];

  protected errorCardStyles = ErrorCardStyle;

  /** The route model that the annotation import is scoped to */
  private audioEventImport?: AudioEventImport;

  private extensionMappings = new Map([["csv", "text/csv"]]);


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
      mergeMap((files: BufferedFile[]) => {
        return files.map((file) => file.model.importedEvents);
      })
    );
  };

  // callback used by the typeahead input to search for associated tags
  protected searchTagsTypeaheadCallback = (
    text: string,
    activeItems: Tag[]
  ): Observable<Tag[]> =>
    this.tagsApi.filter({
      filter: filterAnd(
        contains<Tag, "text">("text", text),
        notIn<Tag>("text", activeItems)
      ),
    });

  // since the typeahead input returns an array of models, but the api wants the associated tags as an array of id's
  // we use this helper function to convert the array of models to an array of id's that can be sent in the api request
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

      const fileTypeMapping = this.extensionMappings.get(extension.toLowerCase());
      if (fileTypeMapping) {
        return this.changeFileTypes(file, this.extensionMappings.get(extension));
      }

      return file;
    });

    this.performDryRun();
  }

  protected hasFiles(): Observable<boolean> {
    return this.importFiles$.pipe(map((files) => files.length > 0));
  }

  protected hasRecordingErrors(model: ImportedAudioEvent): boolean {
    return model.errors.some((error) => "audioRecordingId" in error);
  }

  // uses a reference to the ImportGroup object and update the additional tag ids property
  protected updateAdditionalTagIds(additionalTagIds: Id[]): void {
    this.additionalTagIds = additionalTagIds;
    this.performDryRun();
  }

  protected removeBufferedFile(model: BufferedFile): void {
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
        next: (result: BufferedFile[]) => {
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

  private dryRunFile(file: File): Observable<BufferedFile> {
    const importFileModel = this.createAudioEventImportFile(file);

    return this.api.dryCreate(importFileModel, this.audioEventImport).pipe(
      first(),
      map(
        (model: AudioEventImportFile): BufferedFile =>
          this.importFileToBufferedFile(file, model)
      ),
      catchError((error: BawApiError<AudioEventImportFile>) => {
        this.importErrors.push(...this.extractFileErrors(file, error));

        if (Array.isArray(error.data)) {
          throw new Error("Expected a single model");
        }

        const result = this.importFileToBufferedFile(file, error.data);
        return of(result);
      })
    );
  }

  private importFileToBufferedFile(
    file: File,
    model: AudioEventImportFile
  ): BufferedFile {
    return {
      file,
      model,
      errors: [],
      additionalTagIds: [],
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
  ): BawErrorData[] {
    if (error.status === INTERNAL_SERVER_ERROR) {
      return [
        { [file.name]: "An unrecoverable internal server error occurred." },
      ];
    }

    // because we are mutating the error object (for nicer error message), I
    // create a new object so that I don't accidentally mutate the original
    // error by reference
    const newErrors: BawErrorData[] = Array.isArray(error.info)
      ? Object.assign({}, error.info)
      : [Object.assign({}, error.info)];

    const fileNameKey = "file" satisfies keyof BawErrorData;
    for (const errorInfo of newErrors) {
      // if the "file" key is in the error message, replace the file key with
      // the file name
      // this makes the error message more user friendly and easier to
      // understand when you upload multiple files
      if (fileNameKey in errorInfo) {
        errorInfo[file.name] = errorInfo[fileNameKey];
        delete errorInfo[fileNameKey];
      }
    }

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

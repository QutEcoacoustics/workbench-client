import { Component, Inject, OnInit, ViewChild } from "@angular/core";
import { audioEventImportResolvers } from "@baw-api/audio-event-import/audio-event-import.service";
import { PageComponent } from "@helpers/page/pageComponent";
import { ImportedAudioEvent } from "@models/AudioEventImport/ImportedAudioEvent";
import { BawDataError, Id } from "@interfaces/apiInterfaces";
import { AudioEventImportFileService } from "@baw-api/audio-event-import-file/audio-event-import-file.service";
import {
  catchError,
  first,
  forkJoin,
  mergeMap,
  Observable,
  of,
  startWith,
  Subscriber,
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
import { toCamelCase } from "@helpers/case-converter/case-converter";
import { isInstantiated } from "@helpers/isInstantiated/isInstantiated";
import {
  addAnnotationImportMenuItem,
  annotationsImportCategory,
} from "../import-annotations.menu";
import { annotationImportRoute } from "../import-annotations.routes";

const audioEventImportKey = "audioEventImport";

@Component({
  selector: "baw-add-annotations",
  templateUrl: "add-annotations.component.html",
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

  @ViewChild(NgForm) private form: NgForm;

  /** The route model that the annotation import is scoped to */
  public audioEventImport: AudioEventImport;

  protected errorCardStyles = ErrorCardStyle;

  /**
   * A boolean value indicating if the currently buffered audio event import can
   * be successfully committed
   */
  protected valid: boolean = false;
  protected uploading: boolean = false;
  protected importFiles: File[] = [];
  protected additionalTagIds: Id[] = [];

  /**
   * Errors that apply to the entire file that we cannot display in the events
   * table.
   * E.g. duplicate file uploads, names, etc...
   */
  protected importErrors: BawDataError[] = [];

  // we use an array for the audio event import files because users can upload
  // multiple files through the file input
  protected importFiles$ = new Observable<AudioEventImportFile[]>(
    (subscriber: Subscriber<AudioEventImportFile[]>) => {
      this.importFilesSubscriber$ = subscriber;
    }
  ).pipe(startWith([{}]));

  private importFilesSubscriber$: Subscriber<AudioEventImportFile[]>;

  public get hasUnsavedChanges(): boolean {
    return this.hasFiles || this.hasAdditionalTags;
  }

  // if the "Import Annotations" button is disabled, we want to provide some
  // feedback to the user outlining why they cannot submit the form using a
  // tooltip
  protected get uploadTooltip(): string | null {
    // by returning null, the tooltip will not be displayed
    if (this.canCommitUploads()) {
      return null;
    }

    if (!this.hasFiles) {
      return "Please select a file to upload";
    } else if (!this.valid || !this.form.valid) {
      return "Please fix all errors before submitting";
    } else if (this.uploading) {
      return "Please wait for the current upload to complete";
    }

    // we should never hit this condition, but if we do, I return null so that
    // we don't end up in an unknown state
    return null;
  }

  private get hasFiles(): boolean {
    return this.importFiles.length > 0;
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
      mergeMap((files: AudioEventImportFile[]) => {
        return files.map((file) => file.importedEvents);
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
    }

    const files: FileList = target.files;
    const bufferedFiles = Array.from(files);

    // sometimes the operating system will report files such as csv files as
    // excel file types.
    // because the api cannot process excel files, it will reject it and return
    // an error.
    // to fix this, we will change the file type to the correct type using the
    // file extension.
    const fileExtensionMappings = new Map<string, string>([
      ["csv", "text/csv"],
    ]);

    this.importFiles = bufferedFiles.map((file: File) => {
      const extension = this.extractFileExtension(file);

      const fileTypeMapping = fileExtensionMappings.get(extension.toLowerCase());
      if (fileTypeMapping) {
        return this.changeFileTypes(file, fileExtensionMappings.get(extension));
      }

      return file;
    });

    this.performDryRun();
  }

  // uses a reference to the ImportGroup object and update the additional tag ids property
  protected updateAdditionalTagIds(additionalTagIds: Id[]): void {
    this.additionalTagIds = additionalTagIds;
    this.performDryRun();
  }

  // a predicate to check if every import group is valid
  // this is used for form validation
  protected canCommitUploads(): boolean {
    return !this.uploading && this.hasFiles && this.importErrors.length === 0;
  }

  // sends all import groups to the api if there are no errors
  protected commitImports(): Promise<void> {
    // importing invalid annotation imports results in an internal server error
    // we should therefore not submit any upload groups if there are any errors
    if (!this.canCommitUploads()) {
      return;
    }

    // creates a lock so that no more files can be added to the upload queue while the upload is in progress
    this.uploading = true;

    const fileUploadObservables = this.importFiles.map((file) =>
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
    // even though we are not committing the import, we still want to lock the
    // form so that the user cannot submit before we check the files for errors
    this.uploading = true;
    this.valid = true;

    this.clearIdentifiedEvents();

    const fileUploadObservables = this.importFiles.map((file) =>
      this.dryRunFile(file)
    );

    forkJoin(fileUploadObservables)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe({
        next: (result: AudioEventImportFile[]) => {
          const instantiatedResults = result.filter((model) => isInstantiated(model));
          this.importFilesSubscriber$.next(instantiatedResults);
        },
        error: () => {
          this.valid = false;
        },
        complete: () => {
          this.uploading = false;
        },
      });
  }

  private uploadFile(file: File): Observable<AudioEventImportFile> {
    const importFileModel = this.createAudioEventImportFile(file);

    return this.api
      .create(importFileModel, this.audioEventImport)
      .pipe(first());
  }

  private dryRunFile(file: File): Observable<AudioEventImportFile> {
    const importFileModel = this.createAudioEventImportFile(file);

    return this.api.dryCreate(importFileModel, this.audioEventImport).pipe(
      first(),
      catchError((error: BawApiError<AudioEventImportFile>) => {
        this.importErrors.push(...this.extractFileErrors(error));
        return of(toCamelCase(error.data) as any);
      })
    );
  }

  private createAudioEventImportFile(file: File): AudioEventImportFile {
    return new AudioEventImportFile(
      {
        id: this.audioEventImport.id,
        file,
        additionalTagIds: this.additionalTagIds,
      },
      this.injector
    );
  }

  private clearIdentifiedEvents(): void {
    this.importFilesSubscriber$.next([]);
    this.importErrors = [];
  }

  private extractFileErrors(error: BawApiError<AudioEventImportFile>): BawDataError[] {
    return [error.info as any];
  }

  private extractFileExtension(file: File): string {
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

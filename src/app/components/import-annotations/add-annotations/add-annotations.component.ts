import { Component, Inject, OnInit } from "@angular/core";
import { audioEventImportResolvers } from "@baw-api/audio-event-import/audio-event-import.service";
import { PageComponent } from "@helpers/page/pageComponent";
import { ImportedAudioEvent } from "@models/AudioEventImport/ImportedAudioEvent";
import { Id } from "@interfaces/apiInterfaces";
import { AudioEventImportFileService } from "@baw-api/audio-event-import-file/audio-event-import-file.service";
import {
  first,
  forkJoin,
  mergeMap,
  Observable,
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
import {
  addAnnotationImportMenuItem,
  annotationsImportCategory,
} from "../import-annotations.menu";
import { annotationImportRoute } from "../import-annotations.routes";

interface ImportGroup {
  /** The iterator object of files to be imported */
  files: FileList;
  /** An array of errors encountered during a dry run */
  errors: string[];
  /**
   * List of additional tag IDs that are not found within the imported file and will be associated with every event within the import group
   * This is separate from the identified events because additional tags are typically used for grouping events eg. "testing" and "training"
   */
  additionalTagIds: Id[];
  /** An array of events that were found within the imported file during the dry run */
  identifiedEvents: ImportedAudioEvent[];
  /** Defines whether an import group has uploaded to the baw-api without any errors */
  uploaded: boolean;
}

const audioEventImportKey = "audioEventImport";

@Component({
  selector: "baw-add-annotations",
  templateUrl: "add-annotations.component.html",
  styleUrl: "add-annotations.component.scss",
})
class AddAnnotationsComponent extends PageComponent implements OnInit {
  public constructor(
    private api: AudioEventImportFileService,
    private route: ActivatedRoute,
    private router: Router,
    private notifications: ToastrService,
    @Inject(ASSOCIATION_INJECTOR) private injector: AssociationInjector
  ) {
    super();
  }

  protected uploading: boolean = false;
  protected importGroup: ImportGroup = this.emptyImportGroup;
  protected audioEventImport: AudioEventImport;

  // we use an array for the audio event import files because users can upload
  // multiple files through the file input
  protected importFiles$ = new Observable<AudioEventImportFile[]>(
    (subscriber: Subscriber<AudioEventImportFile[]>) => {
      this.importFilesSubscriber$ = subscriber;
    }
  );
  private importFilesSubscriber$: Subscriber<AudioEventImportFile[]>;

  // we want to create each new import group from a template by value
  // if it is done by reference, we would be modifying the same import group
  // therefore, we use a getter because they internally work like methods, and return a new object each time
  private get emptyImportGroup(): ImportGroup {
    return {
      files: null,
      additionalTagIds: [],
      errors: [],
      identifiedEvents: [],
      uploaded: false,
    };
  }

  public ngOnInit(): void {
    const routeData = this.route.snapshot.data;
    this.audioEventImport = routeData[audioEventImportKey].model;
  }

  // sends all import groups to the api if there are no errors
  protected commitImports(): Promise<void> {
    // importing invalid annotation imports results in an internal server error
    // we should therefore not submit any upload groups if there are any errors
    if (!this.areImportGroupsValid()) {
      return;
    }

    // creates a lock so that no more files can be added to the upload queue while the upload is in progress
    this.uploading = true;

    const fileUploadObservables = Array.from(this.importGroup.files).map(
      (file) => this.uploadFile(file)
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

    this.uploading = false;
  }

  protected getEventModels = (): Observable<ImportedAudioEvent[]> => {
    return this.importFiles$.pipe(
      mergeMap((files: AudioEventImportFile[]) => {
        return files.map((file) => {
          const events = file.importedEvents;
          // for each event, double the errors for testing
          events.forEach((event) => {
            event.errors = event.errors.concat(event.errors);
          });

          return events;
        });
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

  private performDryRun() {
    this.importGroup.errors = [];
    this.importGroup.identifiedEvents = [];

    // we perform a dry run of the import to check for errors
    for (const file of this.importGroup.files) {
      this.dryRunFile(file);
    }
  }

  private uploadFile(file: File): Observable<AudioEventImportFile> {
    const importFileModel = this.createAudioEventImportFile(file);

    return this.api
      .create(importFileModel, this.audioEventImport)
      .pipe(first());
  }

  private dryRunFile(file: File): void {
    const importFileModel = this.createAudioEventImportFile(file);

    this.api
      .dryCreate(importFileModel, this.audioEventImport)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((result: AudioEventImportFile) => {
        this.importFilesSubscriber$.next([result]);
      });
  }

  private createAudioEventImportFile(file: File): AudioEventImportFile {
    return new AudioEventImportFile(
      {
        id: this.audioEventImport.id,
        file,
        additionalTagIds: this.importGroup.additionalTagIds,
      },
      this.injector
    );
  }

  // since the typeahead input returns an array of models, but the api wants the associated tags as an array of id's
  // we use this helper function to convert the array of models to an array of id's that can be sent in the api request
  protected getIdsFromAbstractModelArray(items: object[]): Id[] {
    return items.map((item: AbstractModel): Id => item.id);
  }

  protected pushToImportGroups(event: any): void {
    const files: FileList = event.target.files;
    this.importGroup.files = files;

    this.performDryRun();
  }

  // uses a reference to the ImportGroup object and update the additional tag ids property
  protected updateAdditionalTagIds(additionalTagIds: Id[]): void {
    this.importGroup.additionalTagIds = additionalTagIds;
    this.performDryRun();
  }

  // a predicate to check if every import group is valid
  // this is used for form validation
  protected areImportGroupsValid(): boolean {
    return this.importGroup.errors.length === 0 && !!this.importGroup.files;
  }

  protected removeFromImport(model: ImportGroup): void {
    const index = this.importGroups.indexOf(model);
    if (index !== -1) {
      this.importGroups.splice(index, 1);
    }
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

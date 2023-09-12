import { Component, OnInit } from "@angular/core";
import { List } from "immutable";
import { PageComponent } from "@helpers/page/pageComponent";
import { AudioEventImport } from "@models/AudioEventImport";
import { ActivatedRoute, Router } from "@angular/router";
import {
  AudioEventImportService,
  audioEventImportResolvers,
} from "@baw-api/audio-event-import/audio-event-import.service";
import { contains, filterAnd, notIn } from "@helpers/filters/filters";
import { Tag } from "@models/Tag";
import { takeUntil, Observable, BehaviorSubject } from "rxjs";
import { Id } from "@interfaces/apiInterfaces";
import { AudioEvent } from "@models/AudioEvent";
import { TagsService } from "@baw-api/tag/tags.service";
import { AudioEventImportFileWrite } from "@models/AudioEventImport/AudioEventImportFileWrite";
import { Filters, InnerFilter } from "@baw-api/baw-api.service";
import { AbstractModel } from "@models/AbstractModel";
import { defaultSuccessMsg } from "@helpers/formTemplate/formTemplate";
import { ToastrService } from "ngx-toastr";
import { ShallowAudioEventsService } from "@baw-api/audio-event/audio-events.service";
import { BawApiError } from "@helpers/custom-errors/baw-api-error";
import { FORBIDDEN } from "http-status";
import {
  AudioEventError,
  ImportedAudioEvent,
} from "@models/AudioEventImport/ImportedAudioEvent";
import { deleteAnnotationImportModal } from "../import-annotations.modals";
import {
  annotationsImportMenuItem,
  editAnnotationImportMenuItem,
  annotationsImportCategory,
  annotationImportMenuItem,
} from "../import-annotations.menu";

export const annotationMenuActions = [
  annotationsImportMenuItem,
  editAnnotationImportMenuItem,
  deleteAnnotationImportModal,
];

const audioEventImportKey = "audioEventImport";

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

/**
 * ! This component is subject to change due to forecasted breaking api changes
 * Most of the breaking changes address performance concerns with large annotation imports
 *
 * @see https://github.com/QutEcoacoustics/baw-server/issues/664
 */
@Component({
  selector: "baw-annotation-import",
  templateUrl: "details.component.html",
  styleUrls: ["details.component.scss"],
})
class AnnotationsDetailsComponent extends PageComponent implements OnInit {
  public constructor(
    private route: ActivatedRoute,
    private tagsApi: TagsService,
    private eventsApi: ShallowAudioEventsService,
    private eventImportsApi: AudioEventImportService,
    private notifications: ToastrService,
    private router: Router
  ) {
    super();
  }

  public importGroups: ImportGroup[] = [this.emptyImportGroup];
  public audioEventImport: AudioEventImport;
  // we use this boolean to disable the import form when an upload is in progress
  public uploading: boolean = false;
  protected filters$: BehaviorSubject<Filters<AudioEvent>>;
  private defaultFilters: Filters<AudioEvent> = {
    sorting: {
      direction: "desc",
      orderBy: "createdAt",
    },
  };

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

    this.filters$ = new BehaviorSubject(this.defaultFilters);
  }

  // used to fetch all previously imported events for the events ngx-datatable
  protected getModels = (
    filters: Filters<AudioEvent>
  ): Observable<AudioEvent[]> => {
    const eventImportFilters: Filters<AudioEvent> = {
      filter: {
        audio_event_import_id: {
          eq: this.audioEventImport.id,
        },
      } as InnerFilter<AudioEvent>,
      ...filters,
    };

    return this.eventsApi.filter(eventImportFilters);
  };

  protected deleteModel(): void {
    this.eventImportsApi
      .destroy(this.audioEventImport)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe({
        complete: () => {
          this.notifications.success(
            defaultSuccessMsg("destroyed", this.audioEventImport.name)
          );
          this.router.navigateByUrl(
            annotationsImportMenuItem.route.toRouterLink()
          );
        },
      });
  }

  // since the typeahead input returns an array of models, but the api wants the associated tags as an array of id's
  // we use this helper function to convert the array of models to an array of id's that can be sent in the api request
  protected getIdsFromAbstractModelArray(items: object[]): Id[] {
    return items.map((item: AbstractModel): Id => item.id);
  }

  protected pushToImportGroups(model: ImportGroup, event): void {
    const files: FileList = event.target.files;
    model.files = files;

    this.performDryRun(model);

    // if the user updates an existing import group, we don't want to create a new one
    // however, if the user uses the last empty import group, we want to create a new empty one
    // that they can use to create a new import group
    if (this.areImportGroupsFull()) {
      this.importGroups.push(this.emptyImportGroup);
    }
  }

  // uses a reference to the ImportGroup object and update the additional tag ids property
  protected updateAdditionalTagIds(
    model: ImportGroup,
    additionalTagIds: Id[]
  ): void {
    model.additionalTagIds = additionalTagIds;
    this.performDryRun(model);
  }

  // a predicate to check if every import group is valid
  // this is used for form validation
  protected areImportGroupsValid(): boolean {
    const importErrors = this.importGroups.flatMap((model) => model?.errors);
    return this.importGroups.length > 1 && importErrors.length === 0;
  }

  protected removeFromImport(model: ImportGroup): void {
    const index = this.importGroups.indexOf(model);
    if (index !== -1) {
      this.importGroups.splice(index, 1);
    }
  }

  // sends all import groups to the api if there are no errors
  protected async uploadImportGroups(): Promise<void> {
    // importing invalid annotation imports results in an internal server error
    // we should therefore not submit any upload groups if there are any errors
    if (!this.areImportGroupsValid()) {
      return;
    }

    // creates a lock so that no more files can be added to the upload queue while the upload is in progress
    this.uploading = true;

    // we use a "for-of" loop here because if we use a forEach loop (with async callbacks)
    // it doesn't properly await for each import group to finish uploading
    for (const model of this.importGroups) {
      await this.importEventGroup(model);
    }

    this.importGroups = this.importGroups.filter((model) => !model.uploaded);

    this.refreshTables();
    this.uploading = false;
  }

  protected async importEventGroup(model: ImportGroup): Promise<void> {
    if (!model.files) {
      return;
    }

    for (const file of model.files) {
      await this.uploadFile(model, file);
    }
  }

  private uploadFile(model: ImportGroup, file: File): Promise<void | AudioEventImport> {
    const audioEventImportModel: AudioEventImportFileWrite =
      new AudioEventImportFileWrite({
        id: this.audioEventImport.id,
        file,
        additionalTagIds: model.additionalTagIds,
        commit: true,
      });

    return this.eventImportsApi
      .importFile(audioEventImportModel)
      .pipe(takeUntil(this.unsubscribe))
      .toPromise()
      .finally(() => {
        model.uploaded = true;
      })
      .catch((error: BawApiError) => {
        // some of the default error messages are ambiguous on this page
        // e.g. "you do not have access to this page" means that the user doesn't have access to the audio recording
        if (error.status === FORBIDDEN) {
          model.errors.push(
            "You do not have access to all the audio recordings or tags in your files."
          );
        }
      });
  }

  private performDryRun(model: ImportGroup) {
    model.errors = [];
    model.identifiedEvents = [];
    
    // we perform a dry run of the import to check for errors
    for (const file of model.files) {
      const audioEventImportModel: AudioEventImportFileWrite =
        new AudioEventImportFileWrite({
          id: this.audioEventImport.id,
          file,
          additionalTagIds: model.additionalTagIds,
          commit: false,
        });

      this.eventImportsApi
        .importFile(audioEventImportModel)
        .pipe(takeUntil(this.unsubscribe))
        .subscribe((result: AudioEventImport) => {
          // since the model is on the heap and passed as reference, we can update the model here and it will globally update the model
          result.importedEvents.forEach((event: ImportedAudioEvent) => {
            model.identifiedEvents.push(event);

            const errors: AudioEventError[] = event.errors;

            for (const error of errors) {
              model.errors.push(...this.errorToHumanReadable(error));
            }
          });
        });
    }
  }

  // deserialization converts all object keys to camelCase
  // therefore, to make them human readable we add spaces
  private errorToHumanReadable(error: AudioEventError): string[] {
    const errors: string[] = [];

    const errorKeys: string[] = Object.keys(error);

    for (const errorKey of errorKeys) {
      let errorValue: string = error[errorKey].join(", ");

      // sometimes the error value includes the key e.g. "startTimeSeconds is not a number"
      // in this case, we should not prepend the key to the error value
      if (!errorValue.includes(errorKey)) {
        errorValue = `${errorKey} ${errorValue}`;
      }

      errors.push(errorValue);
    }

    return errors;
  }

  // because we create a new empty import group if all import groups are full
  // we use this predicate to check if every import group has files
  private areImportGroupsFull(): boolean {
    return this.importGroups.every((model) => model.files !== null);
  }

  // because the event and file tables are updated through api requests
  // we have to make new api requests to the page
  private refreshTables(): void {
    // we use the default filter here to prevent two api requests being sent
    // e.g. if we set the filters to {} here, it would make an api call with the {} filters
    // then another one with the default filters
    this.filters$.next(this.defaultFilters);

    // because the "files" property is a sub model on the audio event import model
    // we have to refetch the audio event import model to update the files table
    this.eventImportsApi
      .show(this.audioEventImport)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((result: AudioEventImport) => {
        this.audioEventImport = result;
      });
  }

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
}

AnnotationsDetailsComponent.linkToRoute({
  category: annotationsImportCategory,
  pageRoute: annotationImportMenuItem,
  menus: {
    actions: List(annotationMenuActions),
  },
  resolvers: {
    [audioEventImportKey]: audioEventImportResolvers.show,
  },
});

export { AnnotationsDetailsComponent };

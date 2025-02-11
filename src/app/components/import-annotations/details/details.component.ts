import { Component, OnInit } from "@angular/core";
import { List } from "immutable";
import { PageComponent } from "@helpers/page/pageComponent";
import { AudioEventImport } from "@models/AudioEventImport";
import { ActivatedRoute, Router } from "@angular/router";
import {
  AudioEventImportService,
  audioEventImportResolvers,
} from "@baw-api/audio-event-import/audio-event-import.service";
import { takeUntil, Observable, BehaviorSubject } from "rxjs";
import { Id } from "@interfaces/apiInterfaces";
import { AudioEvent } from "@models/AudioEvent";
import { Filters, InnerFilter } from "@baw-api/baw-api.service";
import { defaultSuccessMsg } from "@helpers/formTemplate/formTemplate";
import { ToastrService } from "ngx-toastr";
import { ShallowAudioEventsService } from "@baw-api/audio-event/audio-events.service";
import { ImportedAudioEvent } from "@models/AudioEventImport/ImportedAudioEvent";
import { AudioEventImportFile } from "@models/AudioEventImportFile";
import { AudioEventImportFileService } from "@baw-api/audio-event-import-file/audio-event-import-file.service";
import { deleteAnnotationImportModal } from "../import-annotations.modals";
import {
  annotationsImportMenuItem,
  editAnnotationImportMenuItem,
  annotationsImportCategory,
  annotationImportMenuItem,
  addAnnotationImportMenuItem,
} from "../import-annotations.menu";

export const annotationMenuActions = [
  addAnnotationImportMenuItem,
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

@Component({
  selector: "baw-annotation-import",
  templateUrl: "details.component.html",
  styleUrl: "details.component.scss",
})
class AnnotationsDetailsComponent extends PageComponent implements OnInit {
  public constructor(
    private route: ActivatedRoute,
    private eventsApi: ShallowAudioEventsService,
    private eventImportsApi: AudioEventImportService,
    private eventImportFileApi: AudioEventImportFileService,
    private notifications: ToastrService,
    private router: Router
  ) {
    super();
  }

  public active = 1;
  public importGroups: ImportGroup[] = [this.emptyImportGroup];
  public audioEventImport: AudioEventImport;
  // we use this boolean to disable the import form when an upload is in progress
  public uploading: boolean = false;

  protected eventFilters$: BehaviorSubject<Filters<AudioEvent>>;
  protected fileFilters$: BehaviorSubject<Filters<AudioEventImportFile>>;

  private defaultEventFilters = {
    sorting: {
      direction: "desc",
      orderBy: "createdAt",
    },
  } as const satisfies Filters<AudioEvent>;

  private defaultFileFilters = {
    sorting: {
      direction: "desc",
      orderBy: "createdAt",
    },
  } as const satisfies Filters<AudioEventImportFile>;

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

    this.eventFilters$ = new BehaviorSubject(this.defaultEventFilters);
    this.fileFilters$ = new BehaviorSubject(this.defaultFileFilters);
  }

  // used to fetch all previously imported events for the events ngx-datatable
  protected getEventModels = (
    filters: Filters<AudioEvent>
  ): Observable<AudioEvent[]> => {
    const eventImportFilters: Filters<AudioEvent> = {
      filter: {
        "audio_event_imports.id": {
          eq: this.audioEventImport.id,
        },
      } as InnerFilter<AudioEvent>,
      ...filters,
    };

    return this.eventsApi.filter(eventImportFilters);
  };

  protected getFileModels = (): Observable<AudioEventImportFile[]> => {
    const eventFileFilters = {} satisfies Filters<AudioEventImportFile>;
    return this.eventImportFileApi.filter(
      eventFileFilters,
      this.audioEventImport
    );
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

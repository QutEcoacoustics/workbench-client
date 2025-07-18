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
import { ToastService } from "@services/toasts/toasts.service";
import { ShallowAudioEventsService } from "@baw-api/audio-event/audio-events.service";
import { ImportedAudioEvent } from "@models/AudioEventImport/ImportedAudioEvent";
import { AudioEventImportFile } from "@models/AudioEventImportFile";
import { AudioEventImportFileService } from "@baw-api/audio-event-import-file/audio-event-import-file.service";
import {
  NgbNav,
  NgbNavItem,
  NgbNavItemRole,
  NgbNavLink,
  NgbNavLinkBase,
  NgbNavContent,
  NgbNavOutlet,
  NgbModal,
} from "@ng-bootstrap/ng-bootstrap";
import { NgxDatatableModule } from "@swimlane/ngx-datatable";
import { DatatableDefaultsDirective } from "@directives/datatable/defaults/defaults.directive";
import { DatatablePaginationDirective } from "@directives/datatable/pagination/pagination.directive";
import { LoadingComponent } from "@shared/loading/loading.component";
import { UrlDirective } from "@directives/url/url.directive";
import { DatetimeComponent } from "@shared/datetime-formats/datetime/datetime/datetime.component";
import { InlineListComponent } from "@shared/inline-list/inline-list.component";
import { IsUnresolvedPipe } from "@pipes/is-unresolved/is-unresolved.pipe";
import { projectResolvers } from "@baw-api/project/projects.service";
import { IPageInfo } from "@helpers/page/pageInfo";
import { hasResolvedSuccessfully, ResolvedModelList, retrieveResolvers } from "@baw-api/resolver-common";
import { Project } from "@models/Project";
import { ConfirmationComponent } from "@components/harvest/components/modal/confirmation.component";
import { BawApiError } from "@helpers/custom-errors/baw-api-error";
import { NgTemplateOutlet } from "@angular/common";
import { verificationRoute } from "@components/annotations/annotation.routes";
import { StrongRouteDirective } from "@directives/strongRoute/strong-route.directive";
import {
  annotationsImportMenuItem,
  editAnnotationImportMenuItem,
  annotationsImportCategory,
  annotationImportMenuItem,
  addAnnotationImportMenuItem,
} from "../../import-annotations.menu";
import { deleteAnnotationImportModal } from "../../import-annotations.modals";

export const annotationMenuActions = [
  addAnnotationImportMenuItem,
  editAnnotationImportMenuItem,
  deleteAnnotationImportModal,
];

const projectKey = "project";
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
  templateUrl: "./details.component.html",
  styleUrl: "./details.component.scss",
  imports: [
    NgTemplateOutlet,
    NgbNav,
    NgbNavItem,
    NgbNavItemRole,
    NgbNavLink,
    NgbNavLinkBase,
    NgbNavContent,
    NgxDatatableModule,
    DatatableDefaultsDirective,
    DatatablePaginationDirective,
    LoadingComponent,
    UrlDirective,
    DatetimeComponent,
    InlineListComponent,
    NgbNavOutlet,
    IsUnresolvedPipe,
    ConfirmationComponent,
    StrongRouteDirective,
  ],
})
class AnnotationImportDetailsComponent extends PageComponent implements OnInit {
  public constructor(
    private route: ActivatedRoute,
    private eventsApi: ShallowAudioEventsService,
    private eventImportsApi: AudioEventImportService,
    private eventImportFileApi: AudioEventImportFileService,
    private notifications: ToastService,
    private router: Router,
    private modals: NgbModal,
  ) {
    super();
  }

  protected verificationRoute = verificationRoute;
  protected active = 1;
  protected importGroups: ImportGroup[] = [this.emptyImportGroup];
  protected audioEventImport: AudioEventImport;
  // we use this boolean to disable the import form when an upload is in progress
  protected uploading: boolean = false;
  private models: ResolvedModelList = {};

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

  protected get project(): Project {
    return this.models.project as Project;
  }

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

    if (this.route) {
      const models = retrieveResolvers(this.route.snapshot.data as IPageInfo);
      if (hasResolvedSuccessfully(models)) {
        this.models = models;
      }
   }
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

  protected getFileModels = (
    filters: Filters<AudioEventImportFile>
  ): Observable<AudioEventImportFile[]> => {
    return this.eventImportFileApi.filter(filters, this.audioEventImport);
  };

  protected async deleteFile(
    confirmationModal: any,
    fileModel: AudioEventImportFile,
  ) {
    const ref = this.modals.open(confirmationModal);
    const success = await ref.result.catch((_) => false);
    const fileName = fileModel.name;

    if (success) {
      this.eventImportFileApi.destroy(fileModel, this.audioEventImport)
        .pipe(takeUntil(this.unsubscribe))
        .subscribe({
          next: () => {
            this.notifications.success(`Successfully deleted file ${fileName}`);

            // Because one of the files has now been deleted, we need to
            // re-fetch the files from the api.
            this.fileFilters$.next(this.fileFilters$.value);
          },
          error: (err: BawApiError) => {
            this.notifications.error(err.message)
          },
        });
    }
  }

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

AnnotationImportDetailsComponent.linkToRoute({
  category: annotationsImportCategory,
  pageRoute: annotationImportMenuItem,
  menus: {
    actions: List(annotationMenuActions),
  },
  resolvers: {
    [projectKey]: projectResolvers.show,
    [audioEventImportKey]: audioEventImportResolvers.show,
  },
});

export { AnnotationImportDetailsComponent };

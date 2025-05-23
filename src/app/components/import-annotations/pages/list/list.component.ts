import { Component, OnInit } from "@angular/core";
import { PageComponent } from "@helpers/page/pageComponent";
import { List } from "immutable";
import { AudioEventImportService } from "@baw-api/audio-event-import/audio-event-import.service";
import { BehaviorSubject, takeUntil } from "rxjs";
import { AudioEventImport } from "@models/AudioEventImport";
import { Filters } from "@baw-api/baw-api.service";
import { Id } from "@interfaces/apiInterfaces";
import { NgbModal, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import { ToastService } from "@services/toasts/toasts.service";
import { NgxDatatableModule } from "@swimlane/ngx-datatable";
import { DatatableDefaultsDirective } from "@directives/datatable/defaults/defaults.directive";
import { DatatablePaginationDirective } from "@directives/datatable/pagination/pagination.directive";
import { DatetimeComponent } from "@shared/datetime-formats/datetime/datetime/datetime.component";
import { UserLinkComponent } from "@shared/user-link/user-link.component";
import { UrlDirective } from "@directives/url/url.directive";
import { projectResolvers } from "@baw-api/project/projects.service";
import { Project } from "@models/Project";
import { hasResolvedSuccessfully, ResolvedModelList, retrieveResolvers } from "@baw-api/resolver-common";
import { ActivatedRoute } from "@angular/router";
import { IPageInfo } from "@helpers/page/pageInfo";
import {
  annotationsImportCategory,
  annotationsImportMenuItem,
  newAnnotationImportMenuItem,
} from "../../import-annotations.menu";

export const annotationListMenuItemActions = [newAnnotationImportMenuItem];
const projectKey = "project";

@Component({
  selector: "baw-import-list-annotation-imports",
  templateUrl: "list.component.html",
  imports: [
    NgxDatatableModule,
    DatatableDefaultsDirective,
    DatatablePaginationDirective,
    DatetimeComponent,
    UserLinkComponent,
    UrlDirective,
  ],
})
class AnnotationsListComponent extends PageComponent implements OnInit {
  public constructor(
    private api: AudioEventImportService,
    private notifications: ToastService,
    private modals: NgbModal,
    protected route: ActivatedRoute,
  ) {
    super();
  }

  protected filters$: BehaviorSubject<Filters<AudioEventImport>>;
  private defaultFilters: Filters<AudioEventImport> = {
    sorting: {
      direction: "desc",
      orderBy: "createdAt",
    },
  };
  private models: ResolvedModelList = {};

  public get project(): Project {
    return this.models.project as Project;
  }

  public ngOnInit(): void {
    this.filters$ = new BehaviorSubject(this.defaultFilters);

    if (this.route) {
      const models = retrieveResolvers(this.route.snapshot.data as IPageInfo);
      if (hasResolvedSuccessfully(models)) {
        this.models = models;
      }
   }
  }

  protected getModels = (filters: Filters<AudioEventImport>) =>
    this.api.filter(filters);

  protected async deleteEventImport(
    template: any,
    model: AudioEventImport
  ): Promise<void> {
    const modelId: Id = model.id;
    const modelName: string = model.name;

    const ref: NgbModalRef = this.modals.open(template);
    const success = await ref.result.catch((_) => false);

    if (!success) {
      return;
    }

    this.api
      .destroy(modelId)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(() => {
        this.filters$.next(this.defaultFilters);
        this.notifications.success(`Successfully destroyed ${modelName}`);
      });
  }
}

AnnotationsListComponent.linkToRoute({
  category: annotationsImportCategory,
  pageRoute: annotationsImportMenuItem,
  menus: {
    actions: List(annotationListMenuItemActions),
  },
  resolvers: {
    [projectKey]: projectResolvers.show,
  },
});

export { AnnotationsListComponent };

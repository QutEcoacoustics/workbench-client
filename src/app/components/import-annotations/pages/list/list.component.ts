import { Component, inject, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { AudioEventImportService } from "@baw-api/audio-event-import/audio-event-import.service";
import { Filters } from "@baw-api/baw-api.service";
import { projectResolvers } from "@baw-api/project/projects.service";
import {
  hasResolvedSuccessfully,
  ResolvedModelList,
  retrieveResolvers,
} from "@baw-api/resolver-common";
import { verificationRoute } from "@components/annotations/annotation.routes";
import { DatatableDefaultsDirective } from "@directives/datatable/defaults/defaults.directive";
import { DatatablePaginationDirective } from "@directives/datatable/pagination/pagination.directive";
import { StrongRouteDirective } from "@directives/strongRoute/strong-route.directive";
import { UrlDirective } from "@directives/url/url.directive";
import { PageComponent } from "@helpers/page/pageComponent";
import { IPageInfo } from "@helpers/page/pageInfo";
import { jsMap } from "@helpers/query-string-parameters/queryStringParameters";
import { toNumber } from "@helpers/typing/toNumber";
import { Id } from "@interfaces/apiInterfaces";
import { AudioEventImport } from "@models/AudioEventImport";
import { Project } from "@models/Project";
import { NgbModal, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import { ToastService } from "@services/toasts/toasts.service";
import { DatetimeComponent } from "@shared/datetime-formats/datetime/datetime/datetime.component";
import { UserLinkComponent } from "@shared/user-link/user-link.component";
import { NgxDatatableModule } from "@swimlane/ngx-datatable";
import { List } from "immutable";
import { BehaviorSubject, takeUntil } from "rxjs";
import {
  annotationsImportCategory,
  annotationsImportMenuItem,
  newAnnotationImportMenuItem,
} from "../../import-annotations.menu";

export const annotationListMenuItemActions = [newAnnotationImportMenuItem];
const projectKey = "project";

@Component({
  selector: "baw-import-list-annotation-imports",
  templateUrl: "./list.component.html",
  imports: [
    NgxDatatableModule,
    DatatableDefaultsDirective,
    DatatablePaginationDirective,
    DatetimeComponent,
    UserLinkComponent,
    UrlDirective,
    StrongRouteDirective,
  ],
})
class AnnotationsListComponent extends PageComponent implements OnInit {
  private readonly api = inject(AudioEventImportService);
  private readonly notifications = inject(ToastService);
  private readonly modals = inject(NgbModal);
  private readonly route = inject(ActivatedRoute);

  protected readonly verificationRoute = verificationRoute;
  private readonly defaultFilters: Filters<AudioEventImport> = {
    sorting: {
      direction: "desc",
      orderBy: "createdAt",
    },
  };

  protected readonly filters$ = new BehaviorSubject(this.defaultFilters);
  private readonly jsIdMapQsp = jsMap(toNumber);
  private models: ResolvedModelList = {};

  public get project(): Project {
    return this.models.project as Project;
  }

  public ngOnInit(): void {
    if (this.route) {
      const models = retrieveResolvers(this.route.snapshot.data as IPageInfo);
      if (hasResolvedSuccessfully(models)) {
        this.models = models;
      }
    }
  }

  protected readonly getModels = (filters: Filters<AudioEventImport>) =>
    this.api.filter(filters);

  protected async deleteEventImport(
    template: any,
    model: AudioEventImport,
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

  protected verifyQsp(model: AudioEventImport): string {
    return this.jsIdMapQsp.serialize(new Map([[model.id, new Set()]]));
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

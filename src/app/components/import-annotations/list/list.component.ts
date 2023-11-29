import { Component, OnInit } from "@angular/core";
import { PageComponent } from "@helpers/page/pageComponent";
import { List } from "immutable";
import { AudioEventImportService } from "@baw-api/audio-event-import/audio-event-import.service";
import { BehaviorSubject, takeUntil } from "rxjs";
import { AudioEventImport } from "@models/AudioEventImport";
import { Filters } from "@baw-api/baw-api.service";
import { Id } from "@interfaces/apiInterfaces";
import { NgbModal, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import { ToastrService } from "ngx-toastr";
import { annotationsImportCategory, annotationsImportMenuItem, newAnnotationImportMenuItem } from "../import-annotations.menu";

export const annotationListMenuItemActions = [newAnnotationImportMenuItem];

@Component({
  selector: "baw-import-list-annotation-imports",
  templateUrl: "list.component.html",
})
class AnnotationsListComponent extends PageComponent implements OnInit {
  public constructor(
    private api: AudioEventImportService,
    private notifications: ToastrService,
    private modals: NgbModal
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

  public ngOnInit(): void {
    this.filters$ = new BehaviorSubject(this.defaultFilters);
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
});

export { AnnotationsListComponent };

import { Component, TemplateRef } from "@angular/core";
import { TagsService } from "@baw-api/tag/tags.service";
import { defaultSuccessMsg } from "@helpers/formTemplate/formTemplate";
import { PagedTableTemplate } from "@helpers/tableTemplate/pagedTableTemplate";
import { ModalComponent } from "@menu/widget.component";
import { Tag } from "@models/Tag";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { List } from "immutable";
import { ToastService } from "@services/toasts/toasts.service";
import { takeUntil } from "rxjs";
import { NgxDatatableModule } from "@swimlane/ngx-datatable";
import { DebounceInputComponent } from "@shared/debounce-input/debounce-input.component";
import { DatatableDefaultsDirective } from "@directives/datatable/defaults/defaults.directive";
import { CheckboxComponent } from "@shared/checkbox/checkbox.component";
import { StrongRouteDirective } from "@directives/strongRoute/strong-route.directive";
import { DeleteModalComponent } from "@shared/delete-modal/delete-modal.component";
import { ErrorHandlerComponent } from "@shared/error-handler/error-handler.component";
import {
  adminEditTagMenuItem,
  adminNewTagMenuItem,
  adminTagsCategory,
  adminTagsMenuItem,
} from "../tags.menus";

export const adminTagsMenuItemActions = [adminNewTagMenuItem];

@Component({
  selector: "baw-admin-tags",
  templateUrl: "./list.component.html",
  imports: [
    DebounceInputComponent,
    NgxDatatableModule,
    DatatableDefaultsDirective,
    CheckboxComponent,
    StrongRouteDirective,
    DeleteModalComponent,
    ErrorHandlerComponent,
  ],
})
class AdminTagsComponent extends PagedTableTemplate<TableRow, Tag> {
  public columns = [
    { name: "Text" },
    { name: "Taxonomic" },
    { name: "Retired" },
    { name: "type" },
    { name: "Tag" },
  ];
  public sortKeys = {
    text: "text",
    taxonomic: "isTaxonomic",
    retired: "retired",
    type: "typeOfTag",
  };
  public editPath = adminEditTagMenuItem.route;

  public constructor(
    protected tagsApi: TagsService,
    protected modals: NgbModal,
    protected notifications: ToastService,
  ) {
    super(tagsApi, (tags) =>
      tags.map((tag) => ({
        text: tag.text,
        taxonomic: tag.isTaxonomic ? "Taxonomic" : "Folksonomic",
        retired: tag.retired,
        type: tag.typeOfTag,
        tag,
      }))
    );

    this.filterKey = "text";
  }

  public async confirmTagDeletion(template: TemplateRef<ModalComponent>, tagModel: Tag) {
    const modal = this.modals.open(template);
    const userConfirmed = await modal.result.catch((_) => false);

    if (userConfirmed) {
      this.tagsApi.destroy(tagModel)
        .pipe(takeUntil(this.unsubscribe))
        .subscribe({
          complete: () => this.notifications.success(defaultSuccessMsg("destroyed", tagModel?.text)),
        });
    }
  }
}

AdminTagsComponent.linkToRoute({
  category: adminTagsCategory,
  pageRoute: adminTagsMenuItem,
  menus: { actions: List(adminTagsMenuItemActions) },
});

export { AdminTagsComponent };

interface TableRow {
  text: string;
  taxonomic: "Taxonomic" | "Folksonomic";
  retired: boolean;
  type: string;
  tag: Tag;
}

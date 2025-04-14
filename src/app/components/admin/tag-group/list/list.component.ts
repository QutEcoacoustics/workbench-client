import { Component, TemplateRef } from "@angular/core";
import { TagGroupsService } from "@baw-api/tag/tag-group.service";
import { defaultSuccessMsg } from "@helpers/formTemplate/formTemplate";
import { PagedTableTemplate } from "@helpers/tableTemplate/pagedTableTemplate";
import { Id } from "@interfaces/apiInterfaces";
import { ModalComponent } from "@menu/widget.component";
import { TagGroup } from "@models/TagGroup";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { List } from "immutable";
import { ToastService } from "@services/toasts/toasts.service";
import { takeUntil } from "rxjs";
import { NgxDatatableModule } from "@swimlane/ngx-datatable";
import {
  adminEditTagGroupMenuItem,
  adminNewTagGroupMenuItem,
  adminTagGroupsCategory,
  adminTagGroupsMenuItem,
} from "../tag-group.menus";
import { adminDeleteTagGroupModal } from "../tag-group.modals";
import { DebounceInputComponent } from "../../../shared/debounce-input/debounce-input.component";
import { DatatableDefaultsDirective } from "../../../../directives/datatable/defaults/defaults.directive";
import { StrongRouteDirective } from "../../../../directives/strongRoute/strong-route.directive";
import { DeleteModalComponent } from "../../../shared/delete-modal/delete-modal.component";
import { ErrorHandlerComponent } from "../../../shared/error-handler/error-handler.component";

export const adminTagGroupsMenuItemActions = [adminNewTagGroupMenuItem];
export const adminTagGroupMenuItemActions = [
  adminNewTagGroupMenuItem,
  adminEditTagGroupMenuItem,
  adminDeleteTagGroupModal,
];

@Component({
  selector: "baw-admin-tag-groups-list",
  templateUrl: "./list.component.html",
  imports: [
    DebounceInputComponent,
    NgxDatatableModule,
    DatatableDefaultsDirective,
    StrongRouteDirective,
    DeleteModalComponent,
    ErrorHandlerComponent,
  ],
})
class AdminTagGroupsComponent extends PagedTableTemplate<TableRow, TagGroup> {
  public columns = [{ name: "Tag" }, { name: "Group" }, { name: "Model" }];
  public sortKeys = { tag: "tagId", group: "groupIdentifier" };
  public editPath = adminEditTagGroupMenuItem.route;

  public constructor(
    protected tagGroupsApi: TagGroupsService,
    protected notifications: ToastService,
    protected modals: NgbModal,
  ) {
    super(tagGroupsApi, (tagGroups) =>
      tagGroups.map((tagGroup) => ({
        tag: tagGroup.tagId,
        group: tagGroup.groupIdentifier,
        model: tagGroup,
      }))
    );

    this.filterKey = "groupIdentifier";
  }

  public async confirmTagGroupDeletion(template: TemplateRef<ModalComponent>, tagModel: TagGroup) {
    const modal = this.modals.open(template);
    const userConfirmed = await modal.result.catch((_) => false);

    if (userConfirmed) {
      this.tagGroupsApi.destroy(tagModel)
        .pipe(takeUntil(this.unsubscribe))
        .subscribe({
          complete: () => this.notifications.success(defaultSuccessMsg("destroyed", this.tagModel?.groupIdentifier)),
        });
    }
  }
}

AdminTagGroupsComponent.linkToRoute({
  category: adminTagGroupsCategory,
  pageRoute: adminTagGroupsMenuItem,
  menus: { actions: List(adminTagGroupsMenuItemActions) },
});

export { AdminTagGroupsComponent };

interface TableRow {
  tag: Id;
  group: string;
  model: TagGroup;
}

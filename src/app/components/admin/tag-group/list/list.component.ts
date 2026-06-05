import { Component, TemplateRef, inject } from "@angular/core";
import { TagGroupsService } from "@baw-api/tag/tag-group.service";
import { DatatableDefaultsDirective } from "@directives/datatable/defaults/defaults.directive";
import { DebouncedInputDirective } from "@directives/debouncedInput/debounced-input.directive";
import { StrongRouteDirective } from "@directives/strongRoute/strong-route.directive";
import { defaultSuccessMsg } from "@helpers/formTemplate/formTemplate";
import { PagedTableTemplate } from "@helpers/tableTemplate/pagedTableTemplate";
import { Id } from "@interfaces/apiInterfaces";
import { ModalComponent } from "@menu/widget.component";
import { TagGroup } from "@models/TagGroup";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { ToastService } from "@services/toasts/toasts.service";
import { DeleteModalComponent } from "@shared/delete-modal/delete-modal.component";
import { ErrorHandlerComponent } from "@shared/error-handler/error-handler.component";
import { NgxDatatableModule } from "@swimlane/ngx-datatable";
import { List } from "immutable";
import { takeUntil } from "rxjs";
import {
  adminEditTagGroupMenuItem,
  adminNewTagGroupMenuItem,
  adminTagGroupsCategory,
  adminTagGroupsMenuItem,
} from "../tag-group.menus";
import { adminDeleteTagGroupModal } from "../tag-group.modals";

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
    DebouncedInputDirective,
    NgxDatatableModule,
    DatatableDefaultsDirective,
    StrongRouteDirective,
    DeleteModalComponent,
    ErrorHandlerComponent,
  ],
})
class AdminTagGroupsComponent extends PagedTableTemplate<TableRow, TagGroup> {
  protected readonly notifications = inject(ToastService);
  protected readonly modals = inject(NgbModal);
  protected readonly tagGroupsApi: TagGroupsService;

  public columns = [{ name: "Tag" }, { name: "Group" }, { name: "Model" }];
  public sortKeys = { tag: "tagId", group: "groupIdentifier" };
  public editPath = adminEditTagGroupMenuItem.route;

  public constructor() {
    const tagGroupsApi = inject(TagGroupsService);

    super(tagGroupsApi, (tagGroups) =>
      // @ts-expect-error: strict mode fix
      tagGroups.map((tagGroup) => ({
        tag: tagGroup.tagId,
        group: tagGroup.groupIdentifier,
        model: tagGroup,
      })),
    );
    this.tagGroupsApi = tagGroupsApi;

    this.filterKey = "groupIdentifier";
  }

  public async confirmTagGroupDeletion(
    template: TemplateRef<ModalComponent>,
    tagModel: TagGroup,
  ) {
    const modal = this.modals.open(template);
    const userConfirmed = await modal.result.catch((_) => false);

    if (userConfirmed) {
      this.tagGroupsApi
        .destroy(tagModel)
        .pipe(takeUntil(this.unsubscribe))
        .subscribe({
          complete: () =>
            this.notifications.success(
              defaultSuccessMsg(
                "destroyed",
                tagModel!.groupIdentifier || "Unknown",
              ),
            ),
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

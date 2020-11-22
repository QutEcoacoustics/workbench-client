import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import {
  tagGroupResolvers,
  TagGroupsService,
} from "@baw-api/tag/tag-group.service";
import {
  defaultSuccessMsg,
  FormTemplate,
} from "@helpers/formTemplate/formTemplate";
import { TagGroup } from "@models/TagGroup";
import { List } from "immutable";
import { ToastrService } from "ngx-toastr";
import { adminTagGroupMenuItemActions } from "../list/list.component";
import {
  adminEditTagGroupMenuItem,
  adminTagGroupsCategory,
  adminTagGroupsMenuItem,
} from "../tag-group.menus";
import { fields } from "../tag-group.schema.json";

const tagGroupKey = "tagGroup";

@Component({
  selector: "baw-admin-tag-groups-edit",
  template: `
    <baw-form
      *ngIf="!failure"
      [title]="title"
      [model]="model"
      [fields]="fields"
      [submitLoading]="loading"
      submitLabel="Submit"
      (onSubmit)="submit($event)"
    ></baw-form>
  `,
})
class AdminTagGroupsEditComponent
  extends FormTemplate<TagGroup>
  implements OnInit {
  public fields = fields;
  public title: string;

  public constructor(
    private api: TagGroupsService,
    notifications: ToastrService,
    route: ActivatedRoute,
    router: Router
  ) {
    super(notifications, route, router, tagGroupKey, (model) =>
      defaultSuccessMsg("updated", model.groupIdentifier)
    );
  }

  public ngOnInit() {
    super.ngOnInit();

    if (!this.failure) {
      this.title = `Edit ${this.model.groupIdentifier}`;
    }
  }

  protected apiAction(model: Partial<TagGroup>) {
    return this.api.update(new TagGroup(model));
  }
}

AdminTagGroupsEditComponent.LinkComponentToPageInfo({
  category: adminTagGroupsCategory,
  menus: {
    actions: List([adminTagGroupsMenuItem, ...adminTagGroupMenuItemActions]),
  },
  resolvers: { [tagGroupKey]: tagGroupResolvers.show },
}).AndMenuRoute(adminEditTagGroupMenuItem);

export { AdminTagGroupsEditComponent };

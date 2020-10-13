import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { tagResolvers, TagsService } from "@baw-api/tag/tags.service";
import {
  defaultSuccessMsg,
  FormTemplate,
} from "@helpers/formTemplate/formTemplate";
import { Tag } from "@models/Tag";
import { List } from "immutable";
import { ToastrService } from "ngx-toastr";
import { adminTagsMenuItemActions } from "../list/list.component";
import {
  adminDeleteTagMenuItem,
  adminEditTagMenuItem,
  adminTagsCategory,
  adminTagsMenuItem,
} from "../tags.menus";

const tagKey = "tag";

@Component({
  selector: "baw-delete",
  template: `
    <baw-form
      *ngIf="!failure"
      [title]="title"
      [model]="model"
      [fields]="fields"
      btnColor="danger"
      submitLabel="Delete"
      [submitLoading]="loading"
      (onSubmit)="submit($event)"
    ></baw-form>
  `,
})
class AdminTagsDeleteComponent extends FormTemplate<Tag> implements OnInit {
  public title: string;

  constructor(
    private api: TagsService,
    notifications: ToastrService,
    route: ActivatedRoute,
    router: Router
  ) {
    super(notifications, route, router, tagKey, (model) =>
      defaultSuccessMsg("destroyed", model.text)
    );
  }

  public ngOnInit(): void {
    super.ngOnInit();

    if (!this.failure) {
      this.title = `Are you certain you wish to delete ${this.model.text}?`;
    }
  }

  protected redirectionPath() {
    return adminTagsMenuItem.route.toString();
  }

  protected apiAction(model: Partial<Tag>) {
    return this.api.destroy(new Tag(model));
  }
}

AdminTagsDeleteComponent.LinkComponentToPageInfo({
  category: adminTagsCategory,
  menus: {
    actions: List([
      adminTagsMenuItem,
      ...adminTagsMenuItemActions,
      adminEditTagMenuItem,
      adminDeleteTagMenuItem,
    ]),
  },
  resolvers: { [tagKey]: tagResolvers.show },
}).AndMenuRoute(adminDeleteTagMenuItem);

export { AdminTagsDeleteComponent };

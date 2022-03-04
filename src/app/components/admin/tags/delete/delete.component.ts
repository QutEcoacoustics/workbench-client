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

  public constructor(
    private api: TagsService,
    notifications: ToastrService,
    route: ActivatedRoute,
    router: Router
  ) {
    super(notifications, route, router, {
      getModel: (models) => models[tagKey] as Tag,
      successMsg: (model) => defaultSuccessMsg("destroyed", model.text),
      redirectUser: () =>
        this.router.navigateByUrl(adminTagsMenuItem.route.toRouterLink()),
    });
  }

  public ngOnInit(): void {
    super.ngOnInit();

    if (!this.failure) {
      this.title = `Are you certain you wish to delete ${this.model.text}?`;
    }
  }

  protected apiAction(model: Partial<Tag>) {
    return this.api.destroy(new Tag(model));
  }
}

AdminTagsDeleteComponent.linkToRoute({
  category: adminTagsCategory,
  pageRoute: adminDeleteTagMenuItem,
  menus: {
    actions: List([
      ...adminTagsMenuItemActions,
      adminEditTagMenuItem,
      adminDeleteTagMenuItem,
    ]),
  },
  resolvers: { [tagKey]: tagResolvers.show },
});

export { AdminTagsDeleteComponent };

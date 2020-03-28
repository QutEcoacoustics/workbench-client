import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { List } from "immutable";
import { ToastrService } from "ngx-toastr";
import {
  defaultSuccessMsg,
  FormTemplate
} from "src/app/helpers/formTemplate/formTemplate";
import { Page } from "src/app/helpers/page/pageDecorator";
import { Tag } from "src/app/models/Tag";
import {
  tagResolvers,
  TagsService
} from "src/app/services/baw-api/tags.service";
import {
  adminDeleteTagMenuItem,
  adminEditTagMenuItem,
  adminTagsCategory,
  adminTagsMenuItem
} from "../../admin.menus";
import { adminTagsMenuItemActions } from "../list/list.component";
import { fields } from "../tag.json";

const tagKey = "tag";

@Page({
  category: adminTagsCategory,
  menus: {
    actions: List([
      adminTagsMenuItem,
      ...adminTagsMenuItemActions,
      adminEditTagMenuItem,
      adminDeleteTagMenuItem
    ]),
    links: List()
  },
  resolvers: {
    [tagKey]: tagResolvers.show
  },
  self: adminEditTagMenuItem
})
@Component({
  selector: "app-admin-tags-edit",
  template: `
    <app-form
      *ngIf="!failure"
      [title]="title"
      [model]="model"
      [fields]="fields"
      [submitLoading]="loading"
      submitLabel="Submit"
      (onSubmit)="submit($event)"
    ></app-form>
  `
})
export class AdminTagsEditComponent extends FormTemplate<Tag>
  implements OnInit {
  public fields = fields;
  public title: string;

  constructor(
    private api: TagsService,
    notifications: ToastrService,
    route: ActivatedRoute,
    router: Router
  ) {
    super(notifications, route, router, tagKey, model =>
      defaultSuccessMsg("updated", model.text)
    );
  }

  ngOnInit() {
    super.ngOnInit();

    if (!this.failure) {
      this.title = `Edit ${this.model.text}`;
      // TODO Update typeOfTag with options
    }
  }

  protected apiAction(model: Partial<Tag>) {
    return this.api.update(new Tag(model));
  }
}

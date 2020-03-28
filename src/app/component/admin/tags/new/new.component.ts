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
import { TagsService } from "src/app/services/baw-api/tags.service";
import {
  adminNewTagMenuItem,
  adminTagsCategory,
  adminTagsMenuItem
} from "../../admin.menus";
import { adminTagsMenuItemActions } from "../list/list.component";
import { fields } from "../tag.json";

@Page({
  category: adminTagsCategory,
  menus: {
    actions: List([adminTagsMenuItem, ...adminTagsMenuItemActions]),
    links: List()
  },
  self: adminNewTagMenuItem
})
@Component({
  selector: "app-admin-tags-new",
  template: `
    <app-form
      *ngIf="!failure"
      title="New Tag"
      [model]="model"
      [fields]="fields"
      [submitLoading]="loading"
      submitLabel="Submit"
      (onSubmit)="submit($event)"
    ></app-form>
  `
})
export class AdminTagsNewComponent extends FormTemplate<Tag> implements OnInit {
  public fields = fields;

  constructor(
    private api: TagsService,
    notifications: ToastrService,
    route: ActivatedRoute,
    router: Router
  ) {
    super(notifications, route, router, undefined, model =>
      defaultSuccessMsg("created", model.text)
    );
  }

  ngOnInit() {
    super.ngOnInit();

    if (!this.failure) {
      // TODO Update typeOfTag with options
    }
  }

  protected apiAction(model: Partial<Tag>) {
    return this.api.create(new Tag(model));
  }
}

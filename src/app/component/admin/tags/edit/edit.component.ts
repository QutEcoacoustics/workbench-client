import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { tagResolvers, TagsService, TagType } from "@baw-api/tags.service";
import {
  adminDeleteTagMenuItem,
  adminEditTagMenuItem,
  adminTagsCategory,
  adminTagsMenuItem,
} from "@component/admin/admin.menus";
import {
  defaultSuccessMsg,
  FormTemplate,
} from "@helpers/formTemplate/formTemplate";
import { Page } from "@helpers/page/pageDecorator";
import { Tag } from "@models/Tag";
import { List } from "immutable";
import { ToastrService } from "ngx-toastr";
import { adminTagsMenuItemActions } from "../list/list.component";
import { fields } from "../tag.json";

const tagKey = "tag";
const tagTypesKey = "tagTypes";

@Page({
  category: adminTagsCategory,
  menus: {
    actions: List([
      adminTagsMenuItem,
      ...adminTagsMenuItemActions,
      adminEditTagMenuItem,
      adminDeleteTagMenuItem,
    ]),
    links: List(),
  },
  resolvers: {
    [tagKey]: tagResolvers.show,
    [tagTypesKey]: tagResolvers.typeOfTags,
  },
  self: adminEditTagMenuItem,
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
  `,
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
    super(notifications, route, router, tagKey, (model) =>
      defaultSuccessMsg("updated", model.text)
    );
  }

  ngOnInit() {
    super.ngOnInit();
    const typeOfTagIndex = 1;

    if (!this.failure) {
      this.title = `Edit ${this.model.text}`;
      this.fields[typeOfTagIndex].templateOptions.options = this.typeOfTags.map(
        (tagType) => ({
          label: tagType.toString(),
          value: tagType.name,
        })
      );
    }
  }

  public get typeOfTags(): TagType[] {
    return (this.models[tagTypesKey] as unknown) as TagType[];
  }

  protected apiAction(model: Partial<Tag>) {
    return this.api.update(new Tag(model));
  }
}

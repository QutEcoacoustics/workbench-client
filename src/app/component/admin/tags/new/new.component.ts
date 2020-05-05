import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { tagResolvers, TagsService } from "@baw-api/tags.service";
import {
  defaultSuccessMsg,
  FormTemplate,
} from "@helpers/formTemplate/formTemplate";
import { Page } from "@helpers/page/pageDecorator";
import { Tag, TagType } from "@models/Tag";
import { List } from "immutable";
import { ToastrService } from "ngx-toastr";
import { adminTagsMenuItemActions } from "../list/list.component";
import { fields } from "../tag.json";
import {
  adminNewTagMenuItem,
  adminTagsCategory,
  adminTagsMenuItem,
} from "../tags.menus";

const typeOfTagsKey = "typeOfTags";

@Page({
  category: adminTagsCategory,
  menus: {
    actions: List([adminTagsMenuItem, ...adminTagsMenuItemActions]),
    links: List(),
  },
  resolvers: {
    [typeOfTagsKey]: tagResolvers.tagTypes,
  },
  self: adminNewTagMenuItem,
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
  `,
})
export class AdminTagsNewComponent extends FormTemplate<Tag> implements OnInit {
  public fields = fields;

  constructor(
    private api: TagsService,
    notifications: ToastrService,
    route: ActivatedRoute,
    router: Router
  ) {
    super(notifications, route, router, undefined, (model) =>
      defaultSuccessMsg("created", model.text)
    );
  }

  ngOnInit() {
    super.ngOnInit();
    const typeOfTagIndex = 1;

    if (!this.failure) {
      this.fields[typeOfTagIndex].templateOptions.options = this.typeOfTags.map(
        (tagType) => ({
          label: tagType.toString(),
          value: tagType.name,
        })
      );
    }
  }

  public get typeOfTags(): TagType[] {
    return (this.models[typeOfTagsKey] as unknown) as TagType[];
  }

  protected apiAction(model: Partial<Tag>) {
    return this.api.create(new Tag(model));
  }
}

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
  TagsService,
  TypeOfTag
} from "src/app/services/baw-api/tags.service";
import {
  adminDeleteTagMenuItem,
  adminEditTagMenuItem,
  adminTagsCategory,
  adminTagsMenuItem
} from "../../admin.menus";
import { adminTagsMenuItemActions } from "../list/list.component";

const tagKey = "tag";
const typeOfTagsKey = "typeOfTags";

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
    [tagKey]: tagResolvers.show,
    [typeOfTagsKey]: tagResolvers.typeOfTags
  },
  self: adminDeleteTagMenuItem
})
@Component({
  selector: "app-delete",
  template: `
    <app-form
      *ngIf="!failure"
      [title]="title"
      [model]="model"
      [fields]="fields"
      btnColor="btn-danger"
      submitLabel="Delete"
      [submitLoading]="loading"
      (onSubmit)="submit($event)"
    ></app-form>
  `
})
export class AdminTagsDeleteComponent extends FormTemplate<Tag>
  implements OnInit {
  public title: string;

  constructor(
    private api: TagsService,
    notifications: ToastrService,
    route: ActivatedRoute,
    router: Router
  ) {
    super(notifications, route, router, tagKey, model =>
      defaultSuccessMsg("destroyed", model.text)
    );
  }

  ngOnInit(): void {
    super.ngOnInit();
    const typeOfTagIndex = 1;

    if (!this.failure) {
      this.title = `Are you certain you wish to delete ${this.model.text}?`;
      this.fields[typeOfTagIndex].templateOptions.options = this.typeOfTags.map(
        tagType => ({
          label: tagType,
          value: tagType
        })
      );
    }
  }

  public get typeOfTags(): TypeOfTag[] {
    return (this.models[typeOfTagsKey] as unknown) as TypeOfTag[];
  }

  protected redirectionPath() {
    return adminTagsMenuItem.route.toString();
  }

  protected apiAction(model: Partial<Tag>) {
    return this.api.destroy(new Tag(model));
  }
}

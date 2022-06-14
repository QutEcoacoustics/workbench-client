import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { tagResolvers, TagsService } from "@baw-api/tag/tags.service";
import {
  defaultSuccessMsg,
  FormTemplate,
} from "@helpers/formTemplate/formTemplate";
import { Tag, TagType } from "@models/Tag";
import { List } from "immutable";
import { ToastrService } from "ngx-toastr";
import { adminTagsMenuItemActions } from "../list/list.component";
import schema from "../tag.schema.json";
import { adminNewTagMenuItem, adminTagsCategory } from "../tags.menus";

const typeOfTagsKey = "tagTypes";

@Component({
  selector: "baw-admin-tags-new",
  template: `
    <baw-form
      title="New Tag"
      [model]="model"
      [fields]="fields"
      [submitLoading]="loading"
      submitLabel="Submit"
      (onSubmit)="submit($event)"
    ></baw-form>
  `,
})
class AdminTagsNewComponent extends FormTemplate<Tag> implements OnInit {
  public fields = schema.fields;

  public constructor(
    private api: TagsService,
    notifications: ToastrService,
    route: ActivatedRoute,
    router: Router
  ) {
    super(notifications, route, router, {
      successMsg: (model) => defaultSuccessMsg("created", model.text),
      redirectUser: (model) => this.router.navigateByUrl(model.viewUrl),
    });
  }

  public ngOnInit() {
    super.ngOnInit();

    const typeOfTagIndex = 1;
    this.fields[typeOfTagIndex].templateOptions.options = this.typeOfTags.map(
      ({ name }) => ({
        label: name,
        value: name,
      })
    );
  }

  public get typeOfTags(): TagType[] {
    return this.models[typeOfTagsKey] as unknown as TagType[];
  }

  protected apiAction(model: Partial<Tag>) {
    return this.api.create(new Tag(model));
  }
}

AdminTagsNewComponent.linkToRoute({
  category: adminTagsCategory,
  pageRoute: adminNewTagMenuItem,
  menus: { actions: List(adminTagsMenuItemActions) },
  resolvers: { [typeOfTagsKey]: tagResolvers.tagTypes },
});

export { AdminTagsNewComponent };

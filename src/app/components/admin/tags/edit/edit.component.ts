import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { tagResolvers, TagsService } from "@baw-api/tag/tags.service";
import {
  defaultSuccessMsg,
  FormTemplate,
} from "@helpers/formTemplate/formTemplate";
import { PermissionsShieldComponent } from "@menu/permissions-shield.component";
import { WidgetMenuItem } from "@menu/widgetItem";
import { Tag, TagType } from "@models/Tag";
import { List } from "immutable";
import { ToastrService } from "ngx-toastr";
import { adminTagsMenuItemActions } from "../list/list.component";
import { fields } from "../tag.schema.json";
import {
  adminDeleteTagMenuItem,
  adminEditTagMenuItem,
  adminTagsCategory,
  adminTagsMenuItem,
} from "../tags.menus";

const tagKey = "tag";
const tagTypesKey = "tagTypes";

@Component({
  selector: "baw-admin-tags-edit",
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
class AdminTagsEditComponent extends FormTemplate<Tag> implements OnInit {
  public fields = fields;
  public title: string;

  public constructor(
    private api: TagsService,
    notifications: ToastrService,
    route: ActivatedRoute,
    router: Router
  ) {
    super(notifications, route, router, {
      getModel: (models) => models[tagKey] as Tag,
      successMsg: (model) => defaultSuccessMsg("updated", model.text),
      redirectUser: (model) => this.router.navigateByUrl(model.viewUrl),
    });
  }

  public ngOnInit() {
    super.ngOnInit();
    const typeOfTagIndex = 1;

    if (this.failure) {
      return;
    }

    this.title = `Edit ${this.model.text}`;
    this.fields[typeOfTagIndex].templateOptions.options = this.typeOfTags.map(
      ({ name }) => ({
        label: name,
        value: name,
      })
    );
  }

  public get typeOfTags(): TagType[] {
    return this.models[tagTypesKey] as TagType[];
  }

  // TODO https://github.com/QutEcoacoustics/baw-server/issues/449
  protected apiAction(model: Partial<Tag>) {
    return this.api.update(new Tag(model));
  }
}

AdminTagsEditComponent.linkComponentToPageInfo({
  category: adminTagsCategory,
  menus: {
    actions: List([
      adminTagsMenuItem,
      ...adminTagsMenuItemActions,
      adminEditTagMenuItem,
      adminDeleteTagMenuItem,
    ]),
    actionWidgets: [new WidgetMenuItem(PermissionsShieldComponent, {})],
  },
  resolvers: {
    [tagKey]: tagResolvers.show,
    [tagTypesKey]: tagResolvers.tagTypes,
  },
}).andMenuRoute(adminEditTagMenuItem);

export { AdminTagsEditComponent };

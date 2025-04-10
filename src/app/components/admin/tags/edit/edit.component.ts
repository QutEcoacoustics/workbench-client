import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { tagResolvers, TagsService } from "@baw-api/tag/tags.service";
import {
  defaultSuccessMsg,
  FormTemplate,
} from "@helpers/formTemplate/formTemplate";
import { permissionsWidgetMenuItem } from "@menu/widget.menus";
import { Tag, TagType } from "@models/Tag";
import { List } from "immutable";
import { ToastService } from "@services/toasts/toasts.service";
import { takeUntil } from "rxjs";
import { adminTagsMenuItemActions } from "../list/list.component";
import schema from "../tag.schema.json";
import {
  adminEditTagMenuItem,
  adminTagsCategory,
  adminTagsMenuItem,
} from "../tags.menus";
import { adminDeleteTagModal } from "../tags.modals";
import { FormComponent } from "../../../shared/form/form.component";

const tagKey = "tag";
const tagTypesKey = "tagTypes";

@Component({
    selector: "baw-admin-tags-edit",
    template: `
    @if (!failure) {
      <baw-form
        [title]="title"
        [model]="model"
        [fields]="fields"
        [submitLoading]="loading"
        submitLabel="Submit"
        (onSubmit)="submit($event)"
      ></baw-form>
    }
  `,
    imports: [FormComponent]
})
class AdminTagsEditComponent extends FormTemplate<Tag> implements OnInit {
  public fields = schema.fields;
  public title: string;

  public constructor(
    private api: TagsService,
    notifications: ToastService,
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
    this.fields[typeOfTagIndex].props.options = this.typeOfTags.map(
      ({ name }) => ({
        label: name,
        value: name,
      })
    );
  }

  public get typeOfTags(): TagType[] {
    return this.models[tagTypesKey] as TagType[];
  }

  public deleteModel(): void {
    this.api.destroy(new Tag(this.model))
      .pipe(takeUntil(this.unsubscribe))
      .subscribe({
        complete: () => {
          this.notifications.success(defaultSuccessMsg("destroyed", this.model.text));
          this.router.navigateByUrl(adminTagsMenuItem.route.toRouterLink());
        },
      });
  }

  // TODO https://github.com/QutEcoacoustics/baw-server/issues/449
  protected apiAction(model: Partial<Tag>) {
    return this.api.update(new Tag(model));
  }
}

AdminTagsEditComponent.linkToRoute({
  category: adminTagsCategory,
  pageRoute: adminEditTagMenuItem,
  menus: {
    actions: List([
      ...adminTagsMenuItemActions,
      adminEditTagMenuItem,
      adminDeleteTagModal,
    ]),
    actionWidgets: List([permissionsWidgetMenuItem]),
  },
  resolvers: {
    [tagKey]: tagResolvers.show,
    [tagTypesKey]: tagResolvers.tagTypes,
  },
});

export { AdminTagsEditComponent };

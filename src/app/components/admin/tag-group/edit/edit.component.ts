import { Component, OnInit, inject } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import {
  tagGroupResolvers,
  TagGroupsService,
} from "@baw-api/tag/tag-group.service";
import {
  defaultSuccessMsg,
  FormTemplate,
} from "@helpers/formTemplate/formTemplate";
import { permissionsWidgetMenuItem } from "@menu/widget.menus";
import { TagGroup } from "@models/TagGroup";
import { List } from "immutable";
import { ToastService } from "@services/toasts/toasts.service";
import { takeUntil } from "rxjs";
import { FormComponent } from "@shared/form/form.component";
import { adminTagGroupMenuItemActions } from "../list/list.component";
import {
  adminEditTagGroupMenuItem,
  adminTagGroupsCategory,
  adminTagGroupsRoute,
} from "../tag-group.menus";
import schema from "../tag-group.schema.json";

const tagGroupKey = "tagGroup";

@Component({
  selector: "baw-admin-tag-groups-edit",
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
  imports: [FormComponent],
})
class AdminTagGroupsEditComponent
  extends FormTemplate<TagGroup>
  implements OnInit
{
  private readonly api = inject(TagGroupsService);

  public fields = schema.fields;
  public title: string;

  public constructor() {
    const notifications = inject(ToastService);
    const route = inject(ActivatedRoute);
    const router = inject(Router);

    super(notifications, route, router, {
      getModel: (models) => models[tagGroupKey] as TagGroup,
      successMsg: (model) =>
        defaultSuccessMsg("updated", model.groupIdentifier),
      redirectUser: (model) => this.router.navigateByUrl(model.viewUrl),
    });
  }

  public ngOnInit() {
    super.ngOnInit();

    if (!this.failure) {
      this.title = `Edit ${this.model.groupIdentifier}`;
    }
  }

  public deleteModel(): void {
    this.api.destroy(new TagGroup(this.model))
      .pipe(takeUntil(this.unsubscribe))
      .subscribe({
        complete: () => {
          this.notifications.success(defaultSuccessMsg("destroyed", this.model?.groupIdentifier));
          this.router.navigateByUrl(adminTagGroupsRoute.toRouterLink());
        },
      });
  }

  protected apiAction(model: Partial<TagGroup>) {
    return this.api.update(new TagGroup(model));
  }
}

AdminTagGroupsEditComponent.linkToRoute({
  category: adminTagGroupsCategory,
  pageRoute: adminEditTagGroupMenuItem,
  menus: {
    actions: List(adminTagGroupMenuItemActions),
    actionWidgets: List([permissionsWidgetMenuItem]),
  },
  resolvers: { [tagGroupKey]: tagGroupResolvers.show },
});

export { AdminTagGroupsEditComponent };

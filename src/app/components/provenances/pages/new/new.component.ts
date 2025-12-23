import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { ProvenanceService } from "@baw-api/provenance/provenance.service";
import {
  newProvenanceMenuItem,
  provenanceCategory,
} from "@components/provenances/provenances.menus";
import {
  defaultSuccessMsg,
  FormTemplate,
} from "@helpers/formTemplate/formTemplate";
import { Provenance } from "@models/Provenance";
import { List } from "immutable";
import { ToastService } from "@services/toasts/toasts.service";
import { FormComponent } from "@shared/form/form.component";
import { provenancesMenuItemActions } from "../list/list.component";
import schema from "../../provenance.base.schema.json";

@Component({
  selector: "baw-provenances-new",
  template: `
    <baw-form
      title="New Provenance"
      [model]="model"
      [fields]="fields"
      [submitLoading]="loading"
      (onSubmit)="submit($event)"
    />
  `,
  imports: [FormComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
class NewProvenanceComponent extends FormTemplate<Provenance> {
  protected readonly api = inject(ProvenanceService);
  protected readonly notifications: ToastService;
  protected readonly route: ActivatedRoute;
  protected readonly router: Router;

  public readonly fields = schema.fields;

  public constructor() {
    const notifications = inject(ToastService);
    const route = inject(ActivatedRoute);
    const router = inject(Router);

    super(notifications, route, router, {
      successMsg: (model) => defaultSuccessMsg("created", model.name),
      redirectUser: (model) => this.router.navigateByUrl(model.viewUrl),
    });
  
    this.notifications = notifications;
    this.route = route;
    this.router = router;
  }

  protected apiAction(model: Partial<Provenance>) {
    return this.api.create(new Provenance(model));
  }
}

NewProvenanceComponent.linkToRoute({
  category: provenanceCategory,
  pageRoute: newProvenanceMenuItem,
  menus: { actions: List(provenancesMenuItemActions) },
});

export { NewProvenanceComponent };

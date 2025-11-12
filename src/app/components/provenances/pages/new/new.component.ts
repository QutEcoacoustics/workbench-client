import { ChangeDetectionStrategy, Component } from "@angular/core";
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
import schema from "../../provenance.schema.json";

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
class ProvenanceNewComponent extends FormTemplate<Provenance> {
  public readonly fields = schema.fields;

  public constructor(
    protected api: ProvenanceService,
    protected notifications: ToastService,
    protected route: ActivatedRoute,
    protected router: Router,
  ) {
    super(notifications, route, router, {
      successMsg: (model) => defaultSuccessMsg("created", model.name),
      redirectUser: (model) => this.router.navigateByUrl(model.viewUrl),
    });
  }

  protected apiAction(model: Partial<Provenance>) {
    return this.api.create(new Provenance(model));
  }
}

ProvenanceNewComponent.linkToRoute({
  category: provenanceCategory,
  pageRoute: newProvenanceMenuItem,
  menus: { actions: List(provenancesMenuItemActions) },
});

export { ProvenanceNewComponent };

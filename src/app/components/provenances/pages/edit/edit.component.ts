import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import {
  provenanceResolvers,
  ProvenanceService,
} from "@baw-api/provenance/provenance.service";
import {
  editProvenanceMenuItem,
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
import { ErrorHandlerComponent } from "@shared/error-handler/error-handler.component";
import { provenanceMenuItemActions } from "../details/details.component";
import schema from "../../provenance.base.schema.json";

const provenanceKey = "provenance";

@Component({
  selector: "baw-provenance-edit",
  templateUrl: "./edit.component.html",
  imports: [FormComponent, ErrorHandlerComponent],
})
class EditProvenanceComponent
  extends FormTemplate<Provenance>
  implements OnInit
{
  public readonly fields = schema.fields;
  protected title: string;

  public constructor(
    protected readonly notifications: ToastService,
    protected readonly route: ActivatedRoute,
    protected readonly router: Router,
    private readonly api: ProvenanceService,
  ) {
    super(notifications, route, router, {
      getModel: (models) => models[provenanceKey] as Provenance,
      successMsg: (model) => defaultSuccessMsg("updated", model.name),
      redirectUser: (model) => this.router.navigateByUrl(model.viewUrl),
    });
  }

  public ngOnInit(): void {
    super.ngOnInit();

    // We set the title as a un-computed property so that when the modals name
    // in the form is changed, the title does not also change.
    this.title = `Edit ${this.model.name}`;
  }

  protected apiAction(model: Partial<Provenance>) {
    return this.api.update(new Provenance(model));
  }
}

EditProvenanceComponent.linkToRoute({
  category: provenanceCategory,
  pageRoute: editProvenanceMenuItem,
  menus: {
    actions: List(provenanceMenuItemActions),
  },
  resolvers: { [provenanceKey]: provenanceResolvers.show },
});

export { EditProvenanceComponent };

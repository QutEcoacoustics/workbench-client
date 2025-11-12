import { Component, OnInit, inject } from "@angular/core";
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
import schema from "../../provenance.schema.json";

const provenanceKey = "provenance";

@Component({
  selector: "baw-provenance-edit",
  templateUrl: "./edit.component.html",
  imports: [FormComponent, ErrorHandlerComponent],
})
class ProvenanceEditComponent
  extends FormTemplate<Provenance>
  implements OnInit
{
  public fields = schema.fields;

  private api = inject(ProvenanceService);
  protected notifications = inject(ToastService);
  protected route = inject(ActivatedRoute);
  protected router = inject(Router);

  public constructor() {
    super(inject(ToastService), inject(ActivatedRoute), inject(Router), {
      getModel: (models) => models[provenanceKey] as Provenance,
      successMsg: (model) => defaultSuccessMsg("updated", model.name),
      redirectUser: (model) => this.router.navigateByUrl(model.viewUrl),
    });
  }

  public ngOnInit() {
    super.ngOnInit();
  }

  protected apiAction(model: Partial<Provenance>) {
    return this.api.update(new Provenance(model));
  }
}

ProvenanceEditComponent.linkToRoute({
  category: provenanceCategory,
  pageRoute: editProvenanceMenuItem,
  menus: {
    actions: List(provenanceMenuItemActions),
  },
  resolvers: { [provenanceKey]: provenanceResolvers.show },
});

export { ProvenanceEditComponent };

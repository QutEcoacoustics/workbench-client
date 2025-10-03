import { Component } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { AudioEventProvenanceService } from "@baw-api/AudioEventProvenance/AudioEventProvenance.service";
import {
  newProvenanceMenuItem,
  provenancesCategory,
} from "@components/provenances/provenances.menus";
import {
  defaultSuccessMsg,
  FormTemplate,
} from "@helpers/formTemplate/formTemplate";
import { AudioEventProvenance } from "@models/AudioEventProvenance";
import { List } from "immutable";
import { ToastService } from "@services/toasts/toasts.service";
import { FormComponent } from "@shared/form/form.component";
import { ErrorHandlerComponent } from "@shared/error-handler/error-handler.component";
import { provenancesMenuItemActions } from "../list/list.component";
import schema from "../../provenance.schema.json";

@Component({
  selector: "baw-provenances-new",
  templateUrl: "./new.component.html",
  imports: [FormComponent, ErrorHandlerComponent],
})
class ProvenanceNewComponent extends FormTemplate<AudioEventProvenance> {
  public fields = schema.fields;

  public constructor(
    private api: AudioEventProvenanceService,
    notifications: ToastService,
    route: ActivatedRoute,
    router: Router
  ) {
    super(notifications, route, router, {
      successMsg: (model) => defaultSuccessMsg("created", model.name),
      redirectUser: (model) => this.router.navigateByUrl(model.viewUrl),
    });
  }

  protected apiAction(model: Partial<AudioEventProvenance>) {
    return this.api.create(new AudioEventProvenance(model));
  }
}

ProvenanceNewComponent.linkToRoute({
  category: provenancesCategory,
  pageRoute: newProvenanceMenuItem,
  menus: { actions: List(provenancesMenuItemActions) },
});

export { ProvenanceNewComponent };

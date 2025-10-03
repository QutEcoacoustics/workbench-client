import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import {
  audioEventProvenanceResolvers,
  AudioEventProvenanceService,
} from "@baw-api/AudioEventProvenance/AudioEventProvenance.service";
import {
  editProvenanceMenuItem,
  provenanceCategory,
} from "@components/provenances/provenances.menus";
import {
  defaultSuccessMsg,
  FormTemplate,
} from "@helpers/formTemplate/formTemplate";
import { AudioEventProvenance } from "@models/AudioEventProvenance";
import { List } from "immutable";
import { ToastService } from "@services/toasts/toasts.service";
import { FormComponent } from "@shared/form/form.component";
import { provenanceMenuItemActions } from "../details/details.component";
import schema from "../../provenance.schema.json";

const provenanceKey = "provenance";

@Component({
  selector: "baw-provenance-edit",
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
class ProvenanceEditComponent
  extends FormTemplate<AudioEventProvenance>
  implements OnInit
{
  public fields = schema.fields;
  public title: string;

  public constructor(
    private api: AudioEventProvenanceService,
    protected notifications: ToastService,
    protected route: ActivatedRoute,
    protected router: Router
  ) {
    super(notifications, route, router, {
      getModel: (models) => models[provenanceKey] as AudioEventProvenance,
      successMsg: (model) => defaultSuccessMsg("updated", model.name),
      redirectUser: (model) => this.router.navigateByUrl(model.viewUrl),
    });
  }

  public ngOnInit() {
    super.ngOnInit();

    if (this.failure) {
      return;
    }

    this.title = `Edit ${this.model.name}`;
  }

  protected apiAction(model: Partial<AudioEventProvenance>) {
    return this.api.update(new AudioEventProvenance(model));
  }
}

ProvenanceEditComponent.linkToRoute({
  category: provenanceCategory,
  pageRoute: editProvenanceMenuItem,
  menus: {
    actions: List(provenanceMenuItemActions),
  },
  resolvers: { [provenanceKey]: audioEventProvenanceResolvers.show },
});

export { ProvenanceEditComponent };

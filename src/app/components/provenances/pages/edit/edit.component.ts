import { Component, OnInit, inject } from "@angular/core";
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
import { ErrorHandlerComponent } from "@shared/error-handler/error-handler.component";
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
    } @else {
      <baw-error-handler [error]="error"></baw-error-handler>
    }
  `,
  imports: [FormComponent, ErrorHandlerComponent],
})
class ProvenanceEditComponent
  extends FormTemplate<AudioEventProvenance>
  implements OnInit
{
  public fields = schema.fields;
  public title: string;

  private api = inject(AudioEventProvenanceService);
  protected notifications = inject(ToastService);
  protected route = inject(ActivatedRoute);
  protected router = inject(Router);

  public constructor() {
    super(inject(ToastService), inject(ActivatedRoute), inject(Router), {
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

import { Component } from "@angular/core";
import { List } from "immutable";
import { ActivatedRoute, Router } from "@angular/router";
import {
  FormTemplate,
  defaultSuccessMsg,
} from "@helpers/formTemplate/formTemplate";
import { AudioEventImport } from "@models/AudioEventImport";
import { AudioEventImportService } from "@baw-api/audio-event-import/audio-event-import.service";
import { ToastService } from "@services/toasts/toasts.service";
import { FormComponent } from "@shared/form/form.component";
import schema from "../audio-event-import.schema.json";
import {
  annotationsImportMenuItem,
  newAnnotationImportMenuItem,
  annotationsImportCategory,
} from "../import-annotations.menu";

export const newAnnotationMenuItemActions = [
  annotationsImportMenuItem,
  newAnnotationImportMenuItem,
];

@Component({
  selector: "baw-new-annotation-import",
  template: `
    @if (!failure) {
      <baw-form
        title="New Annotation Import"
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
class NewAnnotationsComponent extends FormTemplate<AudioEventImport> {
  public constructor(
    protected notifications: ToastService,
    protected route: ActivatedRoute,
    protected router: Router,
    private api: AudioEventImportService
  ) {
    super(notifications, route, router, {
      successMsg: (model) => defaultSuccessMsg("created", model.name),
      redirectUser: (model) => this.router.navigateByUrl(model.viewUrl),
    });
  }

  public fields = schema.fields;

  protected apiAction(model: Partial<AudioEventImport>) {
    return this.api.create(new AudioEventImport(model));
  }
}

NewAnnotationsComponent.linkToRoute({
  category: annotationsImportCategory,
  pageRoute: newAnnotationImportMenuItem,
  menus: {
    actions: List(newAnnotationMenuItemActions),
  },
});

export { NewAnnotationsComponent };

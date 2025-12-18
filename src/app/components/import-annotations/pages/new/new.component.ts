import { Component, inject } from "@angular/core";
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
import { Project } from "@models/Project";
import { projectResolvers } from "@baw-api/project/projects.service";
import schema from "../../audio-event-import.schema.json";
import {
  annotationsImportMenuItem,
  newAnnotationImportMenuItem,
  annotationsImportCategory,
} from "../../import-annotations.menu";

const projectKey = "project";

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
  private readonly api = inject(AudioEventImportService);
  protected readonly notifications: ToastService;
  protected readonly route: ActivatedRoute;
  protected readonly router: Router;

  public constructor() {
    const notifications = inject(ToastService);
    const route = inject(ActivatedRoute);
    const router = inject(Router);

    super(notifications, route, router, {
      successMsg: (model) => defaultSuccessMsg("created", model.name),
      redirectUser: (model) =>
        this.router.navigateByUrl(
          model.createAddAnnotationsUrl(this.project.id),
        ),
    });
  
    this.notifications = notifications;
    this.route = route;
    this.router = router;
  }

  public fields = schema.fields;

  protected get project(): Project {
    return this.models.project as Project;
  }

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
  resolvers: {
    [projectKey]: projectResolvers.show,
  },
});

export { NewAnnotationsComponent };

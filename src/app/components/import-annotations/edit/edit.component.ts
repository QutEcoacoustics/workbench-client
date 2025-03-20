import { Component, OnInit } from "@angular/core";
import { List } from "immutable";
import {
  AudioEventImportService,
  audioEventImportResolvers,
} from "@baw-api/audio-event-import/audio-event-import.service";
import { ActivatedRoute, Router } from "@angular/router";
import { AudioEventImport } from "@models/AudioEventImport";
import {
  FormTemplate,
  defaultSuccessMsg,
} from "@helpers/formTemplate/formTemplate";
import { ToastsService } from "@services/toasts/toasts.service";
import { annotationMenuActions } from "../details/details.component";
import schema from "../audio-event-import.schema.json";
import { annotationsImportCategory, editAnnotationImportMenuItem } from "../import-annotations.menu";

const audioEventImportKey = "audioEventImport";

@Component({
  selector: "baw-edit-annotation-import",
  template: `
    <baw-form
      *ngIf="!failure"
      [title]="title"
      [model]="model"
      [fields]="fields"
      [submitLoading]="loading"
      submitLabel="Submit"
      (onSubmit)="submit($event)"
    ></baw-form>
  `,
})
class EditAnnotationsComponent
  extends FormTemplate<AudioEventImport>
  implements OnInit
{
  public constructor(
    private api: AudioEventImportService,
    protected route: ActivatedRoute,
    protected notifications: ToastsService,
    protected router: Router
  ) {
    super(notifications, route, router, {
      getModel: (models) => models[audioEventImportKey] as AudioEventImport,
      successMsg: (model) => defaultSuccessMsg("updated", model.name),
      redirectUser: (model) => this.router.navigateByUrl(model.viewUrl),
    });
  }

  public fields = schema.fields;
  protected title: string;

  public ngOnInit(): void {
    super.ngOnInit();
    this.title = `Edit ${this.model.name}`;
  }

  protected apiAction(model: Partial<AudioEventImport>) {
    return this.api.update(new AudioEventImport(model));
  }
}

EditAnnotationsComponent.linkToRoute({
  category: annotationsImportCategory,
  pageRoute: editAnnotationImportMenuItem,
  menus: {
    actions: List(annotationMenuActions),
  },
  resolvers: {
    [audioEventImportKey]: audioEventImportResolvers.show,
  },
});

export { EditAnnotationsComponent };

import { Component } from "@angular/core";
import {
  audioAnalysisCategory,
  newAudioAnalysisJobMenuItem,
} from "@components/audio-analysis/audio-analysis.menus";
import { PageComponent } from "@helpers/page/pageComponent";
import { AnalysisJob } from "@models/AnalysisJob";
import { defaultSuccessMsg } from "@helpers/formTemplate/formTemplate";
import { AnalysisJobsService } from "@baw-api/analysis/analysis-jobs.service";
import { ToastrService } from "ngx-toastr";
import { ActivatedRoute, Router } from "@angular/router";
import schema from "../../analysis-job.schema.json";

@Component({
  selector: "baw-new-audio-analyses",
  template: `
    <baw-form
      *ngIf="!failure"
      title="New Analysis Job"
      [model]="model"
      [fields]="fields"
      submitLabel="Submit"
      [submitLoading]="loading"
      (onSubmit)="submit($event)"
    ></baw-form>
  `,
})
class NewAudioAnalysisJobComponent extends PageComponent {
  public fields = schema.fields;

  public constructor(
    protected notifications: ToastrService,
    protected route: ActivatedRoute,
    protected router: Router,
    private api: AnalysisJobsService,
  ) {
    super(notifications, route, router, {
      successMsg: (model) => defaultSuccessMsg("created", model.name),
      redirectUser: (model) => this.router.navigateByUrl(model.viewUrl),
    });

    // Filter out allowAudioUpload field on new form. We can do this
    // intelligently with https://github.com/QutEcoacoustics/baw-server/issues/561
    this.fields = this.fields.filter(
      (field) => field.key !== "allowAudioUpload"
    );
  }

  protected apiAction(model: Partial<AnalysisJob>) {
    return this.api.create(new AnalysisJob(model));
  }
}

NewAudioAnalysisJobComponent.linkToRoute({
  category: audioAnalysisCategory,
  pageRoute: newAudioAnalysisJobMenuItem,
});

export { NewAudioAnalysisJobComponent as NewAudioAnalysisComponent };

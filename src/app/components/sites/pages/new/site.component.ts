import { Component } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { ApiErrorDetails } from "@baw-api/api.interceptor.service";
import { SitesService } from "@baw-api/site/sites.service";
import {
  defaultSuccessMsg,
  extendedErrorMsg,
  FormTemplate,
} from "@helpers/formTemplate/formTemplate";
import { Project } from "@models/Project";
import { Site } from "@models/Site";
import { ToastrService } from "ngx-toastr";
import { fields } from "../../site.base.json";

const projectKey = "project";

@Component({
  selector: "baw-sites-new",
  templateUrl: "./new.component.html",
})
export class SiteNewComponent extends FormTemplate<Site> {
  public fields = fields;
  public title = "";

  public constructor(
    protected api: SitesService,
    notifications: ToastrService,
    route: ActivatedRoute,
    router: Router
  ) {
    super(notifications, route, router, {
      successMsg: (model) => defaultSuccessMsg("created", model.name),
      failureMsg: (error) => siteErrorMsg(error),
      redirectUser: (model) =>
        this.router.navigateByUrl(model.getViewUrl(this.project)),
    });
  }

  public get project(): Project {
    return this.models[projectKey] as Project;
  }

  protected apiAction(model: Partial<Site>) {
    return this.api.create(new Site(model), this.project);
  }
}

export function siteErrorMsg(err: ApiErrorDetails) {
  return extendedErrorMsg(err, {
    tzinfoTz: (value) => `timezone identifier ${value[0]}`,
  });
}

import { Component } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { ApiErrorDetails } from "@baw-api/api.interceptor.service";
import { SitesService } from "@baw-api/site/sites.service";
import { FormTemplate } from "@helpers/formTemplate/formTemplate";
import {
  defaultSuccessMsg,
  extendedErrorMsg,
} from "@helpers/formTemplate/simpleFormTemplate";
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
    super(
      notifications,
      route,
      router,
      undefined,
      (model) => defaultSuccessMsg("created", model.name),
      siteErrorMsg
    );
  }

  public get project(): Project {
    return this.models[projectKey] as Project;
  }

  protected redirectionPath(model: Site) {
    return model.getViewUrl(this.project);
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

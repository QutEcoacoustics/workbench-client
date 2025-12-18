import { Component, OnInit, inject } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { projectResolvers } from "@baw-api/project/projects.service";
import { regionResolvers } from "@baw-api/region/regions.service";
import { SitesService } from "@baw-api/site/sites.service";
import { regionMenuItemActions } from "@components/regions/pages/details/details.component";
import {
  newPointMenuItem,
  pointsCategory,
} from "@components/sites/points.menus";
import {
  defaultSuccessMsg,
  FormTemplate,
} from "@helpers/formTemplate/formTemplate";
import { Project } from "@models/Project";
import { Region } from "@models/Region";
import { Site } from "@models/Site";
import { List } from "immutable";
import { ToastService } from "@services/toasts/toasts.service";
import { FormComponent } from "@shared/form/form.component";
import pointSchema from "../../point.base.json";
import siteSchema from "../../site.base.json";

const projectKey = "project";
const regionKey = "region";

@Component({
  selector: "baw-sites-new",
  templateUrl: "./new.component.html",
  imports: [FormComponent],
})
class SiteNewComponent extends FormTemplate<Site> implements OnInit {
  protected readonly api = inject(SitesService);
  protected readonly notifications: ToastService;
  protected readonly route: ActivatedRoute;
  protected readonly router: Router;

  public title = "";

  public constructor() {
    const notifications = inject(ToastService);
    const route = inject(ActivatedRoute);
    const router = inject(Router);

    super(notifications, route, router, {
      successMsg: (model) => defaultSuccessMsg("created", model.name),
      redirectUser: (model) =>
        this.router.navigateByUrl(model.getViewUrl(this.project)),
      getModel: () => {
        // TODO: for some reason if we use a set here, the project ids don't get
        // serialized correctly when sending the model body
        // to get around this, I've used an array and cast to any
        // we should figure out why we need this type casing and fix it in the
        // correct way
        const projectIds = [this.project.id] as any;

        if (this.region) {
          return {
            regionId: this.region.id,
            projectIds,
          };
        }

        return { projectIds };
      },
    });
  
    this.notifications = notifications;
    this.route = route;
    this.router = router;
  }

  public ngOnInit(): void {
    super.ngOnInit();

    if (!this.failure) {
      // Only sites with regions have their own page, normal sites are part of
      // a wizard
      this.title = this.region ? "New Point" : "";
      this.fields = this.region ? pointSchema.fields : siteSchema.fields;
    }
  }

  public get region(): Region {
    return this.models[regionKey] as Region;
  }

  public get project(): Project {
    return this.models[projectKey] as Project;
  }

  protected apiAction(model: Partial<Site>) {
    return this.api.create(new Site(model), this.project);
  }
}

// Only sites with regions have their own page, normal sites are part of a
// wizard
SiteNewComponent.linkToRoute({
  category: pointsCategory,
  pageRoute: newPointMenuItem,
  menus: { actions: List(regionMenuItemActions) },
  resolvers: {
    [projectKey]: projectResolvers.show,
    [regionKey]: regionResolvers.show,
  },
});

export { SiteNewComponent };

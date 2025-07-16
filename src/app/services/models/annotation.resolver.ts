import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve } from "@angular/router";
import { BawSessionService } from "@baw-api/baw-session.service";
import { SecurityService } from "@baw-api/security/security.service";
import { AnnotationSearchParameters } from "@components/annotations/pages/annotationSearchParameters";
import { lastValueFrom } from "rxjs";

@Injectable({ providedIn: "root" })
class AnnotationsSearchResolver
  implements Resolve<{ model: AnnotationSearchParameters }>
{
  public constructor(
    private session: BawSessionService,
    private security: SecurityService,
  ) {}

  public async resolve(
    route: ActivatedRouteSnapshot,
  ): Promise<{ model: AnnotationSearchParameters }> {
    const routeProjectId = route.params["projectId"];
    const routeRegionId = route.params["regionId"];
    const routeSiteId = route.params["siteId"];

    const data = {
      routeProjectId: routeProjectId,
      routeRegionId: routeRegionId,
      routeSiteId: routeSiteId,
      ...route.queryParams,
    };

    if (!this.security.firstAuthAwait.value) {
      await lastValueFrom(this.security.firstAuthAwait, {
        defaultValue: null,
      });
    }

    return { model: new AnnotationSearchParameters(data, this.session.loggedInUser) };
  }
}

export const annotationResolvers = {
  showOptional: "annotationSearchParametersResolver",
  providers: [
    {
      provide: "annotationSearchParametersResolver",
      useClass: AnnotationsSearchResolver,
      deps: [BawSessionService, SecurityService],
    },
  ],
};

import { inject, Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve } from "@angular/router";
import { BawSessionService } from "@baw-api/baw-session.service";
import { SecurityService } from "@baw-api/security/security.service";
import { AnnotationSearchParameters } from "@components/annotations/components/annotation-search-form/annotationSearchParameters";
import { lastValueFrom } from "rxjs";

@Injectable({ providedIn: "root" })
class AnnotationsSearchParametersResolver
  implements Resolve<{ model: AnnotationSearchParameters }>
{
  private readonly session = inject(BawSessionService);
  private readonly security = inject(SecurityService);

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

    return {
      model: new AnnotationSearchParameters(data, this.session.loggedInUser),
    };
  }
}

export const annotationSearchParametersResolvers = {
  showOptional: "annotationSearchParametersResolver",
  providers: [
    {
      provide: "annotationSearchParametersResolver",
      useClass: AnnotationsSearchParametersResolver,
      deps: [BawSessionService, SecurityService],
    },
  ],
};

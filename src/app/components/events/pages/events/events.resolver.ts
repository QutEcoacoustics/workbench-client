import { inject, Injectable } from "@angular/core";
import { Resolve, ActivatedRouteSnapshot } from "@angular/router";
import { BawSessionService } from "@baw-api/baw-session.service";
import { SecurityService } from "@baw-api/security/security.service";
import { lastValueFrom } from "rxjs";
import { EventMapSearchParameters } from "./eventMapSearchParameters";

@Injectable({ providedIn: "root" })
export class EventMapResolver
  implements Resolve<{ model: EventMapSearchParameters }>
{
  private readonly session = inject(BawSessionService);
  private readonly security = inject(SecurityService);

  public async resolve(
    route: ActivatedRouteSnapshot,
  ): Promise<{ model: EventMapSearchParameters }> {
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
      model: new EventMapSearchParameters(data, this.session.loggedInUser),
    };
  }
}

export const eventMapResolvers = {
  showOptional: "eventMapSearchParametersResolver",
  providers: [
    {
      provide: "eventMapSearchParametersResolver",
      useClass: EventMapResolver,
      deps: [BawSessionService, SecurityService],
    },
  ],
};

import { Injectable } from "@angular/core";
import { Resolve, ActivatedRouteSnapshot } from "@angular/router";
import { BawSessionService } from "@baw-api/baw-session.service";
import { SecurityService } from "@baw-api/security/security.service";
import { EventMapSearchParameters } from "./eventMapSearchParameters";

@Injectable({ providedIn: "root" })
export class EventMapResolver
  implements Resolve<{ model: EventMapSearchParameters }>
{
  public async resolve(
    route: ActivatedRouteSnapshot,
  ): Promise<{ model: EventMapSearchParameters }> {
    return {
      model: new EventMapSearchParameters(route.queryParams),
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

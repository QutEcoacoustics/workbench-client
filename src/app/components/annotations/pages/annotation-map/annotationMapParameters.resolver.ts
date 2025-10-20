import { Injectable } from "@angular/core";
import { Resolve, ActivatedRouteSnapshot } from "@angular/router";
import { BawSessionService } from "@baw-api/baw-session.service";
import { SecurityService } from "@baw-api/security/security.service";
import { AnnotationMapParameters } from "./annotationMapParameters";

@Injectable({ providedIn: "root" })
export class AnnotationMapParametersResolver
  implements Resolve<{ model: AnnotationMapParameters }>
{
  public async resolve(
    route: ActivatedRouteSnapshot,
  ): Promise<{ model: AnnotationMapParameters }> {
    return {
      model: new AnnotationMapParameters(route.queryParams),
    };
  }
}

export const annotationMapParameterResolvers = {
  showOptional: "annotationMapParametersResolver",
  providers: [
    {
      provide: "annotationMapParametersResolver",
      useClass: AnnotationMapParametersResolver,
      deps: [BawSessionService, SecurityService],
    },
  ],
};

import { inject, Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve } from "@angular/router";
import { SecurityService } from "@baw-api/security/security.service";
import { BawSessionService } from "@baw-api/baw-session.service";
import { lastValueFrom } from "rxjs";
import { VerificationParameters } from "./verificationParameters";

interface VerificationResolverData {
  model: VerificationParameters;
}

@Injectable({ providedIn: "root" })
class VerificationParametersResolver
  implements Resolve<VerificationResolverData>
{
  private readonly session = inject(BawSessionService);
  private readonly security = inject(SecurityService);

  public async resolve(
    route: ActivatedRouteSnapshot,
  ): Promise<VerificationResolverData> {
    if (!this.security.firstAuthAwait.value) {
      await lastValueFrom(this.security.firstAuthAwait, {
        defaultValue: null,
      });
    }

    return {
      model: new VerificationParameters(
        route.queryParams,
        this.session.loggedInUser,
      ),
    };
  }
}

export const verificationParametersResolvers = {
  showOptional: "verificationParametersResolver",
  providers: [
    {
      provide: "verificationParametersResolver",
      useClass: VerificationParametersResolver,
      deps: [BawSessionService, SecurityService],
    },
  ],
};

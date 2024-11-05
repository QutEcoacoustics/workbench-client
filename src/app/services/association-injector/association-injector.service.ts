import { Injectable, Injector } from "@angular/core";
import { BAW_SERVICE_OPTIONS } from "@baw-api/api-common";
import { BawApiService } from "@baw-api/baw-api.service";
import { serviceResolvers, services, serviceTokens } from "@baw-api/ServiceProviders";

@Injectable({ providedIn: "root" })
export class AssociationInjectorService {
  public constructor(private injector: Injector) {
    this.instance = Injector.create({
      name: "AssociationInjector",
      parent: this.injector,
      providers: [
        { provide: BawApiService, useClass: BawApiService },
        {
          provide: BAW_SERVICE_OPTIONS,
          useValue: { disableNotification: true },
        },
        ...services,
        ...serviceTokens,
        ...serviceResolvers,
      ],
    });
  }

  public instance: Injector;
}

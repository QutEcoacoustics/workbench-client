import { Injectable, Injector } from "@angular/core";
import { BAW_SERVICE_OPTIONS } from "../baw-api/api-common";
// import {
//   ShallowSitesService,
//   shallowSiteResolvers,
// } from "../baw-api/site/sites.service";
import { BawApiService } from "../baw-api/baw-api.service";
// import * as Tokens from "../baw-api/ServiceTokens";
// import { serviceList } from "../baw-api/ServiceProviders";

// const serviceList = [
//   {
//     serviceToken: Tokens.SHALLOW_SITE,
//     service: ShallowSitesService,
//     resolvers: shallowSiteResolvers,
//   },
// ];

@Injectable({ providedIn: "root" })
export class AssociationInjectorService {
  public constructor(private injector: Injector) {
    // TODO: fix this potential race condition
    this.createInstance().then((instance) => {
      this.instance = instance;
    });
  }

  public instance?: Injector;

  public async createInstance(): Promise<Injector> {
    const imported = await import("../baw-api/ServiceProviders");
    const serviceList = imported.serviceList;

    const providedServices = serviceList.map(({ service, serviceToken }) => {
      return { provide: serviceToken.token, useClass: service };
    });

    return Injector.create({
      name: "AssociationInjector",
      parent: this.injector,
      providers: [
        { provide: BawApiService, useClass: BawApiService },
        {
          provide: BAW_SERVICE_OPTIONS,
          useValue: { disableNotification: true },
        },
        ...providedServices,
      ],
    });
  }
}

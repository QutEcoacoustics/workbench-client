import { Injectable, Injector } from "@angular/core";
import { BAW_SERVICE_OPTIONS } from "@baw-api/api-common";
import { BawApiService } from "@baw-api/baw-api.service";
import { serviceList } from "@baw-api/ServiceProviders";

@Injectable({ providedIn: "root" })
export class AssociationInjectorService {
  public constructor(private injector: Injector) {}

  public _instance?: Injector;

  public get instance(): Injector {
    this._instance ??= this.createInstance();
    return this._instance;
  }

  private createInstance(): Injector {
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

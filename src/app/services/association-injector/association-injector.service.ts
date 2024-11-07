// import { Injectable, Injector } from "@angular/core";
// import { BAW_SERVICE_OPTIONS } from "../baw-api/api-common";
// import { BawApiService } from "../baw-api/baw-api.service";
// import {
//   services,
//   serviceTokens,
//   serviceResolvers,
// } from "../baw-api/ServiceProviders";

// //! WARNING: to prevent a circular dependency issue, this service should be imported
// // through its "ASSOCIATION_INJECTOR" token
// @Injectable()
// export class AssociationInjectorService {
//   public constructor(private injector: Injector) {
//     console.log("creating assocaition");
//   }

//   public get instance(): Injector {
//     this._instance ??= this.createInstance();
//     return this._instance;
//   }

//   private _instance?: Injector;

//   private createInstance(): Injector {
//     return Injector.create({
//       name: "AssociationInjector",
//       parent: this.injector,
//       providers: [
//         { provide: BawApiService, useClass: BawApiService },
//         {
//           provide: BAW_SERVICE_OPTIONS,
//           useValue: { disableNotification: true },
//         },
//         ...services,
//         ...serviceTokens,
//         ...serviceResolvers,
//       ],
//     });
//   }
// }

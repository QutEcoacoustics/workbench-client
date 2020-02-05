// import {
//   HttpClientTestingModule,
//   HttpTestingController
// } from "@angular/common/http/testing";
// import { fakeAsync, TestBed, tick } from "@angular/core/testing";
// import { RouterTestingModule } from "@angular/router/testing";
// import { Subject } from "rxjs";
// import { testAppInitializer } from "src/app/app.helper";
// import { Site } from "src/app/models/Site";
// import { ApiErrorDetails } from "./api.interceptor";
// import { BawApiService, Filters } from "./base-api.service";
// import { MockBawApiService } from "./mock/baseApiMockService";
// import { SitesService, SitesServiceShallow } from "./sites.service";

// describe("SitesServiceShallow", () => {
//   let service: SitesServiceShallow;
//   let httpMock: HttpTestingController;

//   const errorResponse = {
//     status: 401,
//     message: "Unauthorized"
//   } as ApiErrorDetails;

//   const errorInfoResponse = {
//     status: 422,
//     message: "Record could not be saved",
//     info: {
//       name: ["has already been taken"],
//       image: [],
//       image_file_name: [],
//       image_file_size: [],
//       image_content_type: [],
//       image_updated_at: []
//     }
//   } as ApiErrorDetails;

//   beforeEach(() => {
//     TestBed.configureTestingModule({
//       imports: [HttpClientTestingModule, RouterTestingModule],
//       providers: [
//         ...testAppInitializer,
//         { provide: BawApiService, useClass: MockBawApiService }
//       ]
//     });

//     service = TestBed.get(SitesService);
//     httpMock = TestBed.get(HttpTestingController);
//   });

//   afterEach(() => {
//     httpMock.verify();
//   });

//   it("should be created", () => {
//     expect(service).toBeTruthy();
//   });

//   /**
//    * list
//    */

//   it("list should handle empty response", fakeAsync(() => {
//     spyOn<any>(service, "list").and.callFake(
//       (path: string, filters: Filters) => {
//         expect(path).toBe("/sites");
//         expect(filters).toBeFalsy();
//         const subject = new Subject<Site[]>();

//         setTimeout(() => {
//           subject.next([]);
//           subject.complete();
//         }, 50);

//         return subject;
//       }
//     );

//     service.list().subscribe(
//       (sites: Site[]) => {
//         expect(sites).toBeTruthy();
//         expect(sites).toEqual([]);
//       },
//       () => {
//         expect(true).toBeFalsy("Service should not return an error");
//       }
//     );

//     tick(100);
//   }));

//   it("list should handle single site", fakeAsync(() => {
//     spyOn<any>(service, "list").and.callFake(
//       (path: string, filters: Filters) => {
//         expect(path).toBe("/sites");
//         expect(filters).toBeFalsy();
//         const subject = new Subject<Site[]>();

//         setTimeout(() => {
//           subject.next([
//             new Site({
//               id: 1,
//               name: "Name",
//               creatorId: 2,
//               projectIds: new Set([1, 2, 3])
//             })
//           ]);
//           subject.complete();
//         }, 50);

//         return subject;
//       }
//     );

//     service.list().subscribe(
//       (sites: Site[]) => {
//         expect(sites).toBeTruthy();
//         expect(sites).toEqual([
//           new Site({
//             id: 1,
//             name: "Name",
//             creatorId: 2,
//             projectIds: new Set([1, 2, 3])
//           })
//         ]);
//       },
//       () => {
//         expect(true).toBeFalsy("Service should not return an error");
//       }
//     );

//     tick(100);
//   }));

//   it("list should handle multiple sites", fakeAsync(() => {
//     spyOn<any>(service, "list").and.callFake(
//       (path: string, filters: Filters) => {
//         expect(path).toBe("/sites");
//         expect(filters).toBeFalsy();
//         const subject = new Subject<Site[]>();

//         setTimeout(() => {
//           subject.next([
//             new Site({
//               id: 1,
//               name: "Name",
//               creatorId: 2,
//               projectIds: new Set([1, 2, 3])
//             }),
//             new Site({
//               id: 5,
//               name: "Name",
//               creatorId: 10,
//               projectIds: new Set([10, 20, 30])
//             })
//           ]);
//           subject.complete();
//         }, 50);

//         return subject;
//       }
//     );

//     service.list().subscribe(
//       (sites: Site[]) => {
//         expect(sites).toBeTruthy();
//         expect(sites).toEqual([
//           new Site({
//             id: 1,
//             name: "Name",
//             creatorId: 2,
//             projectIds: new Set([1, 2, 3])
//           }),
//           new Site({
//             id: 5,
//             name: "Name",
//             creatorId: 10,
//             projectIds: new Set([10, 20, 30])
//           })
//         ]);
//       },
//       () => {
//         expect(true).toBeFalsy("Service should not return an error");
//       }
//     );

//     tick(100);
//   }));

//   // it("list should handle single site with empty filter", fakeAsync(() => {
//   //   spyOn<any>(service, "list").and.callFake(
//   //     (path: string, filters: Filters) => {
//   //       expect(path).toBe("/sites");
//   //       expect(filters).toEqual({});
//   //       const subject = new Subject<Site[]>();

//   //       setTimeout(() => {
//   //         subject.next([
//   //           new Site({
//   //             id: 1,
//   //             name: "Name",
//   //             creatorId: 2,
//   //             projectIds: new Set([1, 2, 3])
//   //           })
//   //         ]);
//   //         subject.complete();
//   //       }, 50);

//   //       return subject;
//   //     }
//   //   );

//   //   service.list({}).subscribe(
//   //     (sites: Site[]) => {
//   //       expect(sites).toBeTruthy();
//   //       expect(sites).toEqual([
//   //         new Site({
//   //           id: 1,
//   //           name: "Name",
//   //           creatorId: 2,
//   //           projectIds: new Set([1, 2, 3])
//   //         })
//   //       ]);
//   //     },
//   //     () => {
//   //       expect(true).toBeFalsy("Service should not return an error");
//   //     }
//   //   );

//   //   tick(100);
//   // }));

//   // it("list should handle single site with filter", fakeAsync(() => {
//   //   spyOn<any>(service, "list").and.callFake(
//   //     (path: string, filters: Filters) => {
//   //       expect(path).toBe("/sites");
//   //       expect(filters).toEqual({ paging: { items: 3 } });
//   //       const subject = new Subject<Site[]>();

//   //       setTimeout(() => {
//   //         subject.next([
//   //           new Site({
//   //             id: 1,
//   //             name: "Name",
//   //             creatorId: 2,
//   //             projectIds: new Set([1, 2, 3])
//   //           })
//   //         ]);
//   //         subject.complete();
//   //       }, 50);

//   //       return subject;
//   //     }
//   //   );

//   //   service.list({ paging: { items: 3 } }).subscribe(
//   //     (sites: Site[]) => {
//   //       expect(sites).toBeTruthy();
//   //       expect(sites).toEqual([
//   //         new Site({
//   //           id: 1,
//   //           name: "Name",
//   //           creatorId: 2,
//   //           projectIds: new Set([1, 2, 3])
//   //         })
//   //       ]);
//   //     },
//   //     () => {
//   //       expect(true).toBeFalsy("Service should not return an error");
//   //     }
//   //   );

//   //   tick(100);
//   // }));

//   it("list should handle error", fakeAsync(() => {
//     spyOn<any>(service, "list").and.callFake(
//       (path: string, filters: Filters) => {
//         expect(path).toBe("/sites");
//         expect(filters).toBeFalsy();
//         const subject = new Subject<Site[]>();

//         setTimeout(() => {
//           subject.error(errorResponse);
//         }, 50);

//         return subject;
//       }
//     );

//     service.list().subscribe(
//       () => {
//         expect(true).toBeFalsy("Service should not return data");
//       },
//       (err: ApiErrorDetails) => {
//         expect(err).toBeTruthy();
//         expect(err).toEqual(errorResponse);
//       }
//     );

//     tick(100);
//   }));

//   it("list should handle error with info", fakeAsync(() => {
//     spyOn<any>(service, "list").and.callFake(
//       (path: string, filters: Filters) => {
//         expect(path).toBe("/sites");
//         expect(filters).toBeFalsy();
//         const subject = new Subject<Site[]>();

//         setTimeout(() => {
//           subject.error(errorInfoResponse);
//         }, 50);

//         return subject;
//       }
//     );

//     service.list().subscribe(
//       () => {
//         expect(true).toBeFalsy("Service should not return data");
//       },
//       (err: ApiErrorDetails) => {
//         expect(err).toBeTruthy();
//         expect(err).toEqual(errorInfoResponse);
//       }
//     );

//     tick(100);
//   }));

//   /**
//    * show
//    */

//   it("show should handle response", fakeAsync(() => {
//     spyOn<any>(service, "show").and.callFake(
//       (path: string, filters: Filters) => {
//         expect(path).toBe("/sites/1");
//         expect(filters).toBeFalsy();
//         const subject = new Subject<Site>();

//         setTimeout(() => {
//           subject.next(
//             new Site({
//               id: 1,
//               name: "Name",
//               creatorId: 2,
//               projectIds: new Set([1, 2, 3])
//             })
//           );
//           subject.complete();
//         }, 50);

//         return subject;
//       }
//     );

//     service.show(1).subscribe(
//       (site: Site) => {
//         expect(site).toBeTruthy();
//         expect(site).toEqual(
//           new Site({
//             id: 1,
//             name: "Name",
//             creatorId: 2,
//             projectIds: new Set([1, 2, 3])
//           })
//         );
//       },
//       () => {
//         expect(true).toBeFalsy("Service should not return an error");
//       }
//     );

//     tick(100);
//   }));

//   it("show should handle response with random id", fakeAsync(() => {
//     spyOn<any>(service, "show").and.callFake(
//       (path: string, filters: Filters) => {
//         expect(path).toBe("/sites/5");
//         expect(filters).toBeFalsy();
//         const subject = new Subject<Site>();

//         setTimeout(() => {
//           subject.next(
//             new Site({
//               id: 1,
//               name: "Name",
//               creatorId: 2,
//               projectIds: new Set([1, 2, 3])
//             })
//           );
//           subject.complete();
//         }, 50);

//         return subject;
//       }
//     );

//     service.show(5).subscribe(
//       (site: Site) => {
//         expect(site).toBeTruthy();
//         expect(site).toEqual(
//           new Site({
//             id: 1,
//             name: "Name",
//             creatorId: 2,
//             projectIds: new Set([1, 2, 3])
//           })
//         );
//       },
//       () => {
//         expect(true).toBeFalsy("Service should not return an error");
//       }
//     );

//     tick(100);
//   }));

//   // it("show should handle response with empty filter", fakeAsync(() => {
//   //   spyOn<any>(service, "show").and.callFake(
//   //     (path: string, filters: Filters) => {
//   //       expect(path).toBe("/sites/1");
//   //       expect(filters).toEqual({});
//   //       const subject = new Subject<Site>();

//   //       setTimeout(() => {
//   //         subject.next(
//   //           new Site({
//   //             id: 1,
//   //             name: "Name",
//   //             creatorId: 2,
//   //             projectIds: new Set([1, 2, 3])
//   //           })
//   //         );
//   //         subject.complete();
//   //       }, 50);

//   //       return subject;
//   //     }
//   //   );

//   //   service.show(1, {}).subscribe(
//   //     (site: Site) => {
//   //       expect(site).toBeTruthy();
//   //       expect(site).toEqual(
//   //         new Site({
//   //           id: 1,
//   //           name: "Name",
//   //           creatorId: 2,
//   //           projectIds: new Set([1, 2, 3])
//   //         })
//   //       );
//   //     },
//   //     () => {
//   //       expect(true).toBeFalsy("Service should not return an error");
//   //     }
//   //   );

//   //   tick(100);
//   // }));

//   // it("show should handle response with filter", fakeAsync(() => {
//   //   spyOn<any>(service, "show").and.callFake(
//   //     (path: string, filters: Filters) => {
//   //       expect(path).toBe("/sites/1");
//   //       expect(filters).toEqual({ paging: { items: 3 } });
//   //       const subject = new Subject<Site>();

//   //       setTimeout(() => {
//   //         subject.next(
//   //           new Site({
//   //             id: 1,
//   //             name: "Name",
//   //             creatorId: 2,
//   //             projectIds: new Set([1, 2, 3])
//   //           })
//   //         );
//   //         subject.complete();
//   //       }, 50);

//   //       return subject;
//   //     }
//   //   );

//   //   service.show(1, { paging: { items: 3 } }).subscribe(
//   //     (site: Site) => {
//   //       expect(site).toBeTruthy();
//   //       expect(site).toEqual(
//   //         new Site({
//   //           id: 1,
//   //           name: "Name",
//   //           creatorId: 2,
//   //           projectIds: new Set([1, 2, 3])
//   //         })
//   //       );
//   //     },
//   //     () => {
//   //       expect(true).toBeFalsy("Service should not return an error");
//   //     }
//   //   );

//   //   tick(100);
//   // }));

//   it("show should handle error", fakeAsync(() => {
//     spyOn<any>(service, "show").and.callFake(
//       (path: string, filters: Filters) => {
//         expect(path).toBe("/sites/1");
//         expect(filters).toBeFalsy();
//         const subject = new Subject<Site>();

//         setTimeout(() => {
//           subject.error(errorResponse);
//         }, 50);

//         return subject;
//       }
//     );

//     service.show(1).subscribe(
//       () => {
//         expect(true).toBeFalsy("Service should not return data");
//       },
//       (err: ApiErrorDetails) => {
//         expect(err).toBeTruthy();
//         expect(err).toEqual(errorResponse);
//       }
//     );

//     tick(100);
//   }));

//   it("show should handle error with info", fakeAsync(() => {
//     spyOn<any>(service, "show").and.callFake(
//       (path: string, filters: Filters) => {
//         expect(path).toBe("/sites/1");
//         expect(filters).toBeFalsy();
//         const subject = new Subject<Site>();

//         setTimeout(() => {
//           subject.error(errorInfoResponse);
//         }, 50);

//         return subject;
//       }
//     );

//     service.show(1).subscribe(
//       () => {
//         expect(true).toBeFalsy("Service should not return data");
//       },
//       (err: ApiErrorDetails) => {
//         expect(err).toBeTruthy();
//         expect(err).toEqual(errorInfoResponse);
//       }
//     );

//     tick(100);
//   }));
// });

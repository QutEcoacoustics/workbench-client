// import {
//   HttpClientTestingModule,
//   HttpTestingController
// } from "@angular/common/http/testing";
// import { fakeAsync, TestBed, tick } from "@angular/core/testing";
// import { RouterTestingModule } from "@angular/router/testing";
// import { Subject } from "rxjs";
// import { testAppInitializer } from "src/app/app.helper";
// import { Project } from "src/app/models/Project";
// import { ApiErrorDetails } from "./api.interceptor";
// import { BawApiService } from "./base-api.service";
// import { MockBawApiService } from "./mock/baseApiMockService";
// import { ProjectsService } from "./projects.service";

// describe("ProjectsService", () => {
//   let service: ProjectsService;
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

//     service = TestBed.get(ProjectsService);
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
//   describe("list", () => {
//     it("list should handle empty response", fakeAsync(() => {
//       const projectModels = [];

//       spyOn<any>(service, "list").and.callFake((path: string) => {
//         expect(path).toBe("/projects");

//         const subject = new Subject<Project[]>();

//         setTimeout(() => {
//           subject.next(projectModels);
//           subject.complete();
//         }, 50);

//         return subject;
//       });

//       service.list().subscribe(
//         (projects: Project[]) => {
//           expect(projects).toBeTruthy();
//           expect(projects).toEqual(projectModels);
//         },
//         () => {
//           expect(true).toBeFalsy("Service should not return an error");
//         }
//       );

//       tick(100);
//     }));

//     it("list should handle single project", fakeAsync(() => {
//       const projectModels = [
//         new Project({
//           id: 1,
//           name: "Name",
//           creatorId: 2,
//           siteIds: new Set([1, 2, 3])
//         })
//       ];

//       spyOn<any>(service, "list").and.callFake((path: string) => {
//         expect(path).toBe("/projects");

//         const subject = new Subject<Project[]>();

//         setTimeout(() => {
//           subject.next(projectModels);
//           subject.complete();
//         }, 50);

//         return subject;
//       });

//       service.list().subscribe(
//         (projects: Project[]) => {
//           expect(projects).toBeTruthy();
//           expect(projects).toEqual(projectModels);
//         },
//         () => {
//           expect(true).toBeFalsy("Service should not return an error");
//         }
//       );

//       tick(100);
//     }));

//     it("list should handle multiple projects", fakeAsync(() => {
//       const projectModels = [
//         new Project({
//           id: 1,
//           name: "Name",
//           creatorId: 2,
//           siteIds: new Set([1, 2, 3])
//         }),
//         new Project({
//           id: 5,
//           name: "Name",
//           creatorId: 10,
//           siteIds: new Set([10, 20, 30])
//         })
//       ];

//       spyOn<any>(service, "list").and.callFake((path: string) => {
//         expect(path).toBe("/projects");

//         const subject = new Subject<Project[]>();

//         setTimeout(() => {
//           subject.next(projectModels);
//           subject.complete();
//         }, 50);

//         return subject;
//       });

//       service.list().subscribe(
//         (projects: Project[]) => {
//           expect(projects).toBeTruthy();
//           expect(projects).toEqual(projectModels);
//         },
//         () => {
//           expect(true).toBeFalsy("Service should not return an error");
//         }
//       );

//       tick(100);
//     }));

//     it("list should handle error", fakeAsync(() => {
//       spyOn<any>(service, "list").and.callFake((path: string) => {
//         expect(path).toBe("/projects");

//         const subject = new Subject<Project[]>();

//         setTimeout(() => {
//           subject.error(errorResponse);
//         }, 50);

//         return subject;
//       });

//       service.list().subscribe(
//         () => {
//           expect(true).toBeFalsy("Service should not return data");
//         },
//         (err: ApiErrorDetails) => {
//           expect(err).toBeTruthy();
//           expect(err).toEqual(errorResponse);
//         }
//       );

//       tick(100);
//     }));

//     it("list should handle error with info", fakeAsync(() => {
//       spyOn<any>(service, "list").and.callFake((path: string) => {
//         expect(path).toBe("/projects");

//         const subject = new Subject<Project[]>();

//         setTimeout(() => {
//           subject.error(errorInfoResponse);
//         }, 50);

//         return subject;
//       });

//       service.list().subscribe(
//         () => {
//           expect(true).toBeFalsy("Service should not return data");
//         },
//         (err: ApiErrorDetails) => {
//           expect(err).toBeTruthy();
//           expect(err).toEqual(errorInfoResponse);
//         }
//       );

//       tick(100);
//     }));
//   });

//   /**
//    * show
//    */

//   it("show should handle response", fakeAsync(() => {
//     const projectModel = new Project({
//       id: 1,
//       name: "Name",
//       creatorId: 2,
//       siteIds: new Set([1, 2, 3])
//     });

//     spyOn<any>(service, "show").and.callFake((path: string) => {
//       expect(path).toBe("/projects/1");

//       const subject = new Subject<Project>();

//       setTimeout(() => {
//         subject.next(projectModel);
//         subject.complete();
//       }, 50);

//       return subject;
//     });

//     service.show(1).subscribe(
//       (project: Project) => {
//         expect(project).toBeTruthy();
//         expect(project).toEqual(project);
//       },
//       () => {
//         expect(true).toBeFalsy("Service should not return an error");
//       }
//     );

//     tick(100);
//   }));

//   it("getProject should handle response with random id", fakeAsync(() => {
//     spyOn<any>(service, "show").and.callFake((path: string) => {
//       expect(path).toBe("/projects/5");
//       const subject = new Subject<Project>();

//       setTimeout(() => {
//         subject.next(
//           new Project({
//             id: 1,
//             name: "Name",
//             creatorId: 2,
//             siteIds: new Set([1, 2, 3])
//           })
//         );
//         subject.complete();
//       }, 50);

//       return subject;
//     });

//     service.getProject(5).subscribe(
//       (project: Project) => {
//         expect(project).toBeTruthy();
//         expect(project).toEqual(
//           new Project({
//             id: 1,
//             name: "Name",
//             creatorId: 2,
//             siteIds: new Set([1, 2, 3])
//           })
//         );
//       },
//       () => {
//         expect(true).toBeFalsy("Service should not return an error");
//       }
//     );

//     tick(100);
//   }));

//   it("getProject should handle error", fakeAsync(() => {
//     spyOn<any>(service, "show").and.callFake((path: string) => {
//       expect(path).toBe("/projects/1");

//       const subject = new Subject<Project>();

//       setTimeout(() => {
//         subject.error({
//           status: 401,
//           message: "Unauthorized"
//         } as ApiErrorDetails);
//       }, 50);

//       return subject;
//     });

//     service.getProject(1).subscribe(
//       () => {
//         expect(true).toBeFalsy("Service should not return data");
//       },
//       (err: ApiErrorDetails) => {
//         expect(err).toBeTruthy();
//         expect(err).toEqual({
//           status: 401,
//           message: "Unauthorized"
//         } as ApiErrorDetails);
//       }
//     );

//     tick(100);
//   }));

//   it("getProject should handle error with info", fakeAsync(() => {
//     spyOn<any>(service, "show").and.callFake((path: string) => {
//       expect(path).toBe("/projects/1");

//       const subject = new Subject<Project>();

//       setTimeout(() => {
//         subject.error({
//           status: 422,
//           message: "Record could not be saved",
//           info: {
//             name: ["has already been taken"],
//             image: [],
//             image_file_name: [],
//             image_file_size: [],
//             image_content_type: [],
//             image_updated_at: []
//           }
//         } as ApiErrorDetails);
//       }, 50);

//       return subject;
//     });

//     service.getProject(1).subscribe(
//       () => {
//         expect(true).toBeFalsy("Service should not return data");
//       },
//       (err: ApiErrorDetails) => {
//         expect(err).toBeTruthy();
//         expect(err).toEqual({
//           status: 422,
//           message: "Record could not be saved",
//           info: {
//             name: ["has already been taken"],
//             image: [],
//             image_file_name: [],
//             image_file_size: [],
//             image_content_type: [],
//             image_updated_at: []
//           }
//         } as ApiErrorDetails);
//       }
//     );

//     tick(100);
//   }));

//   /**
//    * newProject
//    */

//   it("newProject should handle response", fakeAsync(() => {
//     spyOn<any>(service, "new").and.callFake((path: string, values: any) => {
//       expect(path).toBe("/projects");
//       expect(values).toEqual({ name: "Name" });

//       const subject = new Subject<Project>();

//       setTimeout(() => {
//         subject.next(
//           new Project({
//             id: 1,
//             name: "Name",
//             creatorId: 2,
//             siteIds: new Set([])
//           })
//         );
//         subject.complete();
//       }, 50);

//       return subject;
//     });

//     service.newProject({ name: "Name" }).subscribe(
//       (project: Project) => {
//         expect(project).toBeTruthy();
//         expect(project).toEqual(
//           new Project({
//             id: 1,
//             name: "Name",
//             creatorId: 2,
//             siteIds: new Set([])
//           })
//         );
//       },
//       () => {
//         expect(true).toBeFalsy("Service should not return an error");
//       }
//     );

//     tick(100);
//   }));

//   it("newProject should handle response with description", fakeAsync(() => {
//     spyOn<any>(service, "new").and.callFake((path: string, values: any) => {
//       expect(path).toBe("/projects");
//       expect(values).toEqual({ name: "Name", description: "Description" });

//       const subject = new Subject<Project>();

//       setTimeout(() => {
//         subject.next(
//           new Project({
//             id: 1,
//             name: "Name",
//             creatorId: 2,
//             siteIds: new Set([])
//           })
//         );
//         subject.complete();
//       }, 50);

//       return subject;
//     });

//     service.newProject({ name: "Name", description: "Description" }).subscribe(
//       (project: Project) => {
//         expect(project).toBeTruthy();
//         expect(project).toEqual(
//           new Project({
//             id: 1,
//             name: "Name",
//             creatorId: 2,
//             siteIds: new Set([])
//           })
//         );
//       },
//       () => {
//         expect(true).toBeFalsy("Service should not return an error");
//       }
//     );

//     tick(100);
//   }));

//   xit("newProject should handle response with image", fakeAsync(() => {}));
//   xit("newProject should handle response with all inputs", fakeAsync(() => {}));

//   it("newProject should handle error", fakeAsync(() => {
//     spyOn<any>(service, "new").and.callFake((path: string, values: any) => {
//       expect(path).toBe("/projects");
//       expect(values).toEqual({ name: "Name" });

//       const subject = new Subject<Project>();

//       setTimeout(() => {
//         subject.error({
//           status: 401,
//           message: "Unauthorized"
//         } as ApiErrorDetails);
//       }, 50);

//       return subject;
//     });

//     service.newProject({ name: "Name" }).subscribe(
//       () => {
//         expect(true).toBeFalsy("Service should not return data");
//       },
//       (err: ApiErrorDetails) => {
//         expect(err).toBeTruthy();
//         expect(err).toEqual({
//           status: 401,
//           message: "Unauthorized"
//         } as ApiErrorDetails);
//       }
//     );

//     tick(100);
//   }));

//   it("newProject should handle error with info", fakeAsync(() => {
//     spyOn<any>(service, "new").and.callFake((path: string, values: any) => {
//       expect(path).toBe("/projects");
//       expect(values).toEqual({ name: "Name" });

//       const subject = new Subject<Project>();

//       setTimeout(() => {
//         subject.error({
//           status: 422,
//           message: "Record could not be saved",
//           info: {
//             name: ["has already been taken"],
//             image: [],
//             image_file_name: [],
//             image_file_size: [],
//             image_content_type: [],
//             image_updated_at: []
//           }
//         } as ApiErrorDetails);
//       }, 50);

//       return subject;
//     });

//     service.newProject({ name: "Name" }).subscribe(
//       () => {
//         expect(true).toBeFalsy("Service should not return data");
//       },
//       (err: ApiErrorDetails) => {
//         expect(err).toBeTruthy();
//         expect(err).toEqual({
//           status: 422,
//           message: "Record could not be saved",
//           info: {
//             name: ["has already been taken"],
//             image: [],
//             image_file_name: [],
//             image_file_size: [],
//             image_content_type: [],
//             image_updated_at: []
//           }
//         } as ApiErrorDetails);
//       }
//     );

//     tick(100);
//   }));

//   /**
//    * updateProject
//    */

//   it("updateProject should handle response", fakeAsync(() => {
//     spyOn<any>(service, "update").and.callFake((path: string, values: any) => {
//       expect(path).toBe("/projects/1");
//       expect(values).toEqual({});

//       const subject = new Subject<Project>();

//       setTimeout(() => {
//         subject.next(
//           new Project({
//             id: 1,
//             name: "Name",
//             creatorId: 2,
//             siteIds: new Set([])
//           })
//         );
//         subject.complete();
//       }, 50);

//       return subject;
//     });

//     service.updateProject(1, {}).subscribe(
//       (project: Project) => {
//         expect(project).toBeTruthy();
//         expect(project).toEqual(
//           new Project({
//             id: 1,
//             name: "Name",
//             creatorId: 2,
//             siteIds: new Set([])
//           })
//         );
//       },
//       () => {
//         expect(true).toBeFalsy("Service should not return an error");
//       }
//     );

//     tick(100);
//   }));

//   it("updateProject should handle response with random id", fakeAsync(() => {
//     spyOn<any>(service, "update").and.callFake((path: string, values: any) => {
//       expect(path).toBe("/projects/5");
//       expect(values).toEqual({});
//       const subject = new Subject<Project>();

//       setTimeout(() => {
//         subject.next(
//           new Project({
//             id: 1,
//             name: "Name",
//             creatorId: 2,
//             siteIds: new Set([])
//           })
//         );
//         subject.complete();
//       }, 50);

//       return subject;
//     });

//     service.updateProject(5, {}).subscribe(
//       (project: Project) => {
//         expect(project).toBeTruthy();
//         expect(project).toEqual(
//           new Project({
//             id: 1,
//             name: "Name",
//             creatorId: 2,
//             siteIds: new Set([])
//           })
//         );
//       },
//       () => {
//         expect(true).toBeFalsy("Service should not return an error");
//       }
//     );

//     tick(100);
//   }));

//   it("updateProject should handle response with name", fakeAsync(() => {
//     spyOn<any>(service, "update").and.callFake((path: string, values: any) => {
//       expect(path).toBe("/projects/1");
//       expect(values).toEqual({ name: "Name" });

//       const subject = new Subject<Project>();

//       setTimeout(() => {
//         subject.next(
//           new Project({
//             id: 1,
//             name: "Name",
//             creatorId: 2,
//             siteIds: new Set([])
//           })
//         );
//         subject.complete();
//       }, 50);

//       return subject;
//     });

//     service.updateProject(1, { name: "Name" }).subscribe(
//       (project: Project) => {
//         expect(project).toBeTruthy();
//         expect(project).toEqual(
//           new Project({
//             id: 1,
//             name: "Name",
//             creatorId: 2,
//             siteIds: new Set([])
//           })
//         );
//       },
//       () => {
//         expect(true).toBeFalsy("Service should not return an error");
//       }
//     );

//     tick(100);
//   }));

//   it("updateProject should handle response with description", fakeAsync(() => {
//     spyOn<any>(service, "update").and.callFake((path: string, values: any) => {
//       expect(path).toBe("/projects/1");
//       expect(values).toEqual({ description: "Description" });

//       const subject = new Subject<Project>();

//       setTimeout(() => {
//         subject.next(
//           new Project({
//             id: 1,
//             name: "Name",
//             description: "Description",
//             creatorId: 2,
//             siteIds: new Set([])
//           })
//         );
//         subject.complete();
//       }, 50);

//       return subject;
//     });

//     service.updateProject(1, { description: "Description" }).subscribe(
//       (project: Project) => {
//         expect(project).toBeTruthy();
//         expect(project).toEqual(
//           new Project({
//             id: 1,
//             name: "Name",
//             description: "Description",
//             creatorId: 2,
//             siteIds: new Set([])
//           })
//         );
//       },
//       () => {
//         expect(true).toBeFalsy("Service should not return an error");
//       }
//     );

//     tick(100);
//   }));

//   xit("updateProject should handle response with image", fakeAsync(() => {}));
//   xit("updateProject should handle response with all inputs", fakeAsync(() => {}));

//   it("updateProject should handle error", fakeAsync(() => {
//     spyOn<any>(service, "update").and.callFake((path: string, values: any) => {
//       expect(path).toBe("/projects/1");
//       expect(values).toEqual({});

//       const subject = new Subject<Project>();

//       setTimeout(() => {
//         subject.error({
//           status: 401,
//           message: "Unauthorized"
//         } as ApiErrorDetails);
//       }, 50);

//       return subject;
//     });

//     service.updateProject(1, {}).subscribe(
//       () => {
//         expect(true).toBeFalsy("Service should not return data");
//       },
//       (err: ApiErrorDetails) => {
//         expect(err).toBeTruthy();
//         expect(err).toEqual({
//           status: 401,
//           message: "Unauthorized"
//         } as ApiErrorDetails);
//       }
//     );

//     tick(100);
//   }));

//   it("updateProject should handle error with info", fakeAsync(() => {
//     spyOn<any>(service, "update").and.callFake((path: string, values: any) => {
//       expect(path).toBe("/projects/1");
//       expect(values).toEqual({});

//       const subject = new Subject<Project>();

//       setTimeout(() => {
//         subject.error({
//           status: 422,
//           message: "Record could not be saved",
//           info: {
//             name: ["has already been taken"],
//             image: [],
//             image_file_name: [],
//             image_file_size: [],
//             image_content_type: [],
//             image_updated_at: []
//           }
//         } as ApiErrorDetails);
//       }, 50);

//       return subject;
//     });

//     service.updateProject(1, {}).subscribe(
//       () => {
//         expect(true).toBeFalsy("Service should not return data");
//       },
//       (err: ApiErrorDetails) => {
//         expect(err).toBeTruthy();
//         expect(err).toEqual({
//           status: 422,
//           message: "Record could not be saved",
//           info: {
//             name: ["has already been taken"],
//             image: [],
//             image_file_name: [],
//             image_file_size: [],
//             image_content_type: [],
//             image_updated_at: []
//           }
//         } as ApiErrorDetails);
//       }
//     );

//     tick(100);
//   }));

//   /**
//    * deleteProject
//    */

//   it("deleteProject should handle response", fakeAsync(() => {
//     spyOn<any>(service, "delete").and.callFake((path: string) => {
//       expect(path).toBe("/projects/1");

//       const subject = new Subject<boolean>();

//       setTimeout(() => {
//         subject.next(true);
//         subject.complete();
//       }, 50);

//       return subject;
//     });

//     service.deleteProject(1).subscribe(
//       (success: boolean) => {
//         expect(success).toBeTruthy();
//         expect(success).toBeTrue();
//       },
//       () => {
//         expect(true).toBeFalsy("Service should not return an error");
//       }
//     );

//     tick(100);
//   }));

//   it("deleteProject should handle response with random id", fakeAsync(() => {
//     spyOn<any>(service, "delete").and.callFake((path: string) => {
//       expect(path).toBe("/projects/5");
//       const subject = new Subject<boolean>();

//       setTimeout(() => {
//         subject.next(true);
//         subject.complete();
//       }, 50);

//       return subject;
//     });

//     service.deleteProject(5).subscribe(
//       (success: boolean) => {
//         expect(success).toBeTruthy();
//         expect(success).toBeTrue();
//       },
//       () => {
//         expect(true).toBeFalsy("Service should not return an error");
//       }
//     );

//     tick(100);
//   }));

//   it("deleteProject should handle error", fakeAsync(() => {
//     spyOn<any>(service, "delete").and.callFake((path: string) => {
//       expect(path).toBe("/projects/1");

//       const subject = new Subject<boolean>();

//       setTimeout(() => {
//         subject.error({
//           status: 401,
//           message: "Unauthorized"
//         } as ApiErrorDetails);
//       }, 50);

//       return subject;
//     });

//     service.deleteProject(1).subscribe(
//       () => {
//         expect(true).toBeFalsy("Service should not return data");
//       },
//       (err: ApiErrorDetails) => {
//         expect(err).toBeTruthy();
//         expect(err).toEqual({
//           status: 401,
//           message: "Unauthorized"
//         } as ApiErrorDetails);
//       }
//     );

//     tick(100);
//   }));

//   it("deleteProject should handle error with info", fakeAsync(() => {
//     spyOn<any>(service, "delete").and.callFake((path: string) => {
//       expect(path).toBe("/projects/1");

//       const subject = new Subject<boolean>();

//       setTimeout(() => {
//         subject.error({
//           status: 422,
//           message: "Record could not be saved",
//           info: {
//             name: ["has already been taken"],
//             image: [],
//             image_file_name: [],
//             image_file_size: [],
//             image_content_type: [],
//             image_updated_at: []
//           }
//         } as ApiErrorDetails);
//       }, 50);

//       return subject;
//     });

//     service.deleteProject(1).subscribe(
//       () => {
//         expect(true).toBeFalsy("Service should not return data");
//       },
//       (err: ApiErrorDetails) => {
//         expect(err).toBeTruthy();
//         expect(err).toEqual({
//           status: 422,
//           message: "Record could not be saved",
//           info: {
//             name: ["has already been taken"],
//             image: [],
//             image_file_name: [],
//             image_file_size: [],
//             image_content_type: [],
//             image_updated_at: []
//           }
//         } as ApiErrorDetails);
//       }
//     );

//     tick(100);
//   }));
// });

import {
  HttpClientTestingModule,
  HttpTestingController
} from "@angular/common/http/testing";
import { fakeAsync, TestBed, tick } from "@angular/core/testing";
import { Subject } from "rxjs";
import { testAppInitializer } from "src/app/app.helper";
import { Project, ProjectInterface } from "src/app/models/Project";
import { ApiCommon, Args } from "./api-common";
import { APIErrorDetails } from "./api.interceptor";
import { BawApiService, Filters } from "./base-api.service";
import { MockApiCommon } from "./mock/api-commonMock";
import { MockBawApiService } from "./mock/baseApiMockService";
import { ProjectsService } from "./projects.service";

describe("ProjectsService", () => {
  let service: ProjectsService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        ...testAppInitializer,
        { provide: BawApiService, useClass: MockBawApiService },
        { provide: ApiCommon, useClass: MockApiCommon }
      ]
    });

    service = TestBed.get(ProjectsService);
    httpMock = TestBed.get(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });

  it("classBuilder should create project", () => {
    const project: ProjectInterface = {
      id: 1,
      name: "Project",
      imageUrl: "/assets/images/project/project_span4.png",
      siteIds: new Set([]),
      creatorId: 1
    };

    expect(service["classBuilder"](project)).toEqual(new Project(project));
  });

  /**
   * getProjects
   */

  it("getProjects should handle empty response", fakeAsync(() => {
    spyOn<any>(service, "list").and.callFake(
      (path: string, filters: Filters, ...args: Args) => {
        expect(path).toBe("/projects");
        expect(filters).toBeFalsy();
        expect(args).toEqual([]);
        const subject = new Subject<Project[]>();

        setTimeout(() => {
          subject.next([]);
          subject.complete();
        }, 50);

        return subject;
      }
    );

    service.getProjects().subscribe(
      (projects: Project[]) => {
        expect(projects).toBeTruthy();
        expect(projects).toEqual([]);
      },
      () => {
        expect(true).toBeFalsy("Service should not return an error");
      }
    );

    tick(100);
  }));

  it("getProjects should handle single project", fakeAsync(() => {
    spyOn<any>(service, "list").and.callFake(
      (path: string, filters: Filters, ...args: Args) => {
        expect(path).toBe("/projects");
        expect(filters).toBeFalsy();
        expect(args).toEqual([]);
        const subject = new Subject<Project[]>();

        setTimeout(() => {
          subject.next([
            new Project({
              id: 1,
              name: "Name",
              creatorId: 2,
              siteIds: new Set([1, 2, 3])
            })
          ]);
          subject.complete();
        }, 50);

        return subject;
      }
    );

    service.getProjects().subscribe(
      (projects: Project[]) => {
        expect(projects).toBeTruthy();
        expect(projects).toEqual([
          new Project({
            id: 1,
            name: "Name",
            creatorId: 2,
            siteIds: new Set([1, 2, 3])
          })
        ]);
      },
      () => {
        expect(true).toBeFalsy("Service should not return an error");
      }
    );

    tick(100);
  }));

  it("getProjects should handle multiple projects", fakeAsync(() => {
    spyOn<any>(service, "list").and.callFake(
      (path: string, filters: Filters, ...args: Args) => {
        expect(path).toBe("/projects");
        expect(filters).toBeFalsy();
        expect(args).toEqual([]);
        const subject = new Subject<Project[]>();

        setTimeout(() => {
          subject.next([
            new Project({
              id: 1,
              name: "Name",
              creatorId: 2,
              siteIds: new Set([1, 2, 3])
            }),
            new Project({
              id: 5,
              name: "Name",
              creatorId: 10,
              siteIds: new Set([10, 20, 30])
            })
          ]);
          subject.complete();
        }, 50);

        return subject;
      }
    );

    service.getProjects().subscribe(
      (projects: Project[]) => {
        expect(projects).toBeTruthy();
        expect(projects).toEqual([
          new Project({
            id: 1,
            name: "Name",
            creatorId: 2,
            siteIds: new Set([1, 2, 3])
          }),
          new Project({
            id: 5,
            name: "Name",
            creatorId: 10,
            siteIds: new Set([10, 20, 30])
          })
        ]);
      },
      () => {
        expect(true).toBeFalsy("Service should not return an error");
      }
    );

    tick(100);
  }));

  it("getProjects should handle single project with empty filter", fakeAsync(() => {
    spyOn<any>(service, "list").and.callFake(
      (path: string, filters: Filters, ...args: Args) => {
        expect(path).toBe("/projects");
        expect(filters).toEqual({});
        expect(args).toEqual([]);
        const subject = new Subject<Project[]>();

        setTimeout(() => {
          subject.next([
            new Project({
              id: 1,
              name: "Name",
              creatorId: 2,
              siteIds: new Set([1, 2, 3])
            })
          ]);
          subject.complete();
        }, 50);

        return subject;
      }
    );

    service.getProjects({}).subscribe(
      (projects: Project[]) => {
        expect(projects).toBeTruthy();
        expect(projects).toEqual([
          new Project({
            id: 1,
            name: "Name",
            creatorId: 2,
            siteIds: new Set([1, 2, 3])
          })
        ]);
      },
      () => {
        expect(true).toBeFalsy("Service should not return an error");
      }
    );

    tick(100);
  }));

  it("getProjects should handle single project with filter", fakeAsync(() => {
    spyOn<any>(service, "list").and.callFake(
      (path: string, filters: Filters, ...args: Args) => {
        expect(path).toBe("/projects");
        expect(filters).toEqual({ paging: { items: 3 } });
        expect(args).toEqual([]);
        const subject = new Subject<Project[]>();

        setTimeout(() => {
          subject.next([
            new Project({
              id: 1,
              name: "Name",
              creatorId: 2,
              siteIds: new Set([1, 2, 3])
            })
          ]);
          subject.complete();
        }, 50);

        return subject;
      }
    );

    service.getProjects({ paging: { items: 3 } }).subscribe(
      (projects: Project[]) => {
        expect(projects).toBeTruthy();
        expect(projects).toEqual([
          new Project({
            id: 1,
            name: "Name",
            creatorId: 2,
            siteIds: new Set([1, 2, 3])
          })
        ]);
      },
      () => {
        expect(true).toBeFalsy("Service should not return an error");
      }
    );

    tick(100);
  }));

  it("getProjects should handle error", fakeAsync(() => {
    spyOn<any>(service, "list").and.callFake(
      (path: string, filters: Filters, ...args: Args) => {
        expect(path).toBe("/projects");
        expect(filters).toBeFalsy();
        expect(args).toEqual([]);
        const subject = new Subject<Project[]>();

        setTimeout(() => {
          subject.error({
            status: 401,
            message: "Unauthorized"
          } as APIErrorDetails);
        }, 50);

        return subject;
      }
    );

    service.getProjects().subscribe(
      () => {
        expect(true).toBeFalsy("Service should not return data");
      },
      (err: APIErrorDetails) => {
        expect(err).toBeTruthy();
        expect(err).toEqual({
          status: 401,
          message: "Unauthorized"
        } as APIErrorDetails);
      }
    );

    tick(100);
  }));

  it("getProjects should handle error with info", fakeAsync(() => {
    spyOn<any>(service, "list").and.callFake(
      (path: string, filters: Filters, ...args: Args) => {
        expect(path).toBe("/projects");
        expect(filters).toBeFalsy();
        expect(args).toEqual([]);
        const subject = new Subject<Project[]>();

        setTimeout(() => {
          subject.error({
            status: 422,
            message: "Record could not be saved",
            info: {
              name: ["has already been taken"],
              image: [],
              image_file_name: [],
              image_file_size: [],
              image_content_type: [],
              image_updated_at: []
            }
          } as APIErrorDetails);
        }, 50);

        return subject;
      }
    );

    service.getProjects().subscribe(
      () => {
        expect(true).toBeFalsy("Service should not return data");
      },
      (err: APIErrorDetails) => {
        expect(err).toBeTruthy();
        expect(err).toEqual({
          status: 422,
          message: "Record could not be saved",
          info: {
            name: ["has already been taken"],
            image: [],
            image_file_name: [],
            image_file_size: [],
            image_content_type: [],
            image_updated_at: []
          }
        } as APIErrorDetails);
      }
    );

    tick(100);
  }));

  /**
   * getProject
   */

  it("getProject should handle response", fakeAsync(() => {
    spyOn<any>(service, "show").and.callFake(
      (path: string, filters: Filters, ...args: Args) => {
        expect(path).toBe("/projects/:projectId");
        expect(filters).toBeFalsy();
        expect(args).toEqual([1]);
        const subject = new Subject<Project>();

        setTimeout(() => {
          subject.next(
            new Project({
              id: 1,
              name: "Name",
              creatorId: 2,
              siteIds: new Set([1, 2, 3])
            })
          );
          subject.complete();
        }, 50);

        return subject;
      }
    );

    service.getProject(1).subscribe(
      (project: Project) => {
        expect(project).toBeTruthy();
        expect(project).toEqual(
          new Project({
            id: 1,
            name: "Name",
            creatorId: 2,
            siteIds: new Set([1, 2, 3])
          })
        );
      },
      () => {
        expect(true).toBeFalsy("Service should not return an error");
      }
    );

    tick(100);
  }));

  it("getProject should handle response with random id", fakeAsync(() => {
    spyOn<any>(service, "show").and.callFake(
      (path: string, filters: Filters, ...args: Args) => {
        expect(path).toBe("/projects/:projectId");
        expect(filters).toBeFalsy();
        expect(args).toEqual([5]);
        const subject = new Subject<Project>();

        setTimeout(() => {
          subject.next(
            new Project({
              id: 1,
              name: "Name",
              creatorId: 2,
              siteIds: new Set([1, 2, 3])
            })
          );
          subject.complete();
        }, 50);

        return subject;
      }
    );

    service.getProject(5).subscribe(
      (project: Project) => {
        expect(project).toBeTruthy();
        expect(project).toEqual(
          new Project({
            id: 1,
            name: "Name",
            creatorId: 2,
            siteIds: new Set([1, 2, 3])
          })
        );
      },
      () => {
        expect(true).toBeFalsy("Service should not return an error");
      }
    );

    tick(100);
  }));

  it("getProject should handle response with empty filter", fakeAsync(() => {
    spyOn<any>(service, "show").and.callFake(
      (path: string, filters: Filters, ...args: Args) => {
        expect(path).toBe("/projects/:projectId");
        expect(filters).toEqual({});
        expect(args).toEqual([1]);
        const subject = new Subject<Project>();

        setTimeout(() => {
          subject.next(
            new Project({
              id: 1,
              name: "Name",
              creatorId: 2,
              siteIds: new Set([1, 2, 3])
            })
          );
          subject.complete();
        }, 50);

        return subject;
      }
    );

    service.getProject(1, {}).subscribe(
      (project: Project) => {
        expect(project).toBeTruthy();
        expect(project).toEqual(
          new Project({
            id: 1,
            name: "Name",
            creatorId: 2,
            siteIds: new Set([1, 2, 3])
          })
        );
      },
      () => {
        expect(true).toBeFalsy("Service should not return an error");
      }
    );

    tick(100);
  }));

  it("getProject should handle response with filter", fakeAsync(() => {
    spyOn<any>(service, "show").and.callFake(
      (path: string, filters: Filters, ...args: Args) => {
        expect(path).toBe("/projects/:projectId");
        expect(filters).toEqual({ paging: { items: 3 } });
        expect(args).toEqual([1]);
        const subject = new Subject<Project>();

        setTimeout(() => {
          subject.next(
            new Project({
              id: 1,
              name: "Name",
              creatorId: 2,
              siteIds: new Set([1, 2, 3])
            })
          );
          subject.complete();
        }, 50);

        return subject;
      }
    );

    service.getProject(1, { paging: { items: 3 } }).subscribe(
      (project: Project) => {
        expect(project).toBeTruthy();
        expect(project).toEqual(
          new Project({
            id: 1,
            name: "Name",
            creatorId: 2,
            siteIds: new Set([1, 2, 3])
          })
        );
      },
      () => {
        expect(true).toBeFalsy("Service should not return an error");
      }
    );

    tick(100);
  }));

  it("getProject should handle error", fakeAsync(() => {
    spyOn<any>(service, "show").and.callFake(
      (path: string, filters: Filters, ...args: Args) => {
        expect(path).toBe("/projects/:projectId");
        expect(filters).toBeFalsy();
        expect(args).toEqual([1]);
        const subject = new Subject<Project>();

        setTimeout(() => {
          subject.error({
            status: 401,
            message: "Unauthorized"
          } as APIErrorDetails);
        }, 50);

        return subject;
      }
    );

    service.getProject(1).subscribe(
      () => {
        expect(true).toBeFalsy("Service should not return data");
      },
      (err: APIErrorDetails) => {
        expect(err).toBeTruthy();
        expect(err).toEqual({
          status: 401,
          message: "Unauthorized"
        } as APIErrorDetails);
      }
    );

    tick(100);
  }));

  it("getProject should handle error with info", fakeAsync(() => {
    spyOn<any>(service, "show").and.callFake(
      (path: string, filters: Filters, ...args: Args) => {
        expect(path).toBe("/projects/:projectId");
        expect(filters).toBeFalsy();
        expect(args).toEqual([1]);
        const subject = new Subject<Project>();

        setTimeout(() => {
          subject.error({
            status: 422,
            message: "Record could not be saved",
            info: {
              name: ["has already been taken"],
              image: [],
              image_file_name: [],
              image_file_size: [],
              image_content_type: [],
              image_updated_at: []
            }
          } as APIErrorDetails);
        }, 50);

        return subject;
      }
    );

    service.getProject(1).subscribe(
      () => {
        expect(true).toBeFalsy("Service should not return data");
      },
      (err: APIErrorDetails) => {
        expect(err).toBeTruthy();
        expect(err).toEqual({
          status: 422,
          message: "Record could not be saved",
          info: {
            name: ["has already been taken"],
            image: [],
            image_file_name: [],
            image_file_size: [],
            image_content_type: [],
            image_updated_at: []
          }
        } as APIErrorDetails);
      }
    );

    tick(100);
  }));

  /**
   * newProject
   */

  it("newProject should handle response", fakeAsync(() => {
    spyOn<any>(service, "new").and.callFake(
      (path: string, values: any, ...args: Args) => {
        expect(path).toBe("/projects");
        expect(values).toEqual({ name: "Name" });
        expect(args).toEqual([]);
        const subject = new Subject<Project>();

        setTimeout(() => {
          subject.next(
            new Project({
              id: 1,
              name: "Name",
              creatorId: 2,
              siteIds: new Set([])
            })
          );
          subject.complete();
        }, 50);

        return subject;
      }
    );

    service.newProject({ name: "Name" }).subscribe(
      (project: Project) => {
        expect(project).toBeTruthy();
        expect(project).toEqual(
          new Project({
            id: 1,
            name: "Name",
            creatorId: 2,
            siteIds: new Set([])
          })
        );
      },
      () => {
        expect(true).toBeFalsy("Service should not return an error");
      }
    );

    tick(100);
  }));

  it("newProject should handle response with description", fakeAsync(() => {
    spyOn<any>(service, "new").and.callFake(
      (path: string, values: any, ...args: Args) => {
        expect(path).toBe("/projects");
        expect(values).toEqual({ name: "Name", description: "Description" });
        expect(args).toEqual([]);
        const subject = new Subject<Project>();

        setTimeout(() => {
          subject.next(
            new Project({
              id: 1,
              name: "Name",
              creatorId: 2,
              siteIds: new Set([])
            })
          );
          subject.complete();
        }, 50);

        return subject;
      }
    );

    service.newProject({ name: "Name", description: "Description" }).subscribe(
      (project: Project) => {
        expect(project).toBeTruthy();
        expect(project).toEqual(
          new Project({
            id: 1,
            name: "Name",
            creatorId: 2,
            siteIds: new Set([])
          })
        );
      },
      () => {
        expect(true).toBeFalsy("Service should not return an error");
      }
    );

    tick(100);
  }));

  xit("newProject should handle response with image", fakeAsync(() => {}));
  xit("newProject should handle response with all inputs", fakeAsync(() => {}));

  it("newProject should handle error", fakeAsync(() => {
    spyOn<any>(service, "new").and.callFake(
      (path: string, values: any, ...args: Args) => {
        expect(path).toBe("/projects");
        expect(values).toEqual({ name: "Name" });
        expect(args).toEqual([]);
        const subject = new Subject<Project>();

        setTimeout(() => {
          subject.error({
            status: 401,
            message: "Unauthorized"
          } as APIErrorDetails);
        }, 50);

        return subject;
      }
    );

    service.newProject({ name: "Name" }).subscribe(
      () => {
        expect(true).toBeFalsy("Service should not return data");
      },
      (err: APIErrorDetails) => {
        expect(err).toBeTruthy();
        expect(err).toEqual({
          status: 401,
          message: "Unauthorized"
        } as APIErrorDetails);
      }
    );

    tick(100);
  }));

  it("newProject should handle error with info", fakeAsync(() => {
    spyOn<any>(service, "new").and.callFake(
      (path: string, values: any, ...args: Args) => {
        expect(path).toBe("/projects");
        expect(values).toEqual({ name: "Name" });
        expect(args).toEqual([]);
        const subject = new Subject<Project>();

        setTimeout(() => {
          subject.error({
            status: 422,
            message: "Record could not be saved",
            info: {
              name: ["has already been taken"],
              image: [],
              image_file_name: [],
              image_file_size: [],
              image_content_type: [],
              image_updated_at: []
            }
          } as APIErrorDetails);
        }, 50);

        return subject;
      }
    );

    service.newProject({ name: "Name" }).subscribe(
      () => {
        expect(true).toBeFalsy("Service should not return data");
      },
      (err: APIErrorDetails) => {
        expect(err).toBeTruthy();
        expect(err).toEqual({
          status: 422,
          message: "Record could not be saved",
          info: {
            name: ["has already been taken"],
            image: [],
            image_file_name: [],
            image_file_size: [],
            image_content_type: [],
            image_updated_at: []
          }
        } as APIErrorDetails);
      }
    );

    tick(100);
  }));

  /**
   * updateProject
   */

  it("updateProject should handle response", fakeAsync(() => {
    spyOn<any>(service, "update").and.callFake(
      (path: string, values: any, ...args: Args) => {
        expect(path).toBe("/projects/:projectId");
        expect(values).toEqual({});
        expect(args).toEqual([1]);
        const subject = new Subject<Project>();

        setTimeout(() => {
          subject.next(
            new Project({
              id: 1,
              name: "Name",
              creatorId: 2,
              siteIds: new Set([])
            })
          );
          subject.complete();
        }, 50);

        return subject;
      }
    );

    service.updateProject(1, {}).subscribe(
      (project: Project) => {
        expect(project).toBeTruthy();
        expect(project).toEqual(
          new Project({
            id: 1,
            name: "Name",
            creatorId: 2,
            siteIds: new Set([])
          })
        );
      },
      () => {
        expect(true).toBeFalsy("Service should not return an error");
      }
    );

    tick(100);
  }));

  it("updateProject should handle response with random id", fakeAsync(() => {
    spyOn<any>(service, "update").and.callFake(
      (path: string, values: any, ...args: Args) => {
        expect(path).toBe("/projects/:projectId");
        expect(values).toEqual({});
        expect(args).toEqual([5]);
        const subject = new Subject<Project>();

        setTimeout(() => {
          subject.next(
            new Project({
              id: 1,
              name: "Name",
              creatorId: 2,
              siteIds: new Set([])
            })
          );
          subject.complete();
        }, 50);

        return subject;
      }
    );

    service.updateProject(5, {}).subscribe(
      (project: Project) => {
        expect(project).toBeTruthy();
        expect(project).toEqual(
          new Project({
            id: 1,
            name: "Name",
            creatorId: 2,
            siteIds: new Set([])
          })
        );
      },
      () => {
        expect(true).toBeFalsy("Service should not return an error");
      }
    );

    tick(100);
  }));

  it("updateProject should handle response with name", fakeAsync(() => {
    spyOn<any>(service, "update").and.callFake(
      (path: string, values: any, ...args: Args) => {
        expect(path).toBe("/projects/:projectId");
        expect(values).toEqual({ name: "Name" });
        expect(args).toEqual([1]);
        const subject = new Subject<Project>();

        setTimeout(() => {
          subject.next(
            new Project({
              id: 1,
              name: "Name",
              creatorId: 2,
              siteIds: new Set([])
            })
          );
          subject.complete();
        }, 50);

        return subject;
      }
    );

    service.updateProject(1, { name: "Name" }).subscribe(
      (project: Project) => {
        expect(project).toBeTruthy();
        expect(project).toEqual(
          new Project({
            id: 1,
            name: "Name",
            creatorId: 2,
            siteIds: new Set([])
          })
        );
      },
      () => {
        expect(true).toBeFalsy("Service should not return an error");
      }
    );

    tick(100);
  }));

  it("updateProject should handle response with description", fakeAsync(() => {
    spyOn<any>(service, "update").and.callFake(
      (path: string, values: any, ...args: Args) => {
        expect(path).toBe("/projects/:projectId");
        expect(values).toEqual({ description: "Description" });
        expect(args).toEqual([1]);
        const subject = new Subject<Project>();

        setTimeout(() => {
          subject.next(
            new Project({
              id: 1,
              name: "Name",
              description: "Description",
              creatorId: 2,
              siteIds: new Set([])
            })
          );
          subject.complete();
        }, 50);

        return subject;
      }
    );

    service.updateProject(1, { description: "Description" }).subscribe(
      (project: Project) => {
        expect(project).toBeTruthy();
        expect(project).toEqual(
          new Project({
            id: 1,
            name: "Name",
            description: "Description",
            creatorId: 2,
            siteIds: new Set([])
          })
        );
      },
      () => {
        expect(true).toBeFalsy("Service should not return an error");
      }
    );

    tick(100);
  }));

  xit("updateProject should handle response with image", fakeAsync(() => {}));
  xit("updateProject should handle response with all inputs", fakeAsync(() => {}));

  it("updateProject should handle error", fakeAsync(() => {
    spyOn<any>(service, "update").and.callFake(
      (path: string, values: any, ...args: Args) => {
        expect(path).toBe("/projects/:projectId");
        expect(values).toEqual({});
        expect(args).toEqual([1]);
        const subject = new Subject<Project>();

        setTimeout(() => {
          subject.error({
            status: 401,
            message: "Unauthorized"
          } as APIErrorDetails);
        }, 50);

        return subject;
      }
    );

    service.updateProject(1, {}).subscribe(
      () => {
        expect(true).toBeFalsy("Service should not return data");
      },
      (err: APIErrorDetails) => {
        expect(err).toBeTruthy();
        expect(err).toEqual({
          status: 401,
          message: "Unauthorized"
        } as APIErrorDetails);
      }
    );

    tick(100);
  }));

  it("updateProject should handle error with info", fakeAsync(() => {
    spyOn<any>(service, "update").and.callFake(
      (path: string, values: any, ...args: Args) => {
        expect(path).toBe("/projects/:projectId");
        expect(values).toEqual({});
        expect(args).toEqual([1]);
        const subject = new Subject<Project>();

        setTimeout(() => {
          subject.error({
            status: 422,
            message: "Record could not be saved",
            info: {
              name: ["has already been taken"],
              image: [],
              image_file_name: [],
              image_file_size: [],
              image_content_type: [],
              image_updated_at: []
            }
          } as APIErrorDetails);
        }, 50);

        return subject;
      }
    );

    service.updateProject(1, {}).subscribe(
      () => {
        expect(true).toBeFalsy("Service should not return data");
      },
      (err: APIErrorDetails) => {
        expect(err).toBeTruthy();
        expect(err).toEqual({
          status: 422,
          message: "Record could not be saved",
          info: {
            name: ["has already been taken"],
            image: [],
            image_file_name: [],
            image_file_size: [],
            image_content_type: [],
            image_updated_at: []
          }
        } as APIErrorDetails);
      }
    );

    tick(100);
  }));
});

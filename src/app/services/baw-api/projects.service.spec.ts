import { HTTP_INTERCEPTORS } from "@angular/common/http";
import {
  HttpClientTestingModule,
  HttpTestingController
} from "@angular/common/http/testing";
import { TestBed } from "@angular/core/testing";
import { testAppInitializer } from "src/app/app.helper";
import { Project } from "src/app/models/Project";
import { AppConfigService } from "../app-config/app-config.service";
import { APIErrorDetails, BawApiInterceptor } from "./api.interceptor";
import { mockSessionStorage } from "./mock/sessionStorageMock";
import { ProjectsService } from "./projects.service";
import { SecurityService } from "./security.service";

describe("ProjectsService", () => {
  let service: ProjectsService;
  let config: AppConfigService;
  let securityService: SecurityService;
  let httpMock: HttpTestingController;

  const pageNotFoundResponse = {
    meta: {
      status: 404,
      message: "Not Found",
      error: {
        details: "Could not find the requested page.",
        info: {
          original_route: "dsfaggsdfg",
          original_http_method: "GET"
        }
      }
    },
    data: null
  };

  const itemNotFoundResponse = {
    meta: {
      status: 404,
      message: "Not Found",
      error: {
        details: "Could not find the requested item.",
        info: null
      }
    },
    data: null
  };

  const projectValidResponse = {
    meta: {
      status: 200,
      message: "OK",
      sorting: {
        order_by: "creator_id",
        direction: "asc"
      },
      paging: {
        page: 1,
        items: 25,
        total: 1,
        max_page: 1,
        current:
          "<BROKEN LINK>/projects?direction=asc&items=3&order_by=name&page=1",
        previous: null,
        next: null
      }
    },
    data: {
      id: 512,
      name: "512 Name",
      description: "512 Description.",
      creator_id: 138,
      site_ids: new Set([513, 514, 519]),
      description_html: "<p>512 Description.</p>\n"
    }
  };

  const projectValidConvertedResponse = new Project({
    id: 512,
    name: "512 Name",
    description: "512 Description.",
    creatorId: 138,
    siteIds: new Set([513, 514, 519])
  });

  const projectUnauthorizedResponse = {
    meta: {
      status: 401,
      message: "Unauthorized",
      error: {
        details: "You need to log in or register before continuing.",
        links: {
          "Log in": "/my_account/sign_in",
          Register: "/my_account/sign_up",
          "Confirm account": "/my_account/confirmation/new"
        },
        info: null
      }
    },
    data: null
  };

  const projectsValidResponse = {
    meta: {
      status: 200,
      message: "OK",
      sorting: {
        order_by: "creator_id",
        direction: "asc"
      },
      paging: {
        page: 1,
        items: 25,
        total: 1,
        max_page: 1,
        current:
          "<BROKEN LINK>/projects?direction=asc&items=3&order_by=name&page=1",
        previous: null,
        next: null
      }
    },
    data: [
      {
        id: 512,
        name: "512 Name",
        description: "512 Description.",
        creator_id: 138,
        site_ids: new Set([513, 514, 519]),
        description_html: "<p>512 Description.</p>\n"
      },
      {
        id: 513,
        name: "513 Name",
        description: "513 Description.",
        creator_id: 138,
        site_ids: new Set([513, 514, 519]),
        description_html: "<p>513 Description.</p>\n"
      }
    ]
  };

  const projectsValidConvertedResponse = [
    new Project({
      id: 512,
      name: "512 Name",
      description: "512 Description.",
      creatorId: 138,
      siteIds: new Set([513, 514, 519])
    }),
    new Project({
      id: 513,
      name: "513 Name",
      description: "513 Description.",
      creatorId: 138,
      siteIds: new Set([513, 514, 519])
    })
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        ...testAppInitializer,
        BawApiInterceptor,
        {
          provide: HTTP_INTERCEPTORS,
          useClass: BawApiInterceptor,
          multi: true
        },
        ProjectsService,
        SecurityService
      ]
    });

    Object.defineProperty(window, "sessionStorage", {
      value: mockSessionStorage
    });

    service = TestBed.get(ProjectsService);
    config = TestBed.get(AppConfigService);
    securityService = TestBed.get(SecurityService);
    httpMock = TestBed.get(HttpTestingController);
  });

  afterEach(() => {
    sessionStorage.clear();
    httpMock.verify();
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });

  it("getProjects should return data", () => {
    // tslint:disable-next-line: rxjs-no-ignored-error
    service.getProjects().subscribe(res => {
      expect(res).toEqual(projectsValidConvertedResponse);
    });

    const req = httpMock.expectOne(
      config.getConfig().environment.apiRoot + "/projects"
    );
    req.flush(projectsValidResponse);
  });

  it("getProject should return data", () => {
    // tslint:disable-next-line: rxjs-no-ignored-error
    service.getProject(512).subscribe(res => {
      expect(res).toEqual(projectValidConvertedResponse);
    });

    const req = httpMock.expectOne(
      config.getConfig().environment.apiRoot + "/projects/512"
    );
    req.flush(projectValidResponse);
  });

  it("getProject invalid project should return error", done => {
    service.getProject(-1).subscribe(
      () => {
        expect(false).toBeTruthy(
          "getProject should not return result on error"
        );
        done();
      },
      (err: APIErrorDetails) => {
        expect(err).toBeTruthy();
        expect(err).toEqual({
          status: 404,
          message: "Could not find the requested item."
        });
        done();
      },
      () => {
        done();
      }
    );

    const req = httpMock.expectOne(
      config.getConfig().environment.apiRoot + "/projects/-1"
    );
    req.flush(itemNotFoundResponse, { status: 404, statusText: "Not Found" });
  });

  it("getProject invalid page should return error", done => {
    service.getProject(-1).subscribe(
      () => {
        expect(false).toBeTruthy(
          "getProject should not return result on error"
        );
        done();
      },
      (err: APIErrorDetails) => {
        expect(err).toBeTruthy();
        expect(err).toEqual({
          status: 404,
          message: "Could not find the requested page.",
          info: { original_route: "dsfaggsdfg", original_http_method: "GET" }
        });
        done();
      },
      () => {
        done();
      }
    );

    const req = httpMock.expectOne(
      config.getConfig().environment.apiRoot + "/projects/-1"
    );
    req.flush(pageNotFoundResponse, { status: 404, statusText: "Not Found" });
  });

  it("getProject unauthorized should return error", done => {
    service.getProject(-1).subscribe(
      () => {
        expect(false).toBeTruthy(
          "getProject should not return result on error"
        );
        done();
      },
      (err: APIErrorDetails) => {
        expect(err).toBeTruthy();
        expect(err).toEqual({
          status: 401,
          message: "You need to log in or register before continuing."
        });
        done();
      },
      () => {
        done();
      }
    );

    const req = httpMock.expectOne(
      config.getConfig().environment.apiRoot + "/projects/-1"
    );
    req.flush(projectUnauthorizedResponse, {
      status: 401,
      statusText: "Unauthorized"
    });
  });

  it("getFilteredProjects should get filtered number of items", done => {
    const dummyApiResponse = {
      meta: {
        status: 200,
        message: "OK",
        sorting: {
          order_by: "name",
          direction: "asc"
        },
        paging: {
          page: 1,
          items: 3,
          total: 1,
          max_page: 1,
          current:
            "<BROKEN LINK>/projects?direction=asc&items=3&order_by=name&page=1",
          previous: null,
          next: null
        }
      },
      data: [
        {
          id: 512,
          name: "512 Name",
          description: "512 Description.",
          creator_id: 138,
          site_ids: new Set([513, 514, 519]),
          description_html: "<p>512 Description.</p>\n"
        },
        {
          id: 513,
          name: "513 Name",
          description: "513 Description.",
          creator_id: 138,
          site_ids: new Set([513, 514, 519]),
          description_html: "<p>513 Description.</p>\n"
        },
        {
          id: 514,
          name: "514 Name",
          description: "514 Description.",
          creator_id: 138,
          site_ids: new Set([513, 514, 519]),
          description_html: "<p>514 Description.</p>\n"
        }
      ]
    };

    const dummyApiConvertedResponse = [
      new Project({
        id: 512,
        name: "512 Name",
        description: "512 Description.",
        creatorId: 138,
        siteIds: new Set([513, 514, 519])
      }),
      new Project({
        id: 513,
        name: "513 Name",
        description: "513 Description.",
        creatorId: 138,
        siteIds: new Set([513, 514, 519])
      }),
      new Project({
        id: 514,
        name: "514 Name",
        description: "514 Description.",
        creatorId: 138,
        siteIds: new Set([513, 514, 519])
      })
    ];

    service
      .getFilteredProjects({
        items: 3
      })
      .subscribe(
        res => {
          expect(res).toEqual(dummyApiConvertedResponse);
          done();
        },
        () => {
          expect(false).toBeTruthy("No error should be reported");
          done();
        },
        () => {
          done();
        }
      );

    const req = httpMock.expectOne(
      config.getConfig().environment.apiRoot + "/projects/filter?items=3"
    );
    req.flush(dummyApiResponse);
  });

  it("getFilteredProjects should get ordered by creator id", done => {
    const dummyApiResponse = {
      meta: {
        status: 200,
        message: "OK",
        sorting: {
          order_by: "creator_id",
          direction: "asc"
        },
        paging: {
          page: 1,
          items: 25,
          total: 1,
          max_page: 1,
          current:
            "<BROKEN LINK>/projects?direction=asc&items=3&order_by=name&page=1",
          previous: null,
          next: null
        }
      },
      data: [
        {
          id: 512,
          name: "512 Name",
          description: "512 Description.",
          creator_id: 138,
          site_ids: new Set([513, 514, 519]),
          description_html: "<p>512 Description.</p>\n"
        },
        {
          id: 513,
          name: "513 Name",
          description: "513 Description.",
          creator_id: 138,
          site_ids: new Set([513, 514, 519]),
          description_html: "<p>513 Description.</p>\n"
        },
        {
          id: 514,
          name: "514 Name",
          description: "514 Description.",
          creator_id: 138,
          site_ids: new Set([513, 514, 519]),
          description_html: "<p>514 Description.</p>\n"
        }
      ]
    };

    const dummyApiConvertedResponse = [
      new Project({
        id: 512,
        name: "512 Name",
        description: "512 Description.",
        creatorId: 138,
        siteIds: new Set([513, 514, 519])
      }),
      new Project({
        id: 513,
        name: "513 Name",
        description: "513 Description.",
        creatorId: 138,
        siteIds: new Set([513, 514, 519])
      }),
      new Project({
        id: 514,
        name: "514 Name",
        description: "514 Description.",
        creatorId: 138,
        siteIds: new Set([513, 514, 519])
      })
    ];

    service
      .getFilteredProjects({
        orderBy: "creatorId"
      })
      .subscribe(
        res => {
          expect(res).toEqual(dummyApiConvertedResponse);
          done();
        },
        () => {
          expect(false).toBeTruthy("No error should be reported");
          done();
        },
        () => {
          done();
        }
      );

    const req = httpMock.expectOne(
      config.getConfig().environment.apiRoot +
        "/projects/filter?order_by=creator_id"
    );
    req.flush(dummyApiResponse);
  });

  it("getFilteredProjects should get multi filter", done => {
    const dummyApiResponse = {
      meta: {
        status: 200,
        message: "OK",
        sorting: {
          order_by: "creator_id",
          direction: "desc"
        },
        paging: {
          page: 2,
          items: 5,
          total: 1,
          max_page: 2,
          current:
            "<BROKEN LINK>/projects?direction=asc&items=3&order_by=name&page=1",
          previous: null,
          next: null
        }
      },
      data: [
        {
          id: 512,
          name: "512 Name",
          description: "512 Description.",
          creator_id: 138,
          site_ids: new Set([513, 514, 519]),
          description_html: "<p>512 Description.</p>\n"
        },
        {
          id: 513,
          name: "513 Name",
          description: "513 Description.",
          creator_id: 138,
          site_ids: new Set([513, 514, 519]),
          description_html: "<p>513 Description.</p>\n"
        },
        {
          id: 514,
          name: "514 Name",
          description: "514 Description.",
          creator_id: 138,
          site_ids: new Set([513, 514, 519]),
          description_html: "<p>514 Description.</p>\n"
        }
      ]
    };

    const dummyApiConvertedResponse = [
      new Project({
        id: 512,
        name: "512 Name",
        description: "512 Description.",
        creatorId: 138,
        siteIds: new Set([513, 514, 519])
      }),
      new Project({
        id: 513,
        name: "513 Name",
        description: "513 Description.",
        creatorId: 138,
        siteIds: new Set([513, 514, 519])
      }),
      new Project({
        id: 514,
        name: "514 Name",
        description: "514 Description.",
        creatorId: 138,
        siteIds: new Set([513, 514, 519])
      })
    ];

    service
      .getFilteredProjects({
        direction: "desc",
        items: 3,
        orderBy: "creatorId",
        page: 2
      })
      .subscribe(
        res => {
          expect(res).toEqual(dummyApiConvertedResponse);
          done();
        },
        () => {
          expect(false).toBeTruthy("No error should be reported");
          done();
        },
        () => {
          done();
        }
      );

    const req = httpMock.expectOne(
      config.getConfig().environment.apiRoot +
        "/projects/filter?direction=desc&items=3&order_by=creator_id&page=2"
    );
    req.flush(dummyApiResponse);
  });

  it("authenticated getProjects should return data", () => {
    // tslint:disable-next-line: rxjs-no-ignored-error
    service.getProjects().subscribe(res => {
      expect(res).toEqual(projectsValidConvertedResponse);
    });

    // Login
    securityService
      .signIn({ login: "username", password: "password" })
      // tslint:disable-next-line: rxjs-no-ignored-error
      .subscribe(() => {});

    // Catch security check and return login details
    const login = httpMock.expectOne(
      config.getConfig().environment.apiRoot + "/security"
    );
    login.flush({
      meta: {
        status: 200,
        message: "OK"
      },
      data: {
        auth_token: "aaaaaaaaaaaaaaaaaaaaaa",
        user_name: "Test",
        message: "Logged in successfully."
      }
    });

    const projects = httpMock.expectOne({
      url: config.getConfig().environment.apiRoot + "/projects",
      method: "GET"
    });
    projects.flush(projectsValidResponse);
  });

  it("authenticated getProject should return data", done => {
    service.getProject(512).subscribe(
      res => {
        expect(res).toEqual(projectValidConvertedResponse);
        done();
      },
      () => {
        expect(false).toBeTruthy("Should be no error response");
        done();
      },
      () => {
        done();
      }
    );

    // Login
    securityService
      .signIn({ login: "username", password: "password" })
      // tslint:disable-next-line: rxjs-no-ignored-error
      .subscribe(() => {});

    // Catch security check and return login details
    const login = httpMock.expectOne(
      config.getConfig().environment.apiRoot + "/security"
    );
    login.flush({
      meta: {
        status: 200,
        message: "OK"
      },
      data: {
        auth_token: "aaaaaaaaaaaaaaaaaaaaaa",
        user_name: "Test",
        message: "Logged in successfully."
      }
    });

    const project = httpMock.expectOne({
      url: config.getConfig().environment.apiRoot + "/projects/512",
      method: "GET"
    });
    project.flush(projectValidResponse);
  });

  it("newProject should create new project", done => {
    service.newProject({ name: "Testing Project #1" }).subscribe(
      res => {
        expect(res).toBeTrue();
      },
      () => {
        expect(false).toBeTruthy("Should be no error response");
      },
      () => {
        done();
      }
    );

    const req = httpMock.expectOne({
      url: config.getConfig().environment.apiRoot + "/projects",
      method: "POST"
    });
    req.flush(
      {
        meta: {
          status: 201,
          message: "Created"
        },
        data: {
          id: 1,
          name: "Testing Project #1",
          description: null,
          creator_id: 1,
          site_ids: [],
          description_html: null
        }
      },
      { status: 201, statusText: "Created" }
    );
  });

  it("newProject should create new project with required details", () => {
    service.newProject({ name: "Testing Project #1" }).subscribe();

    const req = httpMock.expectOne({
      url: config.getConfig().environment.apiRoot + "/projects",
      method: "POST"
    });
    expect(req.request.body).toEqual({
      name: "Testing Project #1"
    });
  });

  it("newProject should create new project with description", () => {
    service
      .newProject({
        name: "Testing Project #1",
        description: "Custom description"
      })
      .subscribe();

    const req = httpMock.expectOne({
      url: config.getConfig().environment.apiRoot + "/projects",
      method: "POST"
    });
    expect(req.request.body).toEqual({
      name: "Testing Project #1",
      description: "Custom description"
    });
  });

  // Image option not available
  xit("newProject should create new project with image", done => {});
  xit("newProject should create new project with image and description", done => {});

  it("newProject should return error on duplicate project", done => {
    service.newProject({ name: "Testing Project #1" }).subscribe(
      () => {
        expect(false).toBeTruthy("Should not return result");
        done();
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
        });
        done();
      }
    );

    const req = httpMock.expectOne({
      url: config.getConfig().environment.apiRoot + "/projects",
      method: "POST"
    });
    req.flush(
      {
        meta: {
          status: 422,
          message: "Unprocessable Entity",
          error: {
            details: "Record could not be saved",
            info: {
              name: ["has already been taken"],
              image: [],
              image_file_name: [],
              image_file_size: [],
              image_content_type: [],
              image_updated_at: []
            }
          }
        },
        data: null
      },
      { status: 422, statusText: "Unprocessable Entity" }
    );
  });

  it("newProject should handle unauthorized", done => {
    service.newProject({ name: "Testing Project #1" }).subscribe(
      () => {
        expect(false).toBeTruthy("Should not return result");
        done();
      },
      (err: APIErrorDetails) => {
        expect(err).toBeTruthy();
        expect(err).toEqual({
          status: 401,
          message: "You need to log in or register before continuing."
        });
        done();
      }
    );

    const req = httpMock.expectOne({
      url: config.getConfig().environment.apiRoot + "/projects",
      method: "POST"
    });
    req.flush(
      {
        meta: {
          status: 401,
          message: "Unauthorized",
          error: {
            details: "You need to log in or register before continuing.",
            links: {
              "Log in": "/my_account/sign_in",
              Register: "/my_account/sign_up",
              "Confirm account": "/my_account/confirmation/new"
            },
            info: null
          }
        },
        data: null
      },
      { status: 401, statusText: "Unauthorized" }
    );
  });

  it("updateProject should update project", done => {
    service.updateProject(1, { name: "Testing Project #1" }).subscribe(
      res => {
        expect(res).toBeTrue();
      },
      () => {
        expect(false).toBeTruthy("Should be no error response");
      },
      () => {
        done();
      }
    );

    const req = httpMock.expectOne({
      url: config.getConfig().environment.apiRoot + "/projects/1",
      method: "PATCH"
    });
    req.flush({
      meta: {
        status: 200,
        message: "OK"
      },
      data: {
        id: 1,
        name: "Testing Project #1",
        description: "testing description",
        creator_id: 1,
        site_ids: [],
        description_html: "<p>testing description</p>\n"
      }
    });
  });

  it("updateProject should update project with random project id", done => {
    service.updateProject(5, { name: "Testing Project #1" }).subscribe(
      res => {
        expect(res).toBeTrue();
      },
      () => {
        expect(false).toBeTruthy("Should be no error response");
      },
      () => {
        done();
      }
    );

    const req = httpMock.expectOne({
      url: config.getConfig().environment.apiRoot + "/projects/5",
      method: "PATCH"
    });
    req.flush({
      meta: {
        status: 200,
        message: "OK"
      },
      data: {
        id: 5,
        name: "Testing Project #1",
        description: "testing description",
        creator_id: 1,
        site_ids: [],
        description_html: "<p>testing description</p>\n"
      }
    });
  });

  it("updateProject should update project with required details", () => {
    service.updateProject(1, { name: "Testing Project #1" }).subscribe();

    const req = httpMock.expectOne({
      url: config.getConfig().environment.apiRoot + "/projects/1",
      method: "PATCH"
    });
    expect(req.request.body).toEqual({
      name: "Testing Project #1"
    });
  });

  it("updateProject should update project with description", () => {
    service
      .updateProject(1, {
        name: "Testing Project #1",
        description: "Custom description"
      })
      .subscribe();

    const req = httpMock.expectOne({
      url: config.getConfig().environment.apiRoot + "/projects/1",
      method: "PATCH"
    });
    expect(req.request.body).toEqual({
      name: "Testing Project #1",
      description: "Custom description"
    });
  });

  // Image option not available
  xit("updateProject should update project with image", done => {});
  xit("updateProject should update project with image and description", done => {});

  // API Route broken for this scenario
  xit("updateProject should return error on duplicate project", done => {
    service.updateProject(1, { name: "Testing Project #1" }).subscribe(
      () => {
        expect(false).toBeTruthy("Should not return result");
        done();
      },
      err => {
        expect(err).toBeTruthy(
          "Record could not be saved: name has already been taken"
        );
        done();
      }
    );

    const req = httpMock.expectOne({
      url: config.getConfig().environment.apiRoot + "/projects/1",
      method: "PATCH"
    });
    req.flush(
      {
        meta: {
          status: 422,
          message: "Unprocessable Entity",
          error: {
            details: "Record could not be saved",
            info: {
              name: ["has already been taken"],
              image: [],
              image_file_name: [],
              image_file_size: [],
              image_content_type: [],
              image_updated_at: []
            }
          }
        },
        data: null
      },
      { status: 422, statusText: "Unprocessable Entity" }
    );
  });

  it("updateProject should handle unauthorized", done => {
    service.updateProject(1, { name: "Testing Project #1" }).subscribe(
      () => {
        expect(false).toBeTruthy("Should not return result");
        done();
      },
      err => {
        expect(err).toBeTruthy("Unauthorized");
        done();
      }
    );

    const req = httpMock.expectOne({
      url: config.getConfig().environment.apiRoot + "/projects/1",
      method: "PATCH"
    });
    req.flush(
      {
        meta: {
          status: 401,
          message: "Unauthorized",
          error: {
            details: "You need to log in or register before continuing.",
            links: {
              "Log in": "/my_account/sign_in",
              Register: "/my_account/sign_up",
              "Confirm account": "/my_account/confirmation/new"
            },
            info: null
          }
        },
        data: null
      },
      { status: 401, statusText: "Unauthorized" }
    );
  });

  it("updateProject should handle not found", done => {
    service.updateProject(1, { name: "Testing Project #1" }).subscribe(
      () => {
        expect(false).toBeTruthy("Should not return result");
        done();
      },
      err => {
        expect(err).toBeTruthy("Not Found");
        done();
      }
    );

    const req = httpMock.expectOne({
      url: config.getConfig().environment.apiRoot + "/projects/1",
      method: "PATCH"
    });
    req.flush(
      {
        meta: {
          status: 404,
          message: "Not Found",
          error: {
            details: "Could not find the requested item.",
            info: null
          }
        },
        data: null
      },
      { status: 404, statusText: "Not Found" }
    );
  });
});

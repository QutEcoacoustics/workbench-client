import {
  HttpClientTestingModule,
  HttpTestingController
} from "@angular/common/http/testing";
import { TestBed } from "@angular/core/testing";
import { Project } from "src/app/models/Project";
import { environment } from "src/environments/environment";
import { ProjectsService } from "./projects.service";
import { SecurityService } from "./security.service";

xdescribe("ProjectsService", () => {
  let service: ProjectsService;
  let securityService: SecurityService;
  let httpMock: HttpTestingController;
  const url = environment.bawApiUrl;

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
          "http://staging.ecosounds.org/projects?direction=asc&items=3&order_by=name&page=1",
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
          "http://staging.ecosounds.org/projects?direction=asc&items=3&order_by=name&page=1",
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
      providers: [ProjectsService, SecurityService]
    });
    service = TestBed.get(ProjectsService);
    securityService = TestBed.get(SecurityService);
    httpMock = TestBed.get(HttpTestingController);

    const mockSessionStorage = (() => {
      let storage = {};
      return {
        getItem(key) {
          return storage[key];
        },
        removeItem(key) {
          delete storage[key];
        },
        setItem(key, value) {
          storage[key] = value.toString();
        },
        clear() {
          storage = {};
        },
        get length() {
          return Object.keys(storage).length;
        }
      };
    })();

    Object.defineProperty(window, "sessionStorage", {
      value: mockSessionStorage
    });
  });

  afterEach(() => {
    httpMock.verify();
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });

  it("getProjects should return data", () => {
    service.getProjects().subscribe(res => {
      expect(res).toEqual(projectsValidConvertedResponse);
    });

    const req = httpMock.expectOne(url + "/projects");
    expect(req.request.method).toBe("GET");
    expect(req.request.headers.has("Authorization")).toBeFalsy();
    expect(req.request.headers.has("Accept")).toBeTruthy();
    expect(req.request.headers.get("Accept")).toBeTruthy("application/json");
    expect(req.request.headers.has("Content-Type")).toBeTruthy();
    expect(req.request.headers.get("Content-Type")).toBeTruthy(
      "application/json"
    );
    req.flush(projectsValidResponse);
  });

  it("getProject should return data", () => {
    service.getProject(512).subscribe(res => {
      expect(res).toEqual(projectValidConvertedResponse);
    });

    const req = httpMock.expectOne(url + "/projects/512");
    expect(req.request.method).toBe("GET");
    expect(req.request.headers.has("Authorization")).toBeFalsy();
    expect(req.request.headers.has("Accept")).toBeTruthy();
    expect(req.request.headers.get("Accept")).toBeTruthy("application/json");
    expect(req.request.headers.has("Content-Type")).toBeTruthy();
    expect(req.request.headers.get("Content-Type")).toBeTruthy(
      "application/json"
    );
    req.flush(projectValidResponse);
  });

  it("getProject invalid project should return error", () => {
    service.getProject(-1).subscribe(
      res => {
        expect(res).toBeFalsy();
      },
      err => {
        expect(err).toBeTruthy();
        expect(typeof err).toBe("string");
      }
    );

    const req = httpMock.expectOne(url + "/projects/-1");
    expect(req.request.method).toBe("GET");
    expect(req.request.headers.has("Authorization")).toBeFalsy();
    expect(req.request.headers.has("Accept")).toBeTruthy();
    expect(req.request.headers.get("Accept")).toBeTruthy("application/json");
    expect(req.request.headers.has("Content-Type")).toBeTruthy();
    expect(req.request.headers.get("Content-Type")).toBeTruthy(
      "application/json"
    );
    req.flush(itemNotFoundResponse);
  });

  it("getProject invalid page should return error", () => {
    service.getProject(-1).subscribe(
      res => {
        expect(res).toBeFalsy();
      },
      err => {
        expect(err).toBeTruthy();
        expect(typeof err).toBe("string");
      }
    );

    const req = httpMock.expectOne(url + "/projects/-1");
    expect(req.request.method).toBe("GET");
    expect(req.request.headers.has("Authorization")).toBeFalsy();
    expect(req.request.headers.has("Accept")).toBeTruthy();
    expect(req.request.headers.get("Accept")).toBeTruthy("application/json");
    expect(req.request.headers.has("Content-Type")).toBeTruthy();
    expect(req.request.headers.get("Content-Type")).toBeTruthy(
      "application/json"
    );
    req.flush(pageNotFoundResponse);
  });

  it("getProject unauthorized should return error", () => {
    service.getProject(-1).subscribe(
      res => {
        expect(res).toBeFalsy();
      },
      err => {
        expect(err).toBeTruthy();
        expect(typeof err).toBe("string");
      }
    );

    const req = httpMock.expectOne(url + "/projects/-1");
    expect(req.request.method).toBe("GET");
    expect(req.request.headers.has("Authorization")).toBeFalsy();
    expect(req.request.headers.has("Accept")).toBeTruthy();
    expect(req.request.headers.get("Accept")).toBeTruthy("application/json");
    expect(req.request.headers.has("Content-Type")).toBeTruthy();
    expect(req.request.headers.get("Content-Type")).toBeTruthy(
      "application/json"
    );
    req.flush(projectUnauthorizedResponse);
  });

  it("getFilteredProjects should get filtered number of items", () => {
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
            "http://staging.ecosounds.org/projects?direction=asc&items=3&order_by=name&page=1",
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
      .subscribe(res => {
        expect(res).toEqual(dummyApiConvertedResponse);
      });

    const req = httpMock.expectOne(url + "/projects/filter?items=3");
    expect(req.request.method).toBe("GET");
    expect(req.request.headers.has("Authorization")).toBeFalsy();
    expect(req.request.headers.has("Accept")).toBeTruthy();
    expect(req.request.headers.get("Accept")).toBeTruthy("application/json");
    expect(req.request.headers.has("Content-Type")).toBeTruthy();
    expect(req.request.headers.get("Content-Type")).toBeTruthy(
      "application/json"
    );
    req.flush(dummyApiResponse);
  });

  it("getFilteredProjects should get ordered by creator id", () => {
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
            "http://staging.ecosounds.org/projects?direction=asc&items=3&order_by=name&page=1",
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
      .subscribe(res => {
        expect(res).toEqual(dummyApiConvertedResponse);
      });

    const req = httpMock.expectOne(
      url + "/projects/filter?order_by=creator_id"
    );
    expect(req.request.method).toBe("GET");
    expect(req.request.headers.has("Authorization")).toBeFalsy();
    expect(req.request.headers.has("Accept")).toBeTruthy();
    expect(req.request.headers.get("Accept")).toBeTruthy("application/json");
    expect(req.request.headers.has("Content-Type")).toBeTruthy();
    expect(req.request.headers.get("Content-Type")).toBeTruthy(
      "application/json"
    );
    req.flush(dummyApiResponse);
  });

  it("getFilteredProjects should get multi filter", () => {
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
            "http://staging.ecosounds.org/projects?direction=asc&items=3&order_by=name&page=1",
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
      .subscribe(res => {
        expect(res).toEqual(dummyApiConvertedResponse);
      });

    const req = httpMock.expectOne(
      url + "/projects/filter?direction=desc&items=3&order_by=creator_id&page=2"
    );
    expect(req.request.method).toBe("GET");
    expect(req.request.headers.has("Authorization")).toBeFalsy();
    expect(req.request.headers.has("Accept")).toBeTruthy();
    expect(req.request.headers.get("Accept")).toBeTruthy("application/json");
    expect(req.request.headers.has("Content-Type")).toBeTruthy();
    expect(req.request.headers.get("Content-Type")).toBeTruthy(
      "application/json"
    );
    req.flush(dummyApiResponse);
  });

  it("getProject empty response should return error msg", () => {
    service.getProject(512).subscribe(
      res => {
        expect(res).toBeFalsy();
      },
      err => {
        expect(err).toBeTruthy();
        expect(typeof err).toBe("string");
      }
    );

    const req = httpMock.expectOne(url + "/projects/512");
    expect(req.request.method).toBe("GET");
    expect(req.request.headers.has("Authorization")).toBeFalsy();
    expect(req.request.headers.has("Accept")).toBeTruthy();
    expect(req.request.headers.get("Accept")).toBeTruthy("application/json");
    expect(req.request.headers.has("Content-Type")).toBeTruthy();
    expect(req.request.headers.get("Content-Type")).toBeTruthy(
      "application/json"
    );
    req.flush({ meta: { status: 404 } });
  });

  it("getProjects empty response should return error msg", () => {
    service.getProjects().subscribe(
      res => {
        expect(res).toBeFalsy();
      },
      err => {
        expect(err).toBeTruthy();
        expect(typeof err).toBe("string");
      }
    );

    const req = httpMock.expectOne(url + "/projects");
    expect(req.request.method).toBe("GET");
    expect(req.request.headers.has("Authorization")).toBeFalsy();
    expect(req.request.headers.has("Accept")).toBeTruthy();
    expect(req.request.headers.get("Accept")).toBeTruthy("application/json");
    expect(req.request.headers.has("Content-Type")).toBeTruthy();
    expect(req.request.headers.get("Content-Type")).toBeTruthy(
      "application/json"
    );
    req.flush({ meta: { status: 404 } });
  });

  it("getFilteredProjects empty response should return error msg", () => {
    service
      .getFilteredProjects({
        items: 3
      })
      .subscribe(
        res => {
          expect(res).toBeFalsy();
        },
        err => {
          expect(err).toBeTruthy();
          expect(typeof err).toBe("string");
        }
      );

    const req = httpMock.expectOne(url + "/projects/filter?items=3");
    expect(req.request.method).toBe("GET");
    expect(req.request.headers.has("Authorization")).toBeFalsy();
    expect(req.request.headers.has("Accept")).toBeTruthy();
    expect(req.request.headers.get("Accept")).toBeTruthy("application/json");
    expect(req.request.headers.has("Content-Type")).toBeTruthy();
    expect(req.request.headers.get("Content-Type")).toBeTruthy(
      "application/json"
    );
    req.flush({ meta: { status: 404 } });
  });

  // TODO Ensure authenticated tests are not interfering with each other
  it("authenticated getProjects should return data", () => {
    securityService
      .signIn({ email: "email", password: "password" })
      .subscribe(() => {
        service.getProjects().subscribe(res => {
          expect(res).toEqual(projectsValidConvertedResponse);
        });

        const projects = httpMock.expectOne(url + "/projects");
        expect(projects.request.method).toBe("GET");
        expect(projects.request.headers.has("Authorization")).toBeTruthy();
        expect(projects.request.headers.has("Accept")).toBeTruthy();
        expect(projects.request.headers.get("Accept")).toBeTruthy(
          "application/json"
        );
        expect(projects.request.headers.has("Content-Type")).toBeTruthy();
        expect(projects.request.headers.get("Content-Type")).toBeTruthy(
          "application/json"
        );
        projects.flush(projectsValidResponse);
      });

    const login = httpMock.expectOne(url + "/security");
    login.flush({
      meta: {
        status: 200,
        message: "OK"
      },
      data: {
        auth_token: "pUqyq5KDvZq24qSm8sy1",
        user_name: "Test",
        message: "Logged in successfully."
      }
    });
  });

  // TODO Ensure authenticated tests are not interfering with each other
  it("authenticated getProject should return data", () => {
    securityService
      .signIn({ email: "email", password: "password" })
      .subscribe(() => {
        service.getProject(512).subscribe(res => {
          expect(res).toEqual(projectValidConvertedResponse);
        });

        const project = httpMock.expectOne(url + "/projects/512");
        expect(project.request.method).toBe("GET");
        expect(project.request.headers.has("Authorization")).toBeTruthy();
        expect(project.request.headers.has("Accept")).toBeTruthy();
        expect(project.request.headers.get("Accept")).toBeTruthy(
          "application/json"
        );
        expect(project.request.headers.has("Content-Type")).toBeTruthy();
        expect(project.request.headers.get("Content-Type")).toBeTruthy(
          "application/json"
        );
        project.flush(projectValidResponse);
      });

    const login = httpMock.expectOne(url + "/security");
    login.flush({
      meta: {
        status: 200,
        message: "OK"
      },
      data: {
        auth_token: "pUqyq5KDvZq24qSm8sy1",
        user_name: "Test",
        message: "Logged in successfully."
      }
    });
  });
});

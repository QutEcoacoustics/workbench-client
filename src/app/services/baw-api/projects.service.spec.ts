import { HTTP_INTERCEPTORS } from "@angular/common/http";
import {
  HttpClientTestingModule,
  HttpTestingController
} from "@angular/common/http/testing";
import { fakeAsync, TestBed, tick } from "@angular/core/testing";
import { BehaviorSubject, Observable, Subject } from "rxjs";
import { Project } from "src/app/models/Project";
import { environment } from "src/environments/environment";
import { BawApiInterceptor } from "./base-api.interceptor";
import { ProjectsService } from "./projects.service";
import { SecurityService } from "./security.service";

xdescribe("ProjectsService", () => {
  let service: ProjectsService;
  let securityService: SecurityService;
  let httpMock: HttpTestingController;
  const url = environment.bawApiUrl;

  class MockSecurityService {
    private trigger = new BehaviorSubject<boolean>(false);

    public signIn(details: {
      email: string;
      password: string;
    }): Observable<boolean | string> {
      const subject = new Subject<boolean | string>();

      setTimeout(() => {
        if (details.email === "email" && details.password === "password") {
          subject.next(true);
          this.trigger.next(true);
        } else {
          subject.error("Error MSG");
          this.trigger.next(false);
        }
      }, 1000);

      return subject.asObservable();
    }

    public register(details: {
      username: string;
      email: string;
      password: string;
    }): Observable<boolean | string> {
      const subject = new Subject<boolean | string>();

      setTimeout(() => {
        if (
          details.username === "username" &&
          details.email === "email" &&
          details.password === "password"
        ) {
          subject.next(true);
          this.trigger.next(true);
        } else {
          subject.error("Error MSG");
          this.trigger.next(false);
        }
      }, 1000);

      return subject.asObservable();
    }

    public getLoggedInTrigger() {
      return this.trigger;
    }
  }

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
      providers: [
        ProjectsService,
        { provide: SecurityService, useClass: MockSecurityService },
        { provide: HTTP_INTERCEPTORS, useClass: BawApiInterceptor, multi: true }
      ]
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

  it("getProjects should return data", fakeAsync(() => {
    service.getProjects().subscribe(res => {
      expect(res).toEqual(projectsValidConvertedResponse);
    });

    tick();
    const req = httpMock.expectOne(url + "/projects");
    req.flush(projectsValidResponse);
  }));

  it("getProject should return data", () => {
    service.getProject(512).subscribe(res => {
      expect(res).toEqual(projectValidConvertedResponse);
    });

    const req = httpMock.expectOne(url + "/projects/512");
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
    req.flush(projectUnauthorizedResponse);
  });

  it("getFilteredProjects should get filtered number of items", fakeAsync(() => {
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

    tick();
    const req = httpMock.expectOne(url + "/projects/filter?items=3");
    req.flush(dummyApiResponse);
  }));

  it("getFilteredProjects should get ordered by creator id", fakeAsync(() => {
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

    tick();
    const req = httpMock.expectOne(
      url + "/projects/filter?order_by=creator_id"
    );
    req.flush(dummyApiResponse);
  }));

  it("getFilteredProjects should get multi filter", fakeAsync(() => {
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

    tick();
    const req = httpMock.expectOne(
      url + "/projects/filter?direction=desc&items=3&order_by=creator_id&page=2"
    );
    req.flush(dummyApiResponse);
  }));

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
    req.flush({ meta: { status: 404 } });
  });

  it("getFilteredProjects empty response should return error msg", fakeAsync(() => {
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

    tick();
    /* httpMock.match(request => {
      return (
        request.url === url + "/projects/filter" &&
        request.urlWithParams === url + "/projects/filter" &&
        request.method === "GET"
      );
    });
    httpMock.expectNone(url + "/projects/512"); */
    const req = httpMock.expectOne({
      url: url + "/projects/filter",
      method: "GET"
    });
    req.flush({ meta: { status: 404 } });
  }));

  // TODO Ensure authenticated tests are not interfering with each other
  it("authenticated getProjects should return data", fakeAsync(() => {
    service.getProjects().subscribe(res => {
      expect(res).toEqual(projectsValidConvertedResponse);
    });
    let projects = httpMock.expectOne({
      url: url + "/projects",
      method: "GET"
    });
    projects.flush(projectsValidResponse);

    securityService
      .signIn({ email: "email", password: "password" })
      .subscribe(() => {});

    tick(2000);

    projects = httpMock.expectOne({
      url: url + "/projects",
      method: "GET"
    });
    projects.flush(projectsValidResponse);
  }));

  // TODO Ensure authenticated tests are not interfering with each other
  it("authenticated getProject should return data", fakeAsync(() => {
    securityService
      .signIn({ email: "email", password: "password" })
      .subscribe(() => {
        service.getProject(512).subscribe(res => {
          expect(res).toEqual(projectValidConvertedResponse);
        });

        const project = httpMock.expectOne({
          url: url + "/projects/512",
          method: "GET"
        });
        project.flush(projectValidResponse);
      });
    tick(2000);
  }));
});

import { HTTP_INTERCEPTORS } from "@angular/common/http";
import {
  HttpClientTestingModule,
  HttpTestingController
} from "@angular/common/http/testing";
import { TestBed } from "@angular/core/testing";
import { testAppInitializer } from "src/app/app.helper";
import { Site } from "src/app/models/Site";
import { AppConfigService } from "../app-config/app-config.service";
import { BawApiInterceptor } from "./api.interceptor";
import { mockSessionStorage } from "./mock/sessionStorageMock";
import { SecurityService } from "./security.service";
import { SitesService } from "./sites.service";

describe("SitesService", () => {
  let httpMock: HttpTestingController;
  let config: AppConfigService;
  let service: SitesService;
  let securityService: SecurityService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        SecurityService,
        {
          provide: HTTP_INTERCEPTORS,
          useClass: BawApiInterceptor,
          multi: true
        },
        ...testAppInitializer
      ]
    });

    Object.defineProperty(window, "sessionStorage", {
      value: mockSessionStorage
    });

    service = TestBed.get(SitesService);
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

  it("getSite should return data", done => {
    service.getSite(1).subscribe(
      res => {
        expect(res).toBeTruthy();
        expect(res).toEqual(
          new Site({
            id: 1,
            name: "Site #1",
            creatorId: 1,
            description: "This is a site",
            projectIds: new Set([1]),
            locationObfuscated: true,
            customLatitude: 48.8831,
            customLongitude: 2.3205
          })
        );
        done();
      },
      () => {
        expect(false).toBeTruthy("Result should not return error");
        done();
      },
      () => {
        done();
      }
    );

    const req = httpMock.expectOne(
      config.getConfig().environment.apiRoot + "/sites/1"
    );
    req.flush({
      meta: { status: 200, message: "OK" },
      data: {
        id: 1,
        name: "Site #1",
        creator_id: 1,
        description: "This is a site",
        project_ids: [1],
        location_obfuscated: true,
        custom_latitude: 48.8831,
        custom_longitude: 2.3205,
        description_html: "\u003Cp\u003EThis is a site\u003C/p\u003E\n"
      }
    });
  });

  it("getSite should change request based on id", done => {
    service.getSite(5).subscribe(
      res => {
        expect(res).toBeTruthy();
        expect(res).toEqual(
          new Site({
            id: 5,
            name: "Site #1",
            creatorId: 1,
            description: "This is a site",
            projectIds: new Set([1]),
            locationObfuscated: true,
            customLatitude: 48.8831,
            customLongitude: 2.3205
          })
        );
        done();
      },
      () => {
        expect(false).toBeTruthy("Result should not return error");
        done();
      },
      () => {
        done();
      }
    );

    const req = httpMock.expectOne(
      config.getConfig().environment.apiRoot + "/sites/5"
    );
    req.flush({
      meta: { status: 200, message: "OK" },
      data: {
        id: 5,
        name: "Site #1",
        creator_id: 1,
        description: "This is a site",
        project_ids: [1],
        location_obfuscated: true,
        custom_latitude: 48.8831,
        custom_longitude: 2.3205,
        description_html: "\u003Cp\u003EThis is a site\u003C/p\u003E\n"
      }
    });
  });

  it("authenticated getSite should return data", done => {
    service.getSite(1).subscribe(
      res => {
        expect(res).toBeTruthy();
        expect(res).toEqual(
          new Site({
            id: 1,
            name: "Site #1",
            creatorId: 1,
            description: "This is a site",
            projectIds: new Set([1]),
            locationObfuscated: true,
            customLatitude: 48.8831,
            customLongitude: 2.3205
          })
        );
        done();
      },
      () => {
        expect(false).toBeTruthy("Result should not return error");
        done();
      },
      () => {
        done();
      }
    );

    // Login
    securityService
      .signIn({ email: "email", password: "password" })
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

    const req = httpMock.expectOne(
      config.getConfig().environment.apiRoot + "/sites/1"
    );
    req.flush({
      meta: { status: 200, message: "OK" },
      data: {
        id: 1,
        name: "Site #1",
        creator_id: 1,
        description: "This is a site",
        project_ids: [1],
        location_obfuscated: true,
        custom_latitude: 48.8831,
        custom_longitude: 2.3205,
        description_html: "\u003Cp\u003EThis is a site\u003C/p\u003E\n"
      }
    });
  });

  it("getSite should error on site not found", done => {
    service.getSite(1).subscribe(
      () => {
        expect(false).toBeTruthy("Should not return result");
        done();
      },
      err => {
        expect(err).toBeTruthy();
        expect(typeof err).toBe("string");
        expect(err.length).toBeGreaterThan(0);
        done();
      },
      () => {
        done();
      }
    );

    const req = httpMock.expectOne(
      config.getConfig().environment.apiRoot + "/sites/1"
    );
    req.flush({
      meta: {
        status: 404,
        message: "Not Found",
        error: { details: "Could not find the requested item.", info: null }
      },
      data: null
    });
  });

  it("getSite should error on unauthorized", done => {
    service.getSite(1).subscribe(
      () => {
        expect(false).toBeTruthy("Should not return result");
        done();
      },
      err => {
        expect(err).toBeTruthy();
        expect(typeof err).toBe("string");
        expect(err.length).toBeGreaterThan(0);
        done();
      },
      () => {
        done();
      }
    );

    const req = httpMock.expectOne(
      config.getConfig().environment.apiRoot + "/sites/1"
    );
    req.flush({
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
    });
  });

  it("getProjectSite should return data", done => {
    service.getProjectSite(1, 1).subscribe(
      res => {
        expect(res).toBeTruthy();
        expect(res).toEqual(
          new Site({
            id: 1,
            name: "Site #1",
            creatorId: 1,
            description: "This is a site",
            projectIds: new Set([1]),
            locationObfuscated: true,
            customLatitude: 48.8831,
            customLongitude: 2.3205
          })
        );
        done();
      },
      () => {
        expect(false).toBeTruthy("Result should not return error");
        done();
      },
      () => {
        done();
      }
    );

    const req = httpMock.expectOne(
      config.getConfig().environment.apiRoot + "/projects/1/sites/1"
    );
    req.flush({
      meta: { status: 200, message: "OK" },
      data: {
        id: 1,
        name: "Site #1",
        creator_id: 1,
        description: "This is a site",
        project_ids: [1],
        location_obfuscated: true,
        custom_latitude: 48.8831,
        custom_longitude: 2.3205,
        description_html: "\u003Cp\u003EThis is a site\u003C/p\u003E\n"
      }
    });
  });

  it("authorized getProjectSite should return data", done => {
    service.getProjectSite(1, 1).subscribe(
      res => {
        expect(res).toBeTruthy();
        expect(res).toEqual(
          new Site({
            id: 1,
            name: "Site #1",
            creatorId: 1,
            description: "This is a site",
            projectIds: new Set([1]),
            locationObfuscated: true,
            customLatitude: 48.8831,
            customLongitude: 2.3205
          })
        );
        done();
      },
      () => {
        expect(false).toBeTruthy("Result should not return error");
        done();
      },
      () => {
        done();
      }
    );

    // Login
    securityService
      .signIn({ email: "email", password: "password" })
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

    const req = httpMock.expectOne(
      config.getConfig().environment.apiRoot + "/projects/1/sites/1"
    );
    req.flush({
      meta: { status: 200, message: "OK" },
      data: {
        id: 1,
        name: "Site #1",
        creator_id: 1,
        description: "This is a site",
        project_ids: [1],
        location_obfuscated: true,
        custom_latitude: 48.8831,
        custom_longitude: 2.3205,
        description_html: "\u003Cp\u003EThis is a site\u003C/p\u003E\n"
      }
    });
  });

  it("getProjectSite should change request based on ids", done => {
    service.getProjectSite(2, 3).subscribe(
      res => {
        expect(res).toBeTruthy();
        expect(res).toEqual(
          new Site({
            id: 3,
            name: "Site #1",
            creatorId: 1,
            description: "This is a site",
            projectIds: new Set([2]),
            locationObfuscated: true,
            customLatitude: 48.8831,
            customLongitude: 2.3205
          })
        );
        done();
      },
      () => {
        expect(false).toBeTruthy("Result should not return error");
        done();
      },
      () => {
        done();
      }
    );

    const req = httpMock.expectOne(
      config.getConfig().environment.apiRoot + "/projects/2/sites/3"
    );
    req.flush({
      meta: { status: 200, message: "OK" },
      data: {
        id: 3,
        name: "Site #1",
        creator_id: 1,
        description: "This is a site",
        project_ids: [2],
        location_obfuscated: true,
        custom_latitude: 48.8831,
        custom_longitude: 2.3205,
        description_html: "\u003Cp\u003EThis is a site\u003C/p\u003E\n"
      }
    });
  });

  it("getProjectSite should error on site not found", done => {
    service.getProjectSite(1, 1).subscribe(
      () => {
        expect(false).toBeTruthy("Should not return result");
        done();
      },
      err => {
        expect(err).toBeTruthy();
        expect(typeof err).toBe("string");
        expect(err.length).toBeGreaterThan(0);
        done();
      },
      () => {
        done();
      }
    );

    const req = httpMock.expectOne(
      config.getConfig().environment.apiRoot + "/projects/1/sites/1"
    );
    req.flush({
      meta: {
        status: 404,
        message: "Not Found",
        error: { details: "Could not find the requested item.", info: null }
      },
      data: null
    });
  });

  it("getProjectSite should error on unauthorized", done => {
    service.getProjectSite(1, 1).subscribe(
      () => {
        expect(false).toBeTruthy("Should not return result");
        done();
      },
      err => {
        expect(err).toBeTruthy();
        expect(typeof err).toBe("string");
        expect(err.length).toBeGreaterThan(0);
        done();
      },
      () => {
        done();
      }
    );

    const req = httpMock.expectOne(
      config.getConfig().environment.apiRoot + "/projects/1/sites/1"
    );
    req.flush({
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
    });
  });

  it("getProjectSites should return data", done => {
    service.getProjectSites(1).subscribe(
      res => {
        expect(res).toBeTruthy();
        expect(res).toEqual([
          new Site({
            id: 1,
            name: "Site #1",
            creatorId: 1,
            description: "This is a site",
            projectIds: new Set([1]),
            locationObfuscated: true,
            customLatitude: 48.8831,
            customLongitude: 2.3205
          }),

          new Site({
            id: 2,
            name: "Site #2",
            creatorId: 1,
            description: "This is a site",
            projectIds: new Set([1]),
            locationObfuscated: true,
            customLatitude: 48.8831,
            customLongitude: 2.3205
          })
        ]);
        done();
      },
      () => {
        expect(false).toBeTruthy("Result should not return error");
        done();
      },
      () => {
        done();
      }
    );

    const req = httpMock.expectOne(
      config.getConfig().environment.apiRoot + "/projects/1/sites"
    );
    req.flush({
      meta: { status: 200, message: "OK" },
      data: [
        {
          id: 1,
          name: "Site #1",
          creator_id: 1,
          description: "This is a site",
          project_ids: [1],
          location_obfuscated: true,
          custom_latitude: 48.8831,
          custom_longitude: 2.3205,
          description_html: "\u003Cp\u003EThis is a site\u003C/p\u003E\n"
        },
        {
          id: 2,
          name: "Site #2",
          creator_id: 1,
          description: "This is a site",
          project_ids: [1],
          location_obfuscated: true,
          custom_latitude: 48.8831,
          custom_longitude: 2.3205,
          description_html: "\u003Cp\u003EThis is a site\u003C/p\u003E\n"
        }
      ]
    });
  });

  it("authorized getProjectSites should return data", done => {
    service.getProjectSites(1).subscribe(
      res => {
        expect(res).toBeTruthy();
        expect(res).toEqual([
          new Site({
            id: 1,
            name: "Site #1",
            creatorId: 1,
            description: "This is a site",
            projectIds: new Set([1]),
            locationObfuscated: true,
            customLatitude: 48.8831,
            customLongitude: 2.3205
          }),

          new Site({
            id: 2,
            name: "Site #2",
            creatorId: 1,
            description: "This is a site",
            projectIds: new Set([1]),
            locationObfuscated: true,
            customLatitude: 48.8831,
            customLongitude: 2.3205
          })
        ]);
        done();
      },
      () => {
        expect(false).toBeTruthy("Result should not return error");
        done();
      },
      () => {
        done();
      }
    );

    // Login
    securityService
      .signIn({ email: "email", password: "password" })
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

    const req = httpMock.expectOne(
      config.getConfig().environment.apiRoot + "/projects/1/sites"
    );
    req.flush({
      meta: { status: 200, message: "OK" },
      data: [
        {
          id: 1,
          name: "Site #1",
          creator_id: 1,
          description: "This is a site",
          project_ids: [1],
          location_obfuscated: true,
          custom_latitude: 48.8831,
          custom_longitude: 2.3205,
          description_html: "\u003Cp\u003EThis is a site\u003C/p\u003E\n"
        },
        {
          id: 2,
          name: "Site #2",
          creator_id: 1,
          description: "This is a site",
          project_ids: [1],
          location_obfuscated: true,
          custom_latitude: 48.8831,
          custom_longitude: 2.3205,
          description_html: "\u003Cp\u003EThis is a site\u003C/p\u003E\n"
        }
      ]
    });
  });

  it("getProjectSites should change request based on id", done => {
    service.getProjectSites(5).subscribe(
      res => {
        expect(res).toBeTruthy();
        expect(res).toEqual([
          new Site({
            id: 1,
            name: "Site #1",
            creatorId: 1,
            description: "This is a site",
            projectIds: new Set([5]),
            locationObfuscated: true,
            customLatitude: 48.8831,
            customLongitude: 2.3205
          }),

          new Site({
            id: 2,
            name: "Site #2",
            creatorId: 1,
            description: "This is a site",
            projectIds: new Set([5]),
            locationObfuscated: true,
            customLatitude: 48.8831,
            customLongitude: 2.3205
          })
        ]);
        done();
      },
      () => {
        expect(false).toBeTruthy("Result should not return error");
        done();
      },
      () => {
        done();
      }
    );

    const req = httpMock.expectOne(
      config.getConfig().environment.apiRoot + "/projects/5/sites"
    );
    req.flush({
      meta: { status: 200, message: "OK" },
      data: [
        {
          id: 1,
          name: "Site #1",
          creator_id: 1,
          description: "This is a site",
          project_ids: [5],
          location_obfuscated: true,
          custom_latitude: 48.8831,
          custom_longitude: 2.3205,
          description_html: "\u003Cp\u003EThis is a site\u003C/p\u003E\n"
        },
        {
          id: 2,
          name: "Site #2",
          creator_id: 1,
          description: "This is a site",
          project_ids: [5],
          location_obfuscated: true,
          custom_latitude: 48.8831,
          custom_longitude: 2.3205,
          description_html: "\u003Cp\u003EThis is a site\u003C/p\u003E\n"
        }
      ]
    });
  });

  it("getProjectSites should error on site not found", done => {
    service.getProjectSites(1).subscribe(
      () => {
        expect(false).toBeTruthy("Should not return result");
        done();
      },
      err => {
        expect(err).toBeTruthy();
        expect(typeof err).toBe("string");
        expect(err.length).toBeGreaterThan(0);
        done();
      },
      () => {
        done();
      }
    );

    const req = httpMock.expectOne(
      config.getConfig().environment.apiRoot + "/projects/1/sites"
    );
    req.flush({
      meta: {
        status: 404,
        message: "Not Found",
        error: { details: "Could not find the requested item.", info: null }
      },
      data: null
    });
  });

  it("getProjectSites should error on unauthorized", done => {
    service.getProjectSites(1).subscribe(
      () => {
        expect(false).toBeTruthy("Should not return result");
        done();
      },
      err => {
        expect(err).toBeTruthy();
        expect(typeof err).toBe("string");
        expect(err.length).toBeGreaterThan(0);
        done();
      },
      () => {
        done();
      }
    );

    const req = httpMock.expectOne(
      config.getConfig().environment.apiRoot + "/projects/1/sites"
    );
    req.flush({
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
    });
  });
});

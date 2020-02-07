import { HTTP_INTERCEPTORS } from "@angular/common/http";
import {
  HttpClientTestingModule,
  HttpTestingController
} from "@angular/common/http/testing";
import { fakeAsync, TestBed, tick } from "@angular/core/testing";
import { Subject } from "rxjs";
import { testAppInitializer } from "src/app/app.helper";
import { SessionUser } from "src/app/models/User";
import { AppConfigService } from "../app-config/app-config.service";
import { ApiErrorDetails, BawApiInterceptor } from "./api.interceptor";
import {
  apiErrorDetails,
  shouldNotComplete,
  shouldNotFail,
  shouldNotSucceed
} from "./base-api.service.spec";
import { LoginDetails, SecurityService } from "./security.service";

describe("SecurityService", () => {
  let service: SecurityService;
  let httpMock: HttpTestingController;
  let config: AppConfigService;

  function createError(
    func:
      | "apiList"
      | "apiFilter"
      | "apiShow"
      | "apiCreate"
      | "apiUpdate"
      | "apiDestroy",
    url: string,
    error: ApiErrorDetails
  ) {
    spyOn<any>(service as any, func).and.callFake((path: string) => {
      expect(path).toBe(url);
      const subject = new Subject();

      setTimeout(() => {
        subject.error(error);
      }, 50);

      return subject;
    });
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        ...testAppInitializer,
        {
          provide: HTTP_INTERCEPTORS,
          useClass: BawApiInterceptor,
          multi: true
        },
        SecurityService
      ]
    });

    service = TestBed.get(SecurityService);
    config = TestBed.get(AppConfigService);
    httpMock = TestBed.get(HttpTestingController);
  });

  afterEach(() => {
    sessionStorage.clear();
    httpMock.verify();
  });

  describe("Authentication Tracking", () => {
    it("isLoggedIn should return false initially", () => {
      expect(service.isLoggedIn()).toBeFalse();
    });

    it("getSessionUser should return null initially", () => {
      expect(service.getSessionUser()).toBeFalsy();
    });

    it("authTrigger should contain default value", () => {
      const spy = jasmine.createSpy();

      service.getAuthTrigger().subscribe(spy, shouldNotFail, shouldNotComplete);

      expect(spy).toHaveBeenCalledTimes(1);
    });
  });

  describe("signIn", () => {
    function createSuccess(
      path: string,
      details: LoginDetails,
      model: SessionUser
    ) {
      return spyOn(service as any, "apiCreate").and.callFake(
        (_path: string, _details: object) => {
          expect(_path).toBe(path);
          expect(_details).toEqual(details);

          const subject = new Subject<SessionUser>();

          setTimeout(() => {
            subject.next(model);
            subject.complete();
          }, 50);

          return subject;
        }
      );
    }

    it("should call apiCreate", fakeAsync(() => {
      const details = new LoginDetails({
        login: "username",
        password: "password"
      });
      const model = new SessionUser({
        authToken: "xxxxxxxxxxxxxxx",
        userName: "username"
      });
      const spy = createSuccess("/security/", details, model);
      service.signIn(details).subscribe();
      expect(spy).toHaveBeenCalledWith("/security/", details);

      tick(100);
    }));

    it("should handle response", fakeAsync(() => {
      const details = new LoginDetails({
        login: "username",
        password: "password"
      });
      const model = new SessionUser({
        authToken: "xxxxxxxxxxxxxxx",
        userName: "username"
      });
      createSuccess("/security/", details, model);
      service.signIn(details).subscribe((_model: SessionUser) => {
        expect(_model).toBeTruthy();
        expect(_model).toEqual(model);
      }, shouldNotFail);

      tick(100);
    }));

    it("set session user", fakeAsync(() => {
      const details = new LoginDetails({
        login: "username",
        password: "password"
      });
      const model = new SessionUser({
        authToken: "xxxxxxxxxxxxxxx",
        userName: "username"
      });
      createSuccess("/security/", details, model);
      service
        .signIn(details)
        .subscribe((_model: SessionUser) => {}, shouldNotFail);

      tick(100);

      expect(service.getSessionUser()).toEqual(model);
    }));

    it("should update authTrigger trigger", fakeAsync(() => {
      const details = new LoginDetails({
        login: "username",
        password: "password"
      });
      const model = new SessionUser({
        authToken: "xxxxxxxxxxxxxxx",
        userName: "username"
      });
      const spy = jasmine.createSpy();
      createSuccess("/security/", details, model);

      service.getAuthTrigger().subscribe(spy, shouldNotFail, shouldNotComplete);
      service.signIn(details).subscribe();

      tick(100);

      expect(spy).toHaveBeenCalledTimes(2);
    }));

    it("should handle error", fakeAsync(() => {
      const details = new LoginDetails({
        login: "username",
        password: "password"
      });
      createError("apiCreate", "/security/", apiErrorDetails);
      service
        .signIn(details)
        .subscribe(shouldNotSucceed, (err: ApiErrorDetails) => {
          expect(err).toBeTruthy();
          expect(err).toEqual(apiErrorDetails);
        });

      tick(100);
    }));
  });

  describe("signOut", () => {
    function createSuccess(path: string) {
      return spyOn(service as any, "apiDestroy").and.callFake(
        (_path: string) => {
          expect(_path).toBe(path);

          const subject = new Subject<SessionUser>();

          setTimeout(() => {
            subject.next(null);
            subject.complete();
          }, 50);

          return subject;
        }
      );
    }

    it("should call apiDestroy", fakeAsync(() => {
      const spy = createSuccess("/security/");
      service.signOut().subscribe();
      expect(spy).toHaveBeenCalledWith("/security/");

      tick(100);
    }));

    it("should handle response", fakeAsync(() => {
      createSuccess("/security/");
      service
        .signOut()
        .subscribe(() => expect(true).toBeTruthy(), shouldNotFail);

      tick(100);
    }));

    it("should clear session user", fakeAsync(() => {
      createSuccess("/security/");
      service.signOut().subscribe(() => {}, shouldNotFail);

      tick(100);

      expect(service.getSessionUser()).toBeFalsy();
    }));

    it("should update authTrigger trigger", fakeAsync(() => {
      const spy = jasmine.createSpy();
      createSuccess("/security/");

      service.getAuthTrigger().subscribe(spy, shouldNotFail, shouldNotComplete);
      service.signOut().subscribe();

      tick(100);

      expect(spy).toHaveBeenCalledTimes(2);
    }));

    it("should handle error", fakeAsync(() => {
      createError("apiDestroy", "/security/", apiErrorDetails);
      service.signOut().subscribe(shouldNotSucceed, (err: ApiErrorDetails) => {
        expect(err).toBeTruthy();
        expect(err).toEqual(apiErrorDetails);
      });

      tick(100);
    }));
  });
});

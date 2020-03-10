import { HTTP_INTERCEPTORS } from "@angular/common/http";
import {
  HttpClientTestingModule,
  HttpTestingController
} from "@angular/common/http/testing";
import { fakeAsync, TestBed } from "@angular/core/testing";
import { BehaviorSubject, Subject } from "rxjs";
import { SessionUser } from "src/app/models/User";
import { testAppInitializer } from "src/app/test.helper";
import { ApiErrorDetails, BawApiInterceptor } from "./api.interceptor.service";
import {
  apiErrorDetails,
  shouldNotComplete,
  shouldNotFail,
  shouldNotSucceed
} from "./baw-api.service.spec";
import { MockShowApiService } from "./mock/showApiMock.service";
import { LoginDetails, SecurityService } from "./security.service";
import { UserService } from "./user.service";

describe("SecurityService", () => {
  let service: SecurityService;
  let httpMock: HttpTestingController;

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
        { provide: UserService, useClass: MockShowApiService },
        {
          provide: HTTP_INTERCEPTORS,
          useClass: BawApiInterceptor,
          multi: true
        },
        SecurityService
      ]
    });

    service = TestBed.inject(SecurityService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    localStorage.clear();
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
      spyOn(service as any, "apiCreate").and.callFake(
        (_path: string, _details: object) => {
          expect(_path).toBe(path);
          expect(_details).toEqual(details);

          return new BehaviorSubject<SessionUser>(model);
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
      createSuccess("/security/", details, model);
      service.signIn(details).subscribe();
      expect(service["apiCreate"]).toHaveBeenCalledWith("/security/", details);
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
      service.signIn(details).subscribe(() => {
        expect(true).toBeTruthy();
      }, shouldNotFail);
    }));

    // TODO Update this test
    it("store user", fakeAsync(() => {
      const details = new LoginDetails({
        login: "username",
        password: "password"
      });
      const model = new SessionUser({
        authToken: "xxxxxxxxxxxxxxx",
        userName: "username"
      });
      createSuccess("/security/", details, model);
      service.signIn(details).subscribe(() => {}, shouldNotFail);

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
    }));
  });

  describe("signOut", () => {
    function createSuccess(path: string) {
      spyOn(service as any, "apiDestroy").and.callFake((_path: string) => {
        expect(_path).toBe(path);

        return new BehaviorSubject<void>(null);
      });
    }

    it("should call apiDestroy", fakeAsync(() => {
      createSuccess("/security/");
      service.signOut().subscribe();
      expect(service["apiDestroy"]).toHaveBeenCalledWith("/security/");
    }));

    it("should handle response", fakeAsync(() => {
      createSuccess("/security/");
      service
        .signOut()
        .subscribe(() => expect(true).toBeTruthy(), shouldNotFail);
    }));

    it("should clear session user", fakeAsync(() => {
      createSuccess("/security/");
      service.signOut().subscribe(() => {}, shouldNotFail);

      expect(service.getSessionUser()).toBeFalsy();
    }));

    it("should update authTrigger trigger", fakeAsync(() => {
      const spy = jasmine.createSpy();
      createSuccess("/security/");

      service.getAuthTrigger().subscribe(spy, shouldNotFail, shouldNotComplete);
      service.signOut().subscribe();

      expect(spy).toHaveBeenCalledTimes(2);
    }));

    it("should handle error", fakeAsync(() => {
      createError("apiDestroy", "/security/", apiErrorDetails);
      service.signOut().subscribe(shouldNotSucceed, (err: ApiErrorDetails) => {
        expect(err).toBeTruthy();
        expect(err).toEqual(apiErrorDetails);
      });
    }));
  });
});

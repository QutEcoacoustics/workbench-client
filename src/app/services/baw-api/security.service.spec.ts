import { HTTP_INTERCEPTORS } from "@angular/common/http";
import {
  HttpClientTestingModule,
  HttpTestingController,
} from "@angular/common/http/testing";
import { fakeAsync, TestBed } from "@angular/core/testing";
import { SessionUser, User } from "@models/User";
import { BehaviorSubject, Subject } from "rxjs";
import { testAppInitializer } from "src/app/test.helper";
import { ApiErrorDetails, BawApiInterceptor } from "./api.interceptor.service";
import {
  apiErrorDetails,
  shouldNotComplete,
  shouldNotFail,
  shouldNotSucceed,
} from "./baw-api.service.spec";
import { MockShowApiService } from "./mock/showApiMock.service";
import { LoginDetails, SecurityService } from "./security.service";
import { UserService } from "./user.service";

describe("SecurityService", () => {
  let service: SecurityService;
  let userApi: UserService;
  let httpMock: HttpTestingController;
  let defaultLoginDetails: LoginDetails;
  let defaultUser: User;
  let defaultSessionUser: SessionUser;

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
      subject.error(error);
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
          multi: true,
        },
        SecurityService,
      ],
    });

    service = TestBed.inject(SecurityService);
    userApi = TestBed.inject(UserService);
    httpMock = TestBed.inject(HttpTestingController);

    defaultUser = new User({
      id: 1,
      userName: "username",
    });
    defaultSessionUser = new SessionUser({
      authToken: "xxxxxxxxxxxxxxx",
      userName: "username",
    });
    defaultLoginDetails = new LoginDetails({
      login: "username",
      password: "password",
    });
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
      expect(service.getLocalUser()).toBeFalsy();
    });

    it("authTrigger should contain default value", () => {
      const spy = jasmine.createSpy();

      service.getAuthTrigger().subscribe(spy, shouldNotFail, shouldNotComplete);

      expect(spy).toHaveBeenCalledTimes(1);
    });
  });

  describe("signIn", () => {
    function createResponse(
      path: string,
      details: LoginDetails,
      model: SessionUser,
      user?: User
    ) {
      spyOn(service as any, "apiCreate").and.callFake(
        (_path: string, _details: object) => {
          expect(_path).toBe(path);
          expect(_details).toEqual(details);

          return new BehaviorSubject<SessionUser>(model);
        }
      );
      spyOn(userApi, "show").and.callFake(() => {
        if (user) {
          return new BehaviorSubject<User>(user);
        } else {
          const subject = new Subject<User>();
          subject.error({
            status: 401,
            message: "Unauthorized",
          } as ApiErrorDetails);
          return subject;
        }
      });
    }

    it("should call apiCreate", fakeAsync(() => {
      createResponse(
        "/security/",
        defaultLoginDetails,
        defaultSessionUser,
        defaultUser
      );
      service.signIn(defaultLoginDetails).subscribe();
      expect(service["apiCreate"]).toHaveBeenCalledWith(
        "/security/",
        defaultLoginDetails
      );
    }));

    it("should handle response", fakeAsync(() => {
      createResponse(
        "/security/",
        defaultLoginDetails,
        defaultSessionUser,
        defaultUser
      );
      service.signIn(defaultLoginDetails).subscribe(() => {
        expect(true).toBeTruthy();
      }, shouldNotFail);
    }));

    it("store user", fakeAsync(() => {
      const userDetails = {
        id: 1,
        userName: "username",
        isConfirmed: false,
        lastSeenAt: "1970-01-01T00:00:00.000+10:00",
        rolesMask: 2,
        rolesMaskNames: ["user"],
      };
      const authDetails = {
        authToken: "xxxxxxxxxxxxxxxx",
        userName: "username",
      };

      const user = new User(userDetails);
      const session = new SessionUser(authDetails);
      createResponse("/security/", defaultLoginDetails, session, user);
      service.signIn(defaultLoginDetails).subscribe(() => {}, shouldNotFail);

      expect(service.getLocalUser()).toEqual(
        new SessionUser({
          ...authDetails,
          ...userDetails,
        })
      );
    }));

    it("should update authTrigger trigger", fakeAsync(() => {
      const spy = jasmine.createSpy();
      createResponse(
        "/security/",
        defaultLoginDetails,
        defaultSessionUser,
        defaultUser
      );

      service.getAuthTrigger().subscribe(spy, shouldNotFail, shouldNotComplete);
      service.signIn(defaultLoginDetails).subscribe();

      // Should call auth trigger twice, first time is when the subscription is created
      expect(spy).toHaveBeenCalledTimes(2);
    }));

    it("should handle signIn error", fakeAsync(() => {
      createError("apiCreate", "/security/", apiErrorDetails);
      service
        .signIn(defaultLoginDetails)
        .subscribe(shouldNotSucceed, (err: ApiErrorDetails) => {
          expect(err).toBeTruthy();
          expect(err).toEqual(apiErrorDetails);
        });
    }));

    it("should handle get user error", fakeAsync(() => {
      createResponse(
        "/security/",
        defaultLoginDetails,
        defaultSessionUser,
        undefined
      );

      service
        .signIn(defaultLoginDetails)
        .subscribe(shouldNotSucceed, (err: ApiErrorDetails) => {
          expect(err).toBeTruthy();
          expect(err).toEqual(apiErrorDetails);
        });
    }));

    // TODO Add check for authTrigger triggering on error
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

      expect(service.getLocalUser()).toBeFalsy();
    }));

    it("should update authTrigger trigger", fakeAsync(() => {
      const spy = jasmine.createSpy();
      createSuccess("/security/");

      service.getAuthTrigger().subscribe(spy, shouldNotFail, shouldNotComplete);
      service.signOut().subscribe();

      // Should call auth trigger twice, first time is when the subscription is created
      expect(spy).toHaveBeenCalledTimes(2);
    }));

    it("should handle error", fakeAsync(() => {
      createError("apiDestroy", "/security/", apiErrorDetails);
      service.signOut().subscribe(shouldNotSucceed, (err: ApiErrorDetails) => {
        expect(err).toBeTruthy();
        expect(err).toEqual(apiErrorDetails);
      });
    }));

    // TODO Add check for authTrigger triggering on error
  });
});

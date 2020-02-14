import {
  HttpClientTestingModule,
  HttpTestingController
} from "@angular/common/http/testing";
import { fakeAsync, TestBed, tick } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { Subject } from "rxjs";
import { User } from "src/app/models/User";
import { testAppInitializer } from "src/app/test.helper";
import { ApiErrorDetails } from "./api.interceptor.service";
import { BawApiService } from "./baw-api.service";
import {
  apiErrorDetails,
  apiErrorInfoDetails,
  shouldNotFail,
  shouldNotSucceed
} from "./baw-api.service.spec";
import { MockBawApiService } from "./mock/baseApiMock.service";
import { UserService } from "./user.service";

describe("UserService", () => {
  let httpMock: HttpTestingController;
  let service: UserService;

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
      imports: [HttpClientTestingModule, RouterTestingModule],
      providers: [
        ...testAppInitializer,
        { provide: BawApiService, useClass: MockBawApiService }
      ]
    });

    service = TestBed.get(UserService);
    httpMock = TestBed.get(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe("show", () => {
    function createSuccess(url: string, output: User) {
      spyOn(service as any, "apiShow").and.callFake((path: string) => {
        expect(path).toBe(url);

        const subject = new Subject<User>();

        setTimeout(() => {
          subject.next(output);
          subject.complete();
        }, 50);

        return subject;
      });
    }

    it("should handle response", fakeAsync(() => {
      const userModel = new User({
        id: 1,
        userName: "username"
      });

      createSuccess("/my_account", userModel);

      service.show().subscribe((user: User) => {
        expect(user).toBeTruthy();
        expect(user).toEqual(userModel);
      }, shouldNotFail);

      tick(100);
    }));

    it("should handle error", fakeAsync(() => {
      createError("apiShow", "/my_account", apiErrorDetails);

      service.show().subscribe(shouldNotSucceed, (err: ApiErrorDetails) => {
        expect(err).toBeTruthy();
        expect(err).toEqual(apiErrorDetails);
      });

      tick(100);
    }));

    it("should handle error with info", fakeAsync(() => {
      createError("apiShow", "/my_account", apiErrorInfoDetails);

      service.show().subscribe(shouldNotSucceed, (err: ApiErrorDetails) => {
        expect(err).toBeTruthy();
        expect(err).toEqual(apiErrorInfoDetails);
      });

      tick(100);
    }));
  });
});

import {
  HttpClientTestingModule,
  HttpTestingController
} from "@angular/common/http/testing";
import { fakeAsync, TestBed, tick } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { Subject } from "rxjs";
import { testAppInitializer } from "src/app/app.helper";
import { User } from "src/app/models/User";
import { ApiErrorDetails } from "./api.interceptor";
import { BawApiService } from "./base-api.service";
import { MockBawApiService } from "./mock/baseApiMockService";
import { UserService } from "./user.service";

describe("UserService", () => {
  let httpMock: HttpTestingController;
  let service: UserService;

  const errorResponse = {
    status: 401,
    message: "Unauthorized"
  } as ApiErrorDetails;

  const errorInfoResponse = {
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
  } as ApiErrorDetails;

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

  const shouldNotSucceed = () => {
    fail("Service should not produce a data output");
  };

  const shouldNotFail = () => {
    fail("Service should not produce an error");
  };

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
      createError("apiShow", "/my_account", errorResponse);

      service.show().subscribe(shouldNotSucceed, (err: ApiErrorDetails) => {
        expect(err).toBeTruthy();
        expect(err).toEqual(errorResponse);
      });

      tick(100);
    }));

    it("should handle error with info", fakeAsync(() => {
      createError("apiShow", "/my_account", errorInfoResponse);

      service.show().subscribe(shouldNotSucceed, (err: ApiErrorDetails) => {
        expect(err).toBeTruthy();
        expect(err).toEqual(errorInfoResponse);
      });

      tick(100);
    }));
  });
});

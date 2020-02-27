import {
  HttpClientTestingModule,
  HttpTestingController
} from "@angular/common/http/testing";
import { fakeAsync, TestBed, tick } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { Subject } from "rxjs";
import { User } from "src/app/models/User";
import { testAppInitializer } from "src/app/test.helper";
import { AccountService } from "./account.service";
import { ApiErrorDetails } from "./api.interceptor.service";
import { BawApiService, Filters } from "./baw-api.service";
import {
  apiErrorDetails,
  apiErrorInfoDetails,
  shouldNotFail,
  shouldNotSucceed
} from "./baw-api.service.spec";
import { MockBawApiService } from "./mock/baseApiMock.service";

describe("AccountService", () => {
  let httpMock: HttpTestingController;
  let service: AccountService;

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
        AccountService,
        { provide: BawApiService, useClass: MockBawApiService }
      ]
    });

    service = TestBed.inject(AccountService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe("list", () => {
    function createSuccess(path: string, model: User[]) {
      spyOn(service as any, "apiList").and.callFake((_path: string) => {
        expect(_path).toBe(path);

        const subject = new Subject<User[]>();

        setTimeout(() => {
          subject.next(model);
          subject.complete();
        }, 50);

        return subject;
      });
    }

    it("should handle empty response", fakeAsync(() => {
      const models = [];

      createSuccess("/user_accounts/", models);

      service.list().subscribe((_models: User[]) => {
        expect(_models).toBeTruthy();
        expect(_models).toEqual(models);
      }, shouldNotFail);

      tick(100);
    }));

    it("should handle single user", fakeAsync(() => {
      const models = [
        new User({
          id: 1,
          userName: "username"
        })
      ];

      createSuccess("/user_accounts/", models);

      service.list().subscribe((_models: User[]) => {
        expect(_models).toBeTruthy();
        expect(_models).toEqual(models);
      }, shouldNotFail);

      tick(100);
    }));

    it("should handle multiple users", fakeAsync(() => {
      const models = [
        new User({
          id: 1,
          userName: "username"
        }),
        new User({
          id: 5,
          userName: "username"
        })
      ];

      createSuccess("/user_accounts/", models);

      service.list().subscribe((_models: User[]) => {
        expect(_models).toBeTruthy();
        expect(_models).toEqual(models);
      }, shouldNotFail);

      tick(100);
    }));

    it("should handle error", fakeAsync(() => {
      createError("apiList", "/user_accounts/", apiErrorDetails);

      service.list().subscribe(shouldNotSucceed, (err: ApiErrorDetails) => {
        expect(err).toBeTruthy();
        expect(err).toEqual(apiErrorDetails);
      });

      tick(100);
    }));

    it("should handle error with info", fakeAsync(() => {
      createError("apiList", "/user_accounts/", apiErrorInfoDetails);

      service.list().subscribe(shouldNotSucceed, (err: ApiErrorDetails) => {
        expect(err).toBeTruthy();
        expect(err).toEqual(apiErrorInfoDetails);
      });

      tick(100);
    }));
  });

  describe("filter", () => {
    function createSuccess(path: string, filters: Filters, models: User[]) {
      spyOn(service as any, "apiFilter").and.callFake(
        (_path: string, _filters: Filters) => {
          expect(_path).toBe(path);
          expect(_filters).toBe(filters);

          const subject = new Subject<User[]>();

          setTimeout(() => {
            subject.next(models);
            subject.complete();
          }, 50);

          return subject;
        }
      );
    }

    it("should handle empty filter response", fakeAsync(() => {
      const filters = {} as Filters;
      const models = [];

      createSuccess("/user_accounts/filter", filters, models);

      service.filter(filters).subscribe((_models: User[]) => {
        expect(_models).toBeTruthy();
        expect(_models).toEqual(models);
      }, shouldNotFail);

      tick(100);
    }));

    it("should handle single user", fakeAsync(() => {
      const filters = {} as Filters;
      const models = [
        new User({
          id: 1,
          userName: "username"
        })
      ];

      createSuccess("/user_accounts/filter", filters, models);

      service.filter(filters).subscribe((_models: User[]) => {
        expect(_models).toBeTruthy();
        expect(_models).toEqual(models);
      }, shouldNotFail);

      tick(100);
    }));

    it("should handle multiple users", fakeAsync(() => {
      const filters = {} as Filters;
      const models = [
        new User({
          id: 1,
          userName: "username"
        }),
        new User({
          id: 5,
          userName: "username"
        })
      ];

      createSuccess("/user_accounts/filter", filters, models);

      service.filter(filters).subscribe((_models: User[]) => {
        expect(_models).toBeTruthy();
        expect(_models).toEqual(models);
      }, shouldNotFail);

      tick(100);
    }));

    it("should handle error", fakeAsync(() => {
      const filters = {} as Filters;
      createError("apiFilter", "/user_accounts/filter", apiErrorDetails);

      service
        .filter(filters)
        .subscribe(shouldNotSucceed, (err: ApiErrorDetails) => {
          expect(err).toBeTruthy();
          expect(err).toEqual(apiErrorDetails);
        });

      tick(100);
    }));

    it("should handle error with info", fakeAsync(() => {
      const filters = {} as Filters;
      createError("apiFilter", "/user_accounts/filter", apiErrorInfoDetails);

      service
        .filter(filters)
        .subscribe(shouldNotSucceed, (err: ApiErrorDetails) => {
          expect(err).toBeTruthy();
          expect(err).toEqual(apiErrorInfoDetails);
        });

      tick(100);
    }));

    // TODO Add tests for various types of filters
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

    it("should handle user input", fakeAsync(() => {
      const model = new User({
        id: 1,
        userName: "username"
      });

      createSuccess("/user_accounts/1", model);

      service.show(model).subscribe((_model: User) => {
        expect(_model).toBeTruthy();
        expect(_model).toEqual(model);
      }, shouldNotFail);

      tick(100);
    }));

    it("should handle user id input", fakeAsync(() => {
      const model = new User({
        id: 1,
        userName: "username"
      });

      createSuccess("/user_accounts/1", model);

      service.show(1).subscribe((_model: User) => {
        expect(_model).toBeTruthy();
        expect(_model).toEqual(model);
      }, shouldNotFail);

      tick(100);
    }));

    it("should handle response with random user model id", fakeAsync(() => {
      const model = new User({
        id: 5,
        userName: "username"
      });

      createSuccess("/user_accounts/5", model);

      service.show(model).subscribe((_model: User) => {
        expect(_model).toBeTruthy();
        expect(_model).toEqual(model);
      }, shouldNotFail);

      tick(100);
    }));

    it("should handle response with random user id", fakeAsync(() => {
      const model = new User({
        id: 5,
        userName: "username"
      });

      createSuccess("/user_accounts/5", model);

      service.show(5).subscribe((_model: User) => {
        expect(_model).toBeTruthy();
        expect(_model).toEqual(model);
      }, shouldNotFail);

      tick(100);
    }));

    it("should handle error", fakeAsync(() => {
      createError("apiShow", "/user_accounts/1", apiErrorDetails);

      service.show(1).subscribe(shouldNotSucceed, (err: ApiErrorDetails) => {
        expect(err).toBeTruthy();
        expect(err).toEqual(apiErrorDetails);
      });

      tick(100);
    }));

    it("should handle error with info", fakeAsync(() => {
      createError("apiShow", "/user_accounts/1", apiErrorInfoDetails);

      service.show(1).subscribe(shouldNotSucceed, (err: ApiErrorDetails) => {
        expect(err).toBeTruthy();
        expect(err).toEqual(apiErrorInfoDetails);
      });

      tick(100);
    }));
  });
});

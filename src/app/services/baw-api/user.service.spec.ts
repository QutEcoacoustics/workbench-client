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
import { BawApiService, Filters } from "./base-api.service";
import { MockBawApiService } from "./mock/baseApiMockService";
import { UserService } from "./user.service";

describe("UserService", () => {
  let httpMock: HttpTestingController;
  let service: UserService;

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

  it("should be created", () => {
    expect(service).toBeTruthy();
  });

  /**
   * getUserAccount
   */

  it("should handle response", fakeAsync(() => {
    spyOn<any>(service, "show").and.callFake(
      (path: string, filters: Filters) => {
        expect(path).toBe("/my_account");
        expect(filters).toEqual(null);
        const subject = new Subject<User>();

        setTimeout(() => {
          subject.next(
            new User({
              id: 1,
              userName: "username",
              rolesMask: 3,
              rolesMaskNames: ["user"],
              lastSeenAt: "1970-01-01T00:00:00.000"
            })
          );
          subject.complete();
        }, 50);

        return subject;
      }
    );

    service.show().subscribe(
      (user: User) => {
        expect(user).toBeTruthy();
        expect(user).toEqual(
          new User({
            id: 1,
            userName: "username",
            rolesMask: 3,
            rolesMaskNames: ["user"],
            lastSeenAt: "1970-01-01T00:00:00.000"
          })
        );
      },
      () => {
        expect(true).toBeFalsy("Service should not return an error");
      }
    );

    tick(100);
  }));

  it("should handle error", fakeAsync(() => {
    spyOn<any>(service, "show").and.callFake(
      (path: string, filters: Filters) => {
        expect(path).toBe("/my_account");
        expect(filters).toEqual(null);
        const subject = new Subject<User>();

        setTimeout(() => {
          subject.error({
            status: 401,
            message: "Unauthorized"
          } as ApiErrorDetails);
        }, 50);

        return subject;
      }
    );

    service.show().subscribe(
      () => {
        expect(true).toBeFalsy("Service should not return data");
      },
      (err: ApiErrorDetails) => {
        expect(err).toBeTruthy();
        expect(err).toEqual({
          status: 401,
          message: "Unauthorized"
        } as ApiErrorDetails);
      }
    );

    tick(100);
  }));

  it("should handle error with info", fakeAsync(() => {
    spyOn<any>(service, "show").and.callFake(
      (path: string, filters: Filters) => {
        expect(path).toBe("/my_account");
        expect(filters).toEqual(null);
        const subject = new Subject<User>();

        setTimeout(() => {
          subject.error({
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
          } as ApiErrorDetails);
        }, 50);

        return subject;
      }
    );

    service.show().subscribe(
      () => {
        expect(true).toBeFalsy("Service should not return data");
      },
      (err: ApiErrorDetails) => {
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
        } as ApiErrorDetails);
      }
    );

    tick(100);
  }));
});

import { HttpClientTestingModule } from "@angular/common/http/testing";
import { TestBed } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { User } from "@models/User";
import { testAppInitializer } from "src/app/test.helper";
import { validateApiShow } from "./api-common.helper";
import { BawApiService } from "./baw-api.service";
import { MockBawApiService } from "./mock/baseApiMock.service";
import { UserService } from "./user.service";

describe("UserService", function () {
  beforeEach(function () {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
      providers: [
        ...testAppInitializer,
        UserService,
        { provide: BawApiService, useClass: MockBawApiService },
      ],
    });

    this.service = TestBed.inject(UserService);
  });

  validateApiShow<User, UserService>(
    "/my_account/",
    undefined,
    new User({ id: 5 })
  );
});

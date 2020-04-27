import { HttpClientTestingModule } from "@angular/common/http/testing";
import { TestBed } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { AccountService } from "@baw-api/account.service";
import { BawApiService } from "@baw-api/baw-api.service";
import { MockBawApiService } from "@baw-api/mock/baseApiMock.service";
import { User } from "@models/User";
import {
  validateApiCreate,
  validateApiDestroy,
  validateApiFilter,
  validateApiList,
  validateApiShow,
  validateApiUpdate,
} from "src/app/test/helpers/api-common";
import { testAppInitializer } from "src/app/test/helpers/testbed";

describe("AccountService", () => {
  beforeEach(function () {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
      providers: [
        ...testAppInitializer,
        AccountService,
        { provide: BawApiService, useClass: MockBawApiService },
      ],
    });

    this.service = TestBed.inject(AccountService);
  });

  it("should be created", function () {
    expect(this.service).toBeTruthy();
  });

  validateApiList<User, AccountService>("/user_accounts/");
  validateApiFilter<User, AccountService>("/user_accounts/filter");
  validateApiShow<User, AccountService>(
    "/user_accounts/5",
    5,
    new User({ id: 5 })
  );
  validateApiCreate<User, AccountService>(
    "/user_accounts/",
    new User({ id: 5 })
  );
  validateApiUpdate<User, AccountService>(
    "/user_accounts/5",
    new User({ id: 5 })
  );
  validateApiDestroy<User, AccountService>(
    "/user_accounts/5",
    5,
    new User({ id: 5 })
  );
});

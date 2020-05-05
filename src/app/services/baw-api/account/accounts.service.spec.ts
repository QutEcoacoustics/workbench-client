import { HttpClientTestingModule } from "@angular/common/http/testing";
import { TestBed } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { AccountsService } from "@baw-api/account/accounts.service";
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

describe("AccountsService", () => {
  beforeEach(function () {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
      providers: [
        ...testAppInitializer,
        AccountsService,
        { provide: BawApiService, useClass: MockBawApiService },
      ],
    });

    this.service = TestBed.inject(AccountsService);
  });

  it("should be created", function () {
    expect(this.service).toBeTruthy();
  });

  validateApiList<User, AccountsService>("/user_accounts/");
  validateApiFilter<User, AccountsService>("/user_accounts/filter");
  validateApiShow<User, AccountsService>(
    "/user_accounts/5",
    5,
    new User({ id: 5 })
  );
  validateApiCreate<User, AccountsService>(
    "/user_accounts/",
    new User({ id: 5 })
  );
  validateApiUpdate<User, AccountsService>(
    "/user_accounts/5",
    new User({ id: 5 })
  );
  validateApiDestroy<User, AccountsService>(
    "/user_accounts/5",
    5,
    new User({ id: 5 })
  );
});

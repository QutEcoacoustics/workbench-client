import { HttpClientTestingModule } from "@angular/common/http/testing";
import { TestBed } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { AccountsService } from "@baw-api/account/accounts.service";
import { User } from "@models/User";
import { MockAppConfigModule } from "@services/app-config/app-configMock.module";
import {
  validateApiCreate,
  validateApiDestroy,
  validateApiFilter,
  validateApiList,
  validateApiShow,
  validateApiUpdate,
} from "src/app/test/helpers/api-common";

describe("AccountsService", () => {
  beforeEach(function () {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        MockAppConfigModule,
      ],
      providers: [AccountsService],
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

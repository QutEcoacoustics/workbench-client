import { HttpClientTestingModule } from "@angular/common/http/testing";
import { TestBed } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { AccountsService } from "@baw-api/account/accounts.service";
import { User } from "@models/User";
import { MockAppConfigModule } from "@services/app-config/app-configMock.module";
import { generateUser } from "@test/fakes/User";
import {
  validateApiCreate,
  validateApiDestroy,
  validateApiFilter,
  validateApiList,
  validateApiShow,
  validateApiUpdate,
} from "@test/helpers/api-common";

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

  validateApiList<User, AccountsService>("/user_accounts/");
  validateApiFilter<User, AccountsService>("/user_accounts/filter");
  // TODO Implement additional show unit tests
  validateApiShow<User, AccountsService>(
    "/user_accounts/5",
    5,
    new User(generateUser(5))
  );
  validateApiCreate<User, AccountsService>(
    "/user_accounts/",
    new User(generateUser(5))
  );
  validateApiUpdate<User, AccountsService>(
    "/user_accounts/5",
    new User(generateUser(5))
  );
  validateApiDestroy<User, AccountsService>(
    "/user_accounts/5",
    5,
    new User(generateUser(5))
  );
});

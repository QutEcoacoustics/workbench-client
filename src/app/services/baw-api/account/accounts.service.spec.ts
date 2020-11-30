import { HttpClientTestingModule } from "@angular/common/http/testing";
import { TestBed } from "@angular/core/testing";
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

type Model = User;
type Params = [];
type Service = AccountsService;

describe("AccountsService", () => {
  const createModel = () => new User(generateUser(5));
  const baseUrl = "/user_accounts/";

  beforeEach(function () {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, MockAppConfigModule],
      providers: [AccountsService],
    });

    this.service = TestBed.inject(AccountsService);
  });

  validateApiList<Model, Params, Service>(baseUrl);
  validateApiFilter<Model, Params, Service>(baseUrl + "filter");
  // TODO Implement additional show unit tests
  validateApiShow<Model, Params, Service>(baseUrl + "5", 5, createModel);
  validateApiCreate<Model, Params, Service>(baseUrl, createModel);
  validateApiUpdate<Model, Params, Service>(baseUrl + "5", createModel);
  validateApiDestroy<Model, Params, Service>(baseUrl + "5", 5, createModel);
});

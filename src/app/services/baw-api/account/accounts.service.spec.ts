import { HttpClientTestingModule } from "@angular/common/http/testing";
import { AccountsService } from "@baw-api/account/accounts.service";
import { User } from "@models/User";
import { createServiceFactory } from "@ngneat/spectator";
import { MockAppConfigModule } from "@services/config/configMock.module";
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
  const createModel = () => new User(generateUser({ id: 5 }));
  const baseUrl = "/user_accounts/";
  const createService = createServiceFactory({
    service: AccountsService,
    imports: [HttpClientTestingModule, MockAppConfigModule],
  });

  beforeEach(function () {
    this.service = createService().service;
  });

  validateApiList<Model, Params, Service>(baseUrl);
  validateApiFilter<Model, Params, Service>(baseUrl + "filter");
  // TODO Implement additional show unit tests
  validateApiShow<Model, Params, Service>(baseUrl + "5", 5, createModel);
  validateApiCreate<Model, Params, Service>(baseUrl, createModel);
  validateApiUpdate<Model, Params, Service>(baseUrl + "5", createModel);
  validateApiDestroy<Model, Params, Service>(baseUrl + "5", 5, createModel);
});

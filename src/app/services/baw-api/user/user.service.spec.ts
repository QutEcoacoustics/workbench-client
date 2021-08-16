import { HttpClientTestingModule } from "@angular/common/http/testing";
import { User } from "@models/User";
import { createServiceFactory } from "@ngneat/spectator";
import { MockAppConfigModule } from "@services/config/configMock.module";
import { generateUser } from "@test/fakes/User";
import { validateApiShow } from "@test/helpers/api-common";
import { UserService } from "./user.service";

type Model = User;
type Params = [];
type Service = UserService;

describe("UserService", function () {
  const createModel = () => new User(generateUser({ id: 5 }));
  const baseUrl = "/my_account/";
  const createService = createServiceFactory({
    service: UserService,
    imports: [HttpClientTestingModule, MockAppConfigModule],
  });

  beforeEach(function () {
    this.service = createService().service;
  });

  validateApiShow<Model, Params, Service>(baseUrl, 5, createModel);
});

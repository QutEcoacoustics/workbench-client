import { HttpClientTestingModule } from "@angular/common/http/testing";
import { TestBed } from "@angular/core/testing";
import { User } from "@models/User";
import { MockAppConfigModule } from "@services/config/configMock.module";
import { generateUser } from "@test/fakes/User";
import { validateApiShow } from "@test/helpers/api-common";
import { UserService } from "./user.service";

type Model = User;
type Params = [];
type Service = UserService;

describe("UserService", function () {
  const createModel = () => new User(generateUser(5));
  const baseUrl = "/my_account/";

  beforeEach(function () {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, MockAppConfigModule],
      providers: [UserService],
    });

    this.service = TestBed.inject(UserService);
  });

  validateApiShow<Model, Params, Service>(baseUrl, 5, createModel);
});

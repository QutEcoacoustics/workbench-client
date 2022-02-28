import { HttpClientTestingModule } from "@angular/common/http/testing";
import { User } from "@models/User";
import { createServiceFactory, SpectatorService } from "@ngneat/spectator";
import { MockAppConfigModule } from "@services/config/configMock.module";
import { generateUser } from "@test/fakes/User";
import { validateApiShow } from "@test/helpers/api-common";
import { UserService } from "./user.service";

describe("UserService", (): void => {
  const createModel = () => new User(generateUser({ id: 5 }));
  const baseUrl = "/my_account/";
  let spec: SpectatorService<UserService>;
  const createService = createServiceFactory({
    service: UserService,
    imports: [HttpClientTestingModule, MockAppConfigModule],
  });

  beforeEach((): void => {
    spec = createService();
  });

  validateApiShow(spec, User, baseUrl, 5, createModel);
});

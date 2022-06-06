import { User } from "@models/User";
import { createServiceFactory, SpectatorService } from "@ngneat/spectator";
import { generateUser } from "@test/fakes/User";
import {
  mockServiceImports,
  mockServiceProviders,
  validateApiShow,
} from "@test/helpers/api-common";
import { UserService } from "./user.service";

describe("UserService", (): void => {
  const createModel = () => new User(generateUser({ id: 5 }));
  const baseUrl = "/my_account/";
  let spec: SpectatorService<UserService>;
  const createService = createServiceFactory({
    service: UserService,
    imports: mockServiceImports,
    providers: mockServiceProviders,
  });

  beforeEach(() => {
    spec = createService();
  });

  validateApiShow(() => spec, User, baseUrl, 5, createModel);
});

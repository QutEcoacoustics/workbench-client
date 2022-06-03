import { AccountsService } from "@baw-api/account/accounts.service";
import { User } from "@models/User";
import { createServiceFactory, SpectatorService } from "@ngneat/spectator";
import { generateUser } from "@test/fakes/User";
import {
  mockServiceImports,
  mockServiceProviders,
  validateStandardApi,
} from "@test/helpers/api-common";

describe("AccountsService", (): void => {
  const createModel = () => new User(generateUser({ id: 5 }));
  const baseUrl = "/user_accounts/";
  const updateUrl = baseUrl + "5";
  let spec: SpectatorService<AccountsService>;
  const createService = createServiceFactory({
    service: AccountsService,
    imports: mockServiceImports,
    providers: mockServiceProviders,
  });

  beforeEach((): void => {
    spec = createService();
  });

  validateStandardApi(
    () => spec,
    User,
    baseUrl,
    baseUrl + "filter",
    updateUrl,
    createModel,
    5
  );

  // TODO Implement additional show unit tests
});

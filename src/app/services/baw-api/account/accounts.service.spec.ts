import { HttpClientTestingModule } from "@angular/common/http/testing";
import { AccountsService } from "@baw-api/account/accounts.service";
import { BawApiService } from "@baw-api/baw-api.service";
import { BawSessionService } from "@baw-api/baw-session.service";
import { User } from "@models/User";
import {
  createServiceFactory,
  mockProvider,
  SpectatorService,
} from "@ngneat/spectator";
import { MockAppConfigModule } from "@services/config/configMock.module";
import { generateUser } from "@test/fakes/User";
import { validateStandardApi } from "@test/helpers/api-common";
import { ToastrService } from "ngx-toastr";

describe("AccountsService", (): void => {
  const createModel = () => new User(generateUser({ id: 5 }));
  const baseUrl = "/user_accounts/";
  const updateUrl = baseUrl + "5";
  let spec: SpectatorService<AccountsService>;
  const createService = createServiceFactory({
    service: AccountsService,
    imports: [MockAppConfigModule, HttpClientTestingModule],
    providers: [BawApiService, BawSessionService, mockProvider(ToastrService)],
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

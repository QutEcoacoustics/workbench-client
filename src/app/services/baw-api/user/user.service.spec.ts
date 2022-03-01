import { HttpClientTestingModule } from "@angular/common/http/testing";
import { BawApiService } from "@baw-api/baw-api.service";
import { BawFormApiService } from "@baw-api/baw-form-api.service";
import { BawSessionService } from "@baw-api/baw-session.service";
import { User } from "@models/User";
import {
  createServiceFactory,
  mockProvider,
  SpectatorService,
} from "@ngneat/spectator";
import { MockAppConfigModule } from "@services/config/configMock.module";
import { generateUser } from "@test/fakes/User";
import { validateApiShow } from "@test/helpers/api-common";
import { ToastrService } from "ngx-toastr";
import { UserService } from "./user.service";

describe("UserService", (): void => {
  const createModel = () => new User(generateUser({ id: 5 }));
  const baseUrl = "/my_account/";
  let spec: SpectatorService<UserService>;
  const createService = createServiceFactory({
    service: UserService,
    imports: [MockAppConfigModule, HttpClientTestingModule],
    providers: [
      BawApiService,
      BawFormApiService,
      BawSessionService,
      mockProvider(ToastrService),
    ],
  });

  beforeEach(() => {
    spec = createService();
  });

  validateApiShow(() => spec, User, baseUrl, 5, createModel);
});

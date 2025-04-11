import { AccountsService } from "@baw-api/account/accounts.service";
import { BawApiService } from "@baw-api/baw-api.service";
import { UserConcent } from "@interfaces/apiInterfaces";
import { User } from "@models/User";
import { createServiceFactory, SpectatorService, SpyObject } from "@ngneat/spectator";
import { generateUser } from "@test/fakes/User";
import { mockServiceImports, mockServiceProviders, validateStandardApi } from "@test/helpers/api-common";
import { modelData } from "@test/helpers/faker";
import { of } from "rxjs";

describe("AccountsService", () => {
  const mockModelId = modelData.id();
  const createModel = () => new User(generateUser({ id: mockModelId }));
  const baseUrl = "/user_accounts/";
  const updateUrl: string = baseUrl + mockModelId;
  let spec: SpectatorService<AccountsService>;

  const createService = createServiceFactory({
    service: AccountsService,
    imports: mockServiceImports,
    providers: mockServiceProviders,
  });

  beforeEach(() => {
    spec = createService();
  });

  validateStandardApi(() => spec, User, baseUrl, baseUrl + "filter", updateUrl, createModel, mockModelId);

  describe("opt into communications", () => {
    let bawApi: SpyObject<BawApiService<User>>;

    beforeEach(() => {
      bawApi = spec.inject<BawApiService<User>>(BawApiService);
      spyOn(bawApi, "update").and.returnValue(of(createModel()));
    });

    it("should send the correct api request when a user opts in to communications", () => {
      const user = createModel();
      spec.service.optInContactable(user.id).subscribe();

      expect(bawApi.update).toHaveBeenCalledOnceWith(
        User,
        updateUrl,
        jasmine.objectContaining({ contactable: UserConcent.yes }),
      );
    });

    it("should send the correct api request when a user opts out of communications", () => {
      const user = createModel();
      spec.service.optOutContactable(user.id).subscribe();

      expect(bawApi.update).toHaveBeenCalledOnceWith(
        User,
        updateUrl,
        jasmine.objectContaining({ contactable: UserConcent.no }),
      );
    });
  });

  // TODO Implement additional show unit tests
});

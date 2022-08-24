import { IdOr } from "@baw-api/api-common";
import { Permission } from "@models/Permission";
import { Project } from "@models/Project";
import { createServiceFactory, SpectatorService } from "@ngneat/spectator";
import { generatePermission } from "@test/fakes/Permission";
import {
  mockServiceImports,
  mockServiceProviders,
  validateStandardApi,
} from "@test/helpers/api-common";
import { PermissionsService } from "./permissions.service";

describe("PermissionsService", (): void => {
  const createModel = () => new Permission(generatePermission({ id: 10 }));
  const listUrl = "/projects/5/permissions/";
  const showUrl = listUrl + "10";
  let spec: SpectatorService<PermissionsService>;
  const createService = createServiceFactory({
    service: PermissionsService,
    imports: mockServiceImports,
    providers: mockServiceProviders,
  });

  beforeEach((): void => {
    spec = createService();
  });

  validateStandardApi<Permission, [IdOr<Project>], PermissionsService>(
    () => spec,
    Permission,
    listUrl,
    listUrl + "filter",
    showUrl,
    createModel,
    10, // permission
    5 // project
  );
});

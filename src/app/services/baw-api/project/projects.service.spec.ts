import { HttpClientTestingModule } from "@angular/common/http/testing";
import { IdOr } from "@baw-api/api-common";
import { BawApiService } from "@baw-api/baw-api.service";
import { BawSessionService } from "@baw-api/baw-session.service";
import { ProjectsService } from "@baw-api/project/projects.service";
import { Project } from "@models/Project";
import { User } from "@models/User";
import {
  createServiceFactory,
  mockProvider,
  SpectatorService,
} from "@ngneat/spectator";
import { MockAppConfigModule } from "@services/config/configMock.module";
import { generateProject } from "@test/fakes/Project";
import {
  validateCustomApiFilter,
  validateStandardApi,
} from "@test/helpers/api-common";
import { ToastrService } from "ngx-toastr";

describe("ProjectsService", (): void => {
  const createModel = () => new Project(generateProject({ id: 5 }));
  const baseUrl = "/projects/";
  const updateUrl = baseUrl + "5";
  let spec: SpectatorService<ProjectsService>;
  const createService = createServiceFactory({
    service: ProjectsService,
    imports: [MockAppConfigModule, HttpClientTestingModule],
    providers: [BawApiService, BawSessionService, mockProvider(ToastrService)],
  });

  beforeEach((): void => {
    spec = createService();
  });

  validateStandardApi(
    () => spec,
    Project,
    baseUrl,
    baseUrl + "filter",
    updateUrl,
    createModel,
    5
  );

  validateCustomApiFilter<Project, [IdOr<User>], ProjectsService>(
    () => spec,
    Project,
    baseUrl + "filter",
    "filterByCreator",
    { filter: { creatorId: { eq: 5 } } },
    undefined,
    5
  );
});

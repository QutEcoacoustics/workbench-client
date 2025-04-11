import { IdOr } from "@baw-api/api-common";
import { ProjectsService } from "@baw-api/project/projects.service";
import { Project } from "@models/Project";
import { User } from "@models/User";
import { createServiceFactory, SpectatorService } from "@ngneat/spectator";
import { generateProject } from "@test/fakes/Project";
import {
  mockServiceImports,
  mockServiceProviders,
  validateCustomApiFilter,
  validateStandardApi,
} from "@test/helpers/api-common";

describe("ProjectsService", (): void => {
  const createModel = () => new Project(generateProject({ id: 5 }));
  const baseUrl = "/projects/";
  const updateUrl = baseUrl + "5";
  let spec: SpectatorService<ProjectsService>;
  const createService = createServiceFactory({
    service: ProjectsService,
    imports: mockServiceImports,
    providers: mockServiceProviders,
  });

  beforeEach((): void => {
    spec = createService();
  });

  validateStandardApi(() => spec, Project, baseUrl, baseUrl + "filter", updateUrl, createModel, 5);

  validateCustomApiFilter<Project, [IdOr<User>], ProjectsService>(
    () => spec,
    Project,
    baseUrl + "filter",
    "filterByCreator",
    { filter: { creatorId: { eq: 5 } } },
    undefined,
    5,
  );
});

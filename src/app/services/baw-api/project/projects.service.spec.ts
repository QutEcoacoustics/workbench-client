import { HttpClientTestingModule } from "@angular/common/http/testing";
import { IdOr } from "@baw-api/api-common";
import { ProjectsService } from "@baw-api/project/projects.service";
import { Project } from "@models/Project";
import { User } from "@models/User";
import { createServiceFactory } from "@ngneat/spectator";
import { MockAppConfigModule } from "@services/config/configMock.module";
import { generateProject } from "@test/fakes/Project";
import {
  validateApiCreate,
  validateApiDestroy,
  validateApiFilter,
  validateApiList,
  validateApiShow,
  validateApiUpdate,
  validateCustomApiFilter,
} from "@test/helpers/api-common";

type Model = Project;
type Params = [];
type Service = ProjectsService;

describe("ProjectsService", function () {
  const createModel = () => new Project(generateProject({ id: 5 }));
  const baseUrl = "/projects/";
  const updateUrl = baseUrl + "5";
  const createService = createServiceFactory({
    service: ProjectsService,
    imports: [HttpClientTestingModule, MockAppConfigModule],
  });

  beforeEach(function () {
    this.service = createService().service;
  });

  validateApiList<Model, Params, Service>(baseUrl);
  validateApiFilter<Model, Params, Service>(baseUrl + "filter");
  validateApiShow<Model, Params, Service>(updateUrl, 5, createModel);
  validateApiCreate<Model, Params, Service>(baseUrl, updateUrl, createModel);
  validateApiUpdate<Model, Params, Service>(updateUrl, createModel);
  validateApiDestroy<Model, Params, Service>(updateUrl, 5, createModel);

  validateCustomApiFilter<Model, [...Params, IdOr<User>], Service>(
    baseUrl + "filter",
    "filterByCreator",
    { filter: { creatorId: { eq: 5 } } },
    undefined,
    5
  );
});

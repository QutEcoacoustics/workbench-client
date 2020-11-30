import { HttpClientTestingModule } from "@angular/common/http/testing";
import { TestBed } from "@angular/core/testing";
import { IdOr } from "@baw-api/api-common";
import { ProjectsService } from "@baw-api/project/projects.service";
import { Project } from "@models/Project";
import { User } from "@models/User";
import { MockAppConfigModule } from "@services/app-config/app-configMock.module";
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
  const createModel = () => new Project(generateProject(5));
  const baseUrl = "/projects/";

  beforeEach(function () {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, MockAppConfigModule],
      providers: [ProjectsService],
    });

    this.service = TestBed.inject(ProjectsService);
  });

  validateApiList<Model, Params, Service>(baseUrl);
  validateApiFilter<Model, Params, Service>(baseUrl + "filter");
  validateApiShow<Model, Params, Service>(baseUrl + "5", 5, createModel);
  validateApiCreate<Model, Params, Service>(baseUrl, createModel);
  validateApiUpdate<Model, Params, Service>(baseUrl + "5", createModel);
  validateApiDestroy<Model, Params, Service>(baseUrl + "5", 5, createModel);

  validateCustomApiFilter<Model, [...Params, IdOr<User>], Service>(
    baseUrl + "filter",
    "filterByCreator",
    { filter: { creatorId: { eq: 5 } } },
    undefined,
    5
  );
});

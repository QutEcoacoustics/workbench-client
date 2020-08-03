import { HttpClientTestingModule } from "@angular/common/http/testing";
import { TestBed } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { ProjectsService } from "@baw-api/project/projects.service";
import { Project } from "@models/Project";
import { MockAppConfigModule } from "@services/app-config/app-configMock.module";
import {
  validateApiCreate,
  validateApiDestroy,
  validateApiFilter,
  validateApiList,
  validateApiShow,
  validateApiUpdate,
} from "src/app/test/helpers/api-common";

describe("ProjectsService", function () {
  beforeEach(function () {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        MockAppConfigModule,
      ],
      providers: [ProjectsService],
    });

    this.service = TestBed.inject(ProjectsService);
  });

  it("should be created", function () {
    expect(this.service).toBeTruthy();
  });

  validateApiList<Project, ProjectsService>("/projects/");
  validateApiFilter<Project, ProjectsService>("/projects/filter");
  validateApiShow<Project, ProjectsService>(
    "/projects/5",
    5,
    new Project({ id: 5 })
  );
  validateApiCreate<Project, ProjectsService>(
    "/projects/",
    new Project({ id: 5 })
  );
  validateApiUpdate<Project, ProjectsService>(
    "/projects/5",
    new Project({ id: 5 })
  );
  validateApiDestroy<Project, ProjectsService>(
    "/projects/5",
    5,
    new Project({ id: 5 })
  );
});

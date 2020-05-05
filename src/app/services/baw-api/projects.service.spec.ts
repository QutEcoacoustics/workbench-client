import { HttpClientTestingModule } from "@angular/common/http/testing";
import { TestBed } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { Project } from "@models/Project";
import { testAppInitializer } from "src/app/test/helpers/testbed";
import {
  validateApiCreate,
  validateApiDestroy,
  validateApiFilter,
  validateApiList,
  validateApiShow,
  validateApiUpdate,
} from "../../test/helpers/api-common";
import { BawApiService } from "./baw-api.service";
import { MockBawApiService } from "./mock/baseApiMock.service";
import { ProjectsService } from "./projects.service";

describe("ProjectsService", function () {
  beforeEach(function () {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
      providers: [
        ...testAppInitializer,
        ProjectsService,
        { provide: BawApiService, useClass: MockBawApiService },
      ],
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

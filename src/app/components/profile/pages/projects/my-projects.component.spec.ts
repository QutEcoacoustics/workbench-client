import { RouterTestingModule } from "@angular/router/testing";
import { ApiErrorDetails } from "@baw-api/api.interceptor.service";
import { defaultApiPageSize } from "@baw-api/baw-api.service";
import { MockBawApiModule } from "@baw-api/baw-apiMock.module";
import { ProjectsService } from "@baw-api/project/projects.service";
import { AccessLevel } from "@interfaces/apiInterfaces";
import { Project } from "@models/Project";
import { User } from "@models/User";
import {
  createRoutingFactory,
  SpectatorRouting,
  SpyObject,
} from "@ngneat/spectator";
import { SharedModule } from "@shared/shared.module";
import { generateApiErrorDetails } from "@test/fakes/ApiErrorDetails";
import { generateProject } from "@test/fakes/Project";
import { generateUser } from "@test/fakes/User";
import { assertErrorHandler, assertUri } from "@test/helpers/html";
import { BehaviorSubject } from "rxjs";
import { MyProjectsComponent } from "./my-projects.component";

describe("MyProjectsComponent", () => {
  let api: SpyObject<ProjectsService>;
  let defaultUser: User;
  let defaultProject: Project;
  let spec: SpectatorRouting<MyProjectsComponent>;
  const createComponent = createRoutingFactory({
    component: MyProjectsComponent,
    imports: [SharedModule, RouterTestingModule, MockBawApiModule],
    stubsEnabled: false,
  });

  function setup(model: User, error?: ApiErrorDetails) {
    spec = createComponent({
      detectChanges: false,
      data: {
        resolvers: { user: "resolver" },
        user: { model, error },
      },
    });
    api = spec.inject(ProjectsService);
  }

  function interceptRequest(projects: Project[]) {
    projects?.forEach((project) => {
      project.addMetadata({
        paging: {
          page: 1,
          items: defaultApiPageSize,
          total: 1,
          maxPage: 1,
        },
      });
    });

    api.filter.and.callFake(() => new BehaviorSubject(projects));
  }

  beforeEach(() => {
    defaultUser = new User(generateUser());
    defaultProject = new Project(generateProject());
  });

  it("should create", () => {
    setup(defaultUser);
    interceptRequest([]);
    spec.detectChanges();
    expect(spec.component).toBeTruthy();
  });

  it("should display username in title", () => {
    setup(defaultUser);
    interceptRequest([]);
    spec.detectChanges();
    expect(spec.query("h1 small")).toHaveText(defaultUser.userName);
  });

  it("should handle user error", () => {
    setup(undefined, generateApiErrorDetails());
    interceptRequest([]);
    spec.detectChanges();
    assertErrorHandler(spec.fixture);
  });

  describe("table", () => {
    function getCells() {
      return spec.queryAll<HTMLDivElement>("datatable-body-cell");
    }

    describe("project name", () => {
      it("should display project name", () => {
        setup(defaultUser);
        interceptRequest([defaultProject]);
        spec.detectChanges();

        expect(getCells()[0]).toHaveText(defaultProject.name);
      });

      it("should display project name link", () => {
        setup(defaultUser);
        interceptRequest([defaultProject]);
        spec.detectChanges();

        const link = getCells()[0].querySelector("a");
        assertUri(link, defaultProject.viewUrl);
      });
    });

    it("should display number of site ids", () => {
      setup(defaultUser);
      interceptRequest([defaultProject]);
      spec.detectChanges();

      expect(getCells()[1]).toHaveText(defaultProject.siteIds.size.toString());
    });

    describe("access level", () => {
      (["Reader", "Writer", "Owner"] as AccessLevel[]).forEach(
        (accessLevel) => {
          it(`should display ${accessLevel} permissions`, async () => {
            const project = new Project({ ...generateProject(), accessLevel });

            setup(defaultUser);
            interceptRequest([project]);
            spec.detectChanges();

            expect(getCells()[2]).toHaveText(accessLevel);
          });
        }
      );
    });
  });
});

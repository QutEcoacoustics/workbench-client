import { defaultApiPageSize } from "@baw-api/baw-api.service";
import { provideMockBawApi } from "@baw-api/provide-baw-ApiMock";
import { ProjectsService } from "@baw-api/project/projects.service";
import { titleCase } from "@helpers/case-converter/case-converter";
import { BawApiError } from "@helpers/custom-errors/baw-api-error";
import { PermissionLevel } from "@interfaces/apiInterfaces";
import { Project } from "@models/Project";
import { User } from "@models/User";
import {
  createRoutingFactory,
  SpectatorRouting,
  SpyObject,
} from "@ngneat/spectator";
import { generateBawApiError } from "@test/fakes/BawApiError";
import { generateProject } from "@test/fakes/Project";
import { generateUser } from "@test/fakes/User";
import { assertErrorHandler } from "@test/helpers/html";
import { assertPageInfo } from "@test/helpers/pageRoute";
import { BehaviorSubject } from "rxjs";
import { TheirProjectsComponent } from "./their-projects.component";

describe("TheirProjectsComponent", () => {
  let api: SpyObject<ProjectsService>;
  let defaultUser: User;
  let defaultProject: Project;
  let spec: SpectatorRouting<TheirProjectsComponent>;

  const createComponent = createRoutingFactory({
    component: TheirProjectsComponent,
    providers: [provideMockBawApi()],
    stubsEnabled: false,
  });

  assertPageInfo(TheirProjectsComponent, "Projects");

  function setup(model: User, error?: BawApiError) {
    spec = createComponent({
      detectChanges: false,
      data: {
        resolvers: { account: "resolver" },
        account: { model, error },
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

    api.filterByCreator.and.callFake(() => new BehaviorSubject(projects));
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
    setup(undefined, generateBawApiError());
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
        expect(link).toHaveUrl(defaultProject.viewUrl);
      });
    });

    it("should display number of site ids", () => {
      setup(defaultUser);
      interceptRequest([defaultProject]);
      spec.detectChanges();

      expect(getCells()[1]).toHaveText(defaultProject.siteIds.size.toString());
    });

    describe("access level", () => {
      (["reader", "writer", "owner"] as PermissionLevel[]).forEach(
        (accessLevel) => {
          it(`should display ${accessLevel} permissions`, async () => {
            const project = new Project({ ...generateProject(), accessLevel });

            setup(defaultUser);
            interceptRequest([project]);
            spec.detectChanges();

            expect(getCells()[2]).toHaveText(titleCase(accessLevel));
          });
        }
      );
    });
  });
});

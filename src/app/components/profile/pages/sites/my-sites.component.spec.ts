import { RouterTestingModule } from "@angular/router/testing";
import { defaultApiPageSize } from "@baw-api/baw-api.service";
import { MockBawApiModule } from "@baw-api/baw-apiMock.module";
import { ProjectsService } from "@baw-api/project/projects.service";
import { PROJECT, SHALLOW_SITE } from "@baw-api/ServiceTokens";
import { ShallowSitesService } from "@baw-api/site/sites.service";
import { dataRequestMenuItem } from "@components/data-request/data-request.menus";
import { StrongRouteDirective } from "@directives/strongRoute/strong-route.directive";
import { titleCase } from "@helpers/case-converter/case-converter";
import { BawApiError } from "@helpers/custom-errors/baw-api-error";
import { Id, PermissionLevel } from "@interfaces/apiInterfaces";
import { Project } from "@models/Project";
import { Site } from "@models/Site";
import { User } from "@models/User";
import {
  createRoutingFactory,
  SpectatorRouting,
  SpyObject,
} from "@ngneat/spectator";
import { SharedModule } from "@shared/shared.module";
import { generateBawApiError } from "@test/fakes/BawApiError";
import { generateProject } from "@test/fakes/Project";
import { generateSite } from "@test/fakes/Site";
import { generateUser } from "@test/fakes/User";
import {
  interceptFilterApiRequest,
  interceptMappedApiRequests,
} from "@test/helpers/general";
import { assertErrorHandler } from "@test/helpers/html";
import { assertPageInfo } from "@test/helpers/pageRoute";
import { AssociationInjector } from "@models/ImplementsInjector";
import { ASSOCIATION_INJECTOR } from "@services/association-injector/association-injector.tokens";
import { humanizedDuration } from "@test/helpers/dateTime";
import { modelData } from "@test/helpers/faker";
import { MySitesComponent } from "./my-sites.component";

describe("MySitesComponent", () => {
  let spec: SpectatorRouting<MySitesComponent>;

  let injector: AssociationInjector;
  let sitesApi: SpyObject<ShallowSitesService>;
  let projectsApi: SpyObject<ProjectsService>;

  let defaultUser: User;
  let defaultProject: Project;
  let defaultSite: Site;

  const createComponent = createRoutingFactory({
    component: MySitesComponent,
    imports: [SharedModule, RouterTestingModule, MockBawApiModule],
    stubsEnabled: false,
  });

  assertPageInfo(MySitesComponent, "Sites");

  async function setup(
    model: User = defaultUser,
    sites: Site[] = [defaultSite],
    projects: Project[] = [defaultProject],
    error?: BawApiError
  ) {
    spec = createComponent({
      detectChanges: false,
      data: {
        resolvers: { user: "resolver" },
        user: { model, error },
      },
    });

    injector = spec.inject(ASSOCIATION_INJECTOR);
    sitesApi = spec.inject(SHALLOW_SITE.token);
    projectsApi = spec.inject(PROJECT.token);

    const sitePromise = interceptSiteRequest(sites);
    const projectsPromise = interceptProjectRequest(projects);

    spec.detectChanges();
    await Promise.allSettled([sitePromise, ...projectsPromise]);
    spec.detectChanges();
  }

  function interceptSiteRequest(sites: Site[]) {
    sites?.forEach((site) => {
      site["injector"] = injector;
      site.addMetadata({
        paging: {
          page: 1,
          items: defaultApiPageSize,
          total: 1,
          maxPage: 1,
        },
      });
    });

    return interceptFilterApiRequest(sitesApi, injector, sites, Site);
  }

  function interceptProjectRequest(projects: Project[]) {
    const mockedResponses = new Map<Id, Project>();
    for (const project of projects) {
      mockedResponses.set(project.id, project);
    }

    return interceptMappedApiRequests(projectsApi.show, mockedResponses);
  }

  beforeEach(() => {
    defaultUser = new User(generateUser());

    defaultProject = new Project(generateProject());
    defaultSite = new Site(
      generateSite({
        projectIds: [defaultProject.id],
      })
    );
  });

  it("should create", async () => {
    await setup();
    expect(spec.component).toBeTruthy();
  });

  it("should display username in title", async () => {
    await setup();
    expect(spec.query("h1 small")).toHaveText(defaultUser.userName);
  });

  it("should handle user error", async () => {
    await setup(
      undefined,
      [defaultSite],
      [defaultProject],
      generateBawApiError()
    );
    assertErrorHandler(spec.fixture);
  });

  describe("table", () => {
    function getCells() {
      return spec.queryAll<HTMLDivElement>("datatable-body-cell");
    }

    describe("site name", () => {
      it("should display site name", async () => {
        await setup();
        expect(getCells()[0]).toHaveText(defaultSite.name);
      });

      it("should display site name link", async () => {
        await setup();
        const link = getCells()[0].querySelector("a");
        expect(link).toHaveUrl(defaultSite.viewUrl);
      });

      it("should not display site name link when no projects found", async () => {
        const site = new Site(generateSite({ projectIds: [] }));
        await setup(defaultUser, [site]);

        const link = getCells()[0].querySelector("a");
        expect(link).toBeFalsy();
      });
    });

    it("should display last modified time", async () => {
      await setup();
      const expectedText = humanizedDuration(defaultSite.updatedAt);
      expect(getCells()[1]).toHaveExactTrimmedText(`${expectedText} ago`);
    });

    describe("access level", () => {
      [
        PermissionLevel.reader,
        PermissionLevel.writer,
        PermissionLevel.owner,
      ].forEach((accessLevel) => {
        it(`should display ${accessLevel} permissions`, async () => {
          const projectId = modelData.id();
          const site = new Site(
            generateSite({ projectIds: [projectId] })
          );
          const project = new Project(
            generateProject({ id: projectId, accessLevel })
          );

          await setup(defaultUser, [site], [project]);

          expect(getCells()[2]).toHaveText(titleCase(accessLevel));
        });
      });

      it("should display unknown permissions when no projects found", async () => {
        const site = new Site(generateSite({ projectIds: [1] }));
        await setup(defaultUser, [site], []);
        expect(getCells()[2]).toHaveText("Unknown");
      });

      it("should prioritize owner level permission if multiple projects", async () => {
        const site = new Site(generateSite({ projectIds: [1, 2, 3] }));
        //prettier-ignore
        const projects = [
          new Project(generateProject({ id: 1, accessLevel: PermissionLevel.reader })),
          new Project(generateProject({ id: 2, accessLevel: PermissionLevel.owner })),
          new Project(generateProject({ id: 2, accessLevel: PermissionLevel.writer })),
        ];

        await setup(defaultUser, [site], projects);

        expect(getCells()[2]).toHaveText("Owner");
      });

      it("should prioritize writer level permission if multiple projects and no owner", async () => {
        const site = new Site(generateSite({ projectIds: [1, 2, 3] }));
        // prettier-ignore
        const projects = [
          new Project(generateProject({ id: 1, accessLevel: PermissionLevel.reader })),
          new Project(generateProject({ id: 2, accessLevel: PermissionLevel.writer })),
          new Project(generateProject({ id: 3, accessLevel: PermissionLevel.reader })),
        ];

        await setup(defaultUser, [site], projects);

        expect(getCells()[2]).toHaveText("Writer");
      });
    });

    describe("annotation link", () => {
      function getLink() {
        return spec.queryLast(StrongRouteDirective);
      }

      it("should display annotation link", async () => {
        await setup();
        expect(getCells()[3]).toHaveText("Annotation");
      });

      it("should create annotation link", async () => {
        await setup();
        expect(getLink().strongRoute).toEqual(dataRequestMenuItem.route);
      });

      it("should create annotation link query params", async () => {
        await setup();
        expect(getLink().queryParams).toEqual({ siteId: defaultSite.id });
      });
    });
  });
});

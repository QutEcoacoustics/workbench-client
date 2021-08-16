import { Injector } from "@angular/core";
import { RouterTestingModule } from "@angular/router/testing";
import { ApiErrorDetails } from "@baw-api/api.interceptor.service";
import { defaultApiPageSize } from "@baw-api/baw-api.service";
import { MockBawApiModule } from "@baw-api/baw-apiMock.module";
import { ProjectsService } from "@baw-api/project/projects.service";
import { PROJECT } from "@baw-api/ServiceTokens";
import { ShallowSitesService } from "@baw-api/site/sites.service";
import { dataRequestMenuItem } from "@components/data-request/data-request.menus";
import { StrongRouteDirective } from "@directives/strongRoute/strong-route.directive";
import { AccessLevel } from "@interfaces/apiInterfaces";
import { Project } from "@models/Project";
import { Site } from "@models/Site";
import { User } from "@models/User";
import {
  createRoutingFactory,
  SpectatorRouting,
  SpyObject,
} from "@ngneat/spectator";
import { SharedModule } from "@shared/shared.module";
import { generateApiErrorDetails } from "@test/fakes/ApiErrorDetails";
import { generateProject } from "@test/fakes/Project";
import { generateSite } from "@test/fakes/Site";
import { generateUser } from "@test/fakes/User";
import { nStepObservable } from "@test/helpers/general";
import { assertErrorHandler, assertUrl } from "@test/helpers/html";
import { BehaviorSubject, Subject } from "rxjs";
import { TheirSitesComponent } from "./their-sites.component";

describe("TheirSitesComponent", () => {
  let injector: Injector;
  let defaultUser: User;
  let defaultSite: Site;
  let sitesApi: SpyObject<ShallowSitesService>;
  let projectsApi: SpyObject<ProjectsService>;
  let spec: SpectatorRouting<TheirSitesComponent>;
  const createComponent = createRoutingFactory({
    component: TheirSitesComponent,
    imports: [SharedModule, RouterTestingModule, MockBawApiModule],
    stubsEnabled: false,
  });

  function setup(model: User, error?: ApiErrorDetails) {
    spec = createComponent({
      detectChanges: false,
      data: {
        resolvers: { account: "resolver" },
        account: { model, error },
      },
    });
    injector = spec.inject(Injector);
    sitesApi = spec.inject(ShallowSitesService);
    projectsApi = spec.inject(PROJECT.token);
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

    sitesApi.filterByCreator.and.callFake(() => new BehaviorSubject(sites));
  }

  function interceptProjectRequest(
    projects: Project[],
    error?: ApiErrorDetails
  ) {
    const subject = new Subject();
    projectsApi.filter.and.callFake(() => subject);
    return nStepObservable(subject, () => projects || error, !projects);
  }

  beforeEach(() => {
    defaultUser = new User(generateUser());
    defaultSite = new Site(generateSite());
  });

  it("should create", async () => {
    setup(defaultUser);
    interceptSiteRequest([]);
    spec.detectChanges();
    expect(spec.component).toBeTruthy();
  });

  it("should display username in title", async () => {
    setup(defaultUser);
    interceptSiteRequest([]);
    spec.detectChanges();
    expect(spec.query("h1 small")).toHaveText(defaultUser.userName);
  });

  it("should handle user error", async () => {
    setup(undefined, generateApiErrorDetails());
    interceptSiteRequest([]);
    spec.detectChanges();
    assertErrorHandler(spec.fixture);
  });

  describe("table", () => {
    function getCells() {
      return spec.queryAll<HTMLDivElement>("datatable-body-cell");
    }

    describe("site name", () => {
      it("should display site name", async () => {
        setup(defaultUser);
        interceptSiteRequest([defaultSite]);
        interceptProjectRequest([]);
        spec.detectChanges();

        expect(getCells()[0]).toHaveText(defaultSite.name);
      });

      it("should display site name link", async () => {
        setup(defaultUser);
        interceptSiteRequest([defaultSite]);
        interceptProjectRequest([]);
        spec.detectChanges();

        const link = getCells()[0].querySelector("a");
        assertUrl(link, defaultSite.viewUrl);
      });

      it("should not display site name link when no projects found", () => {
        const site = new Site(generateSite({ projectIds: [] }));
        setup(defaultUser);
        interceptSiteRequest([site]);
        interceptProjectRequest([]);
        spec.detectChanges();

        const link = getCells()[0].querySelector("a");
        expect(link).toBeFalsy();
      });
    });

    it("should display last modified time", async () => {
      setup(defaultUser);
      interceptSiteRequest([defaultSite]);
      interceptProjectRequest([]);
      spec.detectChanges();

      expect(getCells()[1]).toHaveText(defaultSite.updatedAt.toRelative());
    });

    describe("access level", () => {
      [AccessLevel.reader, AccessLevel.writer, AccessLevel.owner].forEach(
        (accessLevel) => {
          it(`should display ${accessLevel} permissions`, async () => {
            const site = new Site(generateSite({ projectIds: [1] }));
            const project = new Project({ ...generateProject(), accessLevel });

            setup(defaultUser);
            interceptSiteRequest([site]);
            const projectPromise = interceptProjectRequest([project]);
            spec.detectChanges();
            await projectPromise;
            spec.detectChanges();

            expect(getCells()[2]).toHaveText(accessLevel);
          });
        }
      );

      it("should display unknown permissions when no projects found", async () => {
        const site = new Site(generateSite({ projectIds: [] }));

        setup(defaultUser);
        interceptSiteRequest([site]);
        const projectPromise = interceptProjectRequest([]);
        spec.detectChanges();
        await projectPromise;
        spec.detectChanges();

        expect(getCells()[2]).toHaveText("Unknown");
      });

      it("should prioritize owner level permission if multiple projects", async () => {
        const site = new Site(generateSite({ projectIds: [1] }));

        setup(defaultUser);
        interceptSiteRequest([site]);
        const projectPromise = interceptProjectRequest([
          new Project(generateProject({ accessLevel: AccessLevel.reader })),
          new Project(generateProject({ accessLevel: AccessLevel.owner })),
          new Project(generateProject({ accessLevel: AccessLevel.writer })),
        ]);
        spec.detectChanges();
        await projectPromise;
        spec.detectChanges();

        expect(getCells()[2]).toHaveText("Owner");
      });

      it("should prioritize writer level permission if multiple projects and no owner", async () => {
        const site = new Site(generateSite({ projectIds: [1] }));

        setup(defaultUser);
        interceptSiteRequest([site]);
        const projectPromise = interceptProjectRequest([
          new Project(generateProject({ accessLevel: AccessLevel.reader })),
          new Project(generateProject({ accessLevel: AccessLevel.writer })),
          new Project(generateProject({ accessLevel: AccessLevel.reader })),
        ]);
        spec.detectChanges();
        await projectPromise;
        spec.detectChanges();

        expect(getCells()[2]).toHaveText("Writer");
      });
    });

    describe("annotation link", () => {
      async function createTable() {
        interceptSiteRequest([defaultSite]);
        const projectPromise = interceptProjectRequest([]);
        spec.detectChanges();
        await projectPromise;
        spec.detectChanges();
      }

      function getLink() {
        return spec.queryLast(StrongRouteDirective);
      }

      it("should display annotation link", async () => {
        setup(defaultUser);
        await createTable();
        expect(getCells()[3]).toHaveText("Annotation");
      });

      it("should create annotation link", async () => {
        setup(defaultUser);
        await createTable();
        expect(getLink().strongRoute).toEqual(dataRequestMenuItem.route);
      });

      it("should create annotation link query params", async () => {
        setup(defaultUser);
        await createTable();
        expect(getLink().queryParams).toEqual({ siteId: defaultSite.id });
      });
    });
  });
});

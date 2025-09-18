import { Router } from "@angular/router";
import { provideMockBawApi } from "@baw-api/provide-baw-ApiMock";
import { projectResolvers } from "@baw-api/project/projects.service";
import { regionResolvers, RegionsService } from "@baw-api/region/regions.service";
import { SitesService } from "@baw-api/site/sites.service";
import { SiteCardComponent } from "@components/projects/components/site-card/site-card.component";
import { SiteMapComponent } from "@components/projects/components/site-map/site-map.component";
import { BawApiError } from "@helpers/custom-errors/baw-api-error";
import { Project } from "@models/Project";
import { Region } from "@models/Region";
import { ISite, Site } from "@models/Site";
import {
  createRoutingFactory,
  SpectatorRouting,
  SpyObject,
} from "@ngneat/spectator";
import { generateBawApiError } from "@test/fakes/BawApiError";
import { generateProject } from "@test/fakes/Project";
import { generateRegion } from "@test/fakes/Region";
import { generateSite } from "@test/fakes/Site";
import { interceptRepeatApiRequests } from "@test/helpers/general";
import { assertErrorHandler } from "@test/helpers/html";
import { assertPageInfo } from "@test/helpers/pageRoute";
import { assertPaginationTemplate } from "@test/helpers/paginationTemplate";
import { MockComponent } from "ng-mocks";
import { ToastService } from "@services/toasts/toasts.service";
import { of } from "rxjs";
import { ConfigService } from "@services/config/config.service";
import { PageTitleStrategy } from "@services/page-title-strategy/page-title-strategy.service";
import { RegionDetailsComponent } from "./details.component";

const mock = {
  map: MockComponent(SiteMapComponent),
  card: MockComponent(SiteCardComponent),
};

describe("RegionDetailsComponent", () => {
  let sitesApi: SpyObject<SitesService>;
  let regionsApi: SpyObject<RegionsService>;
  let routerSpy: SpyObject<Router>;
  let configService: SpyObject<ConfigService>;
  let defaultProject: Project;
  let defaultRegion: Region;
  let spectator: SpectatorRouting<RegionDetailsComponent>;

  const createComponent = createRoutingFactory({
    component: RegionDetailsComponent,
    declarations: [mock.map, mock.card],
    providers: [PageTitleStrategy, provideMockBawApi()],
    mocks: [ToastService],
  });

  assertPageInfo(RegionDetailsComponent, "test name", {
    region: {
      model: new Region(generateRegion({ name: "test name" }))
    },
  });

  function setup(
    project: Project,
    region: Region,
    projectError?: BawApiError,
    regionError?: BawApiError
  ) {
    spectator = createComponent({
      detectChanges: false,
      data: {
        resolvers: {
          project: projectResolvers.show,
          region: regionResolvers.show,
        },
        project: { model: project, error: projectError },
        region: { model: region, error: regionError },
      },
    });

    sitesApi = spectator.inject(SitesService);
    regionsApi = spectator.inject(RegionsService);
    routerSpy = spectator.inject(Router);
  }

  function interceptApiRequest(responses: Site[] | BawApiError) {
    return interceptRepeatApiRequests<ISite, Site[]>(sitesApi.filter, [
      responses,
    ])[0];
  }

  beforeEach(() => {
    defaultProject = new Project(generateProject());
    defaultRegion = new Region(generateRegion({
      projectId: defaultProject.id,
    }));
  });

  it("should create", () => {
    setup(defaultProject, defaultRegion);
    interceptApiRequest([]);
    spectator.detectChanges();
    expect(spectator.component).toBeTruthy();
  });

  it("should display default description if model has none", () => {
    const region = new Region({
      ...generateRegion(),
      descriptionHtml: undefined,
    });
    setup(defaultProject, region);
    interceptApiRequest([]);
    spectator.detectChanges();
    const description = spectator.query<HTMLParagraphElement>(
      "#region_description"
    );
    expect(description.innerHTML.trim()).toContain(
      "<i>No description found</i>"
    );
  });

  it("should display region description", () => {
    setup(defaultProject, defaultRegion);
    interceptApiRequest([]);
    spectator.detectChanges();
    const description = spectator.query<HTMLParagraphElement>(
      "#region_description"
    );
    expect(description.innerHTML.trim()).toContain(
      defaultRegion.descriptionHtml
    );
  });

  describe("error handling", () => {
    it("should handle failure to retrieve project", () => {
      setup(undefined, defaultRegion, generateBawApiError());
      interceptApiRequest([]);
      spectator.detectChanges();
      assertErrorHandler(spectator.fixture);
    });

    it("should handle failure to retrieve region", () => {
      setup(defaultProject, undefined, undefined, generateBawApiError());
      interceptApiRequest([]);
      spectator.detectChanges();
      assertErrorHandler(spectator.fixture);
    });
  });

  assertPaginationTemplate<Site, RegionDetailsComponent>(() => {
    setup(defaultProject, defaultRegion);
    interceptApiRequest([]);
    spectator.detectChanges();
    return spectator;
  });

  // the deleteModel() method should perform differently depending on if projects are hidden
  [false, true].forEach((projectsHidden: boolean) => {
    describe(`deleteModel ${projectsHidden ? "with" : "without"} projects hidden`, () => {
      beforeEach(() => {
        setup(defaultProject, defaultRegion);
        configService ||= spectator.inject(ConfigService);
        configService.settings.hideProjects = projectsHidden;
      });
      afterEach(() => configService.settings.hideProjects = false);

      it("should invoke the correct api calls when the deleteModel() method is called", () => {
        interceptApiRequest([]);
        regionsApi.destroy.and.callFake(() => of(null));
        spectator.detectChanges();

        spectator.component.deleteModel();

        expect(regionsApi.destroy).toHaveBeenCalledWith(defaultRegion, defaultProject);
      });

      it(`should navigate to the ${projectsHidden ? "regions list" : "parent project details"} page when deleteModel() succeeds`, () => {
        const expectedRoute = projectsHidden ? "/regions" : `/projects/${defaultProject.id}`;
        interceptApiRequest([]);
        regionsApi.destroy.and.callFake(() => of(null));
        spectator.detectChanges();

        spectator.component.deleteModel();

        expect(routerSpy.navigateByUrl).toHaveBeenCalledWith(expectedRoute);
      });
    });
  });

  describe("maps", () => {
    function getMap() {
      return spectator.query(SiteMapComponent);
    }

    it("should hide maps component when no sites exist", async () => {
      setup(defaultProject, defaultRegion);
      const promise = interceptApiRequest([]);
      spectator.detectChanges();
      await promise;
      spectator.detectChanges();
      expect(getMap()).toBeFalsy();
    });

    it("should display maps component when sites exist", async () => {
      setup(defaultProject, defaultRegion);
      const promise = interceptApiRequest([new Site(generateSite())]);
      spectator.detectChanges();
      await promise;
      spectator.detectChanges();
      expect(getMap()).toBeTruthy();
    });

    it("should provide project to maps component", async () => {
      setup(defaultProject, defaultRegion);
      const promise = interceptApiRequest([new Site(generateSite())]);
      spectator.detectChanges();
      await promise;
      spectator.detectChanges();
      expect(getMap().project()).toEqual(defaultProject);
    });

    it("should provide region to maps component", async () => {
      setup(defaultProject, defaultRegion);
      const promise = interceptApiRequest([new Site(generateSite())]);
      spectator.detectChanges();
      await promise;
      spectator.detectChanges();
      expect(getMap().region()).toEqual(defaultRegion);
    });
  });

  describe("sites", () => {
    function getPlaceholder() {
      return spectator.query("p.lead");
    }

    function getSiteCards() {
      return spectator.queryAll(SiteCardComponent);
    }

    function assertSiteCard(
      card: SiteCardComponent,
      project: Project,
      site: Site
    ) {
      expect(card).toBeTruthy();
      expect(card.project).toEqual(project);
      expect(card.site).toEqual(site);
    }

    it("should display placeholder when no sites found", async () => {
      setup(defaultProject, defaultRegion);
      const promise = interceptApiRequest([]);
      spectator.detectChanges();
      await promise;
      spectator.detectChanges();
      expect(getPlaceholder()).toBeTruthy();
      expect(getSiteCards().length).toBe(0);
    });

    it("should hide placeholder when sites found", async () => {
      setup(defaultProject, defaultRegion);
      const promise = interceptApiRequest([new Site(generateSite())]);
      spectator.detectChanges();
      await promise;
      spectator.detectChanges();
      expect(getPlaceholder()).toBeFalsy();
    });

    it("should display single site card", async () => {
      const site = new Site(generateSite());
      setup(defaultProject, defaultRegion);
      const promise = interceptApiRequest([site]);
      spectator.detectChanges();
      await promise;
      spectator.detectChanges();
      const cards = getSiteCards();
      expect(cards.length).toBe(1);
      assertSiteCard(cards[0], defaultProject, site);
    });

    it("should display multiple site cards", async () => {
      const sites = [
        new Site(generateSite()),
        new Site(generateSite()),
        new Site(generateSite()),
      ];
      setup(defaultProject, defaultRegion);
      const promise = interceptApiRequest(sites);
      spectator.detectChanges();
      await promise;
      spectator.detectChanges();
      const cards = getSiteCards();

      expect(cards.length).toBe(3);
      sites.forEach((site, index) => {
        assertSiteCard(cards[index], defaultProject, site);
      });
    });
  });
});

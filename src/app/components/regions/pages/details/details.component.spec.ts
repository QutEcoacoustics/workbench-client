import { ApiErrorDetails } from "@baw-api/api.interceptor.service";
import { MockBawApiModule } from "@baw-api/baw-apiMock.module";
import { projectResolvers } from "@baw-api/project/projects.service";
import { regionResolvers } from "@baw-api/region/regions.service";
import { SitesService } from "@baw-api/site/sites.service";
import { SiteCardComponent } from "@components/projects/site-card/site-card.component";
import { SiteMapComponent } from "@components/projects/site-map/site-map.component";
import { Project } from "@models/Project";
import { Region } from "@models/Region";
import { ISite, Site } from "@models/Site";
import {
  createRoutingFactory,
  SpectatorRouting,
  SpyObject,
} from "@ngneat/spectator";
import { SharedModule } from "@shared/shared.module";
import { generateApiErrorDetails } from "@test/fakes/ApiErrorDetails";
import { generateProject } from "@test/fakes/Project";
import { generateRegion } from "@test/fakes/Region";
import { generateSite } from "@test/fakes/Site";
import { interceptApiRequests } from "@test/helpers/general";
import { assertErrorHandler } from "@test/helpers/html";
import { assertPaginationTemplate } from "@test/helpers/paginationTemplate";
import { MockComponent } from "ng-mocks";
import { DetailsComponent } from "./details.component";

const mock = {
  map: MockComponent(SiteMapComponent),
  card: MockComponent(SiteCardComponent),
};

describe("RegionDetailsComponent", () => {
  let api: SpyObject<SitesService>;
  let defaultProject: Project;
  let defaultRegion: Region;
  let spectator: SpectatorRouting<DetailsComponent>;
  const createComponent = createRoutingFactory({
    imports: [SharedModule, MockBawApiModule],
    declarations: [mock.map, mock.card],
    component: DetailsComponent,
  });

  function setup(
    project: Project,
    region: Region,
    projectError?: ApiErrorDetails,
    regionError?: ApiErrorDetails
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

    api = spectator.inject(SitesService);
  }

  function interceptApiRequest(responses: Site[] | ApiErrorDetails) {
    return interceptApiRequests<ISite, Site[]>(api.filter, [responses])[0];
  }

  beforeEach(() => {
    defaultProject = new Project(generateProject());
    defaultRegion = new Region(generateRegion());
  });

  it("should create", () => {
    setup(defaultProject, defaultRegion);
    interceptApiRequest([]);
    spectator.detectChanges();
    expect(spectator.component).toBeTruthy();
  });

  it("should display project and region names in title", () => {
    setup(defaultProject, defaultRegion);
    interceptApiRequest([]);
    spectator.detectChanges();
    const title = spectator.query<HTMLHeadingElement>("h1");
    expect(title.innerText.trim()).toBe(
      `Project: ${defaultProject.name}\n${defaultRegion.name}`
    );
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
      setup(undefined, defaultRegion, generateApiErrorDetails());
      interceptApiRequest([]);
      spectator.detectChanges();
      assertErrorHandler(spectator.fixture);
    });

    it("should handle failure to retrieve region", () => {
      setup(defaultProject, undefined, undefined, generateApiErrorDetails());
      interceptApiRequest([]);
      spectator.detectChanges();
      assertErrorHandler(spectator.fixture);
    });
  });

  assertPaginationTemplate<Site, DetailsComponent>(() => {
    setup(defaultProject, defaultRegion);
    interceptApiRequest([]);
    spectator.detectChanges();
    return spectator;
  });

  describe("maps", () => {
    function getMap() {
      return spectator.query(mock.map);
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
      expect(getMap().project).toEqual(defaultProject);
    });

    it("should provide region to maps component", async () => {
      setup(defaultProject, defaultRegion);
      const promise = interceptApiRequest([new Site(generateSite())]);
      spectator.detectChanges();
      await promise;
      spectator.detectChanges();
      expect(getMap().region).toEqual(defaultRegion);
    });
  });

  describe("sites", () => {
    function getPlaceholder() {
      return spectator.query("p.lead");
    }

    function getSiteCards() {
      return spectator.queryAll(mock.card);
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

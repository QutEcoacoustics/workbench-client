import { RouterTestingModule } from "@angular/router/testing";
import { ApiErrorDetails } from "@baw-api/api.interceptor.service";
import { Filters } from "@baw-api/baw-api.service";
import { MockBawApiModule } from "@baw-api/baw-apiMock.module";
import { projectResolvers } from "@baw-api/project/projects.service";
import { SitesService } from "@baw-api/site/sites.service";
import { SiteCardComponent } from "@components/projects/site-card/site-card.component";
import { Project } from "@models/Project";
import { ISite, Site } from "@models/Site";
import {
  createRoutingFactory,
  SpectatorRouting,
  SpyObject,
} from "@ngneat/spectator";
import { assetRoot } from "@services/app-config/app-config.service";
import { MapComponent } from "@shared/map/map.component";
import { SharedModule } from "@shared/shared.module";
import { generateApiErrorDetails } from "@test/fakes/ApiErrorDetails";
import { generateProject } from "@test/fakes/Project";
import { generateSite } from "@test/fakes/Site";
import { nStepObservable } from "@test/helpers/general";
import { assertErrorHandler, assertImage } from "@test/helpers/html";
import { websiteHttpUrl } from "@test/helpers/url";
import { MockComponent } from "ng-mocks";
import { InfiniteScrollModule } from "ngx-infinite-scroll";
import { Subject } from "rxjs";
import { DetailsComponent } from "./details.component";

const MockMapComponent = MockComponent(MapComponent);
const MockSiteCardComponent = MockComponent(SiteCardComponent);

describe("ProjectDetailsComponent", () => {
  let api: SpyObject<SitesService>;
  let spectator: SpectatorRouting<DetailsComponent>;
  const createComponent = createRoutingFactory({
    component: DetailsComponent,
    declarations: [MockMapComponent, MockSiteCardComponent],
    imports: [
      SharedModule,
      RouterTestingModule,
      MockBawApiModule,
      InfiniteScrollModule,
    ],
  });

  function setup(model: Project, error?: ApiErrorDetails) {
    spectator = createComponent({
      detectChanges: false,
      data: {
        resolvers: { project: projectResolvers.show },
        project: { model, error },
      },
    });

    api = spectator.inject(SitesService);
  }

  function generateSites(
    numSites: number,
    maxPage: number,
    overrides: ISite = {}
  ): Site[] {
    const sites = [];
    for (let i = 0; i < numSites; i++) {
      const site = new Site({ ...generateSite(), ...overrides });
      site.addMetadata({ paging: { maxPage } } as any);
      sites.push(site);
    }
    return sites;
  }

  async function handleApiRequest(
    models: Site[],
    error?: ApiErrorDetails,
    assertFilter: (filters: Filters<ISite>) => void = () => {}
  ) {
    const subject = new Subject<Site[]>();
    const promise = nStepObservable(subject, () => models ?? error, !models);
    api.filter.and.callFake((filters) => {
      assertFilter(filters);
      return subject;
    });

    spectator.detectChanges();
    await promise;
    spectator.detectChanges();
  }

  it("should create", async () => {
    setup(new Project(generateProject()));
    await handleApiRequest([]);
    spectator.detectChanges();
    expect(spectator.component).toBeTruthy();
  });

  describe("Error Handling", () => {
    it("should handle failed project model", async () => {
      setup(undefined, generateApiErrorDetails());
      await handleApiRequest([]);
      spectator.detectChanges();
      assertErrorHandler(spectator.fixture);
    });

    it("should handle failed site model", async () => {
      setup(new Project(generateProject()));
      await handleApiRequest(undefined, generateApiErrorDetails());
      spectator.detectChanges();
      assertErrorHandler(spectator.fixture, true);
    });
  });

  describe("Project", () => {
    it("should display project name", async () => {
      const project = new Project(generateProject());
      setup(project);
      await handleApiRequest([]);
      spectator.detectChanges();

      const title = spectator.query<HTMLHeadingElement>("h1");
      expect(title).toBeTruthy();
      expect(title.innerText).toBe(project.name);
    });

    it("should display default project image", async () => {
      const project = new Project({
        ...generateProject(),
        imageUrl: undefined,
      });
      setup(project);
      await handleApiRequest([]);
      spectator.detectChanges();

      const image = spectator.query<HTMLImageElement>("img");
      assertImage(
        image,
        `${websiteHttpUrl}${assetRoot}/images/project/project_span4.png`,
        project.name + " image"
      );
    });

    it("should display custom project image", async () => {
      const project = new Project({
        ...generateProject(),
        imageUrl: "http://brokenlink/",
      });
      setup(project);
      await handleApiRequest([]);
      spectator.detectChanges();

      const image = spectator.query<HTMLImageElement>("img");
      assertImage(image, "http://brokenlink/", project.name + " image");
    });

    it("should display description with html markup", async () => {
      const project = new Project({
        ...generateProject(),
        descriptionHtml: "<b>A test project</b>",
      });
      setup(project);
      await handleApiRequest([]);
      spectator.detectChanges();

      const description = spectator.query("p#project_description");
      expect(description).toBeTruthy();
      expect(description.innerHTML).toBe("<b>A test project</b>");
    });
  });

  describe("Sites", () => {
    function getSiteCards() {
      return spectator.queryAll(MockSiteCardComponent);
    }

    function assertCard(card: SiteCardComponent, project: Project, site: Site) {
      expect(card.project).toEqual(project);
      expect(card.site).toEqual(site);
    }

    it("should display no sites found message", async () => {
      setup(new Project(generateProject()));
      await handleApiRequest([]);
      spectator.detectChanges();

      const placeholder = spectator.query<HTMLElement>("p#site_placeholder");
      expect(placeholder).toBeTruthy();
      expect(placeholder.innerText).toBe(
        "No sites associated with this project"
      );
    });

    it("should handle single site", async () => {
      setup(new Project(generateProject()));
      await handleApiRequest(generateSites(1, 1));
      spectator.detectChanges();
      expect(getSiteCards().length).toBe(1);
    });

    it("should display single site card", async () => {
      const sites = generateSites(1, 1, { name: "Custom Site" });
      const project = new Project(generateProject());
      setup(project);
      await handleApiRequest(sites);
      spectator.detectChanges();
      assertCard(getSiteCards()[0], project, sites[0]);
    });

    it("should handle multiple sites", async () => {
      const sites = generateSites(2, 1);
      const project = new Project(generateProject());
      setup(project);
      await handleApiRequest(sites);
      spectator.detectChanges();
      expect(getSiteCards().length).toBe(2);
    });

    it("should display multiple sites cards in order", async () => {
      const sites = generateSites(2, 1);
      const project = new Project(generateProject());
      setup(project);
      await handleApiRequest(sites);
      spectator.detectChanges();
      assertCard(getSiteCards()[0], project, sites[0]);
      assertCard(getSiteCards()[1], project, sites[1]);
    });
  });

  describe("Google Maps", () => {
    function getGoogleMap() {
      return spectator.query(MockMapComponent);
    }

    it("should display google maps placeholder box when no sites found", async () => {
      setup(new Project(generateProject()));
      await handleApiRequest([]);
      spectator.detectChanges();
      expect(getGoogleMap().markers).toEqual([]);
    });

    it("should display google maps with pin for single site", async () => {
      const sites = generateSites(1, 1);
      setup(new Project(generateProject()));
      await handleApiRequest(sites);
      spectator.detectChanges();
      expect(getGoogleMap().markers).toEqual([sites[0].getMapMarker()]);
    });

    it("should display google maps with pins for multiple sites", async () => {
      const sites = generateSites(3, 1);
      setup(new Project(generateProject()));
      await handleApiRequest(sites);
      spectator.detectChanges();
      expect(getGoogleMap().markers).toEqual(
        sites.map((site) => site.getMapMarker())
      );
    });

    it("should display google maps with pins for multiple sites where some don't have location", async () => {
      const sitesWithMarker = generateSites(3, 1);
      const sitesNoMarker = generateSites(3, 1, {
        latitude: undefined,
        customLatitude: undefined,
        longitude: undefined,
        customLongitude: undefined,
      });

      setup(new Project(generateProject()));
      await handleApiRequest([...sitesWithMarker, ...sitesNoMarker]);
      spectator.detectChanges();
      expect(getGoogleMap().markers).toEqual(
        sitesWithMarker.map((site) => site.getMapMarker())
      );
    });
  });
});

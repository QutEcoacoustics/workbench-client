import { RouterTestingModule } from "@angular/router/testing";
import { ApiErrorDetails } from "@baw-api/api.interceptor.service";
import { defaultApiPageSize, Filters } from "@baw-api/baw-api.service";
import { MockBawApiModule } from "@baw-api/baw-apiMock.module";
import { projectResolvers } from "@baw-api/project/projects.service";
import { SitesService } from "@baw-api/site/sites.service";
import { RegionCardsComponent } from "@components/projects/region-cards/region-cards.component";
import { SiteCardsComponent } from "@components/projects/site-cards/site-cards.component";
import { Project } from "@models/Project";
import { ISite, Site } from "@models/Site";
import {
  createRoutingFactory,
  SpectatorRouting,
  SpyObject,
} from "@ngneat/spectator";
import { assetRoot } from "@services/app-config/app-config.service";
import { SharedModule } from "@shared/shared.module";
import { generateApiErrorDetails } from "@test/fakes/ApiErrorDetails";
import { generateProject } from "@test/fakes/Project";
import { generateSite } from "@test/fakes/Site";
import { nStepObservable } from "@test/helpers/general";
import {
  assertErrorHandler,
  assertImage,
  assertSpinner,
} from "@test/helpers/html";
import { websiteHttpUrl } from "@test/helpers/url";
import { MockComponent } from "ng-mocks";
import { Subject } from "rxjs";
import { DetailsComponent } from "./details.component";

const mockComponents = {
  SiteCards: MockComponent(SiteCardsComponent),
  RegionCards: MockComponent(RegionCardsComponent),
};

describe("ProjectDetailsComponent", () => {
  let api: SpyObject<SitesService>;
  let spectator: SpectatorRouting<DetailsComponent>;
  const createComponent = createRoutingFactory({
    component: DetailsComponent,
    declarations: [mockComponents.SiteCards, mockComponents.RegionCards],
    imports: [SharedModule, RouterTestingModule, MockBawApiModule],
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

  function generateSites(numSites: number, overrides: ISite = {}): Site[] {
    const sites = [];
    for (let i = 0; i < Math.min(numSites, defaultApiPageSize); i++) {
      const site = new Site({ ...generateSite(), ...overrides });
      site.addMetadata({ paging: { total: numSites } } as any);
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

  it("should initially request page 1", async () => {
    setup(new Project(generateProject()));
    await handleApiRequest([], undefined, (filter) =>
      expect(filter.paging.page).toBe(1)
    );
  });

  it("should display loading animation during request", async () => {
    setup(new Project(generateProject()));
    handleApiRequest([]);
    assertSpinner(spectator.fixture, true);
  });

  it("should clear loading animation on response", async () => {
    setup(new Project(generateProject()));
    await handleApiRequest([]);
    assertSpinner(spectator.fixture, false);
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

  /* describe("Sites", () => {
    function getSiteCards() {
      return spectator.queryAll(mockComponents.SiteCard);
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
      await handleApiRequest(generateSites(1));
      spectator.detectChanges();
      expect(getSiteCards().length).toBe(1);
    });

    it("should display single site card", async () => {
      const sites = generateSites(1, { name: "Custom Site" });
      const project = new Project(generateProject());
      setup(project);
      await handleApiRequest(sites);
      spectator.detectChanges();
      assertCard(getSiteCards()[0], project, sites[0]);
    });

    it("should handle multiple sites", async () => {
      const sites = generateSites(2);
      const project = new Project(generateProject());
      setup(project);
      await handleApiRequest(sites);
      spectator.detectChanges();
      expect(getSiteCards().length).toBe(2);
    });

    it("should display multiple sites cards in order", async () => {
      const sites = generateSites(2);
      const project = new Project(generateProject());
      setup(project);
      await handleApiRequest(sites);
      spectator.detectChanges();
      assertCard(getSiteCards()[0], project, sites[0]);
      assertCard(getSiteCards()[1], project, sites[1]);
    });
  });

  describe("sites map", () => {
    function getGoogleMap() {
      return spectator.query(mockComponents.SiteMap);
    }

    it("should display site map component", async () => {
      setup(new Project(generateProject()));
      await handleApiRequest([]);
      spectator.detectChanges();
      expect(getGoogleMap()).toBeTruthy();
    });
  });

  describe("scrolling", () => {
    function getPagination() {
      return spectator.query(NgbPagination);
    }

    function getPaginationLinks() {
      return spectator.queryAll("ngb-pagination a");
    }

    it("should hide pagination if less than one page of models", async () => {
      setup(new Project(generateProject()));
      await handleApiRequest(generateSites(5));
      expect(getPagination()).toBeFalsy();
    });

    it("should display pagination if more than one page of models", async () => {
      setup(new Project(generateProject()));
      await handleApiRequest(generateSites(defaultApiPageSize * 2));
      expect(getPagination()).toBeTruthy();
    });

    it("should display correct number of pages", async () => {
      setup(new Project(generateProject()));
      await handleApiRequest(generateSites(defaultApiPageSize * 3));
      // 3 Pages, 2 additional options to select forwards and back
      expect(getPaginationLinks().length).toBe(3 + 2);
    });
  });

  describe("filtering", () => {
    function getFilter() {
      return spectator.query(DebounceInputComponent);
    }

    it("should have filtering option", async () => {
      setup(new Project(generateProject()));
      await handleApiRequest(generateSites(3));
      expect(getFilter()).toBeTruthy();
    });

    it("should have default value attached", async () => {
      setup(new Project(generateProject()));
      await handleApiRequest(generateSites(3));
      spectator.component.filter = "custom value";
      spectator.detectChanges();
      expect(getFilter().default).toBe("custom value");
    });

    it("should call onFilter when event detected", async () => {
      setup(new Project(generateProject()));
      await handleApiRequest(generateSites(3));
      spyOn(spectator.component, "onFilter").and.stub();
      getFilter().filter.next("custom value");
      expect(spectator.component.onFilter).toHaveBeenCalled();
    });
  }); */
});

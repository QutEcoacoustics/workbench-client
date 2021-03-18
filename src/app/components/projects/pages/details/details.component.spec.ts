import { componentFactoryName } from "@angular/compiler";
import { ApiErrorDetails } from "@baw-api/api.interceptor.service";
import { defaultApiPageSize } from "@baw-api/baw-api.service";
import { MockBawApiModule } from "@baw-api/baw-apiMock.module";
import { projectResolvers } from "@baw-api/project/projects.service";
import { RegionsService } from "@baw-api/region/regions.service";
import { SitesService } from "@baw-api/site/sites.service";
import { SiteCardComponent } from "@components/projects/site-card/site-card.component";
import { SiteMapComponent } from "@components/projects/site-map/site-map.component";
import { AbstractModel } from "@models/AbstractModel";
import { Project } from "@models/Project";
import { IRegion, Region } from "@models/Region";
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
import {
  FilterExpectations,
  interceptApiRequests,
} from "@test/helpers/general";
import { assertErrorHandler } from "@test/helpers/html";
import { assertPaginationTemplate } from "@test/helpers/paginationTemplate";
import { MockComponent } from "ng-mocks";
import { DetailsComponent } from "./details.component";

const mock = {
  map: MockComponent(SiteMapComponent),
  card: MockComponent(SiteCardComponent),
};

describe("ProjectDetailsComponent", () => {
  let siteApi: SpyObject<SitesService>;
  let regionApi: SpyObject<RegionsService>;
  let defaultProject: Project;
  let spectator: SpectatorRouting<DetailsComponent>;
  let component: DetailsComponent;
  const createComponent = createRoutingFactory({
    imports: [SharedModule, MockBawApiModule],
    declarations: [mock.map, mock.card],
    component: DetailsComponent,
  });
  const emptyResponse = [[]];

  function createModelWithMeta<M extends AbstractModel>(
    construct: (id: number) => M,
    numModels: number
  ) {
    const models: M[][] = [];
    const maxPages = Math.ceil(numModels / defaultApiPageSize);
    const getMinModelIdInPage = (page: number) => page * defaultApiPageSize;
    const getMaxModelIdInPage = (page: number) =>
      numModels - page * defaultApiPageSize;

    for (let page = 0; page < maxPages; page++) {
      models.push([]);
      for (
        let itemNo = getMinModelIdInPage(page);
        itemNo < getMaxModelIdInPage(page);
        itemNo++
      ) {
        const model = construct(itemNo);
        model.addMetadata({ paging: { total: numModels } });
        models[page].push(model);
      }
    }

    return models;
  }

  function createSitesWithMeta(numSites: number) {
    return createModelWithMeta<Site>(
      (id) => new Site(generateSite(id)),
      numSites
    );
  }

  function createRegionsWithMeta(numRegions: number) {
    return createModelWithMeta<Region>(
      (id) => new Region(generateRegion(id)),
      numRegions
    );
  }

  function setup(model: Project, error?: ApiErrorDetails) {
    spectator = createComponent({
      detectChanges: false,
      data: {
        resolvers: { project: projectResolvers.show },
        project: { model, error },
      },
    });

    component = spectator.component;
    siteApi = spectator.inject(SitesService);
    regionApi = spectator.inject(RegionsService);
  }

  function interceptApiRequest(
    siteResponses: (Site[] | ApiErrorDetails)[],
    regionResponses: (Region[] | ApiErrorDetails)[],
    siteExpectations?: FilterExpectations<ISite>[],
    regionExpectations?: FilterExpectations<IRegion>[]
  ) {
    const sitePromises = interceptApiRequests<ISite, Site[]>(
      siteApi.filterByRegion,
      siteResponses,
      siteExpectations
    );
    const regionPromises = interceptApiRequests<IRegion, Region[]>(
      regionApi.filter,
      regionResponses,
      regionExpectations
    );

    return { sites: sitePromises, regions: regionPromises };
  }

  async function awaitChanges(promises: {
    sites: Promise<void>[];
    regions: Promise<void>[];
  }) {
    const promise = Promise.all([...promises.sites, ...promises.regions]);
    await promise;
    spectator.detectChanges();
  }

  beforeEach(() => {
    defaultProject = new Project(generateProject());
  });

  it("should create", () => {
    setup(defaultProject);
    interceptApiRequest(emptyResponse, emptyResponse);
    spectator.detectChanges();
    expect(component).toBeTruthy();
  });

  it("should display project names in title", () => {
    setup(defaultProject);
    interceptApiRequest(emptyResponse, emptyResponse);
    spectator.detectChanges();
    const title = spectator.query<HTMLHeadingElement>("h1");
    expect(title.innerText.trim()).toBe(defaultProject.name);
  });

  it("should display default description if model has none", () => {
    const project = new Project({
      ...generateProject(),
      descriptionHtml: undefined,
    });
    setup(project);
    interceptApiRequest(emptyResponse, emptyResponse);
    spectator.detectChanges();
    const description = spectator.query<HTMLParagraphElement>(
      "#project_description"
    );
    expect(description.innerHTML.trim()).toContain(
      "<i>No description found</i>"
    );
  });

  it("should display project description", () => {
    setup(defaultProject);
    interceptApiRequest(emptyResponse, emptyResponse);
    spectator.detectChanges();
    const description = spectator.query<HTMLParagraphElement>(
      "#project_description"
    );
    expect(description.innerHTML.trim()).toContain(
      defaultProject.descriptionHtml
    );
  });

  describe("error handling", () => {
    it("should handle failure to retrieve project", () => {
      setup(undefined, generateApiErrorDetails());
      interceptApiRequest(emptyResponse, emptyResponse);
      spectator.detectChanges();
      assertErrorHandler(spectator.fixture);
    });
  });

  assertPaginationTemplate<any, DetailsComponent>(() => {
    setup(defaultProject);
    interceptApiRequest(emptyResponse, emptyResponse);
    spectator.detectChanges();
    return spectator;
  });

  describe("maps", () => {
    function getMap() {
      return spectator.query(mock.map);
    }

    it("should hide maps component when no sites exist", async () => {
      setup(defaultProject);
      const promise = interceptApiRequest(emptyResponse, emptyResponse);
      spectator.detectChanges();
      await awaitChanges(promise);
      expect(getMap()).toBeFalsy();
    });

    it("should display maps component when sites exist", async () => {
      setup(defaultProject);
      const promise = interceptApiRequest(
        createSitesWithMeta(1),
        emptyResponse
      );
      spectator.detectChanges();
      await awaitChanges(promise);
      expect(getMap()).toBeTruthy();
    });

    it("should display maps component when regions exist", async () => {
      setup(defaultProject);
      const promise = interceptApiRequest(
        emptyResponse,
        createRegionsWithMeta(1)
      );
      spectator.detectChanges();
      await awaitChanges(promise);
      expect(getMap()).toBeTruthy();
    });

    it("should display maps component when sites and regions exist", async () => {
      setup(defaultProject);
      const promise = interceptApiRequest(
        createSitesWithMeta(1),
        createRegionsWithMeta(1)
      );
      spectator.detectChanges();
      await awaitChanges(promise);
      expect(getMap()).toBeTruthy();
    });

    it("should provide project to maps component", async () => {
      setup(defaultProject);
      const promise = interceptApiRequest(
        emptyResponse,
        createRegionsWithMeta(1)
      );
      spectator.detectChanges();
      await awaitChanges(promise);
      expect(getMap().project).toEqual(defaultProject);
    });
  });

  describe("models", () => {
    function getPlaceholder() {
      return spectator.query("p.lead");
    }

    function getCards() {
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

    function assertRegionCard(
      card: SiteCardComponent,
      project: Project,
      region: Region
    ) {
      expect(card).toBeTruthy();
      expect(card.project).toEqual(project);
      expect(card.region).toEqual(region);
    }

    it("should display placeholder when no models found", async () => {
      setup(defaultProject);
      const promise = interceptApiRequest(emptyResponse, emptyResponse);
      spectator.detectChanges();
      await awaitChanges(promise);
      expect(getPlaceholder()).toBeTruthy();
      expect(getCards().length).toBe(0);
    });

    it("should hide placeholder when sites found", async () => {
      setup(defaultProject);
      const promise = interceptApiRequest(
        createSitesWithMeta(1),
        emptyResponse
      );
      spectator.detectChanges();
      await awaitChanges(promise);
      expect(getPlaceholder()).toBeFalsy();
    });

    it("should hide placeholder when regions found", async () => {
      setup(defaultProject);
      const promise = interceptApiRequest(
        emptyResponse,
        createRegionsWithMeta(1)
      );
      spectator.detectChanges();
      await awaitChanges(promise);
      expect(getPlaceholder()).toBeFalsy();
    });

    it("should display single site card", async () => {
      const sites = createSitesWithMeta(1);
      setup(defaultProject);
      const promise = interceptApiRequest(sites, emptyResponse);
      spectator.detectChanges();
      await awaitChanges(promise);
      const cards = getCards();
      expect(cards.length).toBe(1);
      assertSiteCard(cards[0], defaultProject, sites[0][0]);
    });

    it("should display single region card", async () => {
      const regions = createRegionsWithMeta(1);
      setup(defaultProject);
      const promise = interceptApiRequest(emptyResponse, regions);
      spectator.detectChanges();
      await awaitChanges(promise);
      const cards = getCards();
      expect(cards.length).toBe(1);
      assertRegionCard(cards[0], defaultProject, regions[0][0]);
    });

    it("should display mixed cards", async () => {
      const sites = createSitesWithMeta(3);
      const regions = createRegionsWithMeta(3);
      setup(defaultProject);
      const promise = interceptApiRequest(sites, regions);
      spectator.detectChanges();
      await awaitChanges(promise);
      const cards = getCards();
      expect(cards.length).toBe(6);
      regions[0].forEach((region, index) => {
        assertRegionCard(cards[index], defaultProject, region);
      });
      sites[0].forEach((site, index) => {
        assertSiteCard(cards[index + 3], defaultProject, site);
      });
    });
  });

  describe("api", () => {
    function causeApiRequest(page: number, filterText = "") {
      component["apiRequest$"].next({ page, filterText });
    }

    async function handleOnInit(
      isSite: boolean,
      expectations: FilterExpectations<ISite | IRegion>[],
      pageNo?: number,
      filterText?: string
    ) {
      const promise = interceptApiRequest(
        [initialResponse, []],
        [initialResponse, []],
        isSite ? expectations : undefined,
        !isSite ? expectations : undefined
      );
      await awaitChanges(promise);
      if (pageNo) {
        causeApiRequest(pageNo, filterText);
      }
    }

    const initialResponse = [];
    const initialExpectation = () => {};

    describe("filters", () => {
      [
        {
          test: "sites",
          isSite: true,
          list: "sites",
          stateTracker: "hasSites",
          createModels: (numModels: number) => createSitesWithMeta(numModels),
        },
        {
          test: "regions",
          isSite: false,
          list: "regions",
          stateTracker: "hasRegions",
          createModels: (numModels: number) => createRegionsWithMeta(numModels),
        },
      ].forEach(({ test, isSite, list, stateTracker, createModels }) => {
        describe(test, () => {
          it(`should create initial ${test} api filter request`, (done) => {
            setup(defaultProject);
            const expectation = (filters, project) => {
              expect(project).toEqual(defaultProject.id);
              expect(filters).toEqual({ paging: { page: 1 }, filter: {} });
              done();
            };
            handleOnInit(isSite, [expectation]);
          });

          it(`should create paged ${test} api filter request`, (done) => {
            setup(defaultProject);
            const expectation = (filters, project) => {
              expect(project).toEqual(defaultProject.id);
              expect(filters).toEqual({ paging: { page: 5 }, filter: {} });
              done();
            };
            handleOnInit(isSite, [initialExpectation, expectation], 5);
          });

          if (isSite) {
            it("should handle site api filter request with regionId", (done) => {
              const spy = jasmine.createSpy();
              setup(defaultProject);
              component["generateFilter"] = spy.and.callFake(() => ({
                paging: { page: 1 },
                filter: undefined,
              }));
              const expectation = (filters) => {
                expect(filters).toEqual({
                  paging: { page: 1 },
                  filter: undefined,
                });
                done();
              };
              handleOnInit(isSite, [initialExpectation, expectation], 1);
            });

            it("should not override site api filter request with regionId", (done) => {
              setup(defaultProject);
              const expectation = (filters) => {
                expect(filters).toEqual({
                  paging: { page: 5 },
                  filter: { name: { contains: "custom filter" } },
                });
                done();
              };
              handleOnInit(
                isSite,
                [initialExpectation, expectation],
                5,
                "custom filter"
              );
            });
          }

          it("should set empty model list", () => {
            setup(defaultProject);
            interceptApiRequest(emptyResponse, emptyResponse);
            spectator.detectChanges();
            component["getModels"]();
            component["apiUpdate"]([]);
            expect(component[list].toArray()).toEqual([]);
          });

          it("should set multiple models in list", () => {
            const models = createModels(3);
            setup(defaultProject);
            interceptApiRequest(emptyResponse, emptyResponse);
            spectator.detectChanges();
            component["getModels"]();
            component["apiUpdate"](models[0]);
            expect(component[list].toArray()).toEqual(models[0]);
          });

          it(`should set ${stateTracker} to false if no sites`, () => {
            setup(defaultProject);
            interceptApiRequest(emptyResponse, emptyResponse);
            spectator.detectChanges();
            component["getModels"]();
            component["apiUpdate"]([]);
            expect(component[stateTracker]).toBeFalsy();
          });

          it(`should set ${stateTracker} to true if sites exist`, () => {
            const models = createModels(3);
            setup(defaultProject);
            interceptApiRequest(emptyResponse, emptyResponse);
            spectator.detectChanges();
            component["getModels"]();
            component["apiUpdate"](models[0]);
            expect(component[stateTracker]).toBeTruthy();
          });
        });
      });
    });

    describe("collectionSize", () => {
      beforeEach(() => {
        setup(defaultProject);
        interceptApiRequest(emptyResponse, emptyResponse);
        spectator.detectChanges();
      });

      it("should set collectionSize to 0", () => {
        component["getModels"]();
        component["apiUpdate"]([]);
        component["apiUpdate"]([]);
        expect(component.collectionSize).toBe(0);
      });

      it("should set collection size to region length when it has more values", () => {
        const sites = createSitesWithMeta(3);
        const regions = createRegionsWithMeta(1);
        component["getModels"]();
        component["apiUpdate"](sites[0]);
        component["apiUpdate"](regions[0]);
        expect(component.collectionSize).toBe(3);
      });

      it("should set collection size to site length when it has more values", () => {
        const sites = createSitesWithMeta(1);
        const regions = createRegionsWithMeta(3);
        component["getModels"]();
        component["apiUpdate"](sites[0]);
        component["apiUpdate"](regions[0]);
        expect(component.collectionSize).toBe(3);
      });
    });
  });
});

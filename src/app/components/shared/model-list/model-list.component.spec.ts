import { defaultApiPageSize, Filters } from "@baw-api/baw-api.service";
import { ProjectsService } from "@baw-api/project/projects.service";
import { Errorable } from "@helpers/advancedTypes";
import { isBawApiError } from "@helpers/custom-errors/baw-api-error";
import { IProject, Project } from "@models/Project";
import { NgbPagination } from "@ng-bootstrap/ng-bootstrap";
import {
  createHostFactory,
  mockProvider,
  SpectatorHost,
  SpyObject,
} from "@ngneat/spectator";
import { CardsComponent } from "@shared/model-cards/cards/cards.component";
import { generateProject } from "@test/fakes/Project";
import { nStepObservable } from "@test/helpers/general";
import { assertPageInfo } from "@test/helpers/pageRoute";
import { of, Subject } from "rxjs";
import { shallowRegionsMenuItem } from "@components/regions/regions.menus";
import { provideMockBawApi } from "@baw-api/provide-baw-ApiMock";
import { DebouncedInputDirective } from "@directives/debouncedInput/debounced-input.directive";
import { ProjectListComponent } from "@components/projects/pages/list/list.component";
import { provideMockConfig } from "@services/config/provide-configMock";
import { IconsModule } from "@shared/icons/icons.module";
import { provideRouter } from "@angular/router";
import { AssociationInjector } from "@models/ImplementsInjector";
import { ASSOCIATION_INJECTOR } from "@services/association-injector/association-injector.tokens";
import { ShallowSitesService } from "@baw-api/site/sites.service";
import { AudioRecordingsService } from "@baw-api/audio-recording/audio-recordings.service";
import { Site } from "@models/Site";
import { getElementByTextContent } from "@test/helpers/html";
import { generateSite } from "@test/fakes/Site";
import { modelData } from "@test/helpers/faker";
import { MapComponent } from "@shared/map/map.component";
import { ModelListComponent } from "./model-list.component";
import { MODEL_LIST_SERVICE } from "./model-list.tokens";

describe("ModelListComponent", () => {
  let spec: SpectatorHost<ModelListComponent<Project>>;
  let injector: AssociationInjector;

  let projectsApi: SpyObject<ProjectsService>;
  let sitesApi: SpyObject<ShallowSitesService>;

  let sitesResponse: Site[] = [];

  const createComponent = createHostFactory({
    component: ModelListComponent<Project>,
    imports: [CardsComponent, IconsModule],
    providers: [
      provideMockBawApi(),
      provideMockConfig(),
      { provide: MODEL_LIST_SERVICE, useExisting: ProjectsService },

      mockProvider(AudioRecordingsService, {
        filterByProject: () => of([]),
      }),

      // We have to manually provide a router instead of using a
      // RouterTestingModule because we also need to provide a custom template
      // for the no results case.
      // The easiest way to do this, is to just use a hostFactory and manually
      // provide a router.
      provideRouter([]),
    ],
  });

  function generateProjects(
    projectCount: number,
    overrides: IProject = {},
  ): Project[] {
    const projects = [];

    for (let i = 0; i < Math.min(projectCount, defaultApiPageSize); i++) {
      const project = new Project(generateProject(overrides), injector);
      project.addMetadata({
        status: 200,
        message: "OK",
        paging: { total: projectCount },
      });
      projects.push(project);
    }

    return projects;
  }

  async function handleApiRequest(
    models: Errorable<Project[]>,
    assertFilter: (filters: Filters<Project>) => void = () => {},
  ) {
    const subject = new Subject<Project[]>();
    const promise = nStepObservable(
      subject,
      () => models,
      isBawApiError(models),
    );

    projectsApi.filter.and.callFake((filters) => {
      assertFilter(filters);
      return subject;
    });

    spec.detectChanges();
    await promise;
    spec.detectChanges();
  }

  function getCardsComponent() {
    return spec.query(CardsComponent);
  }

  function getCards() {
    return getCardsComponent().models();
  }

  beforeEach(() => {
    sitesResponse = modelData.randomArray(
      5,
      25,
      () => new Site(generateSite()),
    );

    spec = createComponent(
      `
      <baw-model-list [modelKey]="'projects'" [filterPlaceholder]="'Filter projects'">
        <ng-template #noResultsTemplate>
          No projects found
        </ng-template>
      </baw-model-list>
    `,
      { detectChanges: false },
    );

    injector = spec.inject(ASSOCIATION_INJECTOR);

    projectsApi = spec.inject(MODEL_LIST_SERVICE) as any;

    sitesApi = spec.inject(ShallowSitesService);
    sitesApi.filter.andCallFake(() => of(sitesResponse));
  });

  assertPageInfo(ProjectListComponent, [
    "Projects",
    shallowRegionsMenuItem.label,
  ]);

  it("should create", () => {
    expect(spec.component).toBeInstanceOf(ModelListComponent);
  });

  it("should initially request page 1", async () => {
    await handleApiRequest([], (filter) => {
      expect(filter.paging.page).toBe(1);
    });
  });

  describe("tile tab", () => {
    function assertCard(index: number, model: Project) {
      expect(getCards()[index]).toBe(model);
    }

    it("should handle zero projects", async () => {
      await handleApiRequest([]);
      const title = spec.query<HTMLHeadingElement>("h4");
      expect(title).toContainText("No projects found");
      expect(getCardsComponent()).toBeFalsy();
    });

    it("should display single project card", async () => {
      const projects = generateProjects(1);
      await handleApiRequest(projects);

      expect(getCards()).toHaveLength(1);
      assertCard(0, projects[0]);
    });

    it("should display multiple project cards", async () => {
      const projects = generateProjects(3);
      await handleApiRequest(projects);
      expect(getCards()).toHaveLength(3);
    });

    it("should display multiple project cards in order", async () => {
      const projects = generateProjects(3);
      await handleApiRequest(projects);
      projects.forEach((project, index) => assertCard(index, project));
    });

    describe("pagination", () => {
      function getPagination() {
        return spec.query(NgbPagination);
      }

      function getPaginationLinks() {
        return spec.queryAll("ngb-pagination a");
      }

      it("should hide pagination if less than one page of models", async () => {
        const projects = generateProjects(5);
        await handleApiRequest(projects);
        expect(getPagination()).toBeFalsy();
      });

      it("should display pagination if more than one page of models", async () => {
        const projects = generateProjects(defaultApiPageSize * 2);
        await handleApiRequest(projects);
        expect(getPagination()).toBeTruthy();
      });

      it("should display correct number of pages", async () => {
        const projects = generateProjects(defaultApiPageSize * 3);
        await handleApiRequest(projects);
        // 3 Pages, 2 additional options to select forwards and back
        expect(getPaginationLinks().length).toBe(3 + 2);
      });
    });
  });

  describe("map tab", () => {
    beforeEach(() => {
      spec.detectChanges();
      const mapTabLink = getElementByTextContent(spec, "Map").querySelector(
        "a",
      );

      spec.click(mapTabLink);
      spec.detectChanges();
    });

    it("should make the correct api calls when loading the 'map' tab", () => {
      const expectedProjectFilters: Filters<Site> = {
        filter: {},
        paging: { disablePaging: true },
        projection: {
          include: ["name", "customLatitude", "customLongitude", "regionId"],
        },
      };

      expect(sitesApi.filter).toHaveBeenCalledOnceWith(expectedProjectFilters);
    });

    it("should display a map with markers for each site", () => {
      const siteMap = spec.query(MapComponent);

      const expectedSites: any[] = sitesResponse.map((site) => {
        const marker = site.getMapMarker();
        marker.groupId = site["regionId"];
        return marker;
      });

      expect(siteMap.markers().toArray()).toEqual(expectedSites);
    });
  });

  describe("filtering", () => {
    function getFilterInput(): HTMLInputElement {
      return spec.query("input[type='text']");
    }

    function getInputDirective() {
      return spec.query(DebouncedInputDirective);
    }

    it("should have filtering option", async () => {
      const projects = generateProjects(3);
      await handleApiRequest(projects);
      expect(getFilterInput()).toBeTruthy();
    });

    it("should have default value attached", async () => {
      const projects = generateProjects(3);
      await handleApiRequest(projects);
      spec.component.filter = "custom value";
      spec.detectChanges();
      expect(getFilterInput()["value"]).toBe("custom value");
    });

    it("should call onFilter when the text filter is changed", async () => {
      const projects = generateProjects(3);
      await handleApiRequest(projects);
      spyOn(spec.component, "onFilter").and.stub();
      getInputDirective().valueChange.emit("custom value");
      expect(spec.component.onFilter).toHaveBeenCalled();
    });
  });
});

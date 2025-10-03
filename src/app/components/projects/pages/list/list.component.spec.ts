import { ProjectsService } from "@baw-api/project/projects.service";
import { createRoutingFactory, Spectator, SpyObject } from "@ngneat/spectator";
import { assertPageInfo } from "@test/helpers/pageRoute";
import { shallowRegionsMenuItem } from "@components/regions/regions.menus";
import { provideMockBawApi } from "@baw-api/provide-baw-ApiMock";
import { ModelListComponent } from "@shared/model-list/model-list.component";
import { IconsModule } from "@shared/icons/icons.module";
import { defaultApiPageSize, Filters } from "@baw-api/baw-api.service";
import { getElementByTextContent } from "@test/helpers/html";
import { ShallowSitesService } from "@baw-api/site/sites.service";
import { of } from "rxjs";
import { Site } from "@models/Site";
import { generateSite } from "@test/fakes/Site";
import { Project } from "@models/Project";
import { ASSOCIATION_INJECTOR } from "@services/association-injector/association-injector.tokens";
import { AssociationInjector } from "@models/ImplementsInjector";
import { modelData } from "@test/helpers/faker";
import { ProjectListComponent } from "./list.component";

// A lot of the tile and map assertions are already made by
// the model-list.component tests.
// These tests serve to ensure the correct API calls are made by the model list
// component.
describe("ProjectsListComponent", () => {
  let spec: Spectator<ProjectListComponent>;
  let injector: AssociationInjector;

  let projectsApi: SpyObject<ProjectsService>;
  let sitesApi: SpyObject<ShallowSitesService>;

  const createComponent = createRoutingFactory({
    component: ProjectListComponent,
    imports: [ModelListComponent, IconsModule],
    providers: [provideMockBawApi()],
  });

  beforeEach(() => {
    spec = createComponent({ detectChanges: false });
    injector = spec.inject(ASSOCIATION_INJECTOR);

    const mockSites = modelData.randomArray(
      1,
      defaultApiPageSize,
      () => new Site(generateSite(), injector),
    );

    sitesApi = spec.inject(ShallowSitesService);
    sitesApi.filter.andReturn(of(mockSites));

    projectsApi = spec.inject(ProjectsService);

    spec.detectChanges();
  });

  assertPageInfo(ProjectListComponent, [
    "Projects",
    shallowRegionsMenuItem.label,
  ]);

  it("should create", () => {
    expect(spec.component).toBeInstanceOf(ProjectListComponent);
  });

  it("should make the correct API calls when loading the 'tiles' tab", () => {
    const expectedFilters: Filters<Project> = {
      paging: { page: 1 },
      filter: {},
    };

    expect(projectsApi.filter).toHaveBeenCalledOnceWith(expectedFilters);
  });

  it("should make the correct API calls when loading the 'map' tab", () => {
    const mapTabLink = getElementByTextContent(spec, "Map").querySelector("a");

    spec.click(mapTabLink);
    spec.detectChanges();

    const expectedProjectFilters: Filters<Site> = {
      filter: {},
      paging: { disablePaging: true },
      projection: {
        include: ["name", "customLatitude", "customLongitude"],
      },
    };

    expect(sitesApi.filter).toHaveBeenCalledOnceWith(expectedProjectFilters);
  });
});

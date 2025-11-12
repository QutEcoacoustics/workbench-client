import { ShallowRegionsService } from "@baw-api/region/regions.service";
import { createRoutingFactory, Spectator, SpyObject } from "@ngneat/spectator";
import { assertPageInfo } from "@test/helpers/pageRoute";
import { provideMockBawApi } from "@baw-api/provide-baw-ApiMock";
import { ModelListComponent } from "@shared/model-list/model-list.component";
import { IconsModule } from "@shared/icons/icons.module";
import { Site } from "@models/Site";
import { defaultApiPageSize, Filters } from "@baw-api/baw-api.service";
import { getElementByTextContent } from "@test/helpers/html";
import { Region } from "@models/Region";
import { ShallowSitesService } from "@baw-api/site/sites.service";
import { generateSite } from "@test/fakes/Site";
import { of } from "rxjs";
import { AssociationInjector } from "@models/ImplementsInjector";
import { ASSOCIATION_INJECTOR } from "@services/association-injector/association-injector.tokens";
import { modelData } from "@test/helpers/faker";
import { RegionListComponent } from "./list.component";

describe("RegionsListComponent", () => {
  let spec: Spectator<RegionListComponent>;
  let injector: AssociationInjector;

  let regionsApi: SpyObject<ShallowRegionsService>;
  let sitesApi: SpyObject<ShallowSitesService>;

  const createComponent = createRoutingFactory({
    component: RegionListComponent,
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

    regionsApi = spec.inject(ShallowRegionsService);

    spec.detectChanges();
  });

  assertPageInfo(RegionListComponent, "Sites");

  it("should create", () => {
    expect(spec.component).toBeInstanceOf(RegionListComponent);
  });

  it("should make the correct API calls when loading the 'tiles' tab", () => {
    const expectedFilters: Filters<Region> = {
      paging: { page: 1 },
      filter: {},
    };

    expect(regionsApi.filter).toHaveBeenCalledOnceWith(expectedFilters);
  });

  it("should make the correct API calls when loading the 'map' tab", () => {
    const mapTabLink = getElementByTextContent(spec, "Map").querySelector("a");

    spec.click(mapTabLink);
    spec.detectChanges();

    const expectedProjectFilters: Filters<Site> = {
      filter: {},
      paging: { disablePaging: true },
      projection: {
        // We expect that the regionId is included because we want to group on
        // regions.
        include: ["name", "customLatitude", "customLongitude", "regionId"],
      },
    };

    expect(sitesApi.filter).toHaveBeenCalledOnceWith(expectedProjectFilters);
  });
});

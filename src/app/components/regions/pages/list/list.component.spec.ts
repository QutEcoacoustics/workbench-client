import { ShallowRegionsService } from "@baw-api/region/regions.service";
import { createRoutingFactory, Spectator, SpyObject } from "@ngneat/spectator";
import { assertPageInfo } from "@test/helpers/pageRoute";
import { provideMockBawApi } from "@baw-api/provide-baw-ApiMock";
import { ModelListComponent } from "@shared/model-list/model-list.component";
import { IconsModule } from "@shared/icons/icons.module";
import { RegionListComponent } from "./list.component";

describe("RegionsListComponent", () => {
  let api: SpyObject<ShallowRegionsService>;
  let spec: Spectator<RegionListComponent>;

  const createComponent = createRoutingFactory({
    component: RegionListComponent,
    imports: [ModelListComponent, IconsModule],
    providers: [provideMockBawApi()],
  });

  beforeEach(() => {
    spec = createComponent({ detectChanges: false });
    api = spec.inject(ShallowRegionsService);
    spec.detectChanges();
  });

  assertPageInfo(RegionListComponent, "Sites");

  it("should create", () => {
    expect(spec.component).toBeInstanceOf(RegionListComponent);
  });
});

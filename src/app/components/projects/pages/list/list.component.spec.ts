import { ProjectsService } from "@baw-api/project/projects.service";
import { createRoutingFactory, Spectator, SpyObject } from "@ngneat/spectator";
import { assertPageInfo } from "@test/helpers/pageRoute";
import { shallowRegionsMenuItem } from "@components/regions/regions.menus";
import { provideMockBawApi } from "@baw-api/provide-baw-ApiMock";
import { ModelListComponent } from "@shared/model-list/model-list.component";
import { IconsModule } from "@shared/icons/icons.module";
import { ProjectListComponent } from "./list.component";

describe("ProjectsListComponent", () => {
  let api: SpyObject<ProjectsService>;
  let spec: Spectator<ProjectListComponent>;

  const createComponent = createRoutingFactory({
    component: ProjectListComponent,
    imports: [ModelListComponent, IconsModule],
    providers: [provideMockBawApi()],
  });

  beforeEach(() => {
    spec = createComponent({ detectChanges: false });
    api = spec.inject(ProjectsService);
    spec.detectChanges();
  });

  assertPageInfo(ProjectListComponent, [
    "Projects",
    shallowRegionsMenuItem.label,
  ]);

  it("should create", () => {
    expect(spec.component).toBeInstanceOf(ProjectListComponent);
  });
});

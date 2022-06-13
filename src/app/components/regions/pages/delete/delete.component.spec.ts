import { MockBawApiModule } from "@baw-api/baw-apiMock.module";
import { RegionsService } from "@baw-api/region/regions.service";
import { Project } from "@models/Project";
import { Region } from "@models/Region";
import {
  createRoutingFactory,
  SpectatorRouting,
  SpyObject,
} from "@ngneat/spectator";
import { SharedModule } from "@shared/shared.module";
import { generateProject } from "@test/fakes/Project";
import { generateRegion } from "@test/fakes/Region";
import { ToastrService } from "ngx-toastr";
import { BehaviorSubject, Subject } from "rxjs";
import { DeleteComponent } from "./delete.component";

describe("RegionsDeleteComponent", () => {
  let api: SpyObject<RegionsService>;
  let defaultRegion: Region;
  let defaultProject: Project;
  let spec: SpectatorRouting<DeleteComponent>;
  const createComponent = createRoutingFactory({
    component: DeleteComponent,
    imports: [SharedModule, MockBawApiModule],
    mocks: [ToastrService],
  });

  function setup(project: Project, region: Region) {
    spec = createComponent({
      detectChanges: false,
      data: {
        resolvers: { project: "resolver", region: "resolver" },
        project: { model: project },
        region: { model: region },
      },
    });

    api = spec.inject(RegionsService);
    spec.detectChanges();
  }

  beforeEach(() => {
    defaultProject = new Project(generateProject());
    defaultRegion = new Region(generateRegion());
  });

  describe("form", () => {
    it("should have no fields", () => {
      setup(defaultProject, defaultRegion);
      expect(spec.component.fields).toEqual([]);
    });
  });

  describe("component", () => {
    it("should create", () => {
      setup(defaultProject, defaultRegion);
      expect(spec.component).toBeTruthy();
    });

    it("should call api", () => {
      setup(defaultProject, defaultRegion);
      api.destroy.and.callFake(() => new Subject());
      spec.component.submit({});
      expect(api.destroy).toHaveBeenCalled();
    });

    it("should redirect to projects", () => {
      const spy = spyOnProperty(defaultProject, "viewUrl");
      setup(defaultProject, defaultRegion);
      api.destroy.and.callFake(() => new BehaviorSubject<void>(null));

      spec.component.submit({});
      expect(spy).toHaveBeenCalled();
    });
  });
});

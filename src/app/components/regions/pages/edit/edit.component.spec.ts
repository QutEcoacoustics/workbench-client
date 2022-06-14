import { MockBawApiModule } from "@baw-api/baw-apiMock.module";
import { RegionsService } from "@baw-api/region/regions.service";
import {
  destroyGoogleMaps,
  embedGoogleMaps,
} from "@helpers/embedGoogleMaps/embedGoogleMaps";
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
import { testFormlyFields } from "@test/helpers/formly";
import { ToastrService } from "ngx-toastr";
import { BehaviorSubject, Subject } from "rxjs";
import schema from "../../region.schema.json";
import { EditComponent } from "./edit.component";

describe("RegionsEditComponent", () => {
  let spec: SpectatorRouting<EditComponent>;
  const { fields } = schema;
  const createComponent = createRoutingFactory({
    component: EditComponent,
    imports: [SharedModule, MockBawApiModule],
    mocks: [ToastrService],
  });

  describe("form", () => {
    testFormlyFields([
      {
        testGroup: "Site Name Input",
        field: fields[1],
        key: "name",
        type: "input",
        required: true,
        label: "Site Name",
        inputType: "text",
      },
      {
        testGroup: "Site Description Input",
        field: fields[2],
        key: "description",
        type: "textarea",
        label: "Description",
      },
    ]);
  });

  // TODO Disabled because of #1338
  xdescribe("component", () => {
    let api: SpyObject<RegionsService>;
    let defaultProject: Project;
    let defaultRegion: Region;

    function setup() {
      spec = createComponent({
        detectChanges: false,
        params: { projectId: defaultProject?.id, regionId: defaultRegion?.id },
        data: {
          resolvers: { project: "resolver", region: "resolver" },
          project: { model: defaultProject },
          region: { model: defaultRegion },
        },
      });

      api = spec.inject(RegionsService);
      spec.detectChanges();
    }

    beforeAll(async () => await embedGoogleMaps());
    afterAll(() => destroyGoogleMaps());
    beforeEach(() => {
      defaultProject = new Project(generateProject());
      defaultRegion = new Region(generateRegion());
    });

    it("should create", () => {
      setup();
      expect(spec.component).toBeTruthy();
    });

    it("should call api", () => {
      setup();
      api.update.and.callFake(() => new Subject());

      spec.component.submit({});
      expect(api.update).toHaveBeenCalled();
    });

    it("should redirect to region", () => {
      setup();
      const region = new Region(generateRegion());
      api.update.and.callFake(() => new BehaviorSubject<Region>(region));

      spec.component.submit({});
      expect(spec.router.navigateByUrl).toHaveBeenCalledWith(
        region.getViewUrl(defaultProject)
      );
    });
  });
});

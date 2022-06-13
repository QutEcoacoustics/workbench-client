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
import { FormComponent } from "@shared/form/form.component";
import { generateProject } from "@test/fakes/Project";
import { generateRegion } from "@test/fakes/Region";
import { testFormlyFields } from "@test/helpers/formly";
import { testFormImports } from "@test/helpers/testbed";
import { ToastrService } from "ngx-toastr";
import { BehaviorSubject, Subject } from "rxjs";
import schema from "../../region.schema.json";
import { NewComponent } from "./new.component";

describe("RegionsNewComponent", () => {
  let spec: SpectatorRouting<NewComponent>;
  const { fields } = schema;
  const createComponent = createRoutingFactory({
    component: NewComponent,
    imports: [...testFormImports, MockBawApiModule],
    declarations: [FormComponent],
    mocks: [ToastrService],
    stubsEnabled: true,
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

    function setup() {
      spec = createComponent({
        detectChanges: false,
        params: { projectId: defaultProject?.id },
        data: {
          resolvers: { project: "resolver" },
          project: { model: defaultProject },
        },
      });

      api = spec.inject(RegionsService);
      spec.detectChanges();
    }

    beforeAll(async () => await embedGoogleMaps());
    afterAll(() => destroyGoogleMaps());
    beforeEach(() => {
      defaultProject = new Project(generateProject());
    });

    it("should create", () => {
      setup();
      expect(spec.component).toBeTruthy();
    });

    it("should call api", () => {
      setup();
      api.create.and.callFake(() => new Subject());

      spec.component.submit({});
      expect(api.create).toHaveBeenCalled();
    });

    it("should redirect to region", () => {
      setup();
      const region = new Region(generateRegion());
      api.create.and.callFake(() => new BehaviorSubject<Region>(region));

      spec.component.submit({});
      expect(spec.router.navigateByUrl).toHaveBeenCalledWith(
        region.getViewUrl(defaultProject)
      );
    });
  });
});

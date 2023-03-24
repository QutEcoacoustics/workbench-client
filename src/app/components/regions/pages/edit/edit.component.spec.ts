import { MockBawApiModule } from "@baw-api/baw-apiMock.module";
import { projectResolvers } from "@baw-api/project/projects.service";
import {
  regionResolvers,
  RegionsService,
} from "@baw-api/region/regions.service";
import { BawApiError } from "@helpers/custom-errors/baw-api-error";
import { Project } from "@models/Project";
import { Region } from "@models/Region";
import {
  createRoutingFactory,
  SpectatorRouting,
  SpyObject,
} from "@ngneat/spectator";
import { FormComponent } from "@shared/form/form.component";
import { generateBawApiError } from "@test/fakes/BawApiError";
import { generateProject } from "@test/fakes/Project";
import { generateRegion } from "@test/fakes/Region";
import { testFormlyFields } from "@test/helpers/formly";
import { assertErrorHandler } from "@test/helpers/html";
import { assertPageInfo } from "@test/helpers/pageRoute";
import { testFormImports } from "@test/helpers/testbed";
import { ToastrService } from "ngx-toastr";
import { BehaviorSubject, Subject } from "rxjs";
import schema from "../../region.base.json";
import { EditComponent } from "./edit.component";

describe("RegionsEditComponent", () => {
  let spectator: SpectatorRouting<EditComponent>;
  const { fields } = schema;
  const createComponent = createRoutingFactory({
    component: EditComponent,
    imports: [...testFormImports, MockBawApiModule],
    declarations: [FormComponent],
    mocks: [ToastrService],
    stubsEnabled: true,
  });

  assertPageInfo(EditComponent, "Edit");

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

  describe("component", () => {
    let api: SpyObject<RegionsService>;
    let defaultProject: Project;
    let defaultRegion: Region;

    function setup(projectError?: BawApiError, regionError?: BawApiError) {
      spectator = createComponent({
        detectChanges: false,
        params: { projectId: defaultProject?.id, regionId: defaultRegion?.id },
        data: {
          resolvers: {
            project: projectResolvers.show,
            region: regionResolvers.show,
          },
          project: { model: defaultProject, error: projectError },
          region: { model: defaultRegion, error: regionError },
        },
      });

      api = spectator.inject(RegionsService);
      spectator.detectChanges();
    }

    beforeEach(() => {
      defaultProject = new Project(generateProject());
      defaultRegion = new Region(generateRegion());
    });

    it("should create", () => {
      setup();
      expect(spectator.component).toBeTruthy();
    });

    it("should handle region error", () => {
      setup(undefined, generateBawApiError());
      assertErrorHandler(spectator.fixture);
    });

    it("should handle project error", () => {
      setup(generateBawApiError());
      assertErrorHandler(spectator.fixture);
    });

    it("should call api", () => {
      setup();
      api.update.and.callFake(() => new Subject());

      spectator.component.submit({});
      expect(api.update).toHaveBeenCalled();
    });

    it("should redirect to region", () => {
      setup();
      const region = new Region(generateRegion());
      api.update.and.callFake(() => new BehaviorSubject<Region>(region));

      spectator.component.submit({});
      expect(spectator.router.navigateByUrl).toHaveBeenCalledWith(
        region.getViewUrl(defaultProject)
      );
    });
  });
});

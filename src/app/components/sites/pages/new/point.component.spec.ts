import { ApiErrorDetails } from "@baw-api/api.interceptor.service";
import { MockBawApiModule } from "@baw-api/baw-apiMock.module";
import { projectResolvers } from "@baw-api/project/projects.service";
import { regionResolvers } from "@baw-api/region/regions.service";
import { SitesService } from "@baw-api/site/sites.service";
import { Project } from "@models/Project";
import { Region } from "@models/Region";
import { Site } from "@models/Site";
import {
  createRoutingFactory,
  SpectatorRouting,
  SpyObject,
} from "@ngneat/spectator";
import { FormComponent } from "@shared/form/form.component";
import { generateApiErrorDetails } from "@test/fakes/ApiErrorDetails";
import { generateProject } from "@test/fakes/Project";
import { generateRegion } from "@test/fakes/Region";
import { generateSite } from "@test/fakes/Site";
import { testFormlyFields } from "@test/helpers/formly";
import { assertErrorHandler } from "@test/helpers/html";
import { testFormImports } from "@test/helpers/testbed";
import { ToastrService } from "ngx-toastr";
import { BehaviorSubject, Subject } from "rxjs";
import { fields } from "../../point.base.json";
import { PointNewComponent } from "./point.component";

describe("PointNewComponent", () => {
  let spectator: SpectatorRouting<PointNewComponent>;
  const createComponent = createRoutingFactory({
    component: PointNewComponent,
    imports: [...testFormImports, MockBawApiModule],
    declarations: [FormComponent],
    mocks: [ToastrService],
    stubsEnabled: true,
  });

  describe("form", () => {
    testFormlyFields([
      {
        testGroup: "Point Name Input",
        field: fields[1],
        key: "name",
        type: "input",
        required: true,
        label: "Point Name",
        inputType: "text",
      },
      {
        testGroup: "Point Description Input",
        field: fields[2],
        key: "description",
        type: "textarea",
        label: "Description",
      },
      {
        testGroup: "Point Location Input",
        field: fields[4],
        key: "location",
        label: "Location",
      },
      {
        testGroup: "Point Image Input",
        field: fields[9],
        key: "imageUrl",
        type: "image",
        label: "Image",
      },
    ]);
  });

  describe("component", () => {
    let api: SpyObject<SitesService>;
    let defaultProject: Project;
    let defaultRegion: Region;

    function setup(
      projectError?: ApiErrorDetails,
      regionError?: ApiErrorDetails
    ) {
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

      api = spectator.inject(SitesService);
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

    it("should handle project error", () => {
      setup(generateApiErrorDetails());
      assertErrorHandler(spectator.fixture);
    });

    it("should handle region error", () => {
      setup(undefined, generateApiErrorDetails());
      assertErrorHandler(spectator.fixture);
    });

    it("should call api", () => {
      setup();
      const site = new Site(generateSite());
      api.create.and.callFake(() => new Subject());

      spectator.component.submit({ ...site });
      expect(api.create).toHaveBeenCalledWith(
        new Site({ ...site, regionId: defaultRegion.id }),
        defaultProject
      );
    });

    it("should redirect to site", () => {
      setup();
      const site = new Site(generateSite());
      api.create.and.callFake(() => new BehaviorSubject<Site>(site));

      spectator.component.submit({});
      expect(spectator.router.navigateByUrl).toHaveBeenCalledWith(
        site.getViewUrl(defaultProject)
      );
    });
  });
});

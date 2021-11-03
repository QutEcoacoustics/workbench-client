import { ApiErrorDetails } from "@baw-api/api.interceptor.service";
import { MockBawApiModule } from "@baw-api/baw-apiMock.module";
import { projectResolvers } from "@baw-api/project/projects.service";
import { regionResolvers } from "@baw-api/region/regions.service";
import { SitesService } from "@baw-api/site/sites.service";
import {
  destroyGoogleMaps,
  embedGoogleMaps,
} from "@helpers/embedGoogleMaps/embedGoogleMaps";
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
import schema from "../../point.base.json";
import { PointNewComponent } from "./point.component";

describe("PointNewComponent", () => {
  let spec: SpectatorRouting<PointNewComponent>;
  const { fields } = schema;
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
        key: "imageUrls",
        type: "image",
        label: "Image",
      },
    ]);
  });

  // TODO Disabled because of #1338
  xdescribe("component", () => {
    let api: SpyObject<SitesService>;
    let defaultProject: Project;
    let defaultRegion: Region;

    function setup(
      projectError?: ApiErrorDetails,
      regionError?: ApiErrorDetails
    ) {
      spec = createComponent({
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

      api = spec.inject(SitesService);
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

    it("should handle project error", () => {
      setup(generateApiErrorDetails());
      assertErrorHandler(spec.fixture);
    });

    it("should handle region error", () => {
      setup(undefined, generateApiErrorDetails());
      assertErrorHandler(spec.fixture);
    });

    it("should call api", () => {
      setup();
      const site = new Site(generateSite());
      api.create.and.callFake(() => new Subject());

      spec.component.submit({ ...site });
      expect(api.create).toHaveBeenCalledWith(
        new Site({ ...site, regionId: defaultRegion.id }),
        defaultProject
      );
    });

    it("should redirect to site", () => {
      setup();
      const site = new Site(generateSite());
      api.create.and.callFake(() => new BehaviorSubject<Site>(site));

      spec.component.submit({});
      expect(spec.router.navigateByUrl).toHaveBeenCalledWith(
        site.getViewUrl(defaultProject)
      );
    });
  });
});

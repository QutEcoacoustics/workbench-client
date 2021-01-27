import { ApiErrorDetails } from "@baw-api/api.interceptor.service";
import { MockBawApiModule } from "@baw-api/baw-apiMock.module";
import { projectResolvers } from "@baw-api/project/projects.service";
import { regionResolvers } from "@baw-api/region/regions.service";
import { siteResolvers, SitesService } from "@baw-api/site/sites.service";
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
import { PointEditComponent } from "./point.component";

describe("PointEditComponent", () => {
  let spectator: SpectatorRouting<PointEditComponent>;
  const createComponent = createRoutingFactory({
    component: PointEditComponent,
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
    let defaultSite: Site;

    function setup(
      projectError?: ApiErrorDetails,
      regionError?: ApiErrorDetails,
      siteError?: ApiErrorDetails
    ) {
      spectator = createComponent({
        detectChanges: false,
        params: {
          projectId: defaultProject?.id,
          regionId: defaultRegion?.id,
          siteId: defaultSite?.id,
        },
        data: {
          resolvers: {
            project: projectResolvers.show,
            region: regionResolvers.show,
            site: siteResolvers.show,
          },
          project: { model: defaultProject, error: projectError },
          region: { model: defaultRegion, error: regionError },
          site: { model: defaultSite, error: siteError },
        },
      });

      api = spectator.inject(SitesService);
      spectator.detectChanges();
    }

    beforeEach(() => {
      defaultProject = new Project(generateProject());
      defaultRegion = new Region(generateRegion());
      defaultSite = new Site(generateSite(undefined, true));
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

    it("should handle site error", () => {
      setup(undefined, undefined, generateApiErrorDetails());
      assertErrorHandler(spectator.fixture);
    });

    it("should call api", () => {
      setup();
      api.update.and.callFake(() => new Subject());

      spectator.component.submit({ ...defaultSite });
      expect(api.update).toHaveBeenCalledWith(
        new Site(defaultSite),
        defaultProject
      );
    });

    it("should redirect to site", () => {
      setup();
      api.update.and.callFake(() => new BehaviorSubject<Site>(defaultSite));

      spectator.component.submit({});
      expect(spectator.router.navigateByUrl).toHaveBeenCalledWith(
        defaultSite.getViewUrl(defaultProject)
      );
    });
  });
});

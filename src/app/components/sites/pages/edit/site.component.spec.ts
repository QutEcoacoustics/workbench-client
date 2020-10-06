import { ApiErrorDetails } from "@baw-api/api.interceptor.service";
import { MockBawApiModule } from "@baw-api/baw-apiMock.module";
import { projectResolvers } from "@baw-api/project/projects.service";
import { siteResolvers, SitesService } from "@baw-api/site/sites.service";
import {
  destroyGoogleMaps,
  embedGoogleMaps,
} from "@helpers/embedGoogleMaps/embedGoogleMaps";
import { Project } from "@models/Project";
import { Site } from "@models/Site";
import {
  createRoutingFactory,
  SpectatorRouting,
  SpyObject,
} from "@ngneat/spectator";
import { FormComponent } from "@shared/form/form.component";
import { generateApiErrorDetails } from "@test/fakes/ApiErrorDetails";
import { generateProject } from "@test/fakes/Project";
import { generateSite } from "@test/fakes/Site";
import { testFormlyFields } from "@test/helpers/formly";
import { assertErrorHandler } from "@test/helpers/html";
import { testFormImports } from "@test/helpers/testbed";
import { ToastrService } from "ngx-toastr";
import { BehaviorSubject, Subject } from "rxjs";
import { fields } from "../../site.base.json";
import { SiteEditComponent } from "./site.component";

describe("SiteEditComponent", () => {
  let spectator: SpectatorRouting<SiteEditComponent>;
  const createComponent = createRoutingFactory({
    component: SiteEditComponent,
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
      {
        testGroup: "Site Location Input",
        field: fields[4],
        key: "location",
        label: "Location",
      },
      {
        testGroup: "Site Image Input",
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
    let defaultSite: Site;

    function setup(
      projectError?: ApiErrorDetails,
      siteError?: ApiErrorDetails
    ) {
      spectator = createComponent({
        detectChanges: false,
        params: { projectId: defaultProject?.id, siteId: defaultSite?.id },
        data: {
          resolvers: {
            project: projectResolvers.show,
            site: siteResolvers.show,
          },
          project: { model: defaultProject, error: projectError },
          site: { model: defaultSite, error: siteError },
        },
      });

      api = spectator.inject(SitesService);
      spectator.detectChanges();
    }

    beforeAll(async () => await embedGoogleMaps());
    afterAll(() => destroyGoogleMaps());
    beforeEach(() => {
      defaultProject = new Project(generateProject());
      defaultSite = new Site(generateSite());
    });

    it("should create", () => {
      setup();
      expect(spectator.component).toBeTruthy();
    });

    it("should handle site error", () => {
      setup(undefined, generateApiErrorDetails());
      assertErrorHandler(spectator.fixture);
    });

    it("should handle project error", () => {
      setup(generateApiErrorDetails());
      assertErrorHandler(spectator.fixture);
    });

    it("should call api", () => {
      setup();
      api.update.and.callFake(() => new Subject());

      spectator.component.submit({});
      expect(api.update).toHaveBeenCalled();
    });

    it("should redirect to site", () => {
      setup();
      const site = new Site(generateSite());
      api.update.and.callFake(() => new BehaviorSubject<Site>(site));

      spectator.component.submit({});
      expect(spectator.router.navigateByUrl).toHaveBeenCalledWith(
        site.getViewUrl(defaultProject)
      );
    });
  });
});

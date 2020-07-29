import { ApiErrorDetails } from "@baw-api/api.interceptor.service";
import { projectResolvers } from "@baw-api/project/projects.service";
import { siteResolvers, SitesService } from "@baw-api/site/sites.service";
import {
  destroyGoogleMaps,
  embedGoogleMaps,
} from "@helpers/embedGoogleMaps/embedGoogleMaps";
import { Project } from "@models/Project";
import { Site } from "@models/Site";
import { createRoutingFactory, SpectatorRouting } from "@ngneat/spectator";
import { FormComponent } from "@shared/form/form.component";
import { generateProject } from "@test/fakes/Project";
import { generateSite } from "@test/fakes/Site";
import { testFormlyFields } from "@test/helpers/formly";
import { assertResolverErrorHandling } from "@test/helpers/html";
import { testBawServices, testFormImports } from "@test/helpers/testbed";
import { ToastrService } from "ngx-toastr";
import { BehaviorSubject } from "rxjs";
import { fields } from "../../site.base.json";
import { EditComponent } from "./edit.component";

describe("SitesEditComponent", () => {
  let spectator: SpectatorRouting<EditComponent>;
  const createComponent = createRoutingFactory({
    component: EditComponent,
    imports: testFormImports,
    declarations: [FormComponent],
    providers: testBawServices,
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
    let api: SitesService;
    let defaultError: ApiErrorDetails;
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
      defaultError = { status: 401, message: "Unauthorized" };
    });

    it("should create", () => {
      setup();
      expect(spectator.component).toBeTruthy();
    });

    it("should handle site error", () => {
      setup(undefined, defaultError);
      assertResolverErrorHandling(spectator.fixture);
    });

    it("should handle project error", () => {
      setup(defaultError);
      assertResolverErrorHandling(spectator.fixture);
    });

    it("should call api", () => {
      setup();
      spyOn(api, "update").and.callThrough();

      spectator.component.submit({});
      expect(api.update).toHaveBeenCalled();
    });

    it("should redirect to site", () => {
      setup();
      const site = new Site(generateSite());
      spyOn(site, "getViewUrl").and.stub();
      spyOn(api, "update").and.callFake(() => new BehaviorSubject<Site>(site));

      spectator.component.submit({});
      expect(site.getViewUrl).toHaveBeenCalledWith(defaultProject);
    });
  });
});

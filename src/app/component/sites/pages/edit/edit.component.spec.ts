import { ApiErrorDetails } from "@baw-api/api.interceptor.service";
import { projectResolvers } from "@baw-api/project/projects.service";
import { siteResolvers, SitesService } from "@baw-api/site/sites.service";
import { Project } from "@models/Project";
import { Site } from "@models/Site";
import { createRoutingFactory, SpectatorRouting } from "@ngneat/spectator";
import { FormComponent } from "@shared/form/form.component";
import { MapComponent } from "@shared/map/map.component";
import { generateProject } from "@test/fakes/Project";
import { generateSite } from "@test/fakes/Site";
import { testFormlyFields } from "@test/helpers/formly";
import { assertResolverErrorHandling } from "@test/helpers/html";
import { testBawServices, testFormImports } from "@test/helpers/testbed";
import { MockComponent } from "ng-mocks";
import { ToastrService } from "ngx-toastr";
import { BehaviorSubject } from "rxjs";
import { fields } from "../../site.base.json";
import { EditComponent } from "./edit.component";

describe("SitesEditComponent", () => {
  let api: SitesService;
  let defaultSite: Site;
  let defaultProject: Project;
  let defaultError: ApiErrorDetails;
  let spectator: SpectatorRouting<EditComponent>;
  let createComponent = createRoutingFactory({
    component: EditComponent,
    imports: testFormImports,
    declarations: [FormComponent, MockComponent(MapComponent)],
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
    function setup(
      project: Project,
      projectError: ApiErrorDetails,
      site: Site,
      siteError: ApiErrorDetails
    ) {
      spectator = createComponent({
        detectChanges: false,
        params: { projectId: project?.id, siteId: site?.id },
        data: {
          resolvers: {
            project: projectResolvers.show,
            site: siteResolvers.show,
          },
          project: { model: project, error: projectError },
          site: { model: site, error: siteError },
        },
      });

      api = spectator.inject(SitesService);
      spectator.detectChanges();
    }

    beforeEach(() => {
      defaultSite = new Site(generateSite());
      defaultProject = new Project(generateProject());
      defaultError = { status: 401, message: "Unauthorized" };
    });

    it("should create", () => {
      setup(defaultProject, undefined, defaultSite, undefined);
      expect(spectator.component).toBeTruthy();
    });

    it("should handle site error", () => {
      setup(defaultProject, undefined, undefined, defaultError);
      assertResolverErrorHandling(spectator.fixture);
    });

    it("should handle project error", () => {
      setup(undefined, defaultError, defaultSite, undefined);
      assertResolverErrorHandling(spectator.fixture);
    });

    it("should call api", () => {
      setup(defaultProject, undefined, defaultSite, undefined);
      spyOn(api, "update").and.callThrough();

      spectator.component.submit({});
      expect(api.create).toHaveBeenCalled();
    });

    it("should redirect to site", () => {
      setup(defaultProject, undefined, defaultSite, undefined);
      const site = new Site(generateSite());
      spyOn(site, "getViewUrl").and.stub();
      spyOn(api, "update").and.callFake(() => new BehaviorSubject<Site>(site));

      spectator.component.submit({});
      expect(site.getViewUrl).toHaveBeenCalledWith(defaultProject);
    });
  });
});

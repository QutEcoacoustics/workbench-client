import { createRoutingFactory, Spectator, SpyObject } from "@ngneat/spectator";
import { SharedActivatedRouteService } from "@services/shared-activated-route/shared-activated-route.service";
import { of } from "rxjs";
import { MockBawApiModule } from "@baw-api/baw-apiMock.module";
import { ResolvedModel } from "@baw-api/resolver-common";
import { generatePageInfoResolvers } from "@test/helpers/general";
import { Project } from "@models/Project";
import { modelData } from "@test/helpers/faker";
import { generateProject } from "@test/fakes/Project";
import { ASSOCIATION_INJECTOR } from "@services/association-injector/association-injector.tokens";
import { AssociationInjector } from "@models/ImplementsInjector";
import { ProjectsService } from "@baw-api/project/projects.service";
import { Site } from "@models/Site";
import { generateSite } from "@test/fakes/Site";
import { AudioRecording } from "@models/AudioRecording";
import { generateAudioRecording } from "@test/fakes/AudioRecording";
import { LicenseWidgetComponent } from "./license-widget.component";

describe("LicenseWidgetComponent", () => {
  let spec: Spectator<LicenseWidgetComponent>;
  let injector: AssociationInjector;
  let projectApiSpy: SpyObject<ProjectsService>;

  let mockProjects: Project[];

  const createComponent = createRoutingFactory({
    component: LicenseWidgetComponent,
    imports: [MockBawApiModule],
  });

  const licenseText = () => spec.query("#content");

  function setup(models: ResolvedModel[]): void {
    spec = createComponent({ detectChanges: false });

    injector = spec.inject(ASSOCIATION_INJECTOR);

    for (const project of mockProjects) {
      project["injector"] = injector;
    }

    for (const model of models) {
      model.model["injector"] = injector;
    }

    const resolvedData = generatePageInfoResolvers(...models);

    const activatedRouteMock = spec.inject(SharedActivatedRouteService);
    spyOnProperty(activatedRouteMock, "pageInfo", "get").and.returnValue(
      of(resolvedData)
    );

    projectApiSpy = spec.inject(ProjectsService);
    // interceptFilterApiRequest(projectApiSpy, injector, mockProjects, Project);

    projectApiSpy.filter = jasmine
      .createSpy("filter")
      .and.callFake(() => of(mockProjects)) as any;

    spec.detectChanges();
  }

  beforeEach(() => {
    const projectFactory = () => new Project(generateProject());
    mockProjects = modelData.randomArray(1, 5, projectFactory);
  });

  it("should create", () => {
    setup([]);
    expect(spec.component).toBeInstanceOf(LicenseWidgetComponent);
  });

  it("should display 'Unknown' if the model does not have a license", () => {
    setup([
      {
        model: new Project(generateProject({ license: undefined })),
      },
    ]);
    expect(licenseText()).toHaveExactTrimmedText("Unknown");
  });

  it("should show 'Unknown' for a license with an empty name", () => {
    setup([
      {
        model: new Project(generateProject({ license: "" })),
      },
    ]);
    expect(licenseText()).toHaveExactTrimmedText("Unknown");
  });

  it("should handle a single license", () => {
    const testedLicense = modelData.license();
    const project = new Project(generateProject({ license: testedLicense }));
    setup([{ model: project }]);
    expect(licenseText()).toHaveExactTrimmedText(testedLicense);
  });

  it("should handle a site with multiple licenses", () => {
    mockProjects = [
      new Project(generateProject({ license: modelData.license() })),
      new Project(generateProject({ license: modelData.license() })),
    ];
    const projectIds = mockProjects.map((project) => project.id);

    const expectedLicenses = mockProjects.map((project) => project.license);

    const site = new Site(generateSite({ projectIds }));

    setup([{ model: site }]);

    for (const license of expectedLicenses) {
      expect(licenseText()).toContainText(license);
    }
  });

  it("should handle a site that has multiple licenses but some are missing", () => {
    mockProjects = [
      new Project(generateProject({ license: modelData.license() })),
      new Project(generateProject({ license: undefined })),
    ];
    const projectIds = mockProjects.map((project) => project.id);

    const expectedLicenses = [mockProjects[0].license, "Unknown"];

    const site = new Site(generateSite({ projectIds }));

    setup([{ model: site }]);

    for (const license of expectedLicenses) {
      expect(licenseText()).toContainText(license);
    }
  });

  // We should not be fetching project models from the activated route because
  // sometimes the project is not in the route.
  // E.g. the shallow audio_recording route
  it("should handle a license when there is no project in the route", () => {
    const mockSiteId = modelData.id();
    const testedLicense = modelData.license();
    mockProjects = [
      new Project(
        generateProject({
          license: testedLicense,
          siteIds: [mockSiteId],
        })
      ),
    ];

    const audioRecording = new AudioRecording(
      generateAudioRecording({
        siteId: mockSiteId,
      })
    );

    setup([{ model: audioRecording }]);
    expect(licenseText()).toHaveExactTrimmedText(testedLicense);
  });

  // Because project license information is free-form text, we don't want users
  // to enter a license that would expand the height of the viewport by a large
  // amount.
  // Expanding the height of the viewport would cause a degraded user
  // experience, especially on mobile devices.
  //
  // This problem might arise if a user uses the API to add a license, and
  // inputs the entire license content instead of the license name.
  //
  // TODO: Finish this test case
  xit("should have a limit on the license widget size", () => {
    setup([
      {
        model: new Project(
          generateProject({ license: modelData.lorem.paragraphs(5) })
        ),
      },
    ]);
  });
});

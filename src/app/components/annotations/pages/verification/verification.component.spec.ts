import {
  createRoutingFactory,
  SpectatorRouting,
  SpyObject,
} from "@ngneat/spectator";
import { ToastrService } from "ngx-toastr";
import { MockBawApiModule } from "@baw-api/baw-apiMock.module";
import { SharedModule } from "@shared/shared.module";
import { AnnotationSearchFormComponent } from "@components/annotations/components/annotation-search-form/annotation-search-form.component";
import { Project } from "@models/Project";
import { Region } from "@models/Region";
import { Site } from "@models/Site";
import { ActivatedRoute } from "@angular/router";
import { of } from "rxjs";
import { generateProject } from "@test/fakes/Project";
import { generateRegion } from "@test/fakes/Region";
import { generateSite } from "@test/fakes/Site";
import { assertPageInfo } from "@test/helpers/pageRoute";
import { VerificationService } from "@baw-api/verification/verification.service";
import { VERIFICATION } from "@baw-api/ServiceTokens";
import { Verification } from "@models/Verification";
import { generateVerification } from "@test/fakes/Verification";
import { VerificationComponent } from "./verification.component";

describe("AnnotationSearchComponent", () => {
  let spectator: SpectatorRouting<VerificationComponent>;
  let defaultProject: Project;
  let defaultRegion: Region;
  let defaultSite: Site;
  let mockVerificationsApi: SpyObject<VerificationService>;

  const createComponent = createRoutingFactory({
    declarations: [AnnotationSearchFormComponent],
    component: VerificationComponent,
    imports: [MockBawApiModule, SharedModule],
    mocks: [ToastrService],
  });

  function setup() {
    spectator = createComponent({
      detectChanges: false,
      data: { projectId: { model: defaultProject } },
      params: {
        projectId: defaultProject.id,
        regionId: defaultRegion.id,
        siteId: defaultSite.id,
      },
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            params: of({
              projectId: defaultProject.id,
              regionId: defaultRegion.id,
              siteId: defaultSite.id,
            }),
          },
        },
      ],
    });

    spectator.component.project = defaultProject;
    spectator.component.region = defaultRegion;
    spectator.component.site = defaultSite;

    mockVerificationsApi = spectator.inject(VERIFICATION.token);
    mockVerificationsApi.create.and.stub();
    mockVerificationsApi.update.and.stub();
    mockVerificationsApi.filter.and.returnValue(
      of([
        new Verification(generateVerification()),
        new Verification(generateVerification()),
        new Verification(generateVerification()),
        new Verification(generateVerification()),
      ])
    );

    spectator.detectChanges();
  }

  beforeEach(() => {
    defaultProject = new Project(generateProject());
    defaultRegion = new Region(
      generateRegion({ projectId: defaultProject.id })
    );
    defaultSite = new Site(generateSite({ regionId: defaultRegion.id }));

    setup();
  });

  const hideShowParametersButton = (): HTMLButtonElement =>
    spectator.query<HTMLButtonElement>("#hideShowParametersButton");
  const parametersBox = (): HTMLDivElement =>
    spectator.query<HTMLDivElement>("#search-parameters");
  const dialogElement = (): HTMLDialogElement =>
    spectator.query<HTMLDialogElement>("dialog");
  const verificationGrid = (): HTMLElement =>
    spectator.query<HTMLElement>("oe-verification-grid");
  const decisionButtons = (): HTMLElement =>
    spectator.query<HTMLElement>("oe-decision");

  assertPageInfo(VerificationComponent, "Verify This List");

  it("should create", () => {
    expect(spectator.component).toBeInstanceOf(VerificationComponent);
  });

  describe("search parameters", () => {
    it("should have a collapsable search parameters box", () => {
      const expectedExpandedClass = "show";

      expect(parametersBox()).not.toHaveClass(expectedExpandedClass);
      hideShowParametersButton().click();
      spectator.detectChanges();

      expect(parametersBox()).toHaveClass(expectedExpandedClass);
    });

    it("should behave correctly for an empty search parameter model", () => {
      expect(spectator.component.searchParameters).toBeEmpty();
    });

    it("should create the correct search parameter model from query string parameters", () => {});

    it("should pre-populate the search parameters box from the query string parameters", () => {});

    it("should have a verification grid component populated with the first page", () => {});
  });

  describe("verification grid functionality", () => {
    it("should make the correct api calls when the page is first loaded", () => {});

    it("should make the correct api calls when a decision is made", () => {
      decisionButtons().click();
      spectator.detectChanges();
    });

    it("should make the correct api calls when a sub-selection decision is made", () => {});

    it("should populate the verification grid correctly for the first page", () => {});

    it("should populate the verification grid correctly for a full page pagination", () => {});

    it("should populate the verification grid correctly for a partial page pagination", () => {});
  });
});

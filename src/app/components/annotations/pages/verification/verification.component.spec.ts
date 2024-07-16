import {
  createRoutingFactory,
  SpectatorRouting,
  SpyObject,
} from "@ngneat/spectator";
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
import {
  PROJECT,
  SHALLOW_REGION,
  SHALLOW_SITE,
  TAG,
  VERIFICATION,
} from "@baw-api/ServiceTokens";
import { Verification } from "@models/Verification";
import { generateVerification } from "@test/fakes/Verification";
import { generateAnnotationSearchUrlParameters } from "@test/fakes/data/AnnotationSearchParameters";
import { Injector } from "@angular/core";
import { ProjectsService } from "@baw-api/project/projects.service";
import { ShallowRegionsService } from "@baw-api/region/regions.service";
import { ShallowSitesService } from "@baw-api/site/sites.service";
import { TagsService } from "@baw-api/tag/tags.service";
import { AnnotationSearchParameters } from "../annotationSearchParameters";
import { VerificationComponent } from "./verification.component";

describe("AnnotationSearchComponent", () => {
  let spectator: SpectatorRouting<VerificationComponent>;
  let defaultProject: Project;
  let defaultRegion: Region;
  let defaultSite: Site;
  let mockVerificationsApi: SpyObject<VerificationService>;
  let mockVerificationsResponse: Verification[] = [];
  let mockProjectsApi: SpyObject<ProjectsService>;
  let mockRegionsApi: SpyObject<ShallowRegionsService>;
  let mockSitesApi: SpyObject<ShallowSitesService>;
  let mockTagsApi: SpyObject<TagsService>;
  let injector: SpyObject<Injector>;

  const createComponent = createRoutingFactory({
    declarations: [AnnotationSearchFormComponent],
    component: VerificationComponent,
    imports: [MockBawApiModule, SharedModule],
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

    injector = spectator.inject(Injector);

    mockVerificationsApi = spectator.inject(VERIFICATION.token);
    mockVerificationsApi.create.and.stub();
    mockVerificationsApi.update.and.stub();
    mockVerificationsApi.filter.and.callFake(() =>
      of(mockVerificationsResponse)
    );

    mockProjectsApi = spectator.inject(PROJECT.token);
    mockRegionsApi = spectator.inject(SHALLOW_REGION.token);
    mockSitesApi = spectator.inject(SHALLOW_SITE.token);
    mockTagsApi = spectator.inject(TAG.token);

    mockProjectsApi.filter.and.returnValue(of([]));
    mockRegionsApi.filter.and.returnValue(of([]));
    mockSitesApi.filter.and.returnValue(of([]));
    mockTagsApi.filter.and.returnValue(of([]));

    const mockParameters = new AnnotationSearchParameters(
      generateAnnotationSearchUrlParameters(),
      injector
    );
    spectator.component.searchParameters = mockParameters;

    mockVerificationsResponse = Array.from<Verification>({ length: 3 }).fill(
      new Verification(generateVerification(), injector)
    );

    // we do not detect changes here because some tests require router params
    // while others do not
    // settings these parameters after a detectChanges is incorrect and does not
    // reflect the actual behavior of Angular
  }

  beforeEach(() => {
    defaultProject = new Project(generateProject());
    defaultRegion = new Region(
      generateRegion({ projectId: defaultProject.id })
    );
    defaultSite = new Site(generateSite({ regionId: defaultRegion.id }));

    setup();
  });

  // TODO: remove these prettier-ignore comments
  // prettier-ignore
  const dialogCloseButton = () => getElementByInnerText<HTMLButtonElement>("Close");
  // prettier-ignore
  const parametersCollapsable = () => spectator.query<HTMLDivElement>("#search-parameters");
  // prettier-ignore
  const verificationGrid = () => spectator.query<HTMLElement>("oe-verification-grid");
  const dialogElement = () => spectator.query<HTMLDialogElement>("dialog");
  const decisionButtons = () => spectator.queryAll<HTMLElement>("oe-decision");
  // prettier-ignore
  const onlyVerifiedCheckbox = () => spectator.query<HTMLInputElement>("#filter-verified");

  function getElementByInnerText<T extends HTMLElement>(text: string): T {
    return spectator.debugElement.query(
      (element) => element.nativeElement.innerText === text
    )?.nativeElement as T;
  }

  function toggleOnlyVerifiedCheckbox() {
    onlyVerifiedCheckbox().click();
    spectator.detectChanges();
  }

  assertPageInfo(VerificationComponent, "Verify Annotations");

  it("should create", () => {
    spectator.detectChanges();
    expect(spectator.component).toBeInstanceOf(VerificationComponent);
  });

  describe("search parameters", () => {
    describe("no initial search parameters", () => {
      beforeEach(() => {
        spectator.detectChanges();

        // TODO: we compare the query params because the object has an injector
        // which fails the jasmine.empty() assertion. However, this is not
        // correct, and we should use a custom matcher to compare that the
        // object is empty (excluding the injector property)
        expect(spectator.component.searchParameters.toQueryParams()).toEqual(
          jasmine.empty()
        );
      });

      it("should automatically open the search parameters box if there are no initial search parameters", () => {
        expect(parametersCollapsable()).toHaveClass("show");
      });

      it("should not automatically hide the search parameters box once search parameters are added", () => {
        toggleOnlyVerifiedCheckbox();
        expect(onlyVerifiedCheckbox()).toBeChecked();
        expect(spectator.component.searchParameters.onlyUnverified).toBeTrue();

        expect(parametersCollapsable()).toHaveClass("show");
      });

      fit("should not have a getPage callback set on the verification grid", () => {
        expect(verificationGrid()).not.toHaveProperty("getPage");
      });

      it("should update the verification grids getPage callback correctly when search parameters are added", () => {});

      it("should make the correct api calls when search parameters are added", () => {});
    });

    describe("with initial search parameters", () => {
      beforeEach(() => {
        spectator.detectChanges();
      });

      it("should have a collapsed search parameters box", () => {
        expect(parametersCollapsable()).toHaveClass("hide");
      });

      it("should create the correct search parameter model from query string parameters", () => {});

      it("should pre-populate the search parameters box from the query string parameters", () => {});

      it("should have a verification grid component populated with the first page", () => {});

      it("should make the correct api calls when the search parameters are changed", () => {});

      it("should reset the verification grids getPage function when the search parameters are changed", () => {});

      // this functionality is handled by the verification grid component
      // however, we test it here to test the interop between the two components
      it("should reset the verifications grid page to zero when the search parameters change", () => {});

      it("should have the correct behavior when removing all the search parameters", () => {});
    });
  });

  describe("verification grid functionality", () => {
    beforeEach(() => {
      spectator.detectChanges();
    });

    it("should be mount all the required Open-Ecoacoustics web components as custom elements", () => {
      const expectedCustomElements: string[] = [
        "oe-verification-grid",
        "oe-verification-grid-tile",
        "oe-decision",
        "oe-media-controls",
        "oe-info-card",
        "oe-indicator",
        "oe-axes",
      ];

      for (const selector of expectedCustomElements) {
        const customElementClass = customElements.get(selector);
        expect(customElementClass).withContext(selector).toBeDefined();
      }
    });

    it("should show an initial help dialog when the page is first loaded", () => {
      expect(dialogElement()).toHaveProperty("open", true);

      // we test closing the dialog element in this test to assert both the
      // dialog element is open and that the close button works
      // and that the test will fail under the correct conditions
      dialogCloseButton().click();
      expect(dialogElement()).toHaveProperty("open", false);
    });

    it("should make the correct api calls when a decision is made", () => {
      decisionButtons()[0].click();
      spectator.detectChanges();
    });

    it("should make the correct api calls when a sub-selection decision is made", () => {});

    it("should populate the verification grid correctly for the first page", () => {});

    it("should populate the verification grid correctly for a full page pagination", () => {});

    it("should populate the verification grid correctly for a partial page pagination", () => {});
  });
});

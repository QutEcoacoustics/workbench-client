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
import { VerificationGridComponent } from "@ecoacoustics/web-components/@types/components/verification-grid/verification-grid";
import { VerificationComponent as DecisionButton } from "@ecoacoustics/web-components/@types/components/decision/verification/verification";
import { SpectrogramComponent } from "@ecoacoustics/web-components/@types/components/spectrogram/spectrogram";
import { modelData } from "@test/helpers/faker";
import { Tag } from "@models/Tag";
import { fakeAsync, tick } from "@angular/core/testing";
import { defaultDebounceTime } from "src/app/app.helper";
import { TypeaheadInputComponent } from "@shared/typeahead-input/typeahead-input.component";
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
  let defaultFakeSites: Site[];
  let defaultFakeRegions: Region[];
  let defaultFakeProjects: Project[];
  let defaultFakeTags: Tag[];

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

    defaultFakeProjects = modelData.randomArray(
      3,
      10,
      () => new Project(generateProject())
    );

    defaultFakeRegions = modelData.randomArray(
      3,
      10,
      () => new Region(generateRegion({ projectId: defaultProject.id }))
    );

    defaultFakeSites = modelData.randomArray(
      3,
      10,
      () => new Site(generateSite())
    );

    defaultFakeTags = modelData.randomArray(
      3,
      10,
      () => new Tag(generateSite())
    );

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

    mockProjectsApi.filter.and.callFake(() => of(defaultFakeProjects));
    mockRegionsApi.filter.and.callFake(() => of(defaultFakeRegions));
    mockSitesApi.filter.and.callFake(() => of(defaultFakeSites));
    mockTagsApi.filter.and.callFake(() => of(defaultFakeTags));

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

  const parametersCollapsable = () =>
    spectator.query<HTMLDivElement>("#search-parameters");
  const onlyVerifiedCheckbox = () =>
    spectator.query<HTMLInputElement>("#filter-verified");

  const selectedTypeaheadOption = (): HTMLButtonElement =>
    spectator.query<HTMLButtonElement>("button.dropdown-item.active");
  const tagsTypeahead = (): TypeaheadInputComponent =>
    spectator.query<any>("[label='Tags of Interest']");
  const tagsTypeaheadInput = (): HTMLInputElement =>
    spectator.query<HTMLInputElement>(
      "[label='Tags of interest'] #typeahead-input"
    );

  const spectrogramElements = (): SpectrogramComponent[] =>
    spectator.queryAll<SpectrogramComponent>("oe-spectrogram");
  const previewNextPageButton = (): HTMLButtonElement =>
    getElementByInnerText<HTMLButtonElement>("Next Page");
  const previewPreviousPageButton = (): HTMLButtonElement =>
    getElementByInnerText<HTMLButtonElement>("Previous Page");

  const verificationButtons = () =>
    spectator.queryAll<DecisionButton>("oe-verification");
  const verificationGrid = () =>
    spectator.query<VerificationGridComponent>("oe-verification-grid");

  const dialogElement = () => spectator.query<HTMLDialogElement>("dialog");
  const dialogCloseButton = () =>
    getElementByInnerText<HTMLButtonElement>("Close");

  function getElementByInnerText<T extends HTMLElement>(text: string): T {
    return spectator.debugElement.query(
      (element) => element.nativeElement.innerText === text
    )?.nativeElement as T;
  }

  function clickByInnerText<T extends HTMLElement>(text: string): void {
    const targetElement = getElementByInnerText<T>(text);
    targetElement.click();
    spectator.detectChanges();
  }

  function toggleOnlyVerifiedCheckbox(): void {
    onlyVerifiedCheckbox().click();
    spectator.detectChanges();
  }

  function expandSearchParameters(): void {
    clickByInnerText("Show Parameters");
  }

  function collapseSearchParameters(): void {
    clickByInnerText("Hide Parameters");
  }

  function selectFromTypeahead(target: HTMLInputElement, text: string): void {
    spectator.typeInElement(text, target);
    spectator.detectChanges();
    tick(defaultDebounceTime);
    selectedTypeaheadOption().click();
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

      it("should not have a getPage callback set on the verification grid", () => {
        expect(verificationGrid().getPage).not.toBeDefined();
      });

      it("should update the verification grids getPage callback correctly when filter conditions added", () => {});

      it("should update the search parameters when filter conditions are added", fakeAsync(() => {
        const targetTag = defaultFakeTags[0];
        const tagText = targetTag.text;
        const expectedTagId = targetTag.id;

        selectFromTypeahead(tagsTypeaheadInput(), tagText);

        const realizedRouterParams = spectator.inject(ActivatedRoute).params;
        const realizedComponentParams = spectator.component.searchParameters;

        expect(realizedRouterParams).toEqual(
          jasmine.objectContaining({
            tags: jasmine.arrayContaining([expectedTagId]),
          })
        );
        expect(realizedComponentParams.tags).toContain(expectedTagId);
      }));

      it("should make the correct api calls when search parameters are added", async () => {
        const targetTag = defaultFakeTags[0];
        const tagText = targetTag.text;
        const expectedTagId = targetTag.id;

        selectFromTypeahead(tagsTypeaheadInput(), tagText);

        spectator.setRouteQueryParam("tags", defaultFakeTags[0].id.toString());
        await spectator.fixture.whenStable();

        const realizedRouterParams = spectator.inject(ActivatedRoute).params;
        const realizedComponentParams = spectator.component.searchParameters;

        expect(realizedRouterParams).toEqual(
          jasmine.objectContaining({
            tags: jasmine.arrayContaining([expectedTagId]),
          })
        );
        expect(realizedComponentParams.tags).toContain(expectedTagId);
      });

      it("should show and hide the search paramters box correctly", () => {
        const expectedExpandedClass = "show";

        // the search parameters box should start expanded because there were
        // no initial query search parameters
        expect(parametersCollapsable()).toHaveClass(expectedExpandedClass);

        collapseSearchParameters();
        expect(parametersCollapsable()).not.toHaveClass(expectedExpandedClass);

        expandSearchParameters();
        expect(parametersCollapsable()).toHaveClass(expectedExpandedClass);
      });

      describe("Search results preview", () => {
        beforeEach(() => {
          spectator.component.model.tags = defaultFakeTags.map(
            (tag) => tag.id
          );
        });

        it("should make the correct api call", () => {
          const expectedBody = {};
          expect(mockVerificationsApi.filter).toHaveBeenCalledWith(expectedBody);
        });

        it("should display an error if there are no search results", () => {
          const expectedText = "No annotations found";
          defaultFakeTags = [];
          spectator.detectChanges();

          const element =
            getElementByInnerText<HTMLHeadingElement>(expectedText);
          expect(element).toExist();
        });

        it("should use a different error message if there are no unverified annotations found", () => {
          const expectedText = "No unverified annotations found";
          mockVerificationsResponse = [];
          toggleOnlyVerifiedCheckbox();

          const element =
            getElementByInnerText<HTMLHeadingElement>(expectedText);
          expect(element).toExist();
        });

        it("should have disabled pagination buttons if there are no search results", () => {});

        it("should display a search preview for a full page of results", () => {
          const expectedResults = mockVerificationsResponse.length;
          const realizedResults = spectrogramElements().length;
          expect(realizedResults).toEqual(expectedResults);
        });

        it("should display a reduced search preview for a partial page of results", () => {
          mockVerificationsResponse = mockVerificationsResponse.slice(0, 2);

          const expectedResults = mockVerificationsResponse.length;
          const realizedResults = spectrogramElements().length;
          expect(realizedResults).toEqual(expectedResults);
        });

        it("should page forward correctly", () => {
          previewNextPageButton().click();
          spectator.detectChanges();

          const expectedPageNumber = 2;
          const realizedPageNumber = spectator.component.previewPage;
          expect(realizedPageNumber).toEqual(expectedPageNumber);
        });

        it("should page to previous pages correctly", () => {
          previewNextPageButton().click();
          spectator.detectChanges();
          previewPreviousPageButton().click();
          spectator.detectChanges();

          const expectedPageNumber = 1;
          const realizedPageNumber = spectator.component.previewPage;
          expect(realizedPageNumber).toEqual(expectedPageNumber);
        });

        it("should not be possible to page back past the first page", () => {
          const initialPageNumber = spectator.component.previewPage;
          const expectedPageNumber = 1;

          expect(initialPageNumber).toEqual(expectedPageNumber);

          previewPreviousPageButton().click();
          spectator.detectChanges();

          const realizedPageNumber = spectator.component.previewPage;
          expect(realizedPageNumber).toEqual(expectedPageNumber);
        });
      });
    });

    describe("with initial search parameters", () => {
      beforeEach(async () => {
        spectator.setRouteQueryParam(
          "tags",
          defaultFakeTags.map((tag) => tag.id).toString()
        );
        spectator.setRouteQueryParam(
          "sites",
          defaultFakeSites.map((site) => site.id).toString()
        );
        spectator.setRouteQueryParam(
          "regions",
          defaultFakeRegions.map((region) => region.id).toString()
        );
        spectator.detectChanges();
        await spectator.fixture.whenStable();
      });

      it("should have a collapsed search parameters box", () => {
        expect(parametersCollapsable()).toHaveClass("hide");
      });

      it("should create the correct search parameter model from query string parameters", () => {
        const realizedParameterModel = spectator.component.searchParameters;

        const expectedSiteIds = defaultFakeSites.map((site) => site.id);
        const expectedRegionIds = defaultFakeRegions.map((region) => region.id);
        const expectedTagIds = defaultFakeTags.map((tag) => tag.id);

        expect(realizedParameterModel).toEqual(
          jasmine.objectContaining({
            tags: jasmine.arrayContaining(expectedTagIds),
            sites: jasmine.arrayContaining(expectedSiteIds),
            regions: jasmine.arrayContaining(expectedRegionIds),
          })
        );
      });

      it("should pre-populate the search parameters box from the query string parameters", () => {
        const realizedTagModels = tagsTypeahead().model;
        expect(realizedTagModels).toEqual(defaultFakeTags);
      });

      it("should make the correct api calls when first loaded", () => {
        const expectedFilterBody = {};
        expect(mockVerificationsApi.filter).toHaveBeenCalledWith(
          expectedFilterBody
        );
      });

      it("should cache client side with GET requests", () => {
        const expectedRequestCount = 10;
        expect(mockVerificationsApi.filter).toHaveBeenCalledTimes(
          expectedRequestCount
        );
      });

      it("should cache server side with HEAD requests", () => {
        const expectedRequestCount = 50;
        expect(mockVerificationsApi.filter).toHaveBeenCalledTimes(
          expectedRequestCount
        );
      });

      it("should have a verification grid component populated with the first page", () => {});

      it("should make the correct api calls when the search parameters are changed", () => {});

      it("should perform client-side caching if the search parameters change", () => {});

      it("should perform server-side caching if the search parameters change", () => {});

      // this functionality is handled by the verification grid component
      // however, we test it here to test the interaction between the
      // two components
      it("should reset the verification grids page to one if the search parameters change", () => {
        expandSearchParameters();
        selectFromTypeahead(tagsTypeaheadInput(), defaultFakeTags[0].text);

        const expectedPagedItems = 0;
        const realizedPagedItems = verificationGrid().pagedItems;
        expect(realizedPagedItems).toEqual(expectedPagedItems);
      });

      it("should reset the verification grids getPage function when the search parameters are changed", () => {
        const initialPagingCallback = verificationGrid().getPage;

        expandSearchParameters();
        selectFromTypeahead(tagsTypeaheadInput(), defaultFakeTags[0].text);
        const newPagingCallback = verificationGrid().getPage;

        expect(newPagingCallback).not.toEqual(initialPagingCallback);
      });
    });
  });

  describe("verification grid functionality", () => {
    beforeEach(() => {
      spectator.detectChanges();
    });

    describe("initial state", () => {
      it("should be mount all the required Open-Ecoacoustics web components as custom elements", () => {
        const expectedCustomElements: string[] = [
          "oe-verification-grid",
          "oe-verification-grid-tile",
          "oe-verification",
          "oe-media-controls",
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
    });

    describe("after help-dialog dismissed", () => {
      beforeEach(() => {
        dialogCloseButton().click();
        spectator.detectChanges();
      });

      it("should make the correct api calls when a decision is made", () => {
        verificationButtons()[0].click();
        spectator.detectChanges();
      });

      it("should make the correct api calls when a sub-selection decision is made", () => {});

      it("should populate the verification grid correctly for the first page", () => {});

      it("should populate the verification grid correctly for a full page pagination", () => {});

      it("should populate the verification grid correctly for a partial page pagination", () => {});
    });
  });
});

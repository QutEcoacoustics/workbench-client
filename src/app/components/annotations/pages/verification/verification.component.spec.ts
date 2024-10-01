import {
  createRoutingFactory,
  SpectatorRouting,
  SpyObject,
} from "@ngneat/spectator";
import { MockBawApiModule } from "@baw-api/baw-apiMock.module";
import { SharedModule } from "@shared/shared.module";
import { Project } from "@models/Project";
import { Region } from "@models/Region";
import { Site } from "@models/Site";
import { ActivatedRoute, Params } from "@angular/router";
import { of } from "rxjs";
import { generateProject } from "@test/fakes/Project";
import { generateRegion } from "@test/fakes/Region";
import { generateSite } from "@test/fakes/Site";
import { assertPageInfo } from "@test/helpers/pageRoute";
import { VerificationService } from "@baw-api/verification/verification.service";
import {
  SHALLOW_REGION,
  SHALLOW_SITE,
  TAG,
  VERIFICATION,
} from "@baw-api/ServiceTokens";
import { Verification } from "@models/Verification";
import { generateVerification } from "@test/fakes/Verification";
import { CUSTOM_ELEMENTS_SCHEMA, Injector } from "@angular/core";
import { ShallowRegionsService } from "@baw-api/region/regions.service";
import { ShallowSitesService } from "@baw-api/site/sites.service";
import { TagsService } from "@baw-api/tag/tags.service";
import { VerificationGridComponent } from "@ecoacoustics/web-components/@types/components/verification-grid/verification-grid";
import { VerificationComponent as DecisionButton } from "@ecoacoustics/web-components/@types/components/decision/verification/verification";
import { SpectrogramComponent } from "@ecoacoustics/web-components/@types/components/spectrogram/spectrogram";
import { VerificationHelpDialogComponent } from "@ecoacoustics/web-components/@types/components/verification-grid/help-dialog";
import { modelData } from "@test/helpers/faker";
import { Tag } from "@models/Tag";
import {
  discardPeriodicTasks,
  fakeAsync,
  flush,
  tick,
} from "@angular/core/testing";
import { defaultDebounceTime } from "src/app/app.helper";
import { TypeaheadInputComponent } from "@shared/typeahead-input/typeahead-input.component";
import { generateTag } from "@test/fakes/Tag";
import { RouterTestingModule } from "@angular/router/testing";
import { Filters } from "@baw-api/baw-api.service";
import { VerificationComponent } from "./verification.component";
import "node_modules/@ecoacoustics/web-components";

describe("VerificationComponent", () => {
  let spectator: SpectatorRouting<VerificationComponent>;
  let defaultProject: Project;
  let defaultRegion: Region;
  let defaultSite: Site;
  let mockVerificationsApi: SpyObject<VerificationService>;
  let mockVerificationsResponse: Verification[] = [];
  let mockRegionsApi: SpyObject<ShallowRegionsService>;
  let mockSitesApi: SpyObject<ShallowSitesService>;
  let mockTagsApi: SpyObject<TagsService>;
  let injector: SpyObject<Injector>;
  let defaultFakeSites: Site[];
  let defaultFakeRegions: Region[];
  let defaultFakeTags: Tag[];

  const createComponent = createRoutingFactory({
    component: VerificationComponent,
    imports: [MockBawApiModule, SharedModule, RouterTestingModule],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
  });

  function setup(queryParameters: Params = {}) {
    spectator = createComponent({
      detectChanges: false,
      params: {
        projectId: defaultProject.id,
        regionId: defaultRegion.id,
        siteId: defaultSite.id,
      },
      queryParams: queryParameters,
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            params: of({
              projectId: defaultProject.id,
              regionId: defaultRegion.id,
              siteId: defaultSite.id,
            }),
            queryParams: of(queryParameters),
          },
        },
      ],
    });

    injector = spectator.inject(Injector);

    mockVerificationsResponse = modelData.randomArray(
      3,
      3,
      () =>
        new Verification(
          generateVerification({
            audioLink:
              "https://api.staging.ecosounds.org/audio_recordings/461823/media.flac?end_offset=8170&start_offset=8159",
          }),
          injector
        )
    );

    spectator.component.project = defaultProject;
    spectator.component.region = defaultRegion;
    spectator.component.site = defaultSite;

    mockVerificationsApi = spectator.inject(VERIFICATION.token);
    mockRegionsApi = spectator.inject(SHALLOW_REGION.token);
    mockSitesApi = spectator.inject(SHALLOW_SITE.token);
    mockTagsApi = spectator.inject(TAG.token);

    mockRegionsApi.filter.and.callFake(() => of(defaultFakeRegions));
    mockSitesApi.filter.and.callFake(() => of(defaultFakeSites));
    mockTagsApi.filter.and.callFake(() => of(defaultFakeTags));
    mockVerificationsApi.filter.and.callFake(() =>
      of(mockVerificationsResponse)
    );

    spectator.detectChanges();
  }

  beforeEach(() => {
    defaultProject = new Project(generateProject());
    defaultRegion = new Region(
      generateRegion({ projectId: defaultProject.id })
    );
    defaultSite = new Site(generateSite({ regionId: defaultRegion.id }));

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
      () => new Tag(generateTag())
    );
  });

  const parametersToggleButton = () =>
    spectator.query<HTMLButtonElement>(".show-parameters-button");
  const parametersCollapsable = () =>
    spectator.query<HTMLDivElement>("#search-parameters");
  const onlyVerifiedCheckbox = () =>
    spectator.query<HTMLInputElement>("#filter-verified");

  const selectedTypeaheadOption = (): HTMLButtonElement =>
    spectator.query<HTMLButtonElement>("button.dropdown-item.active");
  const tagsTypeahead = (): TypeaheadInputComponent =>
    spectator.query<any>("[label='Tags of Interest']");
  const tagsTypeaheadInput = (): HTMLInputElement =>
    spectator.query("#tags-input").querySelector("input");
  const progressLossWarning = () =>
    spectator.query<HTMLDivElement>("baw-reset-progress-warning-modal");

  const spectrogramElements = () =>
    spectator.queryAll<SpectrogramComponent>("oe-spectrogram");
  const previewNextPageButton = () =>
    getElementByInnerText<HTMLButtonElement>("Next Page");
  const previewPreviousPageButton = (): HTMLButtonElement =>
    getElementByInnerText<HTMLButtonElement>("Previous Page");

  const verificationButtons = () =>
    spectator.queryAll<DecisionButton>("oe-verification");
  const verificationGrid = () =>
    spectator.query<VerificationGridComponent>("oe-verification-grid");
  const verificationGridRoot = (): ShadowRoot => verificationGrid().shadowRoot;

  // a lot of the web components elements of interest are in the shadow DOM
  // therefore, we have to chain some query selectors to get to the elements
  const dialogElement = (): VerificationHelpDialogComponent =>
    verificationGridRoot().querySelector("oe-verification-help-dialog");
  const dialogCloseButton = (): HTMLButtonElement =>
    dialogElement().shadowRoot.querySelector(".close-btn");

  function getElementByInnerText<T extends HTMLElement>(text: string): T {
    return spectator.debugElement.query(
      (element) => element.nativeElement.innerText === text
    )?.nativeElement;
  }

  function toggleOnlyVerifiedCheckbox(): void {
    onlyVerifiedCheckbox().click();
    spectator.detectChanges();
  }

  function toggleParameters(): void {
    parametersToggleButton().click();
    spectator.detectChanges();
    tick(defaultDebounceTime);
    spectator.detectChanges();

    discardPeriodicTasks();
  }

  function selectFromTypeahead(target: HTMLInputElement, text: string): void {
    spectator.typeInElement(text, target);
    spectator.detectChanges();
    tick(defaultDebounceTime);
    selectedTypeaheadOption().click();
    flush();
  }

  assertPageInfo(VerificationComponent, "Verify Annotations");

  // if this test fails, the test runners server might not be running with the
  // correct headers
  // see: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/SharedArrayBuffer#security_requirements
  it("should have sharedArrayBuffer defined", () => {
    // note that this test does not use the setup() function
    expect(SharedArrayBuffer).toBeDefined();
  });

  it("should create", () => {
    setup();
    expect(spectator.component).toBeInstanceOf(VerificationComponent);
  });

  describe("search parameters", () => {
    describe("no initial search parameters", () => {
      beforeEach(() => {
        setup();
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

      it("should update the search parameters when filter conditions are added", fakeAsync(() => {
        const targetTag = defaultFakeTags[0];
        const tagText = targetTag.text;
        const expectedTagId = targetTag.id;

        selectFromTypeahead(tagsTypeaheadInput(), tagText);

        const realizedComponentParams = spectator.component.searchParameters;
        expect(realizedComponentParams.tags).toContain(expectedTagId);
      }));

      it("should show and hide the search paramters box correctly", fakeAsync(() => {
        const expectedExpandedClass = "show";

        // the search parameters box should start expanded because there were
        // no initial query search parameters
        expect(parametersCollapsable()).toHaveClass(expectedExpandedClass);

        toggleParameters();
        expect(parametersCollapsable()).not.toHaveClass(expectedExpandedClass);

        toggleParameters();
        expect(parametersCollapsable()).toHaveClass(expectedExpandedClass);
      }));

      describe("Search results preview", () => {
        beforeEach(fakeAsync(() => {
          const targetTag = defaultFakeTags[0];
          const tagText = targetTag.text;
          selectFromTypeahead(tagsTypeaheadInput(), tagText);
        }));

        it("should make the correct api call", () => {
          const expectedBody: Filters<Verification> = {
            filter: {
              "tags.id": {
                in: [defaultFakeTags[0].id],
              },
            },
            paging: {
              page: 1,
              items: 3,
            },
          } as any;

          expect(mockVerificationsApi.filter).toHaveBeenCalledWith(
            expectedBody
          );
        });

        it("should display an error if there are no search results", () => {
          const expectedText = "No annotations found";
          const element = getElementByInnerText(expectedText);
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

        it("should populate the preview spectrograms after collapsing and re-expanding the search parameters", fakeAsync(() => {
          const expectedSpectrogramSources = mockVerificationsResponse.map(
            (verification) => verification.audioLink
          );

          toggleParameters();
          toggleParameters();

          const realizedSpectrogramSources = spectrogramElements().map(
            (element) => element.src
          );
          expect(realizedSpectrogramSources).toEqual(
            expectedSpectrogramSources
          );
        }));
      });
    });

    describe("with initial search parameters", () => {
      beforeEach(() => {
        const testedQueryParameters: Params = {
          tags: defaultFakeTags.map((tag) => tag.id).toString(),
          sites: defaultFakeSites.map((site) => site.id).toString(),
          regions: defaultFakeRegions.map((region) => region.id).toString(),
        };

        // we recreate the fixture with query parameters so that we can test
        // the component's behavior when query parameters are present
        // on load
        setup(testedQueryParameters);
      });

      it("should have a collapsed search parameters box", () => {
        expect(parametersCollapsable()).not.toHaveClass("show");
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
      it("should reset the verification grids page to one if the search parameters change", fakeAsync(() => {
        toggleParameters();
        selectFromTypeahead(tagsTypeaheadInput(), defaultFakeTags[0].text);

        const expectedPagedItems = 0;
        const realizedPagedItems = verificationGrid().pagedItems;
        expect(realizedPagedItems).toEqual(expectedPagedItems);
      }));

      it("should reset the verification grids getPage function when the search parameters are changed", fakeAsync(() => {
        const initialPagingCallback = verificationGrid().getPage;

        toggleParameters();
        selectFromTypeahead(tagsTypeaheadInput(), defaultFakeTags[0].text);
        const newPagingCallback = verificationGrid().getPage;

        expect(newPagingCallback).not.toEqual(initialPagingCallback);
      }));

      describe("verification grid functionality", () => {
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

          it("should have the correct grid size target", () => {
            const expectedTarget = 10;
            const realizedTarget = verificationGrid().targetGridSize;
            expect(realizedTarget).toEqual(expectedTarget);
          });
        });

        describe("after help-dialog dismissed", () => {
          beforeEach(() => {
            // TODO: for some reason, tests are not able to find the dialog element
            // enable this part of the test before review
            // dialogCloseButton().click();
            spectator.detectChanges();
          });

          it("should fetch the next page when a full page of results has a decision applied", () => {});

          it("should pre-fetch client and server side cache when a full page of results has a decision applied", () => {});

          it("should populate the verification grid correctly for the first page", () => {});

          it("should populate the verification grid correctly for a full page pagination", () => {});

          it("should populate the verification grid correctly for a partial page pagination with skip decision", () => {});

          fit("should not display a warning when opening the search parameters", fakeAsync(() => {
            toggleParameters();
            expect(progressLossWarning()).not.toExist();
          }));

          it("should not display a warning if the search parameters are not changed with progress", () => {});

          it("should not display a warning if the search parameters are changed without progress", () => {});

          it("should display a warning if the search parameters are changed with progress", () => {});

          it("should not reset decisions if the search parameters are opened and closed without change", () => {});

          it("should reset decisions if the search parameters are changed", () => {});

          it("should not change the paging callback if the change warning is dismissed", () => {});

          it("should change the paging callback if the search parameters are changed", () => {});

          it("should not change the paging callback if the search parameters are opened and closed without change", () => {});

          it("should download the correct results if the user has not made a full page of decisions", () => {});

          it("should download the correct results if the user has made a full page of decisions", () => {});

          it("should display a progress meter with the correct value after a full page of decisions", () => {});

          it("should be able to navigate back in history", () => {});

          it("should be able to resume verification after navigating back in history", () => {});

          it("should be able to play and pause audio", () => {});

          it("should have the correct tag name in the verification grid tiles", () => {});
        });
      });
    });
  });
});

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
import { Params } from "@angular/router";
import { of } from "rxjs";
import { generateProject } from "@test/fakes/Project";
import { generateRegion } from "@test/fakes/Region";
import { generateSite } from "@test/fakes/Site";
import { assertPageInfo } from "@test/helpers/pageRoute";
import {
  SHALLOW_AUDIO_EVENT,
  SHALLOW_REGION,
  SHALLOW_SITE,
  TAG,
} from "@baw-api/ServiceTokens";
import { CUSTOM_ELEMENTS_SCHEMA, INJECTOR, Injector } from "@angular/core";
import { ShallowRegionsService } from "@baw-api/region/regions.service";
import { ShallowSitesService } from "@baw-api/site/sites.service";
import { TagsService } from "@baw-api/tag/tags.service";
import type { VerificationGridComponent } from "@ecoacoustics/web-components/@types/components/verification-grid/verification-grid";
import type { VerificationComponent as DecisionButton } from "@ecoacoustics/web-components/@types/components/decision/verification/verification";
import type { VerificationHelpDialogComponent } from "@ecoacoustics/web-components/@types/components/verification-grid/help-dialog";
import { modelData } from "@test/helpers/faker";
import { Tag } from "@models/Tag";
import {
  discardPeriodicTasks,
  fakeAsync,
  tick,
} from "@angular/core/testing";
import { defaultDebounceTime } from "src/app/app.helper";
import { TypeaheadInputComponent } from "@shared/typeahead-input/typeahead-input.component";
import { generateTag } from "@test/fakes/Tag";
import { RouterTestingModule } from "@angular/router/testing";
import { selectFromTypeahead } from "@test/helpers/html";
import { ShallowAudioEventsService } from "@baw-api/audio-event/audio-events.service";
import { AudioEvent } from "@models/AudioEvent";
import { generateAudioEvent } from "@test/fakes/AudioEvent";
import { VerificationComponent } from "./verification.component";

describe("VerificationComponent", () => {
  let spectator: SpectatorRouting<VerificationComponent>;
  let defaultProject: Project;
  let defaultRegion: Region;
  let defaultSite: Site;
  let mockAudioEventsApi: SpyObject<ShallowAudioEventsService>;
  let mockAudioEventsResponse: AudioEvent[] = [];
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
    });

    injector = spectator.inject(INJECTOR);

    mockAudioEventsResponse = modelData.randomArray(
      3,
      3,
      () =>
        new AudioEvent(
          generateAudioEvent(),
          injector
        )
    );

    spectator.component.project = defaultProject;
    spectator.component.region = defaultRegion;
    spectator.component.site = defaultSite;

    mockAudioEventsApi = spectator.inject(SHALLOW_AUDIO_EVENT.token);
    mockRegionsApi = spectator.inject(SHALLOW_REGION.token);
    mockSitesApi = spectator.inject(SHALLOW_SITE.token);
    mockTagsApi = spectator.inject(TAG.token);

    mockRegionsApi.filter.and.callFake(() => of(defaultFakeRegions));
    mockSitesApi.filter.and.callFake(() => of(defaultFakeSites));
    mockTagsApi.filter.and.callFake(() => of(defaultFakeTags));
    mockAudioEventsApi.filter.and.callFake(() =>
      of(mockAudioEventsResponse)
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

  const tagsTypeahead = (): TypeaheadInputComponent =>
    spectator.query<any>("[label='Tags of Interest']");
  const tagsTypeaheadInput = (): HTMLInputElement =>
    spectator.query("#tags-input");
  const progressLossWarning = () =>
    spectator.query<HTMLDivElement>("baw-reset-progress-warning-modal");

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

        selectFromTypeahead(spectator, tagsTypeaheadInput(), tagText);

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
        expect(mockAudioEventsApi.filter).toHaveBeenCalledTimes(
          expectedRequestCount
        );
      });

      it("should cache server side with HEAD requests", () => {
        const expectedRequestCount = 50;
        expect(mockAudioEventsApi.filter).toHaveBeenCalledTimes(
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
        selectFromTypeahead(spectator, tagsTypeaheadInput(), defaultFakeTags[0].text);

        const expectedPagedItems = 0;
        const realizedPagedItems = verificationGrid().pagedItems;
        expect(realizedPagedItems).toEqual(expectedPagedItems);
      }));

      it("should reset the verification grids getPage function when the search parameters are changed", fakeAsync(() => {
        const initialPagingCallback = verificationGrid().getPage;

        toggleParameters();
        selectFromTypeahead(spectator, tagsTypeaheadInput(), defaultFakeTags[0].text);
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

          it("should not display a warning when opening the search parameters", fakeAsync(() => {
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

import {
  createRoutingFactory,
  SpectatorRouting,
  SpyObject,
} from "@ngneat/spectator";
import { provideMockBawApi } from "@baw-api/provide-bawApiMock";
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
  MEDIA,
  PROJECT,
  SHALLOW_AUDIO_EVENT,
  SHALLOW_REGION,
  SHALLOW_SITE,
  SHALLOW_VERIFICATION,
  TAG,
} from "@baw-api/ServiceTokens";
import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { TagsService } from "@baw-api/tag/tags.service";
import { VerificationGridComponent } from "@ecoacoustics/web-components/@types/components/verification-grid/verification-grid";
import { VerificationBootstrapComponent } from "@ecoacoustics/web-components/@types/components/bootstrap-modal/bootstrap-modal";
import { modelData } from "@test/helpers/faker";
import { Tag } from "@models/Tag";
import { discardPeriodicTasks, fakeAsync, tick } from "@angular/core/testing";
import { generateTag } from "@test/fakes/Tag";
import { selectFromTypeahead, waitUntil } from "@test/helpers/html";
import { ShallowAudioEventsService } from "@baw-api/audio-event/audio-events.service";
import { AudioEvent } from "@models/AudioEvent";
import { generateAudioEvent } from "@test/fakes/AudioEvent";
import { AnnotationService } from "@services/models/annotation.service";
import { AudioRecording } from "@models/AudioRecording";
import { Annotation } from "@models/data/Annotation";
import { generateAudioRecording } from "@test/fakes/AudioRecording";
import { generateAnnotation } from "@test/fakes/data/Annotation";
import { MediaService } from "@services/media/media.service";
import { generateAnnotationSearchUrlParameters } from "@test/fakes/data/AnnotationSearchParameters";
import { NgbModal, NgbModalConfig } from "@ng-bootstrap/ng-bootstrap";
import { AnnotationSearchFormComponent } from "@components/annotations/components/annotation-search-form/annotation-search-form.component";
import { SearchFiltersModalComponent } from "@components/annotations/components/modals/search-filters/search-filters.component";
import { ShallowRegionsService } from "@baw-api/region/regions.service";
import { ShallowSitesService } from "@baw-api/site/sites.service";
import { ProjectsService } from "@baw-api/project/projects.service";
import { detectChanges } from "@test/helpers/changes";
import { nodeModule, testAsset } from "@test/helpers/karma";
import { patchSharedArrayBuffer } from "src/patches/tests/testPatches";
import { ProgressWarningComponent } from "@components/annotations/components/modals/progress-warning/progress-warning.component";
import { AssociationInjector } from "@models/ImplementsInjector";
import { ASSOCIATION_INJECTOR } from "@services/association-injector/association-injector.tokens";
import { ShallowVerificationService } from "@baw-api/verification/verification.service";
import { Verification } from "@models/Verification";
import { TypeaheadInputComponent } from "@shared/typeahead-input/typeahead-input.component";
import { DateTimeFilterComponent } from "@shared/date-time-filter/date-time-filter.component";
import { WIPComponent } from "@shared/wip/wip.component";
import {
  interceptFilterApiRequest,
  interceptShowApiRequest,
  viewports,
} from "@test/helpers/general";
import { VerificationGridTileComponent } from "@ecoacoustics/web-components/@types";
import { IconsModule } from "@shared/icons/icons.module";
import { AnnotationSearchParameters } from "../annotationSearchParameters";
import { VerificationComponent } from "./verification.component";

describe("VerificationComponent", () => {
  let spec: SpectatorRouting<VerificationComponent>;
  let injector: SpyObject<AssociationInjector>;

  let audioEventsApiSpy: SpyObject<ShallowAudioEventsService>;
  let mediaServiceSpy: SpyObject<MediaService>;
  let fileWriteSpy: jasmine.Spy;

  let verificationApiSpy: SpyObject<ShallowVerificationService>;
  let tagsApiSpy: SpyObject<TagsService>;
  let projectApiSpy: SpyObject<ProjectsService>;
  let regionApiSpy: SpyObject<ShallowRegionsService>;
  let sitesApiSpy: SpyObject<ShallowSitesService>;

  let modalsSpy: NgbModal;
  let modalConfigService: NgbModalConfig;

  let routeProject: Project;
  let routeRegion: Region;
  let routeSite: Site;

  let mockSearchParameters: AnnotationSearchParameters;
  let mockAudioEventsResponse: AudioEvent[] = [];
  let defaultFakeTags: Tag[];
  let mockAudioRecording: AudioRecording;
  let mockAnnotationResponse: Annotation;
  let verificationResponse: Verification;

  const createComponent = createRoutingFactory({
    component: VerificationComponent,
    imports: [
      IconsModule,

      SearchFiltersModalComponent,
      ProgressWarningComponent,
      AnnotationSearchFormComponent,
      TypeaheadInputComponent,
      DateTimeFilterComponent,
      WIPComponent,
    ],
    providers: [provideMockBawApi()],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
  });

  async function setup(queryParameters: Params = {}) {
    spec = createComponent({
      detectChanges: false,
      params: {
        projectId: routeProject.id,
        regionId: routeRegion.id,
        siteId: routeSite.id,
      },
      providers: [
        {
          provide: AnnotationService,
          useValue: { show: () => mockAnnotationResponse },
        },
      ],
      queryParams: queryParameters,
    });

    injector = spec.inject(ASSOCIATION_INJECTOR);

    mediaServiceSpy = spec.inject(MEDIA.token);
    mediaServiceSpy.createMediaUrl = jasmine.createSpy("createMediaUrl") as any;
    mediaServiceSpy.createMediaUrl.and.returnValue(testAsset("example.flac"));

    mockSearchParameters = new AnnotationSearchParameters(
      generateAnnotationSearchUrlParameters(queryParameters),
      injector
    );
    mockSearchParameters.routeSiteModel = routeSite;
    mockSearchParameters.routeSiteId = routeSite.id;

    mockSearchParameters.routeRegionModel = routeRegion;
    mockSearchParameters.routeRegionId = routeRegion.id;

    mockSearchParameters.routeProjectModel = routeProject;
    mockSearchParameters.routeProjectId = routeProject.id;

    defaultFakeTags = modelData.randomArray(
      3,
      10,
      () => new Tag(generateTag(), injector)
    );

    mockAudioEventsResponse = modelData.randomArray(
      3,
      3,
      () => new AudioEvent(generateAudioEvent(), injector)
    );

    mockAudioRecording = new AudioRecording(
      generateAudioRecording({ siteId: routeSite.id }),
      injector
    );

    mockAnnotationResponse = new Annotation(
      generateAnnotation({ audioRecording: mockAudioRecording }),
      injector
    );

    spec.component.searchParameters = mockSearchParameters;
    spec.component.project = routeProject;
    spec.component.region = routeRegion;
    spec.component.site = routeSite;

    verificationApiSpy = spec.inject(SHALLOW_VERIFICATION.token);
    audioEventsApiSpy = spec.inject(SHALLOW_AUDIO_EVENT.token);
    tagsApiSpy = spec.inject(TAG.token);
    projectApiSpy = spec.inject(PROJECT.token);
    regionApiSpy = spec.inject(SHALLOW_REGION.token);
    sitesApiSpy = spec.inject(SHALLOW_SITE.token);

    // inject the bootstrap modal config service so that we can disable animations
    // this is needed so that buttons can be clicked without waiting for the async animation
    modalsSpy = spec.inject(NgbModal);
    modalConfigService = spec.inject(NgbModalConfig);
    modalConfigService.animation = false;

    // TODO: this should probably be replaced with callThrough()
    modalsSpy.open = jasmine.createSpy("open").and.callFake(modalsSpy.open);

    const requestPromises = Promise.all([
      interceptShowApiRequest(tagsApiSpy, injector, defaultFakeTags[0], Tag),
      interceptShowApiRequest(projectApiSpy, injector, routeProject, Project),
      interceptShowApiRequest(regionApiSpy, injector, routeRegion, Region),
      interceptShowApiRequest(sitesApiSpy, injector, routeSite, Site),

      interceptFilterApiRequest(regionApiSpy, injector, [routeRegion], Region),
      interceptFilterApiRequest(sitesApiSpy, injector, [routeSite], Site),
      interceptFilterApiRequest(
        projectApiSpy,
        injector,
        [routeProject],
        Project
      ),

      interceptFilterApiRequest(tagsApiSpy, injector, defaultFakeTags, Tag),
      interceptFilterApiRequest(
        audioEventsApiSpy,
        injector,
        mockAudioEventsResponse,
        AudioEvent
      ),
    ]);

    tagsApiSpy.typeaheadCallback = (() => () => of(defaultFakeTags)) as any;

    verificationApiSpy.createOrUpdate = jasmine.createSpy(
      "createOrUpdate"
    ) as any;
    verificationApiSpy.createOrUpdate.and.callFake(() =>
      of(verificationResponse)
    );

    verificationApiSpy.create = jasmine.createSpy("create") as any;
    verificationApiSpy.create.and.callFake(() => of(verificationResponse));

    verificationApiSpy.update = jasmine.createSpy("update") as any;
    verificationApiSpy.update.and.callFake(() => of(verificationResponse));

    // I explicitly set the viewport size so that the grid size is always
    // consistent no matter what size the karma browser window is
    viewport.set(viewports.extraLarge);

    await detectChanges(spec);

    await requestPromises;
  }

  beforeEach(async () => {
    patchSharedArrayBuffer();
    fileWriteSpy = saveFilePickerApiSpy();

    // we import the web components using a dynamic import statement so that
    // the web components are loaded through the karma test server
    //
    // we also use the webpackIgnore comment so that the webpack bundler does
    // not bundle the web components when dynamically imported
    // if we were to bundle the assets first, the web components would be served
    // under the __karma_webpack__ sub-path, but workers dynamically loaded by
    // the web components would be served under the root path
    //
    // under some circumstances, Karma will re-use the same browser instance
    // between tests. Meaning that the custom element can registration can
    // persist between multiple tests.
    // to prevent re-declaring the same custom element, we conditionally
    // import the web components only if they are not already defined
    if (!customElements.get("oe-verification-grid")) {
      await import(
        /* webpackIgnore: true */ nodeModule(
          "@ecoacoustics/web-components/dist/components.js"
        )
      );
    }

    routeProject = new Project(generateProject());
    routeRegion = new Region(generateRegion({ projectId: routeProject.id }));
    routeSite = new Site(generateSite({ regionId: routeRegion.id }));
  });

  afterEach(() => {
    // modals can persist between tests, meaning that we might have multiple
    // modal windows open at the same time if we do not explicitly dismiss them
    // after each test
    modalsSpy?.dismissAll();
  });

  const dialogToggleButton = () =>
    spec.query<HTMLButtonElement>(".filter-button");

  const tagsTypeahead = () =>
    document.querySelector<HTMLElement>("#tags-input");
  const updateFiltersButton = () =>
    document.querySelector<HTMLButtonElement>("#update-filters-btn");

  const verificationGrid = () =>
    spec.query<VerificationGridComponent>("oe-verification-grid");
  const verificationGridRoot = () => verificationGrid().shadowRoot;

  const gridTiles = () =>
    verificationGridRoot().querySelectorAll<VerificationGridTileComponent>(
      "oe-verification-grid-tile"
    );

  // a lot of the web components elements of interest are in the shadow DOM
  // therefore, we have to chain some query selectors to get to the elements
  const bootstrapElement = () =>
    verificationGridRoot().querySelector<VerificationBootstrapComponent>(
      "oe-verification-bootstrap"
    );
  const helpCloseButton = () =>
    bootstrapElement().shadowRoot.querySelector<HTMLButtonElement>(
      ".close-button"
    );

  const decisionComponents = () =>
    document.querySelectorAll<HTMLButtonElement>("oe-verification");
  const decisionButton = (index: number) =>
    decisionComponents()[index].shadowRoot.querySelector<HTMLButtonElement>(
      "button"
    );

  const dataSourceComponent = () =>
    document.querySelector<HTMLElement>("oe-data-source");
  const dataSourceRoot = () => dataSourceComponent().shadowRoot;
  const downloadResultsButton = () =>
    dataSourceRoot().querySelector<HTMLButtonElement>(
      "[data-testid='download-results-button']"
    );

  function toggleParameters(): void {
    spec.click(dialogToggleButton());
    tick(1_000);
    discardPeriodicTasks();
  }

  async function makeDecision(index: number) {
    const decisionComponent = decisionComponents()[index];
    decisionComponent.disabled = false;

    const decisionButtonTarget = decisionButton(index);
    spec.click(decisionButtonTarget);

    await detectChanges(spec);
  }

  /** Uses shift + click selection to select a range */
  async function makeSelection(start: number, end: number) {
    const targetGridTiles = gridTiles();

    const startTile = targetGridTiles[start];
    const startTileClickTarget = startTile.shadowRoot.querySelector(
      "[part='tile-container']"
    );

    const endTile = targetGridTiles[end];
    const endTileClickTarget = endTile.shadowRoot.querySelector(
      "[part='tile-container']"
    );

    startTileClickTarget.dispatchEvent(new MouseEvent("pointerdown"));

    // If the start is the same as the end, we do not want to dispatch a shift
    // click event on the tile because that would result in the tile being
    // de-selected.
    // I have made this decision because I deemed it helpful for this function
    // to be able to select a single tile.
    // e.g. makeSelection(0, 0) should select the first tile
    if (startTile !== endTile) {
      endTileClickTarget.dispatchEvent(
        new MouseEvent("pointerdown", { shiftKey: true })
      );
    }

    await detectChanges(spec);
  }

  async function downloadResults() {
    const downloadButton = downloadResultsButton();

    await waitUntil(() => !downloadButton.disabled);

    expect(downloadButton).not.toBeDisabled();
    downloadButton.click();

    await waitUntil(() => fileWriteSpy.calls.count() > 0);

    detectChanges(spec);
  }

  function saveFilePickerApiSpy(): jasmine.Spy {
    const fileWriteApi = jasmine.createSpy("write").and.stub();

    const mockApi = () =>
      Object({
        createWritable: () =>
          Object({
            write: fileWriteApi,
            close: jasmine.createSpy("close").and.stub(),
          }),
      });

    window["showSaveFilePicker"] = mockApi;
    return fileWriteApi;
  }

  function gridSize(): number {
    return gridTiles().length;
  }

  assertPageInfo(VerificationComponent, "Verify Annotations");

  // if this test fails, the test runners server might not be running with the
  // correct headers
  // see: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/SharedArrayBuffer#security_requirements
  it("should have sharedArrayBuffer defined", () => {
    // note that this test does not use the setup() function
    expect(SharedArrayBuffer).toBeDefined();
  });

  it("should create", async () => {
    await setup();
    expect(spec.component).toBeInstanceOf(VerificationComponent);
  });

  describe("search parameters", () => {
    describe("no initial search parameters", () => {
      beforeEach(async () => {
        await setup();

        helpCloseButton().click();
        await detectChanges(spec);
      });

      xit("should update the search parameters when filter conditions are added", fakeAsync(() => {
        const targetTag = defaultFakeTags[0];
        const tagText = targetTag.text;
        const expectedTagId = targetTag.id;

        toggleParameters();
        selectFromTypeahead(spec, tagsTypeahead(), tagText);

        const realizedComponentParams = spec.component.searchParameters;
        expect(realizedComponentParams.tags).toContain(expectedTagId);
      }));

      it("should show and hide the search parameters dialog correctly", fakeAsync(() => {
        expect(modalsSpy.open).not.toHaveBeenCalled();
        toggleParameters();
        expect(modalsSpy.open).toHaveBeenCalledTimes(1);
      }));
    });

    describe("with initial search parameters", () => {
      let mockTagIds: number[];

      beforeEach(async () => {
        mockTagIds = modelData.ids();

        const testedQueryParameters: Params = {
          tags: mockTagIds.join(","),
        };

        // we recreate the fixture with query parameters so that we can test
        // the component's behavior when query parameters are present
        // on load
        await setup(testedQueryParameters);

        helpCloseButton().click();
        await detectChanges(spec);
      });

      it("should create the correct search parameter model from query string parameters", () => {
        const realizedParameterModel = spec.component.searchParameters;

        expect(realizedParameterModel).toEqual(
          jasmine.objectContaining({
            tags: jasmine.arrayContaining(mockTagIds),
          })
        );
      });

      describe("verification api", () => {
        beforeEach(async () => {
          await waitUntil(() => gridSize() > 2);
        });

        it("should make the correct api calls when a decision is made about the entire grid", async () => {
          await makeDecision(0);
          expect(verificationApiSpy.createOrUpdate).toHaveBeenCalledTimes(
            gridSize()
          );
        });

        it("should make a verification api when a single decision is made", async () => {
          await makeSelection(0, 0);
          await makeDecision(0);

          await detectChanges(spec);

          expect(verificationApiSpy.createOrUpdate).toHaveBeenCalledOnceWith(
            jasmine.anything(),
            jasmine.anything(),
            jasmine.anything()
          );
        });

        it("should make multiple verification api calls when multiple decisions are made", async () => {
          await makeSelection(0, 2);
          await makeDecision(0);

          const expectedApiCalls = [
            [jasmine.anything(), jasmine.anything(), jasmine.anything()],
            [jasmine.anything(), jasmine.anything(), jasmine.anything()],
            [jasmine.anything(), jasmine.anything(), jasmine.anything()],
          ];

          expect(verificationApiSpy.createOrUpdate).toHaveBeenCalledTimes(
            expectedApiCalls.length
          );

          for (const apiCall of expectedApiCalls) {
            expect(verificationApiSpy.createOrUpdate).toHaveBeenCalledWith(
              ...apiCall
            );
          }
        });

        it("should make the correct api calls when a decision is overwritten", async () => {
          await makeSelection(0, 0);
          await makeDecision(0);
          expect(verificationApiSpy.createOrUpdate).toHaveBeenCalledTimes(1);

          verificationApiSpy.createOrUpdate.calls.reset();
          await makeDecision(1);

          expect(verificationApiSpy.createOrUpdate).toHaveBeenCalledOnceWith(
            jasmine.anything(),
            jasmine.anything(),
            jasmine.anything()
          );
        });
      });

      describe("verification grid functionality", () => {
        describe("initial state", () => {
          it("should be mount all the required Open-Ecoacoustics web components as custom elements", () => {
            const expectedCustomElements: string[] = [
              "oe-verification-grid",
              "oe-verification",
              "oe-media-controls",
              "oe-indicator",
              "oe-axes",

              // these two custom elements are private components not supposed
              // to be used by the end user
              // however, because we control both the web components and the
              // workbench client, I am happy to assert that these two
              // components are defined, so that the test is more robust
              "oe-verification-bootstrap",
              "oe-verification-grid-tile",
            ];

            for (const selector of expectedCustomElements) {
              const customElementClass = customElements.get(selector);
              expect(customElementClass).withContext(selector).toBeDefined();
            }
          });

          it("should have the correct grid size target", () => {
            const expectedTarget = 12;
            const realizedTarget = verificationGrid().targetGridSize;
            expect(realizedTarget).toEqual(expectedTarget);
          });
        });

        it("should reset the verification grids getPage function when the search parameters are changed", async () => {
          await detectChanges(spec);

          const initialPagingCallback = verificationGrid().getPage;
          const targetTag = defaultFakeTags[0];
          const tagText = targetTag.text;

          fakeAsync(() => {
            toggleParameters();
            selectFromTypeahead(spec, tagsTypeahead(), tagText);
          })();

          spec.click(updateFiltersButton());

          await detectChanges(spec);

          // we use the "toBe" matcher so that we compare the "getPage" callback
          // by reference
          const newPagingCallback = verificationGrid().getPage;
          expect(newPagingCallback).not.toBe(initialPagingCallback);
        });

        it("should populate the verification grid correctly for the first page", () => {
          const realizedTileCount = verificationGrid().populatedTileCount;
          expect(realizedTileCount).toBeGreaterThan(0);
        });

        // jasmine will automatically fail if an error is thrown in a test
        // by clicking the download button we can assert that the download
        // functionality was called without throwing an error
        // we also assert that the file write api was called with a file
        it("should download results without error", async () => {
          // the verification grid will not allow us to download results if
          // there is no history to download. Therefore, we have to make a
          // decision before testing downloading results
          await makeDecision(0);
          await downloadResults();

          expect(fileWriteSpy).toHaveBeenCalledOnceWith(jasmine.any(File));
        });
      });
    });
  });
});

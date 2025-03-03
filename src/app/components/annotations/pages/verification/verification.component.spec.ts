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
import {
  discardPeriodicTasks,
  fakeAsync,
  flush,
  tick,
} from "@angular/core/testing";
import { generateTag } from "@test/fakes/Tag";
import { RouterTestingModule } from "@angular/router/testing";
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
    imports: [MockBawApiModule, SharedModule, RouterTestingModule],
    declarations: [
      SearchFiltersModalComponent,
      ProgressWarningComponent,
      AnnotationSearchFormComponent,
    ],
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

    // needed for AnnotationSearchParameters associated models
    audioEventsApiSpy.filter.and.callFake(() => of(mockAudioEventsResponse));
    tagsApiSpy.filter.and.callFake(() => of(defaultFakeTags));
    projectApiSpy.filter.and.callFake(() => of([routeProject]));
    regionApiSpy.filter.and.callFake(() => of([routeRegion]));
    sitesApiSpy.filter.and.callFake(() => of([routeSite]));

    verificationApiSpy.createOrUpdate.and.callFake(() => of(verificationResponse));
    verificationApiSpy.update.and.callFake(() => of(verificationResponse));

    await detectChanges(spec);
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
  const verificationGridRoot = (): ShadowRoot => verificationGrid().shadowRoot;

  const gridTiles = () => spec.queryAll("oe-verification-grid-tile");

  // a lot of the web components elements of interest are in the shadow DOM
  // therefore, we have to chain some query selectors to get to the elements
  const helpElement = (): VerificationBootstrapComponent =>
    verificationGridRoot().querySelector("oe-verification-help-dialog");
  const helpCloseButton = (): HTMLButtonElement =>
    helpElement().shadowRoot.querySelector(".close-btn");

  const decisionButtons = (): NodeListOf<HTMLButtonElement> =>
    document.querySelectorAll("oe-verification");

  const dataSourceComponent = (): HTMLElement =>
    document.querySelector("oe-data-source");
  const dataSourceRoot = (): ShadowRoot =>
    dataSourceComponent().shadowRoot;
  const downloadResultsButton = (): HTMLButtonElement =>
    dataSourceRoot().querySelector("[data-testid='download-results-button']");

  function toggleParameters(): void {
    spec.click(dialogToggleButton());
    tick(1_000);
    discardPeriodicTasks();
  }

  async function makeDecision(index: number) {
    const decisionButtonTarget = decisionButtons()[index];
    decisionButtonTarget.click();
    verificationGrid().dispatchEvent(new CustomEvent("decision-made"));

    detectChanges(spec);
  }

  /** Uses shift + click selection to select a range */
  async function makeSelection(start: number, end: number) {
    const startTile = gridTiles()[start];
    const endTile = gridTiles()[end];

    startTile.dispatchEvent(new MouseEvent("click"));
    endTile.dispatchEvent(new MouseEvent("click", { shiftKey: true }));
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

  assertPageInfo(VerificationComponent, "Verify Annotations");

  // if this test fails, the test runners server might not be running with the
  // correct headers
  // see: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/SharedArrayBuffer#security_requirements
  xit("should have sharedArrayBuffer defined", () => {
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

      // TODO: fix this test. Something is leaking causing there to be no results in the dropdown
      xit("should update the search parameters when filter conditions are added", fakeAsync(() => {
        const targetTag = defaultFakeTags[0];
        const tagText = targetTag.text;
        const expectedTagId = targetTag.id;

        toggleParameters();
        selectFromTypeahead(spec, tagsTypeahead(), tagText);

        const realizedComponentParams = spec.component.searchParameters;
        expect(realizedComponentParams.tags).toContain(expectedTagId);
      }));

      it("should show and hide the search paramters dialog correctly", fakeAsync(() => {
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
        it("should make a verification api when a single decision is made", async () => {
          await makeDecision(0);
          expect(verificationApiSpy.createOrUpdate).toHaveBeenCalledOnceWith({});
        });

        it("should make multiple verification api calls when multiple decisions are made", () => {
          makeSelection(0, 2);

          const expectedApiCalls = [{}, {}, {}];
          expect(verificationApiSpy.createOrUpdate).toHaveBeenCalledTimes(expectedApiCalls.length);

          for (const apiCall of expectedApiCalls) {
            expect(verificationApiSpy.createOrUpdate).toHaveBeenCalledWith(apiCall);
          }
        });

        it("should make the correct api calls when a decision is overwritten", () => {
          makeDecision(0);
          makeDecision(1);

          expect(verificationApiSpy.createOrUpdate).toHaveBeenCalledTimes(2);

          expect(verificationApiSpy.update).toHaveBeenCalledOnceWith({});
        });

        it("should make an update api call if a verification conflicts", () => {
          makeDecision(1);

          expect(verificationApiSpy.createOrUpdate).toHaveBeenCalledOnceWith({});
          expect(verificationApiSpy.update).toHaveBeenCalledOnceWith({});
        });
      });

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

        // TODO: this test seems to fail only when running in CI because the tags typeahead isn't populated correctly
        xit("should reset the verification grids getPage function when the search parameters are changed", fakeAsync(() => {
          const initialPagingCallback = verificationGrid().getPage;
          const targetTag = defaultFakeTags[0];
          const tagText = targetTag.text;

          toggleParameters();
          selectFromTypeahead(spec, tagsTypeahead(), tagText);
          spec.click(updateFiltersButton());
          detectChanges(spec);

          const newPagingCallback = verificationGrid().getPage;
          expect(newPagingCallback).not.toBe(initialPagingCallback);

          flush();
          discardPeriodicTasks();
        }));

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

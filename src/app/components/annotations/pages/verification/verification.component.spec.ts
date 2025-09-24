import {
  createRoutingFactory,
  mockProvider,
  SpectatorRouting,
  SpyObject,
} from "@ngneat/spectator";
import { provideMockBawApi } from "@baw-api/provide-baw-ApiMock";
import { Project } from "@models/Project";
import { Region } from "@models/Region";
import { Site } from "@models/Site";
import { Params, Router } from "@angular/router";
import { of } from "rxjs";
import { generateProject } from "@test/fakes/Project";
import { generateRegion } from "@test/fakes/Region";
import { generateSite } from "@test/fakes/Site";
import { assertPageInfo } from "@test/helpers/pageRoute";
import { CUSTOM_ELEMENTS_SCHEMA, signal } from "@angular/core";
import { TagsService } from "@baw-api/tag/tags.service";
import { VerificationGridComponent } from "@ecoacoustics/web-components/@types/components/verification-grid/verification-grid";
import { modelData } from "@test/helpers/faker";
import { Tag } from "@models/Tag";
import { discardPeriodicTasks, fakeAsync, tick } from "@angular/core/testing";
import { generateTag } from "@test/fakes/Tag";
import {
  clickButton,
  selectFromTypeahead,
  waitUntil,
} from "@test/helpers/html";
import { ShallowAudioEventsService } from "@baw-api/audio-event/audio-events.service";
import { AudioEvent } from "@models/AudioEvent";
import { generateAudioEvent } from "@test/fakes/AudioEvent";
import { AnnotationService } from "@services/models/annotations/annotation.service";
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
import { nodeModule } from "@test/helpers/karma";
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
import {
  DecisionComponent,
  TagPromptComponent,
  VerificationGridTileComponent,
} from "@ecoacoustics/web-components/@types";
import { IconsModule } from "@shared/icons/icons.module";
import { User } from "@models/User";
import { generateUser } from "@test/fakes/User";
import { SelectableItemsComponent } from "@shared/items/selectable-items/selectable-items.component";
import { TaggingCorrectionsService } from "@services/models/tagging-corrections/tagging-corrections.service";
import { Tagging } from "@models/Tagging";
import { generateVerification } from "@test/fakes/Verification";
import { generateTagging } from "@test/fakes/Tagging";
import { ScrollService } from "@services/scroll/scroll.service";
import {
  AnnotationSearchParameters,
  VerificationStatusKey,
} from "../annotationSearchParameters";
import { exampleBase64 } from "../../../../../assets/test-assets/example.base64";
import { VerificationComponent } from "./verification.component";

enum DecisionOptions {
  TRUE = "true",
  FALSE = "false",
  UNSURE = "unsure",
  CORRECT_TAG = "correct-tag",
  SKIP = "skip",
}

interface VerificationTest {
  testName?: string;
  initialDecision: DecisionOptions | null;
  newDecision: DecisionOptions;
  expectedApiCall: VerificationServiceCall | null;
}

interface TagCorrectionDecision {
  item: number;
  decision: DecisionOptions;
}

interface NewTagTest {
  testName?: string;
  initialDecision: TagCorrectionDecision | DecisionOptions.SKIP | null;
  newDecision: TagCorrectionDecision | DecisionOptions.SKIP;
  expectedApiCalls: TagCorrectionServiceCall[];
}

interface ServiceCall<T> {
  method: keyof T;
  args: any[];
}

type VerificationServiceCall = ServiceCall<ShallowVerificationService>;
type TagCorrectionServiceCall = ServiceCall<TaggingCorrectionsService>;

describe("VerificationComponent", () => {
  let spec: SpectatorRouting<VerificationComponent>;
  let injector: SpyObject<AssociationInjector>;

  let audioEventsApiSpy: SpyObject<ShallowAudioEventsService>;
  let mediaServiceSpy: SpyObject<MediaService>;

  let verificationApiSpy: SpyObject<ShallowVerificationService>;
  let taggingCorrectionApiSpy: SpyObject<TaggingCorrectionsService>;
  let tagsApiSpy: SpyObject<TagsService>;
  let projectApiSpy: SpyObject<ProjectsService>;
  let regionApiSpy: SpyObject<ShallowRegionsService>;
  let sitesApiSpy: SpyObject<ShallowSitesService>;

  let modalsSpy: NgbModal;

  let routeProject: Project;
  let routeRegion: Region;
  let routeSite: Site;

  let mockSearchParameters: AnnotationSearchParameters;
  let mockUser: User;
  let mockAudioEventsResponse: AudioEvent[] = [];
  let defaultFakeTags: Tag[];
  let mockAudioRecording: AudioRecording;
  let mockAnnotationResponse: Annotation;
  let verificationResponse: Verification;

  const createComponent = createRoutingFactory({
    component: VerificationComponent,
    imports: [
      IconsModule,

      SelectableItemsComponent,
      SearchFiltersModalComponent,
      AnnotationSearchFormComponent,
      TypeaheadInputComponent,
      DateTimeFilterComponent,
      WIPComponent,
    ],
    providers: [
      provideMockBawApi(),

      // The verification grid will automatically scroll into view once it has
      // loaded. However, I disable this behavior for testing because it can be
      // annoying to deal with when trying to read test stack traces and the page
      // automatically scrolls away from what you were reading.
      mockProvider(ScrollService),
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
  });

  async function setup(queryParameters: Params = {}) {
    // We stop the bootstrap modal from opening because there is logic that
    // stops decisions from being made while the bootstrap is open.
    // I did this so that people can't accidentally make a decision by pressing
    // a keyboard shortcut while the bootstrap modal is open.
    //
    // I prevent the modal from opening rather than trying to close it because:
    //
    // 1) If the modal fails to close or is slow to close, I don't want any
    //    tests to fails.
    // 2) It makes the tests faster because we don't have to wait for the modal
    //    to open and close.
    setNoBootstrap();

    spec = createComponent({
      detectChanges: false,
      params: {
        projectId: routeProject.id,
        regionId: routeRegion.id,
        siteId: routeSite.id,
      },
      data: {
        resolvers: {
          project: "resolver",
          region: "resolver",
          site: "resolver",
        },
        project: routeProject,
        region: routeRegion,
        site: routeSite,
      },
      providers: [
        mockProvider(AnnotationService, {
          show: () => mockAnnotationResponse,
        }),
        mockProvider(TaggingCorrectionsService),
        mockProvider(Router, {
          createUrlTree: () => ({}),
        }),
      ],
      queryParams: queryParameters,
    });

    injector = spec.inject(ASSOCIATION_INJECTOR);

    // We use a base64 encoded audio file rather than fetching the file through
    // the Karma server because we encountered issues where the server would
    // modify & corrupt the audio file when it was served.
    // This only seemed to occur after the first test had run.
    // see: https://github.com/QutEcoacoustics/workbench-client/issues/2139#issuecomment-3322539983
    //
    // TODO: Remove this once we replace Karma
    const mockFile = `data:[audio/flac];base64,${exampleBase64}`;
    // const mockFile = testAsset("example.flac");

    mediaServiceSpy = spec.inject(MediaService);
    mediaServiceSpy.createMediaUrl = jasmine.createSpy("createMediaUrl") as any;
    mediaServiceSpy.createMediaUrl.and.returnValue(mockFile);

    mockSearchParameters = new AnnotationSearchParameters(
      generateAnnotationSearchUrlParameters(queryParameters),
      mockUser,
      injector,
    );
    mockSearchParameters.routeSiteModel = routeSite;
    mockSearchParameters.routeSiteId = routeSite.id;

    mockSearchParameters.routeRegionModel = routeRegion;
    mockSearchParameters.routeRegionId = routeRegion.id;

    mockSearchParameters.routeProjectModel = routeProject;
    mockSearchParameters.routeProjectId = routeProject.id;

    defaultFakeTags = Array.from({ length: 3 }).map((_, index) => {
      const tagObject = generateTag({ id: index, text: `item ${index}` });
      return new Tag(tagObject, injector);
    });

    const mockAudioEventIds = Array.from({ length: 12 }).map((_, index) => index);
    const mockTaggings = defaultFakeTags.slice(0, 3).map((tag, index) => {
      return new Tagging(generateTagging({ tagId: tag.id, audioEventId: index }), injector);
    });

    mockAudioEventsResponse = mockAudioEventIds.map((id, index) => {
      return new AudioEvent(
        generateAudioEvent({ id, taggings: [mockTaggings[index]] }),
        injector,
      );
    });

    mockAudioRecording = new AudioRecording(
      generateAudioRecording({ siteId: routeSite.id }),
      injector,
    );

    mockAnnotationResponse = new Annotation(
      generateAnnotation({
        audioRecording: mockAudioRecording,
        tags: defaultFakeTags,
        ...mockAudioEventsResponse[0],
      }),
      injector,
    );

    verificationResponse = new Verification(generateVerification(), injector);

    spec.component.searchParameters = signal(mockSearchParameters);

    verificationApiSpy = spec.inject(ShallowVerificationService);
    taggingCorrectionApiSpy = spec.inject(TaggingCorrectionsService);
    audioEventsApiSpy = spec.inject(ShallowAudioEventsService);
    tagsApiSpy = spec.inject(TagsService);
    projectApiSpy = spec.inject(ProjectsService);
    regionApiSpy = spec.inject(ShallowRegionsService);
    sitesApiSpy = spec.inject(ShallowSitesService);

    // inject the bootstrap modal config service so that we can disable animations
    // this is needed so that buttons can be clicked without waiting for the async animation
    modalsSpy = spec.inject(NgbModal);
    const modalConfigService = spec.inject(NgbModalConfig);
    modalConfigService.animation = false;

    spyOn(modalsSpy, "open").and.callThrough();

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
        Project,
      ),

      interceptFilterApiRequest(tagsApiSpy, injector, defaultFakeTags, Tag),
      interceptFilterApiRequest(
        audioEventsApiSpy,
        injector,
        mockAudioEventsResponse,
        AudioEvent,
      ),
    ]);

    tagsApiSpy.typeaheadCallback.andReturn(() => of(defaultFakeTags));

    spyOn(verificationApiSpy, "create").and.returnValue(
      of(verificationResponse),
    );
    spyOn(verificationApiSpy, "update").and.returnValue(
      of(verificationResponse),
    );
    spyOn(verificationApiSpy, "createOrUpdate").and.returnValue(
      of(verificationResponse),
    );
    spyOn(verificationApiSpy, "destroy").and.returnValue(of());

    spyOn(verificationApiSpy, "filter").and.returnValue(of([]));
    spyOn(verificationApiSpy, "list").and.returnValue(of([]));
    spyOn(verificationApiSpy, "show").and.returnValue(of());

    spyOn(verificationApiSpy, "destroyUserVerification").and.returnValue(
      of(undefined),
    );
    spyOn(verificationApiSpy, "showUserVerification").and.returnValue(
      of(verificationResponse),
    );

    taggingCorrectionApiSpy.destroy.and.returnValue(of(undefined));
    taggingCorrectionApiSpy.create.and.returnValue(of(mockTaggings[0]));

    await detectChanges(spec);

    await requestPromises;

    await waitUntil(() => isGridLoaded());

    await detectChanges(spec);
  }

  beforeEach(async () => {
    // I explicitly set the viewport size so that the grid size is always
    // consistent no matter what size the karma browser window is
    viewport.set(viewports.extraLarge);

    // we import the web components using a dynamic import statement so that
    // the web components are loaded through the karma test server
    if (!customElements.get("oe-verification-grid")) {
      await import(nodeModule("@ecoacoustics/web-components/dist/components.js"));
    }

    mockUser = new User(generateUser());

    routeProject = new Project(generateProject());
    routeRegion = new Region(generateRegion({ projectId: routeProject.id }));
    routeSite = new Site(generateSite({ regionId: routeRegion.id }));
  });

  afterEach(() => {
    // modals can persist between tests, meaning that we might have multiple
    // modal windows open at the same time if we do not explicitly dismiss them
    // after each test
    modalsSpy?.dismissAll();
    viewport.reset();

    // Remove the local storage key that prevents the bootstrap modal from
    // opening to reduce side effects between tests.
    localStorage.removeItem("oe-auto-dismiss-bootstrap");

    spec?.fixture?.destroy();
  });

  const dialogShowButton = () =>
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
      "oe-verification-grid-tile",
    );

  const decisionComponents = () =>
    document.querySelectorAll<DecisionComponent>(
      "oe-verification, oe-classification, oe-tag-prompt, oe-skip",
    );

  const tagPromptComponent = () =>
    document.querySelector<TagPromptComponent>("oe-tag-prompt");

  const tagPromptTypeaheadComponent = () =>
    tagPromptComponent().shadowRoot.querySelector("oe-typeahead");

  const tagPromptTypeaheadItems = () =>
    tagPromptTypeaheadComponent().shadowRoot.querySelectorAll(
      ".typeahead-result-action",
    );

  const decisionButton = (index: number) =>
    decisionComponents()[index].shadowRoot.querySelector<HTMLButtonElement>(
      "[part='decision-button']",
    );

  function clickVerificationStatusFilter(value: VerificationStatusKey) {
    const target = document.querySelector(`[aria-valuetext="${value}"]`);
    spec.click(target);
  }

  function showParameters(): void {
    spec.click(dialogShowButton());
    tick(1_000);
    discardPeriodicTasks();
  }

  /**
   * Prevents the bootstrap modal from opening by setting a local storage key
   * to automatically dismiss the modal.
   */
  function setNoBootstrap(): void {
    localStorage.setItem("oe-auto-dismiss-bootstrap", "true");
  }

  function isGridLoaded() {
    return verificationGrid().loadState === "loaded";
  }

  async function clickDecisionButton(decision: DecisionOptions) {
    const decisions = [
      DecisionOptions.TRUE,
      DecisionOptions.FALSE,
      DecisionOptions.UNSURE,
      DecisionOptions.CORRECT_TAG,
      DecisionOptions.SKIP,
    ];

    const index = decisions.indexOf(decision);
    if (index < 0) {
      throw new Error("Could not find decision button");
    }

    const decisionButtonTarget = decisionButton(index);
    spec.click(decisionButtonTarget);

    await detectChanges(spec);
  }

  async function makeTagCorrectionDecision(
    decision: TagCorrectionDecision | DecisionOptions.SKIP,
  ) {
    if (decision === DecisionOptions.SKIP) {
      clickDecisionButton(DecisionOptions.SKIP);
      return;
    }

    await clickDecisionButton(DecisionOptions.CORRECT_TAG);

    // When the tag typeahead is initially opened, it will show a list of
    // results based on a query without any search text.
    // Because we mock the "filter" API request to return all tags, we can just
    // select the item from the initial list of results.
    clickButton(spec, tagPromptTypeaheadItems()[decision.item]);
  }

  /** Uses shift + click selection to select a range */
  async function makeSelection(start: number, end: number) {
    // Resize the viewport to make the grid tiles visible
    //! Smell: I should not have to resize the karma viewport
    viewport.set(viewports.large);
    await waitUntil(() => gridTiles().length > 0);
    const targetGridTiles = gridTiles();

    const startTile = targetGridTiles[start];
    const startTileClickTarget = startTile.shadowRoot.querySelector(
      "[part='tile-container']",
    );

    const endTile = targetGridTiles[end];
    const endTileClickTarget = endTile.shadowRoot.querySelector(
      "[part='tile-container']",
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
        new MouseEvent("pointerdown", { shiftKey: true }),
      );
    }

    await detectChanges(spec);
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

  describe("no initial search parameters", () => {
    beforeEach(async () => {
      await setup();
    });

    xit("should update the search parameters when filter conditions are added", async () => {
      const targetTag = defaultFakeTags[0];
      const tagText = targetTag.text;
      const expectedTagId = targetTag.id;

      await detectChanges(spec);

      fakeAsync(() => {
        showParameters();
        selectFromTypeahead(spec, tagsTypeahead(), tagText);
      })();

      spec.click(updateFiltersButton());

      expect(spec.component.searchParameters().tags).toContain(expectedTagId);
    });

    it("should show and hide the search parameters dialog correctly", fakeAsync(() => {
      expect(modalsSpy.open).not.toHaveBeenCalled();
      showParameters();
      expect(modalsSpy.open).toHaveBeenCalledTimes(1);
    }));

    it("should correctly update the selection parameter when filter conditions are added", async () => {
      await detectChanges(spec);
      fakeAsync(() => showParameters())();

      clickVerificationStatusFilter("any");

      spec.click(updateFiltersButton());

      expect(spec.component.searchParameters().verificationStatus).toEqual(
        "any",
      );
    });
  });

  describe("with initial search parameters", () => {
    let mockTagIds: number[];

    beforeEach(async () => {
      mockTagIds = modelData.ids();

      const testedQueryParameters: Params = {
        tags: mockTagIds.join(","),
        taskBehavior: "verify-and-correct-tag",
      };

      // we recreate the fixture with query parameters so that we can test
      // the component's behavior when query parameters are present
      // on load
      await setup(testedQueryParameters);
    });

    it("should create the correct search parameter model from query string parameters", () => {
      const realizedParameterModel = spec.component.searchParameters();

      expect(realizedParameterModel).toEqual(
        jasmine.objectContaining({
          tags: jasmine.arrayContaining(mockTagIds),
        }),
      );
    });

    describe("verification decisions", () => {
      const verificationTrueApiCall: VerificationServiceCall = {
        method: "createOrUpdate",
        args: [jasmine.objectContaining({ confirmed: "correct" })],
      };

      const verificationFalseApiCall: VerificationServiceCall = {
        method: "createOrUpdate",
        args: [jasmine.objectContaining({ confirmed: "incorrect" })],
      };

      const verificationUnsureApiCall: VerificationServiceCall = {
        method: "createOrUpdate",
        args: [jasmine.objectContaining({ confirmed: "unsure" })],
      };

      const verificationSkipApiCall: VerificationServiceCall = {
        method: "createOrUpdate",
        args: [jasmine.objectContaining({ confirmed: "skip" })],
      };

      const verificationDeleteApiCall: VerificationServiceCall = {
        method: "destroyUserVerification",
        args: [jasmine.anything()],
      };

      function runVerificationTest(test: VerificationTest): void {
        const testName =
          test.testName ?? `${test.initialDecision} -> ${test.newDecision}`;

        it(testName, async () => {
          if (test.initialDecision) {
            await makeSelection(0, 0);
            await clickDecisionButton(test.initialDecision);
          }

          const testedMethods: (keyof ShallowVerificationService)[] = [
            "create",
            "update",
            "createOrUpdate",
            "destroy",
            "filter",
            "list",
            "show",
          ];

          for (const method of testedMethods) {
            verificationApiSpy[method].calls.reset();
          }

          // We make the selection after resetting calls so that if there is a
          // bug where a decision is made on selection, this the test will fail.
          //
          // Additionally, because of auto-advancement, we need to click on the
          // target tile after the initial decision is made.
          // This is because the verification grid will automatically advance
          // to the next tile after the initial decision.
          await makeSelection(0, 0);

          if (test.newDecision) {
            await clickDecisionButton(test.newDecision);
          }

          for (const method of testedMethods) {
            if (method === test.expectedApiCall?.method) {
              expect(verificationApiSpy[method]).toHaveBeenCalledOnceWith(
                ...test.expectedApiCall.args,
              );
            } else {
              expect(verificationApiSpy[method]).not.toHaveBeenCalled();
            }
          }
        });
      }

      const decisionTests: VerificationTest[] = [
        {
          testName: "verify a tag as correct",
          initialDecision: null,
          newDecision: DecisionOptions.TRUE,
          expectedApiCall: verificationTrueApiCall,
        },
        {
          testName: "verify a tag as incorrect",
          initialDecision: null,
          newDecision: DecisionOptions.FALSE,
          expectedApiCall: verificationFalseApiCall,
        },
        {
          testName: "skip verifying a tag",
          initialDecision: null,
          newDecision: DecisionOptions.SKIP,
          expectedApiCall: verificationSkipApiCall,
        },
        {
          testName: "unsure about a tag",
          initialDecision: null,
          newDecision: DecisionOptions.UNSURE,
          expectedApiCall: verificationUnsureApiCall,
        },

        // Transitioning from an initial "false" decision
        {
          initialDecision: DecisionOptions.FALSE,
          newDecision: DecisionOptions.TRUE,
          expectedApiCall: verificationTrueApiCall,
        },
        {
          initialDecision: DecisionOptions.FALSE,
          newDecision: DecisionOptions.FALSE,

          // If the "false" decision button is clicked twice, we expect that the
          // decision is toggled and a DELETE api call is made.
          expectedApiCall: verificationDeleteApiCall,
        },
        {
          initialDecision: DecisionOptions.FALSE,
          newDecision: DecisionOptions.SKIP,
          expectedApiCall: null,
          // TODO: https://github.com/ecoacoustics/web-components/issues/487
          // expectedApiCall: verificationSkipApiCall,
        },
        {
          initialDecision: DecisionOptions.FALSE,
          newDecision: DecisionOptions.UNSURE,
          expectedApiCall: verificationUnsureApiCall,
        },

        // Transitioning from an initial "true" decision
        {
          initialDecision: DecisionOptions.TRUE,
          newDecision: DecisionOptions.TRUE,
          expectedApiCall: verificationDeleteApiCall,
        },
        {
          initialDecision: DecisionOptions.TRUE,
          newDecision: DecisionOptions.FALSE,
          expectedApiCall: verificationFalseApiCall,
        },
        {
          initialDecision: DecisionOptions.TRUE,
          newDecision: DecisionOptions.SKIP,
          expectedApiCall: null,
          // TODO: https://github.com/ecoacoustics/web-components/issues/487
          // expectedApiCall: verificationSkipApiCall,
        },
        {
          initialDecision: DecisionOptions.TRUE,
          newDecision: DecisionOptions.UNSURE,
          expectedApiCall: verificationUnsureApiCall,
        },

        // Transitioning from an initial "skip" decision
        {
          initialDecision: DecisionOptions.SKIP,
          newDecision: DecisionOptions.TRUE,
          expectedApiCall: verificationTrueApiCall,
        },
        {
          initialDecision: DecisionOptions.SKIP,
          newDecision: DecisionOptions.FALSE,
          expectedApiCall: verificationFalseApiCall,
        },
        {
          initialDecision: DecisionOptions.SKIP,
          newDecision: DecisionOptions.SKIP,
          expectedApiCall: verificationDeleteApiCall,
        },
        {
          initialDecision: DecisionOptions.SKIP,
          newDecision: DecisionOptions.UNSURE,
          expectedApiCall: verificationUnsureApiCall,
        },

        // Transitioning from an initial "unsure" decision
        {
          initialDecision: DecisionOptions.UNSURE,
          newDecision: DecisionOptions.TRUE,
          expectedApiCall: verificationTrueApiCall,
        },
        {
          initialDecision: DecisionOptions.UNSURE,
          newDecision: DecisionOptions.FALSE,
          expectedApiCall: verificationFalseApiCall,
        },
        {
          initialDecision: DecisionOptions.UNSURE,
          newDecision: DecisionOptions.SKIP,
          expectedApiCall: null,
          // TODO: https://github.com/ecoacoustics/web-components/issues/487
          // expectedApiCall: verificationSkipApiCall,
        },
        {
          initialDecision: DecisionOptions.UNSURE,
          newDecision: DecisionOptions.UNSURE,
          expectedApiCall: verificationDeleteApiCall,
        },
      ];

      for (const test of decisionTests) {
        runVerificationTest(test);
      }

      it("should make verification api calls about the entire page if nothing is selected", async () => {
        await clickDecisionButton(DecisionOptions.TRUE),

        expect(verificationApiSpy.createOrUpdate).toHaveBeenCalledTimes(
          gridSize(),
        );
      });
    });

    describe("new tag decisions", () => {
      const newTagCorrectionApiCall: TagCorrectionServiceCall = {
        method: "create",
        args: [jasmine.any(Annotation), jasmine.any(Number)],
      };

      const deleteTagCorrectionApiCall: TagCorrectionServiceCall = {
        method: "destroy",
        args: [jasmine.any(Annotation), jasmine.any(Number)],
      };

      async function runNewTagTest(test: NewTagTest): Promise<void> {
        const newDecisionName = typeof test.newDecision === "object"
          ? `${test.newDecision.decision}`
          : test.newDecision;
        const testName =
          test.testName ?? `${test.initialDecision} -> ${newDecisionName}`;

        it(testName, async () => {
          // We have to make an initial "false" verification decision so that
          // the tag correction option is enabled.
          await makeSelection(0, 0);
          await clickDecisionButton(DecisionOptions.FALSE);

          if (test.initialDecision) {
            await makeSelection(0, 0);
            await makeTagCorrectionDecision(test.initialDecision);
          }

          await makeSelection(0, 0);

          const testedMethods: (keyof TaggingCorrectionsService)[] = [
            "create",
            "destroy",
          ];

          for (const method of testedMethods) {
            taggingCorrectionApiSpy[method].calls.reset();
          }

          await makeTagCorrectionDecision(test.newDecision);

          for (const method of testedMethods) {
            const expectedApiCall = test.expectedApiCalls.find(
              (call) => call.method === method,
            );

            if (expectedApiCall) {
              expect(taggingCorrectionApiSpy[method]).toHaveBeenCalledOnceWith(
                ...expectedApiCall.args,
              );
            } else {
              expect(taggingCorrectionApiSpy[method]).not.toHaveBeenCalled();
            }
          }
        });
      }

      const decisionTests: NewTagTest[] = [
        {
          testName: "Apply a label",
          initialDecision: null,
          newDecision: { item: 1, decision: DecisionOptions.TRUE },
          expectedApiCalls: [newTagCorrectionApiCall],
        },
        // A "false" new-tag decision is currently not implemented
        // TODO: https://github.com/ecoacoustics/web-components/issues/489
        // {
        //   testName: "Apply a negative label for counter learning",
        //   initialDecision: null,
        //   newDecision: { item: 0, decision: DecisionOptions.FALSE },
        // },
        {
          testName: "Skip applying a new tag",
          initialDecision: null,
          newDecision: DecisionOptions.SKIP,

          // At the moment, we do not record that the user skipped tag
          // correction.
          // Therefore, if the user presses the "skip" button without a
          // decision, it has no effect.
          expectedApiCalls: [],
        },
        // TODO: https://github.com/ecoacoustics/web-components/issues/489
        // {
        //   testName: "Unsure about applying a new tag",
        //   initialDecision: null,
        //   newDecision: { item: 0, decision: DecisionOptions.UNSURE },
        // },

        // TODO: https://github.com/ecoacoustics/web-components/issues/489
        // {
        //   initialDecision: { item: 0, decision: DecisionOptions.FALSE },
        //   newDecision: { item: 0, decision: DecisionOptions.TRUE },
        // },
        // {
        //   initialDecision: { item: 0, decision: DecisionOptions.FALSE },
        //   newDecision: { item: 0, decision: DecisionOptions.FALSE },
        // },
        // {
        //   initialDecision: { item: 0, decision: DecisionOptions.FALSE },
        //   newDecision: { item: 0, decision: DecisionOptions.SKIP },
        // },
        // {
        //   initialDecision: { item: 0, decision: DecisionOptions.FALSE },
        //   newDecision: { item: 0, decision: DecisionOptions.UNSURE },
        // },
        // {
        //    initialDecision: { item: 0, decision: DecisionOptions.FALSE },
        //    newDecision: null,
        // },

        {
          testName: "Correct a label",
          initialDecision: { item: 1, decision: DecisionOptions.TRUE },
          newDecision: { item: 2, decision: DecisionOptions.TRUE },

          // Note that because this is done in two requests, it's currently
          // possible, to change a tag correction and have the DELETE request
          // succeed without the corresponding CREATE request succeeding,
          // leaving us in a state where no tag correction is applied.
          expectedApiCalls: [
            deleteTagCorrectionApiCall,
            newTagCorrectionApiCall,
          ],
        },
        {
          testName: "Correcting to the same label",
          initialDecision: { item: 1, decision: DecisionOptions.TRUE },
          newDecision: { item: 1, decision: DecisionOptions.TRUE },

          // Although the test opened the tag correction typeahead, and selected
          // a tag, we should see that no API calls are made because it selected
          // the same value that was already present.
          expectedApiCalls: [],
        },
        // TODO: https://github.com/ecoacoustics/web-components/issues/489
        // {
        //   initialDecision: { item: 0, decision: DecisionOptions.TRUE },
        //   newDecision: { item: 0, DecisionOptions.FALSE },
        // },
        // {
        //   initialDecision: { item: 0, decision: DecisionOptions.TRUE },
        //   newDecision: { item: 0, decision: DecisionOptions.SKIP },
        // },
        // {
        //   initialDecision: { item: 0, DecisionOptions.TRUE },
        //   newDecision: { item: 0, decision: DecisionOptions.UNSURE },
        // },
        // TODO: https://github.com/ecoacoustics/web-components/issues/491
        // {
        //   initialDecision: { item: 0, decision: DecisionOptions.TRUE },
        //   newDecision: null,
        //   expectedApiCalls: [deleteTagCorrectionApiCall],
        // },

        {
          initialDecision: DecisionOptions.SKIP,
          newDecision: { item: 1, decision: DecisionOptions.TRUE },
          expectedApiCalls: [newTagCorrectionApiCall],
        },
        // TODO: https://github.com/ecoacoustics/web-components/issues/487
        // {
        //   initialDecision: { item: 0, decision: DecisionOptions.SKIP },
        //   newDecision: { item: 0, decision: DecisionOptions.FALSE },
        // },
        // {
        //   initialDecision: { item: 0, decision: DecisionOptions.SKIP },
        //   newDecision: { item: 0, decision: DecisionOptions.SKIP },
        // },
        // {
        //   initialDecision: { item: 0, decision: DecisionOptions.SKIP },
        //   newDecision: { item: 0, decision: DecisionOptions.UNSURE },
        // },
        // TODO: https://github.com/ecoacoustics/web-components/issues/493
        // {
        //   initialDecision: DecisionOptions.SKIP,
        //   newDecision: DecisionOptions.SKIP,
        //   expectedApiCalls: [],
        // },

        // TODO: https://github.com/ecoacoustics/web-components/issues/487
        // {
        //   initialDecision: DecisionOptions.UNSURE,
        //   newDecision: DecisionOptions.TRUE,
        // },
        // {
        //   initialDecision: DecisionOptions.UNSURE,
        //   newDecision: DecisionOptions.FALSE,
        // },
        // {
        //   initialDecision: DecisionOptions.UNSURE,
        //   newDecision: DecisionOptions.SKIP,
        // },
        // {
        //   initialDecision: DecisionOptions.UNSURE,
        //   newDecision: DecisionOptions.UNSURE,
        // },
        // {
        //   initialDecision: DecisionOptions.UNSURE,
        //   newDecision: null,
        // },
      ];

      for (const test of decisionTests) {
        runNewTagTest(test);
      }
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
          showParameters();
          selectFromTypeahead(spec, tagsTypeahead(), tagText);
        })();

        spec.click(updateFiltersButton());
        await detectChanges(spec);

        // we use the "toBe" matcher so that we compare the "getPage" callback
        // by reference
        const newPagingCallback = verificationGrid().getPage;
        expect(newPagingCallback).not.toBe(initialPagingCallback);
      });

      it("should reset the verification grids getPage function when the selection criteria is changed", async () => {
        await detectChanges(spec);
        const initialPagingCallback = verificationGrid().getPage;

        fakeAsync(() => showParameters())();
        clickVerificationStatusFilter("any");

        spec.click(updateFiltersButton());
        await detectChanges(spec);

        const newPagingCallback = verificationGrid().getPage;
        expect(newPagingCallback).not.toBe(initialPagingCallback);
      });

      it("should populate the verification grid correctly for the first page", () => {
        const realizedTileCount = verificationGrid().pageSize;
        expect(realizedTileCount).toBeGreaterThan(0);
      });
    });
  });
});

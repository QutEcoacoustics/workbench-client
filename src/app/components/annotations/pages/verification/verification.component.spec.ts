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
import { MEDIA, PROJECT, SHALLOW_AUDIO_EVENT, SHALLOW_REGION, SHALLOW_SITE, TAG } from "@baw-api/ServiceTokens";
import { CUSTOM_ELEMENTS_SCHEMA, INJECTOR, Injector } from "@angular/core";
import { TagsService } from "@baw-api/tag/tags.service";
import { VerificationGridComponent } from "@ecoacoustics/web-components/@types/components/verification-grid/verification-grid";
import { VerificationComponent as DecisionButton } from "@ecoacoustics/web-components/@types/components/decision/verification/verification";
import { VerificationHelpDialogComponent } from "@ecoacoustics/web-components/@types/components/verification-grid/help-dialog";
import { modelData } from "@test/helpers/faker";
import { Tag } from "@models/Tag";
import { discardPeriodicTasks, fakeAsync, tick } from "@angular/core/testing";
import { defaultDebounceTime } from "src/app/app.helper";
import { generateTag } from "@test/fakes/Tag";
import { RouterTestingModule } from "@angular/router/testing";
import { selectFromTypeahead } from "@test/helpers/html";
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
import { AnnotationSearchParameters } from "../annotationSearchParameters";
import { VerificationComponent } from "./verification.component";

describe("VerificationComponent", () => {
  let spectator: SpectatorRouting<VerificationComponent>;
  let injector: SpyObject<Injector>;

  let mockAudioEventsApi: SpyObject<ShallowAudioEventsService>;
  let mediaServiceSpy: SpyObject<MediaService>;

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

  const createComponent = createRoutingFactory({
    component: VerificationComponent,
    imports: [MockBawApiModule, SharedModule, RouterTestingModule],
    declarations: [AnnotationSearchFormComponent, SearchFiltersModalComponent],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
  });

  function setup(queryParameters: Params = {}) {
    spectator = createComponent({
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

    injector = spectator.inject(INJECTOR);

    mediaServiceSpy = spectator.inject(MEDIA.token);
    mediaServiceSpy.createMediaUrl = jasmine.createSpy("createMediaUrl") as any;
    mediaServiceSpy.createMediaUrl.and.returnValue("/assets/test-assets/example.flac");

    mockSearchParameters = new AnnotationSearchParameters(
      generateAnnotationSearchUrlParameters(queryParameters),
      injector,
    );
    mockSearchParameters.routeSiteModel = routeSite;
    mockSearchParameters.routeSiteId = routeSite.id;

    mockSearchParameters.routeRegionModel = routeRegion;
    mockSearchParameters.routeRegionId = routeRegion.id;

    mockSearchParameters.routeProjectModel = routeProject;
    mockSearchParameters.routeProjectId = routeProject.id;

    defaultFakeTags = modelData.randomArray(
      3, 10, () => new Tag(generateTag(), injector),
    );

    mockAudioEventsResponse = modelData.randomArray(
      3, 3, () => new AudioEvent( generateAudioEvent(), injector),
    );

    mockAudioRecording = new AudioRecording(
      generateAudioRecording({ siteId: routeSite.id }),
      injector,
    );

    mockAnnotationResponse = new Annotation(
      generateAnnotation({ audioRecording: mockAudioRecording }),
      mediaServiceSpy,
    );

    spectator.component.searchParameters = mockSearchParameters;
    spectator.component.project = routeProject;
    spectator.component.region = routeRegion;
    spectator.component.site = routeSite;

    mockAudioEventsApi = spectator.inject(SHALLOW_AUDIO_EVENT.token);
    tagsApiSpy = spectator.inject(TAG.token);
    projectApiSpy = spectator.inject(PROJECT.token);
    regionApiSpy = spectator.inject(SHALLOW_REGION.token);
    sitesApiSpy = spectator.inject(SHALLOW_SITE.token);

    // inject the bootstrap modal config service so that we can disable animations
    // this is needed so that buttons can be clicked without waiting for the async animation
    modalsSpy = spectator.inject(NgbModal);
    modalConfigService = spectator.inject(NgbModalConfig);
    modalConfigService.animation = false;

    // TODO: this should probably be replaced with callThrough()
    modalsSpy.open = jasmine.createSpy("open").and.callFake(modalsSpy.open);

    // needed for AnnotationSearchParameters associated models
    mockAudioEventsApi.filter.and.callFake(() => of(mockAudioEventsResponse));
    tagsApiSpy.filter.and.callFake(() => of(defaultFakeTags));
    projectApiSpy.filter.and.callFake(() => of([routeProject]));
    regionApiSpy.filter.and.callFake(() => of([routeRegion]));
    sitesApiSpy.filter.and.callFake(() => of([routeSite]));

    spectator.detectChanges();
  }

  beforeEach(() => {
    // we import the web components using a dynamic import statement so that
    // the web components are loaded through the karma test server
    //
    // we have to import through the testing server so that when the spectrogram
    // components request their buffer-builder-processor and high-accuracy-time
    // workers, they get loaded through http and not the file protocol
    import("@ecoacoustics/web-components");

    routeProject = new Project(generateProject());
    routeRegion = new Region(
      generateRegion({ projectId: routeProject.id }),
    );
    routeSite = new Site(generateSite({ regionId: routeRegion.id }));
  });

  afterEach(() => {
    // modals can persist between tests, meaning that we might have multiple
    // modal windows open at the same time if we do not explicitly dismiss them
    // after each test
    // TODO: remove this condition
    if (modalsSpy) {
      modalsSpy.dismissAll();
    }
  });

  const dialogToggleButton = () =>
    spectator.query<HTMLButtonElement>(".filter-button");
  const tagsTypeahead = () =>
    document.querySelector<HTMLElement>("#tags-input");

  const verificationButtons = () =>
    spectator.queryAll<DecisionButton>("oe-verification");
  const verificationGrid = () =>
    spectator.query<VerificationGridComponent>("oe-verification-grid");
  const verificationGridRoot = (): ShadowRoot => verificationGrid().shadowRoot;
  const verificationGridTiles =() => verificationGridRoot().querySelectorAll("oe-verification-grid-tile");

  // a lot of the web components elements of interest are in the shadow DOM
  // therefore, we have to chain some query selectors to get to the elements
  const helpElement = (): VerificationHelpDialogComponent =>
    verificationGridRoot().querySelector("oe-verification-help-dialog");
  const helpCloseButton = (): HTMLButtonElement =>
    helpElement().shadowRoot.querySelector(".close-btn");

  function gridTileTag(index: number): string {
    const tileTarget = verificationGridTiles()[index];
    const tileShadowRoot = tileTarget.shadowRoot;
    const tagContainer = tileShadowRoot.querySelector(".tag-label");
    return tagContainer.textContent;
  }

  function toggleParameters(): void {
    spectator.click(dialogToggleButton());
    tick(defaultDebounceTime);
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

      it("should update the search parameters when filter conditions are added", fakeAsync(() => {
        const targetTag = defaultFakeTags[0];
        const tagText = targetTag.text;
        const expectedTagId = targetTag.id;

        toggleParameters();
        selectFromTypeahead(spectator, tagsTypeahead(), tagText);

        const realizedComponentParams = spectator.component.searchParameters;
        expect(realizedComponentParams.tags).toContain(expectedTagId);
        }),
      );

      it("should show and hide the search paramters dialog correctly", fakeAsync(() => {
        expect(modalsSpy.open).not.toHaveBeenCalled();
        toggleParameters();
        expect(modalsSpy.open).toHaveBeenCalledTimes(1);
        }),
      );
    });

    describe("with initial search parameters", () => {
      let mockTagIds: number[];

      beforeEach(() => {
        mockTagIds = modelData.ids();

        const testedQueryParameters: Params = {
          tags: mockTagIds.join(","),
        };

        // we recreate the fixture with query parameters so that we can test
        // the component's behavior when query parameters are present
        // on load
        setup(testedQueryParameters);
      });

      it("should create the correct search parameter model from query string parameters", () => {
        const realizedParameterModel = spectator.component.searchParameters;

        expect(realizedParameterModel).toEqual(
          jasmine.objectContaining({
            tags: jasmine.arrayContaining(mockTagIds),
          }),
        );
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

        xdescribe("after help-dialog dismissed", () => {
          beforeEach(() => {
            helpCloseButton().click();
            spectator.detectChanges();
          });

          // this functionality is handled by the verification grid component
          // however, we test it here to test the interaction between the
          // two components
          it("should reset the verification grids page to one if the search parameters change", fakeAsync(() => {
              const targetTag = defaultFakeTags[0];
              const tagText = targetTag.text;

              toggleParameters();
              selectFromTypeahead(spectator, tagsTypeahead(), tagText);

              const expectedPagedItems = 0;
              const realizedPagedItems = verificationGrid().pagedItems;
              expect(realizedPagedItems).toEqual(expectedPagedItems);
            }),
          );

          it("should reset the verification grids getPage function when the search parameters are changed", fakeAsync(() => {
              const initialPagingCallback = verificationGrid().getPage;

              toggleParameters();
              selectFromTypeahead(
                spectator,
                tagsTypeahead(),
                defaultFakeTags[0].text,
              );
              const newPagingCallback = verificationGrid().getPage;

              expect(newPagingCallback).not.toBe(initialPagingCallback);
            }),
          );

          it("should fetch the next page when a full page of results has a decision applied", () => {
            const gridSize = verificationGrid().populatedTileCount;
            verificationButtons()[0].click();
            expect(verificationGrid().subjectHistory).toHaveLength(gridSize);
          });

          it("should populate the verification grid correctly for the first page", () => {
            const realizedTileCount = verificationGrid().populatedTileCount;
            expect(realizedTileCount).toBeGreaterThan(0);
          });

          it("should have the correct tag name in the verification grid tiles", () => {
            const tileCount = verificationGrid().populatedTileCount;
            const targetTile = modelData.datatype.number({ min: 0, max: tileCount });

            const expectedTileText = mockAnnotationResponse.tags as any;
            const tileTags = gridTileTag(targetTile);

            expect(tileTags).toEqual(expectedTileText);
          });
        });
      });
    });
  });
});

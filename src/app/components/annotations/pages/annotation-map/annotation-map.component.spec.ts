import {
  createRoutingFactory,
  mockProvider,
  SpectatorRouting,
} from "@ngneat/spectator";
import { provideMockBawApi } from "@baw-api/provide-baw-ApiMock";
import { Params, Router } from "@angular/router";
import { Project } from "@models/Project";
import { AnnotationSearchParameters } from "@components/annotations/components/annotation-search-form/annotationSearchParameters";
import { Region } from "@models/Region";
import { Site } from "@models/Site";
import { generateProject } from "@test/fakes/Project";
import { generateRegion } from "@test/fakes/Region";
import { generateSite } from "@test/fakes/Site";
import { generateAnnotationSearchUrlParams } from "@test/fakes/data/AnnotationSearchParameters";
import { IconsModule } from "@shared/icons/icons.module";
import { assertPageInfo } from "@test/helpers/pageRoute";
import { GroupedAudioEventsService } from "@baw-api/grouped-audio-events/grouped-audio-events.service";
import { of } from "rxjs";
import { AudioEventGroup } from "@models/AudioEventGroup";
import { GoogleMapsModule, MapAdvancedMarker } from "@angular/google-maps";
import { MapComponent } from "@shared/map/map.component";
import { GoogleMapsState, MapsService } from "@services/maps/maps.service";
import { fakeAsync, flush } from "@angular/core/testing";
import { MockModule } from "ng-mocks";
import { AudioEvent } from "@models/AudioEvent";
import { generateAudioEvent } from "@test/fakes/AudioEvent";
import { ShallowAudioEventsService } from "@baw-api/audio-event/audio-events.service";
import { ASSOCIATION_INJECTOR } from "@services/association-injector/association-injector.tokens";
import { modelData } from "@test/helpers/faker";
import {
  clickButton,
  getElementByTextContent,
  selectFromTypeahead,
} from "@test/helpers/html";
import { annotationSearchRoute } from "@components/annotations/annotation.routes";
import { Filters } from "@baw-api/baw-api.service";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { AnnotationService } from "@services/models/annotations/annotation.service";
import { EventModalComponent } from "@shared/event-modal/event-modal.component";
import { Tag } from "@models/Tag";
import { generateTag } from "@test/fakes/Tag";
import { TagsService } from "@baw-api/tag/tags.service";
import { AnnotationMapParameters } from "./annotationMapParameters";
import { AnnotationMapPageComponent } from "./annotation-map.component";

describe("AnnotationMapPageComponent", () => {
  let spec: SpectatorRouting<AnnotationMapPageComponent>;

  let groupedEventsService: GroupedAudioEventsService;

  let project: Project;
  let region: Region;
  let site: Site;
  let audioEvents: AudioEvent[];
  let tags: Tag[];

  let eventMapSearchParameters: AnnotationMapParameters;
  let annotationSearchParameters: AnnotationSearchParameters;

  let routerSpy: Router;
  let modalSpy: NgbModal;

  const mockAudioEvents = [
    new AudioEventGroup({
      siteId: 3605,
      eventCount: 67,
      latitude: -27.4975,
      longitude: 153.0136,
    }),
    new AudioEventGroup({
      siteId: 3606,
      eventCount: 42,
      latitude: -27.4773,
      longitude: 153.0271,
    }),
    new AudioEventGroup({
      siteId: 3873,
      eventCount: 9,
      latitude: 4.522871,
      longitude: 6.118915,
    }),
  ];

  function mapMarkers() {
    return spec.queryAll(MapAdvancedMarker);
  }

  function audioEventRows() {
    return spec.queryAll(".audio-event-row");
  }

  function annotationSearchForm(): HTMLElement {
    // We use a document query instead of spec.query here because ng-bootstrap
    // modals are attached to the document body, not within the component's
    // template, meaning that ng-neat spectator queries cannot find them.
    return document.querySelector("baw-annotation-search-form");
  }

  function openSearchForm() {
    const toggleButton = getElementByTextContent(spec, "Edit Filters");
    clickButton(spec, toggleButton);
    flush();
  }

  function clickMarker(index: number) {
    const mapMarker = mapMarkers()[index];
    expect(mapMarker).toExist();

    mapMarker.advancedMarker.dispatchEvent(new Event("click"));
    spec.detectChanges();
  }

  const createComponent = createRoutingFactory({
    component: AnnotationMapPageComponent,
    imports: [IconsModule, MapComponent, MockModule(GoogleMapsModule)],
    providers: [provideMockBawApi(), mockProvider(AnnotationService)],
  });

  function setup(queryParams: Params = {}): void {
    project = new Project(generateProject());
    region = new Region(generateRegion());
    site = new Site(generateSite());

    eventMapSearchParameters = new AnnotationMapParameters(queryParams);
    annotationSearchParameters = new AnnotationSearchParameters(queryParams);

    // These would typically be set by the annotationSearchParameters resolver
    // but since we are mocking the resolver, we have to set them here.
    annotationSearchParameters.routeProjectId = project.id;

    spec = createComponent({
      detectChanges: false,
      data: {
        resolvers: {
          project: "resolver",
          region: "resolver",
          site: "resolver",
          eventMapSearchParameters: "resolver",
          annotationSearchParameters: "resolver",
        },
        project: { model: project },
        region: { model: region },
        site: { model: site },
        eventMapSearchParameters: { model: eventMapSearchParameters },
        annotationSearchParameters: { model: annotationSearchParameters },
      },
      queryParams,
    });

    routerSpy = spec.inject(Router);

    // inject the NgbModal service so that we can
    // dismiss all modals at the end of every test
    modalSpy = spec.inject(NgbModal);
    spyOn(modalSpy, "open").and.callThrough();

    groupedEventsService = spec.inject(GroupedAudioEventsService);
    groupedEventsService.filterGroupBy = jasmine
      .createSpy("filterGroupBy")
      .and.returnValue(of(mockAudioEvents));

    const injector = spec.inject(ASSOCIATION_INJECTOR);

    audioEvents = modelData.randomArray(
      1,
      25,
      () => new AudioEvent(generateAudioEvent(), injector),
    );

    tags = modelData.randomArray(1, 25, () => new Tag(generateTag(), injector));

    const audioEventSpy = spec.inject(ShallowAudioEventsService);
    audioEventSpy.filterBySite.and.returnValue(of(audioEvents));

    const tagSpy = spec.inject(TagsService);
    tagSpy.typeaheadCallback.andReturn(() => of(tags));

    // Because we don't actually load Google Maps in tests, we need to manually
    // trigger the "loaded" state so the map and markers render.
    const mapsServiceSpy = spec.inject(MapsService);
    mapsServiceSpy.mapsState = GoogleMapsState.Loaded;
    spec.detectChanges();

    // We have to flush the microtask queue so that the async pipe that awaits
    // the api response evaluates.
    flush();
    spec.detectChanges();

    // I set the load state to the service's state so that if the service
    // rejects the load state update (for some reason), the map component won't
    // incorrectly think that maps are loaded.
    const mapComponent = spec.query(MapComponent);
    mapComponent["mapsLoadState"].set(mapsServiceSpy.mapsState);
    spec.detectChanges();

    const markers = mapMarkers();
    for (const marker of markers) {
      marker.advancedMarker = new google.maps.marker.AdvancedMarkerElement();
      marker.markerInitialized.emit(marker.advancedMarker);
    }

    spec.detectChanges();
  }

  afterEach(() => {
    // dismiss all bootstrap modals, so if a test fails
    // it doesn't impact future tests by using a stale modal
    modalSpy?.dismissAll();
  });

  assertPageInfo(AnnotationMapPageComponent, "Annotation Map");

  it("should create", fakeAsync(() => {
    setup();
    expect(spec.component).toBeInstanceOf(AnnotationMapPageComponent);
  }));

  describe("api calls", () => {
    it("should make the correct api call with no query parameters", fakeAsync(() => {
      setup();

      // Notice that we still include the project filter because the event map
      // in these tests is always scoped within a project.
      //
      // I have to use a type cast here because our filter conditions do not
      // support model associations.
      // TODO: Remove this type cast once our filter typings support
      // associations.
      const expectedFilters = {
        filter: {
          "projects.id": { in: [project.id] },
        },
      } as Filters<AudioEvent>;

      expect(groupedEventsService.filterGroupBy).toHaveBeenCalledOnceWith(
        expectedFilters,
      );
    }));

    it("should make the correct api call with query parameters", fakeAsync(() => {
      setup(generateAnnotationSearchUrlParams());

      const expectedFilters = {
        filter: {
          and: [
            { "tags.id": { in: annotationSearchParameters.tags } },
            {
              "audioRecordings.id": {
                in: annotationSearchParameters.audioRecordings,
              },
            },
            {
              audioEventImportFileId: {
                in: annotationSearchParameters.importFiles,
              },
            },
            { "sites.id": { in: annotationSearchParameters.sites } },
            { score: { gteq: annotationSearchParameters.scoreLowerBound } },
            { score: { lteq: annotationSearchParameters.scoreUpperBound } },
          ],
        },
      };

      // Note that there are no "verification status" filter conditions because
      // the page component should set
      // annotationSearchParameters.includeVerificationParams to false.
      //
      // We should not be using the sorting conditions from the annotation
      // search
      expect(groupedEventsService.filterGroupBy).toHaveBeenCalledOnceWith(
        expectedFilters,
      );
    }));
  });

  describe("focusing sites", () => {
    it("should set the 'focused' url parameter when a site is clicked", fakeAsync(() => {
      setup();

      // I purposely click the second marker (1st index) to test that we are not
      // just focusing the first marker all the time.
      const testedGroup = 1;
      clickMarker(testedGroup);

      const expectedSiteId = mockAudioEvents[testedGroup].siteId;

      expect(routerSpy.createUrlTree).toHaveBeenCalledWith([], {
        queryParams: jasmine.objectContaining({
          focused: expectedSiteId,
        }),
      });
    }));

    it("should show audio events from the focused site in the overlay", fakeAsync(() => {
      setup();
      clickMarker(0);

      const eventRows = audioEventRows();
      expect(eventRows).toHaveLength(audioEvents.length);
    }));

    it("should have the correct 'show more' link in the overlay", fakeAsync(() => {
      setup();
      clickMarker(0);

      const showMoreLink = getElementByTextContent(
        spec,
        "Show More",
      ).querySelector("a");

      // We should not see the "focused" url parameter in the "show more" link
      // because it is not a valid url parameter for the annotation search page.
      expect(showMoreLink).toHaveStrongRoute(annotationSearchRoute.project, {
        queryParams: annotationSearchParameters.toQueryParams(),
        routeParams: {
          projectId: project.id,
          regionId: region.id,
          siteId: site.id,
        },
      });
    }));

    it("should have the correct action links", fakeAsync(() => {
      setup();
      clickMarker(0);

      // Because the query selector will find the first matching element, we
      // expect that the first "view event" link corresponds to the first audio
      // event in our mocked audio events.
      const viewEventLink = spec.query(".audio-event-row a.view-event");
      expect(viewEventLink).toHaveUrl(audioEvents[0].viewUrl);
    }));

    it("should correctly open the annotation preview modal", fakeAsync(() => {
      setup();
      clickMarker(0);

      const previewButton = spec.query(".preview-event");
      clickButton(spec, previewButton);

      expect(modalSpy.open).toHaveBeenCalledOnceWith(
        EventModalComponent,
        jasmine.any(Object),
      );
    }));
  });

  describe("filtering", () => {
    // This test asserts that the search parameters are correctly parsed and
    // transferred to the annotation search form, but does not assert that the
    // annotation search form inputs are correctly populated because that is
    // already tested within the annotation search form component tests.
    it("should automatically populate the annotation search form from the url parameters", fakeAsync(() => {
      setup(generateAnnotationSearchUrlParams());
      openSearchForm();

      const form = annotationSearchForm();

      // We can use Angular's global ng object to get the component instance
      // from the HTML element.
      // This is a bit of a hack, but I don't have the time to figure out a better
      // way right now.
      //
      // Additionally, I have contained the hack within this test so that if
      // Angular removes this global object in the future, it only breaks this
      // test.
      const componentInstance = (window as any).ng.getComponent(form);

      expect(componentInstance.searchParameters()).toEqual(
        annotationSearchParameters,
      );
    }));

    it("should retain the 'focused' parameter after updating the annotation search parameters", fakeAsync(() => {
      const testedMarker = 0;

      setup(generateAnnotationSearchUrlParams());
      clickMarker(testedMarker);
      openSearchForm();

      const focusedSiteId = mockAudioEvents[testedMarker].siteId;

      const form = annotationSearchForm();
      const tagsTypeahead = form.querySelector("#tags-input");

      selectFromTypeahead(spec, tagsTypeahead, tags[0].text);

      const updateButton = document.querySelector<HTMLButtonElement>(
        "#update-filters-btn",
      );

      clickButton(spec, updateButton);

      // We expect that the annotationSearchParameters now include the newly
      // selected tag.
      expect(spec.component["annotationSearchParameters"]().tags).toContain(
        tags[0].id,
      );

      const expectedQueryParams = generateAnnotationSearchUrlParams();
      expectedQueryParams.focused = mockAudioEvents[0].siteId;

      expect(routerSpy.createUrlTree).toHaveBeenCalledWith([], {
        queryParams: jasmine.objectContaining({
          focused: focusedSiteId,
        }),
      });
    }));
  });
});

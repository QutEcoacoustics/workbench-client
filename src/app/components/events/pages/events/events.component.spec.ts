import { createRoutingFactory, SpectatorRouting } from "@ngneat/spectator";
import { provideMockBawApi } from "@baw-api/provide-baw-ApiMock";
import { Params } from "@angular/router";
import { Project } from "@models/Project";
import { AnnotationSearchParameters } from "@components/annotations/components/annotation-search-form/annotationSearchParameters";
import { Region } from "@models/Region";
import { Site } from "@models/Site";
import { generateProject } from "@test/fakes/Project";
import { generateRegion } from "@test/fakes/Region";
import { generateSite } from "@test/fakes/Site";
import { generateAnnotationSearchUrlParameters } from "@test/fakes/data/AnnotationSearchParameters";
import { IconsModule } from "@shared/icons/icons.module";
import { assertPageInfo } from "@test/helpers/pageRoute";
import { GroupedAudioEventsService } from "@baw-api/grouped-audio-events/grouped-audio-events.service";
import { of } from "rxjs";
import { AudioEventGroup } from "@models/AudioEventGroup";
import { Location } from "@angular/common";
import { MapAdvancedMarker } from "@angular/google-maps";
import { MapComponent } from "@shared/map/map.component";
import { GoogleMapsState, MapsService } from "@services/maps/maps.service";
import { EventMapSearchParameters } from "./eventMapSearchParameters";
import { EventsPageComponent } from "./events.component";

describe("EventsPageComponent", () => {
  let spec: SpectatorRouting<EventsPageComponent>;

  let groupedEventsService: GroupedAudioEventsService;

  let project: Project;
  let region: Region;
  let site: Site;

  let eventMapSearchParameters: EventMapSearchParameters;
  let annotationSearchParameters: AnnotationSearchParameters;

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

  function clickMarker(index: number) {
    const mapMarker = mapMarkers()[index];
    expect(mapMarker).toExist();

    mapMarker.advancedMarker.dispatchEvent(new Event("click"));
    spec.detectChanges();
  }

  const createComponent = createRoutingFactory({
    component: EventsPageComponent,
    providers: [provideMockBawApi()],
    imports: [IconsModule],
  });

  function setup(queryParams: Params = {}): void {
    project = new Project(generateProject());
    region = new Region(generateRegion());
    site = new Site(generateSite());

    eventMapSearchParameters = new EventMapSearchParameters(queryParams);
    annotationSearchParameters = new AnnotationSearchParameters(queryParams);

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

    groupedEventsService = spec.inject(GroupedAudioEventsService);
    groupedEventsService.filterGroupBy = jasmine
      .createSpy("filterGroupBy")
      .and.returnValue(of(mockAudioEvents));

    const mapsServiceSpy = spec.inject(MapsService);

    // Because we don't actually load Google Maps in tests, we need to manually
    // trigger the "loaded" state so the map and markers render.
    mapsServiceSpy.mapsState = GoogleMapsState.Loaded;

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

  assertPageInfo(EventsPageComponent, "Annotation Map");

  it("should create", () => {
    setup();
    expect(spec.component).toBeInstanceOf(EventsPageComponent);
  });

  describe("api calls", () => {
    it("should make the correct api call with no query parameters", () => {
      setup();

      const expectedFilters = { filter: {} };

      expect(groupedEventsService.filterGroupBy).toHaveBeenCalledOnceWith(
        expectedFilters,
      );
    });

    it("should make the correct api call with query parameters", () => {
      setup(generateAnnotationSearchUrlParameters());

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
    });
  });

  describe("focusing sites", () => {
    fit("should set the 'focused' url parameter when a site is clicked", () => {
      setup();

      // I purposely click the second marker (1st index) to test that we are not
      // just focusing the first marker all the time.
      clickMarker(1);

      const location = spec.inject(Location).path();
      const expectedLocation = `?focused=${site.id}`;

      expect(location).toEqual(expectedLocation);
    });

    it("should show audio events from the focused site in the overlay", () => {});

    it("should have the correct 'show more' link in the overlay", () => {});

    it("should have the correct action links", () => {});

    it("should correctly open the annotation preview modal", () => {});
  });

  describe("filtering", () => {
    // This test asserts that the search parameters are correctly parsed and
    // transferred to the annotation search form, but does not assert that the
    // annotation search form inputs are correctly populated because that is
    // already tested within the annotation search form component tests.
    it("should automatically populate the annotation search form from the url parameters", () => {});

    it("should make an api call with the correct parameters when filters are applied", () => {});

    it("should retain the 'focused' parameter after annotation search parameters", () => {});
  });
});

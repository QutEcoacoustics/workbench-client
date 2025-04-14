import { createRoutingFactory, Spectator, SpyObject } from "@ngneat/spectator";
import { Params } from "@angular/router";
import { of } from "rxjs";
import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { modelData } from "@test/helpers/faker";
import {
  MEDIA,
  SHALLOW_AUDIO_EVENT,
  SHALLOW_SITE,
} from "@baw-api/ServiceTokens";
import { MockBawApiModule } from "@baw-api/baw-apiMock.module";
import { RouterTestingModule } from "@angular/router/testing";
import { Project } from "@models/Project";
import { Region } from "@models/Region";
import { Site } from "@models/Site";
import { generateProject } from "@test/fakes/Project";
import { generateRegion } from "@test/fakes/Region";
import { generateSite } from "@test/fakes/Site";
import { fakeAsync } from "@angular/core/testing";
import { SpectrogramComponent } from "@ecoacoustics/web-components/@types/components/spectrogram/spectrogram";
import { getElementByInnerText } from "@test/helpers/html";
import { Filters, Meta } from "@baw-api/baw-api.service";
import { ShallowAudioEventsService } from "@baw-api/audio-event/audio-events.service";
import { AudioEvent } from "@models/AudioEvent";
import { generateAudioEvent } from "@test/fakes/AudioEvent";
import { generateAnnotationSearchUrlParameters } from "@test/fakes/data/AnnotationSearchParameters";
import { AnnotationService } from "@services/models/annotation.service";
import { Annotation } from "@models/data/Annotation";
import { generateAnnotation } from "@test/fakes/data/Annotation";
import { MediaService } from "@services/media/media.service";
import { AudioRecording } from "@models/AudioRecording";
import { generateAudioRecording } from "@test/fakes/AudioRecording";
import { ShallowSitesService } from "@baw-api/site/sites.service";
import { patchSharedArrayBuffer } from "src/patches/tests/testPatches";
import { testAsset } from "@test/helpers/karma";
import { assertPageInfo } from "@test/helpers/pageRoute";
import { AssociationInjector } from "@models/ImplementsInjector";
import { ASSOCIATION_INJECTOR } from "@services/association-injector/association-injector.tokens";
import { AnnotationSearchParameters } from "../annotationSearchParameters";
import { AnnotationSearchComponent } from "./search.component";

describe("AnnotationSearchComponent", () => {
  const responsePageSize = 24;

  let spectator: Spectator<AnnotationSearchComponent>;
  let injector: AssociationInjector;

  let audioEventsApiSpy: SpyObject<ShallowAudioEventsService>;
  let mediaServiceSpy: SpyObject<MediaService>;
  let shallowSiteSpy: SpyObject<ShallowSitesService>;

  let mockAudioEventsResponse: AudioEvent[] = [];
  let mockAnnotationResponse: Annotation;
  let mockSearchParameters: AnnotationSearchParameters;
  let mockAudioRecording: AudioRecording;

  let routeProject: Project;
  let routeRegion: Region;
  let routeSite: Site;

  const createComponent = createRoutingFactory({
    component: AnnotationSearchComponent,
    imports: [MockBawApiModule, RouterTestingModule],
    providers: [
      {
        provide: AnnotationService,
        useValue: { show: () => mockAnnotationResponse },
      },
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
  });

  function setup(queryParameters: Params = {}): void {
    spectator = createComponent({
      detectChanges: false,
      params: {
        projectId: routeProject.id,
        regionId: routeRegion.id,
        siteId: routeSite.id,
      },
      queryParams: queryParameters,
    });

    injector = spectator.inject(ASSOCIATION_INJECTOR);
    mediaServiceSpy = spectator.inject(MEDIA.token);
    spyOn(mediaServiceSpy, "createMediaUrl").and.returnValue(testAsset("example.flac"));

    spectator.component.searchParameters = mockSearchParameters;

    mockAudioEventsResponse = modelData.randomArray(
      responsePageSize,
      responsePageSize,
      () => {
        const model = new AudioEvent(generateAudioEvent(), injector);
        const metadata: Meta = {
          paging: {
            items: responsePageSize,
            page: 1,
            total: responsePageSize,
            maxPage: modelData.datatype.number({ min: 1, max: 5 }),
          },
        };

        model.addMetadata(metadata);

        return model;
      }
    );

    mockAudioRecording = new AudioRecording(
      generateAudioRecording({
        siteId: routeSite.id,
      }),
      injector
    );

    mockAnnotationResponse = new Annotation(
      generateAnnotation({
        audioRecording: mockAudioRecording,
      }),
      injector
    );

    audioEventsApiSpy = spectator.inject(SHALLOW_AUDIO_EVENT.token);
    audioEventsApiSpy.filter.andCallFake(() => of(mockAudioEventsResponse));

    shallowSiteSpy = spectator.inject(SHALLOW_SITE.token);
    shallowSiteSpy.show.andCallFake(() => of(routeSite));

    spectator.detectChanges();
  }

  const spectrogramElements = () =>
    spectator.queryAll<SpectrogramComponent>("oe-spectrogram");

  beforeEach(fakeAsync(() => {
    patchSharedArrayBuffer();

    routeProject = new Project(generateProject());
    routeRegion = new Region(generateRegion());
    routeSite = new Site(generateSite());

    mockSearchParameters = new AnnotationSearchParameters(
      generateAnnotationSearchUrlParameters()
    );
    mockSearchParameters.routeProjectModel = routeProject;
    mockSearchParameters.routeRegionModel = routeRegion;
    mockSearchParameters.routeSiteModel = routeSite;

    setup();
  }));

  assertPageInfo(AnnotationSearchComponent, "Search Annotations");

  it("should create", () => {
    expect(spectator.component).toBeInstanceOf(AnnotationSearchComponent);
  });

  it("should make the correct api call", () => {
    const expectedBody: Filters<AudioEvent> = {
      paging: {
        page: 1,
        items: responsePageSize,
      },
      filter: {
        and: [
          {
            "tags.id": {
              in: Array.from(mockSearchParameters.tags),
            },
          },
          {
            "audioRecordings.siteId": {
              in: Array.from(routeProject.siteIds),
            },
          },
        ],
      },
    };

    expect(audioEventsApiSpy.filter).toHaveBeenCalledWith(expectedBody);
  });

  it("should display an error if there are no search results", () => {
    const expectedText = "No annotations found";

    spectator.component.searchResults = [];
    spectator.component.loading = false;
    spectator.detectChanges();

    const element = getElementByInnerText(spectator, expectedText);
    expect(element).toExist();
  });

  it("should not display an error if the search results are still loading", () => {
    const expectedText = "No annotations found";

    spectator.component.searchResults = [];
    spectator.component.loading = true;
    spectator.detectChanges();

    const element = getElementByInnerText(spectator, expectedText);
    expect(element).not.toExist();
  });

  it("should display a page of search results", () => {
    spectator.detectChanges();

    const expectedResults = mockAudioEventsResponse.length;
    const realizedResults = spectrogramElements().length;
    expect(realizedResults).toEqual(expectedResults);
  });

  it("should add a query string parameters when a filter condition is added", () => {});

  it("should remove a query string parameter when a filter condition is removed", () => {});
});

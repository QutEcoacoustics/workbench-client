import {
  createRoutingFactory,
  mockProvider,
  Spectator,
  SpyObject,
} from "@ngneat/spectator";
import { Params, Router } from "@angular/router";
import { of } from "rxjs";
import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { modelData } from "@test/helpers/faker";
import { SHALLOW_AUDIO_EVENT, SHALLOW_SITE } from "@baw-api/ServiceTokens";
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
import { IconsModule } from "@shared/icons/icons.module";
import { provideMockBawApi } from "@baw-api/provide-baw-ApiMock";
import { User } from "@models/User";
import { generateUser } from "@test/fakes/User";
import { AnnotationSearchFormComponent } from "@components/annotations/components/annotation-search-form/annotation-search-form.component";
import { TagsService } from "@baw-api/tag/tags.service";
import { AnnotationSearchParameters } from "../annotationSearchParameters";
import { AnnotationSearchComponent } from "./search.component";

describe("AnnotationSearchComponent", () => {
  const responsePageSize = 24;

  let spec: Spectator<AnnotationSearchComponent>;
  let injector: AssociationInjector;

  let audioEventsSpy: SpyObject<ShallowAudioEventsService>;
  let shallowSiteSpy: SpyObject<ShallowSitesService>;

  let mockAudioEventsResponse: AudioEvent[] = [];
  let mockAnnotationResponse: Annotation;
  let mockSearchParameters: AnnotationSearchParameters;
  let mockAudioRecording: AudioRecording;
  let mockUser: User;

  let routeProject: Project;
  let routeRegion: Region;
  let routeSite: Site;

  const verifyButton = () => spec.query<HTMLButtonElement>(".verify-button");

  const createComponent = createRoutingFactory({
    component: AnnotationSearchComponent,
    imports: [IconsModule, AnnotationSearchFormComponent],
    providers: [
      provideMockBawApi(),
      mockProvider(Router),
      mockProvider(AnnotationService, {
        show: () => mockAnnotationResponse,
      }),
      mockProvider(TagsService, {
        show: () => of(),
        filter: () => of(),
      }),
      mockProvider(MediaService, {
        createMediaUrl: () => testAsset("example.flac"),
      }),
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
  });

  function setup(queryParameters: Params = {}): void {
    spec = createComponent({
      detectChanges: false,
      params: {
        projectId: routeProject.id,
        regionId: routeRegion.id,
        siteId: routeSite.id,
      },
      queryParams: queryParameters,
    });

    injector = spec.inject(ASSOCIATION_INJECTOR);
    spec.component.searchParameters = mockSearchParameters;

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
      },
    );

    mockAudioRecording = new AudioRecording(
      generateAudioRecording({
        siteId: routeSite.id,
      }),
      injector,
    );

    mockAnnotationResponse = new Annotation(
      generateAnnotation({
        audioRecording: mockAudioRecording,
      }),
      injector,
    );

    audioEventsSpy = spec.inject(SHALLOW_AUDIO_EVENT.token);
    audioEventsSpy.filter.andCallFake(() => of(mockAudioEventsResponse));

    shallowSiteSpy = spec.inject(SHALLOW_SITE.token);
    shallowSiteSpy.show.andCallFake(() => of(routeSite));

    spec.detectChanges();
  }

  const spectrogramElements = () =>
    spec.queryAll<SpectrogramComponent>("oe-spectrogram");

  beforeEach(fakeAsync(() => {
    patchSharedArrayBuffer();

    routeProject = new Project(generateProject());
    routeRegion = new Region(generateRegion());
    routeSite = new Site(generateSite());

    mockUser = new User(generateUser());

    mockSearchParameters = new AnnotationSearchParameters(
      generateAnnotationSearchUrlParameters(),
      mockUser,
    );
    mockSearchParameters.routeProjectModel = routeProject;
    mockSearchParameters.routeRegionModel = routeRegion;
    mockSearchParameters.routeSiteModel = routeSite;

    setup();
  }));

  assertPageInfo(AnnotationSearchComponent, "Search Annotations");

  it("should create", () => {
    expect(spec.component).toBeInstanceOf(AnnotationSearchComponent);
  });

  describe("api calls", () => {
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
                in: Array.from(mockSearchParameters.sites),
              },
            },
            {
              or: [
                { "verifications.creatorId": { notEq: mockUser.id} },
                { "verifications.id": { eq: null } },
                {
                  and: [
                    { "verifications.creatorId": { eq: mockUser.id} },
                    { "verifications.confirmed": { eq: "skip" } },
                  ],
                },
              ],
            }
          ],
        },
        sorting: {
          orderBy: "createdAt",
          direction: "asc",
        },
      };

      expect(audioEventsSpy.filter).toHaveBeenCalledWith(expectedBody);
    });
  });

  describe("search results", () => {
    it("should display the correct error message if there are no search results", () => {
      const expectedText = "No annotations found";

      spec.component.searchParameters.verificationStatus = "any";

      spec.component.searchResults = [];
      spec.component.loading = false;
      spec.detectChanges();

      const element = getElementByInnerText(spec, expectedText);
      expect(element).toExist();
    });

    it("should not display an error if the search results are still loading", () => {
      const expectedText = "No annotations found";

      spec.component.searchResults = [];
      spec.component.loading = true;
      spec.detectChanges();

      const element = getElementByInnerText(spec, expectedText);
      expect(element).not.toExist();
    });

    xit("should display a page of search results", () => {
      spec.detectChanges();

      const expectedResults = mockAudioEventsResponse.length;
      const realizedResults = spectrogramElements().length;
      expect(realizedResults).toEqual(expectedResults);
    });

    xit("should have a disabled 'verify' button if there are no search results", () => {
      spec.component.searchResults = [];
      spec.detectChanges();

      expect(verifyButton()).toBeDisabled();
    });

    xit("should have an enabled 'verify' button if there are search results", () => {
      spec.component.searchResults = [
        new Annotation(generateAnnotation(), injector),
        new Annotation(generateAnnotation(), injector),
        new Annotation(generateAnnotation(), injector),
      ];
      spec.detectChanges();

      expect(verifyButton()).not.toBeDisabled();
    });

    xit("should have a disable 'verify' button if the search results are loading", () => {
      // Because we did not reset the search results to an empty array, the
      // search results will still be populated in this test.
      spec.component.loading = true;
      spec.detectChanges();

      expect(verifyButton()).toBeDisabled();
    });
  });
});

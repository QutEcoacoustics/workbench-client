import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { fakeAsync } from "@angular/core/testing";
import { Params } from "@angular/router";
import { ShallowAudioEventImportFileService } from "@baw-api/audio-event-import-file/audio-event-import-file.service";
import { ShallowAudioEventsService } from "@baw-api/audio-event/audio-events.service";
import { Filters, Meta } from "@baw-api/baw-api.service";
import { BawSessionService } from "@baw-api/baw-session.service";
import { provideMockBawApi } from "@baw-api/provide-baw-ApiMock";
import { ShallowSitesService } from "@baw-api/site/sites.service";
import { TagsService } from "@baw-api/tag/tags.service";
import { AnnotationSearchFormComponent } from "@components/annotations/components/annotation-search-form/annotation-search-form.component";
import { AnnotationSearchParameters } from "@components/annotations/components/annotation-search-form/annotationSearchParameters";
import {
  VerificationParameters,
  VerificationStatusKey,
} from "@components/annotations/components/verification-form/verificationParameters";
import { AudioEvent } from "@models/AudioEvent";
import { AudioRecording } from "@models/AudioRecording";
import { Annotation } from "@models/data/Annotation";
import { AssociationInjector } from "@models/ImplementsInjector";
import { Project } from "@models/Project";
import { Region } from "@models/Region";
import { Site } from "@models/Site";
import { User } from "@models/User";
import {
  createRoutingFactory,
  mockProvider,
  Spectator,
  SpyObject,
} from "@ngneat/spectator";
import { ASSOCIATION_INJECTOR } from "@services/association-injector/association-injector.tokens";
import { MediaService } from "@services/media/media.service";
import { AnnotationService } from "@services/models/annotations/annotation.service";
import { AnnotationEventCardComponent } from "@shared/audio-event-card/annotation-event-card.component";
import { IconsModule } from "@shared/icons/icons.module";
import { generateAudioEvent } from "@test/fakes/AudioEvent";
import { generateAudioRecording } from "@test/fakes/AudioRecording";
import { generateAnnotation } from "@test/fakes/data/Annotation";
import { generateAnnotationSearchUrlParams } from "@test/fakes/data/AnnotationSearchParameters";
import { generateMeta } from "@test/fakes/Meta";
import { generateProject } from "@test/fakes/Project";
import { generateRegion } from "@test/fakes/Region";
import { generateSite } from "@test/fakes/Site";
import { generateUser } from "@test/fakes/User";
import { modelData } from "@test/helpers/faker";
import { clickButton, getElementByTextContent } from "@test/helpers/html";
import { assertPageInfo } from "@test/helpers/pageRoute";
import { of } from "rxjs";
import { exampleBase64 } from "src/test-assets/example-0.5s.base64";
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

  const createComponent = createRoutingFactory({
    component: AnnotationSearchComponent,
    imports: [
      IconsModule,
      AnnotationSearchFormComponent,
      AnnotationEventCardComponent,
    ],
    providers: [
      provideMockBawApi(),
      mockProvider(AnnotationService, {
        show: () => mockAnnotationResponse,
      }),
      mockProvider(TagsService, {
        show: () => of(),
        filter: () => of(),
      }),
      mockProvider(ShallowAudioEventImportFileService, {
        filter: () => of([]),
      }),
      mockProvider(MediaService, {
        // createMediaUrl: () => testAsset("example.flac"),
        createMediaUrl: () => `data:[audio/flac];base64,${exampleBase64}`,
      }),
      mockProvider(BawSessionService, {
        get isLoggedIn() {
          return true;
        },
        authTrigger: of({ user: mockUser }),
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
      data: {
        resolvers: {
          project: "resolver",
          region: "resolver",
          site: "resolver",
          searchParameters: "resolver",
          verificationParameters: "resolver",
        },
        project: { model: routeProject },
        region: { model: routeRegion },
        site: { model: routeSite },
        searchParameters: { model: mockSearchParameters },
        verificationParameters: { model: new VerificationParameters() },
      },
    });

    injector = spec.inject(ASSOCIATION_INJECTOR);

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
        tags: [],
        verificationSummary: [],
      }),
      injector,
    );

    audioEventsSpy = spec.inject(ShallowAudioEventsService);
    audioEventsSpy.filter.andCallFake(() => of(mockAudioEventsResponse));

    shallowSiteSpy = spec.inject(ShallowSitesService);
    shallowSiteSpy.show.andCallFake(() => of(routeSite));

    spec.detectChanges();
  }

  const verifyButton = () => spec.query<HTMLButtonElement>(".verify-button");
  const eventCards = () => spec.queryAll(AnnotationEventCardComponent);

  function clickVerificationStatusFilter(value: VerificationStatusKey) {
    const target = spec.query(`[aria-valuetext="${value}"]`);
    clickButton(spec, target);
  }

  beforeEach(fakeAsync(() => {
    routeProject = new Project(generateProject());
    routeRegion = new Region(generateRegion());
    routeSite = new Site(generateSite());

    mockUser = new User(generateUser());

    mockSearchParameters = new AnnotationSearchParameters(
      generateAnnotationSearchUrlParams(),
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
              "audioRecordings.id": {
                in: Array.from(mockSearchParameters.audioRecordings),
              },
            },
            {
              or: Array.from(mockSearchParameters.eventImportFiles).map((id) => ({
                audioEventImportFileId: { eq: id },
              })),
            },
            {
              "sites.id": {
                in: Array.from(mockSearchParameters.sites),
              },
            },
            {
              score: {
                gteq: mockSearchParameters.scoreLowerBound,
              },
            },
            {
              score: {
                lteq: mockSearchParameters.scoreUpperBound,
              },
            },
          ],
        },
        sorting: {
          orderBy: "createdAt",
          direction: "asc",
        },
        projection: {
          add: ["verificationSummary"],
        },
      };

      expect(audioEventsSpy.filter).toHaveBeenCalledWith(expectedBody);
    });

    it("should make the correct api calls when 'verification status' is changed", () => {
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
              "audioRecordings.id": {
                in: Array.from(mockSearchParameters.audioRecordings),
              },
            },
            {
              or: Array.from(mockSearchParameters.eventImportFiles).map((id) => ({
                audioEventImportFileId: { eq: id },
              })),
            },
            {
              "sites.id": {
                in: Array.from(mockSearchParameters.sites),
              },
            },
            {
              score: {
                gteq: mockSearchParameters.scoreLowerBound,
              },
            },
            {
              score: {
                lteq: mockSearchParameters.scoreUpperBound,
              },
            },
            {
              or: [
                { "verifications.creatorId": { notEq: mockUser.id } },
                { "verifications.id": { eq: null } },
                {
                  and: [
                    { "verifications.creatorId": { eq: mockUser.id } },
                    { "verifications.confirmed": { eq: "skip" } },
                  ],
                },
              ],
            },
          ],
        },
        sorting: {
          orderBy: "createdAt",
          direction: "asc",
        },
        projection: {
          add: ["verificationSummary"],
        },
      };

      audioEventsSpy.filter.calls.reset();
      clickVerificationStatusFilter("unverified-for-me");

      expect(audioEventsSpy.filter).toHaveBeenCalledWith(expectedBody);
    });
  });

  describe("search results", () => {
    it("should display the correct error message if there are no search results", () => {
      const expectedText = "No annotations found";

      spec.component.searchParameters().verificationStatus = "any";

      spec.component.searchResults.set([]);
      spec.component.loading = false;
      spec.detectChanges();

      const element = getElementByTextContent(spec, expectedText);
      expect(element).toBeVisible();
    });

    it("should not display an error if the search results are still loading", () => {
      const expectedText = "No annotations found";

      spec.component.searchResults.set([]);
      spec.component.loading = true;
      spec.detectChanges();

      const element = getElementByTextContent(spec, expectedText);
      expect(element).toBeHidden();
    });

    it("should display a page of search results", () => {
      spec.detectChanges();

      const expectedCount = mockAudioEventsResponse.length;
      expect(eventCards()).toHaveLength(expectedCount);
    });

    it("should re-use the event cards when search results are updated", () => {
      spec.detectChanges();

      const initialCard = eventCards()[0];

      // We override the returned audio events to make this test harder to pass
      // because we can't track by anything on the audio event since it would
      // have changed.
      mockAudioEventsResponse = modelData.randomArray(
        responsePageSize,
        responsePageSize,
        () => {
          // generateAudioEvent() uses our modelData.id iterator which ensures
          // that each generated audio event has a unique ID.
          // Therefore, there is no risk of this being a flaky test because each
          // id will always be unique.
          const model = new AudioEvent(generateAudioEvent(), injector);
          model.addMetadata(generateMeta());

          return model;
        },
      );

      // By changing the "verification status" filter, we should re-enter a
      // loading state, but should not have destroyed the spectrograms elements.
      clickVerificationStatusFilter("unverified-for-me");
      spec.detectChanges();

      const updatedCard = eventCards()[0];

      // We use a toBe comparison here so that we compare the spectrogram
      // elements by reference instead of by value.
      // If the reference is the same, then we know the elements were reused.
      expect(updatedCard).toBe(initialCard);
    });

    xit("should have a disabled 'verify' button if there are no search results", () => {
      spec.component.searchResults.set([]);
      spec.detectChanges();

      expect(verifyButton()).toBeDisabled();
    });

    xit("should have an enabled 'verify' button if there are search results", () => {
      spec.component.searchResults.set([
        new Annotation(generateAnnotation(), injector),
        new Annotation(generateAnnotation(), injector),
        new Annotation(generateAnnotation(), injector),
      ]);
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

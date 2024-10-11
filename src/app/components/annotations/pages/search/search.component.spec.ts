import { createRoutingFactory, Spectator, SpyObject } from "@ngneat/spectator";
import { Params } from "@angular/router";
import { of } from "rxjs";
import { CUSTOM_ELEMENTS_SCHEMA, INJECTOR, Injector } from "@angular/core";
import { modelData } from "@test/helpers/faker";
import { SHALLOW_AUDIO_EVENT, TAG } from "@baw-api/ServiceTokens";
import { Tag } from "@models/Tag";
import { TagsService } from "@baw-api/tag/tags.service";
import { generateTag } from "@test/fakes/Tag";
import { MockBawApiModule } from "@baw-api/baw-apiMock.module";
import { SharedModule } from "@shared/shared.module";
import { RouterTestingModule } from "@angular/router/testing";
import { Project } from "@models/Project";
import { Region } from "@models/Region";
import { Site } from "@models/Site";
import { generateProject } from "@test/fakes/Project";
import { generateRegion } from "@test/fakes/Region";
import { generateSite } from "@test/fakes/Site";
import { fakeAsync } from "@angular/core/testing";
import type { SpectrogramComponent } from "@ecoacoustics/web-components/@types/components/spectrogram/spectrogram";
import { getElementByInnerText, selectFromTypeahead } from "@test/helpers/html";
import { defaultApiPageSize, Filters } from "@baw-api/baw-api.service";
import { ShallowAudioEventsService } from "@baw-api/audio-event/audio-events.service";
import { AudioEvent } from "@models/AudioEvent";
import { generateAudioEvent } from "@test/fakes/AudioEvent";
import { AnnotationSearchComponent } from "./search.component";

describe("AnnotationSearchComponent", () => {
  let spectator: Spectator<AnnotationSearchComponent>;
  let injector: Injector;

  let mockAudioEventsApi: SpyObject<ShallowAudioEventsService>;
  let mockTagsApi: SpyObject<TagsService>;

  let routeProject: Project;
  let routeRegion: Region;
  let routeSite: Site;

  let mockAudioEventsResponse: AudioEvent[] = [];
  let mockTagsResponse: Tag[] = [];

  const createComponent = createRoutingFactory({
    component: AnnotationSearchComponent,
    imports: [MockBawApiModule, SharedModule, RouterTestingModule],
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

    injector = spectator.inject(INJECTOR);

    mockTagsResponse = modelData.randomArray(
      3,
      10,
      () => new Tag(generateTag(), injector)
    );

    mockAudioEventsResponse = modelData.randomArray(
      defaultApiPageSize,
      defaultApiPageSize,
      () =>
        new AudioEvent(
          generateAudioEvent(),
          injector
        )
    );

    mockTagsApi = spectator.inject(TAG.token);
    mockTagsApi.filter.and.callFake(() => of(mockTagsResponse));

    mockAudioEventsApi = spectator.inject(SHALLOW_AUDIO_EVENT.token);
    mockAudioEventsApi.filter.and.callFake(() =>
      of(mockAudioEventsResponse)
    );

    spectator.detectChanges();

    const targetTag = mockTagsResponse[0];
    const tagText = targetTag.text;
    selectFromTypeahead(spectator, tagsTypeaheadInput(), tagText);
  }

  const spectrogramElements = () =>
    spectator.queryAll<SpectrogramComponent>("oe-spectrogram");
  const previewNextPageButton = () =>
    getElementByInnerText<HTMLButtonElement>(spectator, "Next Page");
  const previewPreviousPageButton = (): HTMLButtonElement =>
    getElementByInnerText<HTMLButtonElement>(spectator, "Previous Page");
  const tagsTypeaheadInput = (): HTMLElement => spectator.query("#tags-input");
  const onlyVerifiedCheckbox = () =>
    spectator.query<HTMLInputElement>("#filter-verified");

  function toggleOnlyVerifiedCheckbox(): void {
    onlyVerifiedCheckbox().click();
    spectator.detectChanges();
  }

  beforeEach(fakeAsync(() => {
    routeProject = new Project(generateProject());
    routeRegion = new Region(generateRegion());
    routeSite = new Site(generateSite());

    setup();
  }));

  it("should create", () => {
    expect(spectator.component).toBeInstanceOf(AnnotationSearchComponent);
  });

  it("should make the correct api call", () => {
    const expectedBody: Filters<AudioEvent> = {
      filter: {
        "tags.id": {
          in: [mockTagsResponse[0].id],
        },
      },
      paging: {
        page: 1,
        items: 3,
      },
    } as any;

    expect(mockAudioEventsApi.filter).toHaveBeenCalledWith(expectedBody);
  });

  it("should display an error if there are no search results", () => {
    const expectedText = "No annotations found";
    const element = getElementByInnerText(spectator, expectedText);
    expect(element).toExist();
  });

  // TODO: this test is disabled because we currently have a non-functional and
  // disabled "only show unverified" checkbox until the endpoint is avaliable
  // filter for verified status
  xit("should use a different error message if there are no unverified annotations found", () => {
    const expectedText = "No unverified annotations found";
    mockAudioEventsResponse = [];
    toggleOnlyVerifiedCheckbox();

    const element = getElementByInnerText<HTMLHeadingElement>(
      spectator,
      expectedText
    );
    expect(element).toExist();
  });

  it("should display a search preview for a full page of results", () => {
    const expectedResults = mockAudioEventsResponse.length;
    const realizedResults = spectrogramElements().length;
    expect(realizedResults).toEqual(expectedResults);
  });

  it("should display a reduced search preview for a partial page of results", () => {
    mockAudioEventsResponse = mockAudioEventsResponse.slice(0, 2);

    const expectedResults = mockAudioEventsResponse.length;
    const realizedResults = spectrogramElements().length;
    expect(realizedResults).toEqual(expectedResults);
  });

  it("should page forward correctly", () => {
    previewNextPageButton().click();
    spectator.detectChanges();

    const expectedPageNumber = 2;
    const realizedPageNumber = spectator.component.previewPage;
    expect(realizedPageNumber).toEqual(expectedPageNumber);
  });

  it("should page to previous pages correctly", () => {
    previewNextPageButton().click();
    spectator.detectChanges();
    previewPreviousPageButton().click();
    spectator.detectChanges();

    const expectedPageNumber = 1;
    const realizedPageNumber = spectator.component.previewPage;
    expect(realizedPageNumber).toEqual(expectedPageNumber);
  });
});

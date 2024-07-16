import {
  createRoutingFactory,
  SpectatorRouting,
  SpyObject,
} from "@ngneat/spectator";
import { ToastrService } from "ngx-toastr";
import { MockBawApiModule } from "@baw-api/baw-apiMock.module";
import { SharedModule } from "@shared/shared.module";
import { AnnotationSearchFormComponent } from "@components/annotations/components/annotation-search-form/annotation-search-form.component";
import { Project } from "@models/Project";
import { Region } from "@models/Region";
import { Site } from "@models/Site";
import { ActivatedRoute } from "@angular/router";
import { of } from "rxjs";
import { generateProject } from "@test/fakes/Project";
import { generateRegion } from "@test/fakes/Region";
import { generateSite } from "@test/fakes/Site";
import { assertPageInfo } from "@test/helpers/pageRoute";
import { AudioEventsService } from "@baw-api/audio-event/audio-events.service";
import { AUDIO_EVENT, TAG } from "@baw-api/ServiceTokens";
import { AudioEvent } from "@models/AudioEvent";
import { generateAudioEvent } from "@test/fakes/AudioEvent";
import { Tag } from "@models/Tag";
import { generateTag } from "@test/fakes/Tag";
import { TagsService } from "@baw-api/tag/tags.service";
import { AnnotationSearchComponent } from "./search.component";

describe("AnnotationSearchComponent", () => {
  let spectator: SpectatorRouting<AnnotationSearchComponent>;
  let defaultProject: Project;
  let defaultRegion: Region;
  let defaultSite: Site;

  // I mock the tags api because the AnnotationSearchParameters data model
  // uses an association decorator to fetch tag models from the api using the
  // tag ids
  let mockTagsApi: SpyObject<TagsService>;
  let mockTagsApiResponse: Tag[] = [];
  let mockAudioEventApi: SpyObject<AudioEventsService>;
  let mockAudioEventApiResponse: AudioEvent[] = [];

  const createComponent = createRoutingFactory({
    declarations: [AnnotationSearchFormComponent],
    component: AnnotationSearchComponent,
    imports: [MockBawApiModule, SharedModule],
    mocks: [ToastrService],
  });

  function setup() {
    spectator = createComponent({
      detectChanges: false,
      data: { projectId: { model: defaultProject } },
      params: {
        projectId: defaultProject.id,
        regionId: defaultRegion.id,
        siteId: defaultSite.id,
      },
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            params: of({
              projectId: defaultProject.id,
              regionId: defaultRegion.id,
              siteId: defaultSite.id,
            }),
          },
        },
      ],
    });

    spectator.component.project = defaultProject;
    spectator.component.region = defaultRegion;
    spectator.component.site = defaultSite;

    mockAudioEventApi = spectator.inject(AUDIO_EVENT.token);
    mockAudioEventApi.filter.and.callFake(() => of(mockAudioEventApiResponse));

    mockTagsApi = spectator.inject(TAG.token);
    mockTagsApi.filter.and.callFake(() => of(mockTagsApiResponse));

    spectator.detectChanges();
  }

  beforeEach(() => {
    defaultProject = new Project(generateProject());
    defaultRegion = new Region(
      generateRegion({ projectId: defaultProject.id })
    );
    defaultSite = new Site(generateSite({ regionId: defaultRegion.id }));

    mockAudioEventApiResponse = Array.from<AudioEvent>({ length: 3 }).fill(
      new AudioEvent(generateAudioEvent())
    );

    mockTagsApiResponse = Array.from<Tag>({ length: 3 }).fill(
      new Tag(generateTag({ text: "test tag" }))
    );

    setup();
  });

  const nextPageButton = () =>
    getElementByInnerText<HTMLButtonElement>("Next Page");
  const previousPageButton = () =>
    getElementByInnerText<HTMLButtonElement>("Previous Page");
  const spectrogramElements = () =>
    spectator.queryAll<HTMLElement>("oe-spectrogram");
  const onlyShowUnverifiedCheckbox = () =>
    spectator.query<HTMLInputElement>("#filter-verified");

  function getElementByInnerText<T extends HTMLElement>(text: string): T {
    return spectator.debugElement.query(
      (element) => element.nativeElement.innerText === text
    )?.nativeElement as T;
  }

  assertPageInfo(AnnotationSearchComponent, "Search Annotations");

  it("should create", () => {
    expect(spectator.component).toBeInstanceOf(AnnotationSearchComponent);
  });

  describe("Before search", () => {
    it("should not make any api calls on initialization", () => {
      expect(mockAudioEventApi.filter).not.toHaveBeenCalled();
    });

    it("should not display any search preview if there are no search parameters", () => {
      // we use an id selector here instead of the text because we want to match
      // against any error thrown by the component
      const errorElement = spectator.query("#no-results-error");
      const spectrogramElement = spectrogramElements();

      expect(errorElement).not.toExist();
      expect(spectrogramElement).toHaveLength(0);
    });

    it("should have disabled next page and previous page", () => {
      expect(nextPageButton()).toBeDisabled();
      expect(previousPageButton()).toBeDisabled();
    });
  });

  describe("Search results preview", () => {
    beforeEach(() => {
      spectator.component.model.tags = mockTagsApiResponse.map((tag) => tag.id);
    });

    it("should make the correct api call", () => {
      const expectedBody = {};
      expect(mockAudioEventApi.filter).toHaveBeenCalledWith(expectedBody);
    });

    it("should display an error if there are no search results", () => {
      const expectedText = "No annotations found";
      mockAudioEventApiResponse = [];
      spectator.detectChanges();

      const element = getElementByInnerText<HTMLHeadingElement>(expectedText);
      expect(element).toExist();
    });

    it("should use a different error message if there are no unverified annotations found", () => {
      const expectedText = "No unverified annotations found";
      mockAudioEventApiResponse = [];
      const targetCheckbox = onlyShowUnverifiedCheckbox();

      targetCheckbox.checked = true;
      targetCheckbox.dispatchEvent(new Event("change"));
      spectator.detectChanges();

      const element = getElementByInnerText<HTMLHeadingElement>(expectedText);
      expect(element).toExist();
    });

    it("should have disabled pagination buttons if there are no search results", () => {});

    it("should display a search preview for a full page of results", () => {
      const expectedResults = mockAudioEventApiResponse.length;
      const realizedResults = spectrogramElements().length;
      expect(realizedResults).toEqual(expectedResults);
    });

    it("should display a reduced search preview for a partial page of results", () => {
      mockAudioEventApiResponse = mockAudioEventApiResponse.slice(0, 2);

      const expectedResults = mockAudioEventApiResponse.length;
      const realizedResults = spectrogramElements().length;
      expect(realizedResults).toEqual(expectedResults);
    });

    it("should page forward correctly", () => {
      nextPageButton().click();
      spectator.detectChanges();

      const expectedPageNumber = 2;
      const realizedPageNumber = spectator.component.previewPage;
      expect(realizedPageNumber).toEqual(expectedPageNumber);
    });

    it("should page to previous pages correctly", () => {
      nextPageButton().click();
      spectator.detectChanges();
      previousPageButton().click();
      spectator.detectChanges();

      const expectedPageNumber = 1;
      const realizedPageNumber = spectator.component.previewPage;
      expect(realizedPageNumber).toEqual(expectedPageNumber);
    });

    it("should not be possible to page back past the first page", () => {
      const initialPageNumber = spectator.component.previewPage;
      const expectedPageNumber = 1;

      expect(initialPageNumber).toEqual(expectedPageNumber);

      previousPageButton().click();
      spectator.detectChanges();

      const realizedPageNumber = spectator.component.previewPage;
      expect(realizedPageNumber).toEqual(expectedPageNumber);
    });
  });
});

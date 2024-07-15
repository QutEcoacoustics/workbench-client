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
import { AUDIO_EVENT } from "@baw-api/ServiceTokens";
import { AudioEvent } from "@models/AudioEvent";
import { generateAudioEvent } from "@test/fakes/AudioEvent";
import { AnnotationSearchComponent } from "./search.component";

describe("AnnotationSearchComponent", () => {
  let spectator: SpectatorRouting<AnnotationSearchComponent>;
  let defaultProject: Project;
  let defaultRegion: Region;
  let defaultSite: Site;
  let mockAudioEventApi: SpyObject<AudioEventsService>;
  let mockApiResponse: AudioEvent[] = [];

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
    mockAudioEventApi.filter.and.callFake(() => of(mockApiResponse));

    spectator.detectChanges();
  }

  beforeEach(() => {
    defaultProject = new Project(generateProject());
    defaultRegion = new Region(
      generateRegion({ projectId: defaultProject.id })
    );
    defaultSite = new Site(generateSite({ regionId: defaultRegion.id }));

    mockApiResponse = Array.from<AudioEvent>({ length: 3 }).fill(
      new AudioEvent(generateAudioEvent())
    );

    setup();
  });

  const nextPageButton = () =>
    getElementByInnerText<HTMLButtonElement>("Next Page");
  const previousPageButton = () =>
    getElementByInnerText<HTMLButtonElement>("Previous Page");

  function getElementByInnerText<T extends HTMLElement>(text: string): T {
    return spectator.debugElement.query(
      (element) => element.nativeElement.innerText === text
    )?.nativeElement as T;
  }

  assertPageInfo(AnnotationSearchComponent, "Search Annotations");

  it("should create", () => {
    expect(spectator.component).toBeInstanceOf(AnnotationSearchComponent);
  });

  it("should not make any api calls on initialization", () => {
    expect(mockAudioEventApi.filter).not.toHaveBeenCalled();
  });

  it("should not display any search preview if there are no search parameters", () => {});

  it("should display an error if there are no search results", () => {});

  it("should display a search preview for a full page of results", () => {});

  it("should display a reduced search preview for a partial page of results", () => {});

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
});

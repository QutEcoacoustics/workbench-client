import { createRoutingFactory, Spectator, SpyObject } from "@ngneat/spectator";
import { Params } from "@angular/router";
import { of } from "rxjs";
import { CUSTOM_ELEMENTS_SCHEMA, INJECTOR, Injector } from "@angular/core";
import { generateVerification } from "@test/fakes/Verification";
import { Verification } from "@models/Verification";
import { modelData } from "@test/helpers/faker";
import { VerificationService } from "@baw-api/verification/verification.service";
import { TAG, VERIFICATION } from "@baw-api/ServiceTokens";
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
import { SpectrogramComponent } from "@ecoacoustics/web-components/@types/components/spectrogram/spectrogram";
import { getElementByInnerText, selectFromTypeahead } from "@test/helpers/html";
import { Filters } from "@baw-api/baw-api.service";
import { AnnotationSearchComponent } from "./search.component";
import "@ecoacoustics/web-components";

describe("AnnotationSearchComponent", () => {
  let spectator: Spectator<AnnotationSearchComponent>;
  let injector: Injector;

  let mockVerificationsApi: SpyObject<VerificationService>;
  let mockTagsApi: SpyObject<TagsService>;

  let routeProject: Project;
  let routeRegion: Region;
  let routeSite: Site;

  let mockVerificationsResponse: Verification[] = [];
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

    mockVerificationsResponse = modelData.randomArray(
      10,
      10,
      () =>
        new Verification(
          generateVerification({
            audioLink:
              "https://api.staging.ecosounds.org/audio_recordings/461823/media.flac?end_offset=8170&start_offset=8159",
          }),
          injector
        )
    );

    mockTagsApi = spectator.inject(TAG.token);
    mockTagsApi.filter.and.callFake(() => of(mockTagsResponse));

    mockVerificationsApi = spectator.inject(VERIFICATION.token);
    mockVerificationsApi.filter.and.callFake(() =>
      of(mockVerificationsResponse)
    );

    spectator.detectChanges();
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

    const targetTag = mockTagsResponse[0];
    const tagText = targetTag.text;
    selectFromTypeahead(spectator, tagsTypeaheadInput(), tagText);

    setup();
  }));

  it("should create", () => {
    expect(spectator.component).toBeInstanceOf(AnnotationSearchComponent);
  });

  it("should make the correct api call", () => {
    const expectedBody: Filters<Verification> = {
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

    expect(mockVerificationsApi.filter).toHaveBeenCalledWith(expectedBody);
  });

  it("should display an error if there are no search results", () => {
    const expectedText = "No annotations found";
    const element = getElementByInnerText(spectator, expectedText);
    expect(element).toExist();
  });

  it("should use a different error message if there are no unverified annotations found", () => {
    const expectedText = "No unverified annotations found";
    mockVerificationsResponse = [];
    toggleOnlyVerifiedCheckbox();

    const element = getElementByInnerText<HTMLHeadingElement>(
      spectator,
      expectedText
    );
    expect(element).toExist();
  });

  it("should have disabled pagination buttons if there are no search results", () => {});

  it("should display a search preview for a full page of results", () => {
    const expectedResults = mockVerificationsResponse.length;
    const realizedResults = spectrogramElements().length;
    expect(realizedResults).toEqual(expectedResults);
  });

  it("should display a reduced search preview for a partial page of results", () => {
    mockVerificationsResponse = mockVerificationsResponse.slice(0, 2);

    const expectedResults = mockVerificationsResponse.length;
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

  it("should not be possible to page back past the first page", () => {
    const initialPageNumber = spectator.component.previewPage;
    const expectedPageNumber = 1;

    expect(initialPageNumber).toEqual(expectedPageNumber);

    previewPreviousPageButton().click();
    spectator.detectChanges();

    const realizedPageNumber = spectator.component.previewPage;
    expect(realizedPageNumber).toEqual(expectedPageNumber);
  });
});

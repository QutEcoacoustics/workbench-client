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
import "node_modules/@ecoacoustics/web-components";
import { MockBawApiModule } from "@baw-api/baw-apiMock.module";
import { SharedModule } from "@shared/shared.module";
import { RouterTestingModule } from "@angular/router/testing";
import { Project } from "@models/Project";
import { Region } from "@models/Region";
import { Site } from "@models/Site";
import { generateProject } from "@test/fakes/Project";
import { generateRegion } from "@test/fakes/Region";
import { generateSite } from "@test/fakes/Site";
import { AnnotationSearchComponent } from "./search.component";

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

  beforeEach(() => {
    routeProject = new Project(generateProject());
    routeRegion = new Region(generateRegion());
    routeSite = new Site(generateSite());

    setup();
  });

  it("should create", () => {
    expect(spectator.component).toBeInstanceOf(AnnotationSearchComponent);
  });
});

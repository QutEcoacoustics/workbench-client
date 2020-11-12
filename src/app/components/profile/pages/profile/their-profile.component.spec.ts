import { RouterTestingModule } from "@angular/router/testing";
import { ApiErrorDetails } from "@baw-api/api.interceptor.service";
import { ShallowAudioEventsService } from "@baw-api/audio-event/audio-events.service";
import { MockBawApiModule } from "@baw-api/baw-apiMock.module";
import { BookmarksService } from "@baw-api/bookmark/bookmarks.service";
import { ProjectsService } from "@baw-api/project/projects.service";
import { ShallowSitesService } from "@baw-api/site/sites.service";
import { TagsService } from "@baw-api/tag/tags.service";
import { User } from "@models/User";
import { createRoutingFactory, SpectatorRouting } from "@ngneat/spectator";
import { SharedModule } from "@shared/shared.module";
import { generateUser } from "@test/fakes/User";
import { Subject } from "rxjs";
import { TheirProfileComponent } from "./their-profile.component";

describe("TheirProfileComponent", () => {
  let defaultUser: User;
  let spec: SpectatorRouting<TheirProfileComponent>;
  const createComponent = createRoutingFactory({
    component: TheirProfileComponent,
    imports: [SharedModule, RouterTestingModule, MockBawApiModule],
    stubsEnabled: false,
  });

  function setup(model: User, error?: ApiErrorDetails) {
    spec = createComponent({
      detectChanges: false,
      data: {
        resolvers: { account: "resolver" },
        account: { model, error },
      },
    });

    const audioEventsApi = spec.inject(ShallowAudioEventsService);
    const bookmarksApi = spec.inject(BookmarksService);
    const projectsApi = spec.inject(ProjectsService);
    const sitesApi = spec.inject(ShallowSitesService);
    const tagsApi = spec.inject(TagsService);

    audioEventsApi.filterByCreator.andCallFake(() => new Subject());
    bookmarksApi.filterByCreator.andCallFake(() => new Subject());
    projectsApi.filterByCreator.andCallFake(() => new Subject());
    sitesApi.filterByCreator.andCallFake(() => new Subject());
    tagsApi.filterByCreator.andCallFake(() => new Subject());
  }

  beforeEach(() => {
    defaultUser = new User(generateUser());
  });

  it("should create", () => {
    setup(defaultUser);
    spec.detectChanges();
    expect(spec.component).toBeTruthy();
  });

  // TODO Implement tests
});

import { RouterTestingModule } from "@angular/router/testing";
import { ApiErrorDetails } from "@baw-api/api.interceptor.service";
import { ShallowAudioEventsService } from "@baw-api/audio-event/audio-events.service";
import { MockBawApiModule } from "@baw-api/baw-apiMock.module";
import { BookmarksService } from "@baw-api/bookmark/bookmarks.service";
import { ProjectsService } from "@baw-api/project/projects.service";
import { ShallowSitesService } from "@baw-api/site/sites.service";
import { TagsService } from "@baw-api/tag/tags.service";
import { isInstantiated } from "@helpers/isInstantiated/isInstantiated";
import { AbstractModel } from "@models/AbstractModel";
import { AudioEvent } from "@models/AudioEvent";
import { Bookmark } from "@models/Bookmark";
import { Project } from "@models/Project";
import { Site } from "@models/Site";
import { Tag } from "@models/Tag";
import { User } from "@models/User";
import {
  createRoutingFactory,
  SpectatorRouting,
  SpyObject,
} from "@ngneat/spectator";
import { ItemsComponent } from "@shared/items/items/items.component";
import { SharedModule } from "@shared/shared.module";
import { generateApiErrorDetails } from "@test/fakes/ApiErrorDetails";
import { generateAudioEvent } from "@test/fakes/AudioEvent";
import { generateBookmark } from "@test/fakes/Bookmark";
import { generateProject } from "@test/fakes/Project";
import { generateSite } from "@test/fakes/Site";
import { generateTag } from "@test/fakes/Tag";
import { generateUser } from "@test/fakes/User";
import { modelData } from "@test/helpers/faker";
import { nStepObservable } from "@test/helpers/general";
import { assertErrorHandler, assertImage, assertUrl } from "@test/helpers/html";
import { Subject } from "rxjs";
import { TheirProfileComponent } from "./their-profile.component";

describe("TheirProfileComponent", () => {
  let audioEventsApi: SpyObject<ShallowAudioEventsService>;
  let bookmarksApi: SpyObject<BookmarksService>;
  let projectsApi: SpyObject<ProjectsService>;
  let sitesApi: SpyObject<ShallowSitesService>;
  let tagsApi: SpyObject<TagsService>;

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

    audioEventsApi = spec.inject(ShallowAudioEventsService);
    bookmarksApi = spec.inject(BookmarksService);
    projectsApi = spec.inject(ProjectsService);
    sitesApi = spec.inject(ShallowSitesService);
    tagsApi = spec.inject(TagsService);
  }

  type Intercept<Model extends AbstractModel> = Model[] | ApiErrorDetails;

  function interceptApiRequest<Model extends AbstractModel, Service>(
    api: SpyObject<Service>,
    filter: keyof Service,
    response: Intercept<Model> = []
  ) {
    (response as Model[])?.forEach?.((model) => {
      if (!model.getMetadata()) {
        model.addMetadata({ paging: { items: (response as Model[]).length } });
      }
    });

    const subject = new Subject<Model[]>();
    (api[filter] as any).andCallFake(() => subject);
    return nStepObservable(
      subject,
      () => response,
      isInstantiated(response["status"])
    );
  }

  function interceptApiRequests(models: {
    annotations?: Intercept<AudioEvent>;
    bookmarks?: Intercept<Bookmark>;
    projects?: Intercept<Project>;
    sites?: Intercept<Site>;
    tags?: Intercept<Tag>;
  }) {
    return Promise.all([
      interceptApiRequest(
        audioEventsApi,
        "filterByCreator",
        models.annotations
      ),
      interceptApiRequest(bookmarksApi, "filterByCreator", models.bookmarks),
      interceptApiRequest(projectsApi, "filterByCreator", models.projects),
      interceptApiRequest(sitesApi, "filterByCreator", models.sites),
      interceptApiRequest(tagsApi, "filterByCreator", models.tags),
    ]);
  }

  beforeEach(() => {
    defaultUser = new User(generateUser());
  });

  it("should create", () => {
    setup(defaultUser);
    interceptApiRequests({});
    spec.detectChanges();
    expect(spec.component).toBeTruthy();
  });

  it("should handle user error", () => {
    setup(undefined, generateApiErrorDetails());
    interceptApiRequests({});
    spec.detectChanges();
    assertErrorHandler(spec.fixture);
  });

  it("should display username", () => {
    setup(defaultUser);
    interceptApiRequests({});
    spec.detectChanges();

    expect(spec.query("h1")).toHaveText(defaultUser.userName);
  });

  it("should display profile image", () => {
    setup(defaultUser);
    interceptApiRequests({});
    spec.detectChanges();

    assertImage(
      spec.query("img"),
      defaultUser.image[0].url,
      `${defaultUser.userName} profile image`
    );
    expect(spec.query("h1")).toHaveText(defaultUser.userName);
  });

  it("should not show download annotations link", () => {
    setup(defaultUser);
    interceptApiRequests({});
    spec.detectChanges();
    const link = spec.query<HTMLAnchorElement>("#annotations-link a");
    expect(link).toBeFalsy();
  });

  describe("last seen at", () => {
    function getLabel() {
      return spec.query("#last-seen-at");
    }

    it("should display last seen at time", () => {
      setup(defaultUser);
      interceptApiRequests({});
      spec.detectChanges();
      expect(getLabel()).toHaveText(defaultUser.lastSeenAt.toRelative());
    });

    it("should handle if user is deleted", () => {
      setup(User.deletedUser);
      interceptApiRequests({});
      spec.detectChanges();
      expect(getLabel()).toHaveText("Unknown time since last logged in");
    });

    it("should handle if user is unknown", () => {
      setup(User.unknownUser);
      interceptApiRequests({});
      spec.detectChanges();
      expect(getLabel()).toHaveText("Unknown time since last logged in");
    });

    it("should handle if user has no last seen at date", () => {
      const user = new User(generateUser({ lastSeenAt: null }));
      setup(user);
      interceptApiRequests({});
      spec.detectChanges();
      expect(getLabel()).toHaveText("Unknown time since last logged in");
    });
  });

  describe("membership length", () => {
    function getLabel() {
      return spec.query("#membership-length");
    }

    it("should display membership length", () => {
      setup(defaultUser);
      interceptApiRequests({});
      spec.detectChanges();
      expect(getLabel()).toHaveText(defaultUser.createdAt.toRelative());
    });

    it("should handle if user is deleted", () => {
      setup(User.deletedUser);
      interceptApiRequests({});
      spec.detectChanges();
      expect(getLabel()).toHaveText("Unknown membership length");
    });

    it("should handle if user is unknown", () => {
      setup(User.unknownUser);
      interceptApiRequests({});
      spec.detectChanges();
      expect(getLabel()).toHaveText("Unknown membership length");
    });

    it("should handle if user has no membership length", () => {
      const user = new User(generateUser({ createdAt: undefined }));
      setup(user);
      interceptApiRequests({});
      spec.detectChanges();
      expect(getLabel()).toHaveText("Unknown membership length");
    });
  });

  describe("statistics", () => {
    [
      {
        suite: "projects",
        model: "projects",
        response: () => new Project(generateProject()),
      },
      {
        suite: "tags",
        model: "tags",
        response: () => new Tag(generateTag()),
      },
      {
        suite: "bookmarks",
        model: "bookmarks",
        response: () => new Bookmark(generateBookmark()),
      },
      {
        suite: "sites",
        model: "sites",
        response: () => new Site(generateSite()),
      },
      {
        suite: "points",
        model: "sites",
        response: () => new Site(generateSite()),
      },
      {
        suite: "annotations",
        model: "annotations",
        response: () => new AudioEvent(generateAudioEvent()),
      },
    ].forEach((test, position) => {
      describe(test.suite, () => {
        let numModels: number;
        let apiResponse: AbstractModel;

        function getStatistics() {
          return spec.query(ItemsComponent);
        }

        beforeEach(() => {
          numModels = modelData.datatype.number();
          apiResponse = test.response();
          apiResponse.addMetadata({ paging: { total: numModels } });
        });

        it("should initially display ...", () => {
          setup(defaultUser);
          interceptApiRequests({ [test.model]: [apiResponse] });
          spec.detectChanges();
          expect(getStatistics().items.get(position).value).toBe("...");
        });

        it(`should update with number of ${test.suite}`, async () => {
          setup(defaultUser);
          const promise = interceptApiRequests({ [test.model]: [apiResponse] });
          spec.detectChanges();
          await promise;
          spec.detectChanges();
          expect(getStatistics().items.get(position).value).toBe(numModels);
        });

        it("should update with Unknown when showing deleted user", async () => {
          setup(User.deletedUser);
          spec.detectChanges();
          expect(getStatistics().items.get(position).value).toBe("Unknown");
        });

        it("should update with Unknown when showing unknown user", async () => {
          setup(User.unknownUser);
          spec.detectChanges();
          expect(getStatistics().items.get(position).value).toBe("Unknown");
        });

        it("should update with Unknown on error", async () => {
          setup(defaultUser);
          const promise = interceptApiRequests({
            [test.model]: generateApiErrorDetails(),
          });
          spec.detectChanges();
          await promise;
          spec.detectChanges();
          expect(getStatistics().items.get(position).value).toBe("Unknown");
        });
      });
    });
  });

  describe("tags", () => {
    let defaultTag: Tag;

    function getTags() {
      return spec.queryAll<HTMLElement>("#tags li");
    }

    beforeEach(() => (defaultTag = new Tag(generateTag())));

    it("should display loading animation while resolving tags", async () => {
      setup(defaultUser);
      interceptApiRequests({ tags: [] });
      spec.detectChanges();

      const tags = getTags();
      expect(tags.length).toBe(1);
      expect(tags[0].querySelector("baw-loading")).toBeTruthy();
    });

    it("should display no tags", async () => {
      setup(defaultUser);
      const promise = interceptApiRequests({ tags: [] });
      spec.detectChanges();
      await promise;
      spec.detectChanges();

      const tags = getTags();
      expect(tags.length).toBe(1);
      expect(tags[0]).toHaveText("User has not created any tags yet");
    });

    it("should display single tag", async () => {
      setup(defaultUser);
      const promise = interceptApiRequests({ tags: [defaultTag] });
      spec.detectChanges();
      await promise;
      spec.detectChanges();

      const tags = getTags();
      expect(tags.length).toBe(1);
      expect(tags[0]).toHaveText(defaultTag.text);
    });

    it("should link to tag details page", async () => {
      setup(defaultUser);
      const promise = interceptApiRequests({ tags: [defaultTag] });
      spec.detectChanges();
      await promise;
      spec.detectChanges();

      const tags = getTags();
      assertUrl(tags[0].querySelector("a"), defaultTag.viewUrl);
    });

    it("should display multiple tags", async () => {
      const tagModels = [1, 2, 3].map(() => new Tag(generateTag()));

      setup(defaultUser);
      const promise = interceptApiRequests({ tags: tagModels });
      spec.detectChanges();
      await promise;
      spec.detectChanges();

      const tags = getTags();
      expect(tags.length).toBe(3);
      expect(tags[0]).toHaveText(tagModels[0].text);
      expect(tags[1]).toHaveText(tagModels[1].text);
      expect(tags[2]).toHaveText(tagModels[2].text);
    });
  });

  // TODO Add expectations for individual filter requests
});

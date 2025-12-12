import { AccountsService } from "@baw-api/account/accounts.service";
import { AudioRecordingsService } from "@baw-api/audio-recording/audio-recordings.service";
import { provideMockBawApi } from "@baw-api/provide-baw-ApiMock";
import { BawSessionService } from "@baw-api/baw-session.service";
import { SecurityService } from "@baw-api/security/security.service";
import {
  ACCOUNT,
  AUDIO_RECORDING,
  SHALLOW_SITE,
  TAG,
} from "@baw-api/ServiceTokens";
import { ShallowSitesService } from "@baw-api/site/sites.service";
import { TagsService } from "@baw-api/tag/tags.service";
import { Errorable } from "@helpers/advancedTypes";
import { AudioEvent } from "@models/AudioEvent";
import { AudioRecording } from "@models/AudioRecording";
import { Site } from "@models/Site";
import { Tag } from "@models/Tag";
import { User } from "@models/User";
import {
  createRoutingFactory,
  Spectator,
  SpyObject,
} from "@ngneat/spectator";
import { DatatableComponent } from "@swimlane/ngx-datatable";
import { generateAudioEvent } from "@test/fakes/AudioEvent";
import { generateAudioRecording } from "@test/fakes/AudioRecording";
import { generateBawApiError } from "@test/fakes/BawApiError";
import { generateSite } from "@test/fakes/Site";
import { generateTag } from "@test/fakes/Tag";
import { generateTagging } from "@test/fakes/Tagging";
import {
  interceptMappedApiRequests,
  interceptShowApiRequest,
} from "@test/helpers/general";
import { humanizedDuration } from "@test/helpers/dateTime";
import { AssociationInjector } from "@models/ImplementsInjector";
import { ASSOCIATION_INJECTOR } from "@services/association-injector/association-injector.tokens";
import { Id } from "@interfaces/apiInterfaces";
import { modelData } from "@test/helpers/faker";
import { generateUser } from "@test/fakes/User";
import { IconsModule } from "@shared/icons/icons.module";
import { RecentAnnotationsComponent } from "./recent-annotations.component";
import { datatableCells } from "@test/helpers/datatable";

describe("RecentAnnotationsComponent", () => {
  let api: {
    sites: SpyObject<ShallowSitesService>;
    users: SpyObject<AccountsService>;
    recordings: SpyObject<AudioRecordingsService>;
    tags: SpyObject<TagsService>;
    security: SecurityService;
  };
  let session: BawSessionService;
  let injector: AssociationInjector;
  let spec: Spectator<RecentAnnotationsComponent>;

  let defaultUser: User;
  let defaultAnnotation: AudioEvent;
  let defaultSite: Site;
  let defaultRecording: AudioRecording;
  let defaultTags: Tag[];

  const createComponent = createRoutingFactory({
    component: RecentAnnotationsComponent,
    imports: [IconsModule],
    providers: [provideMockBawApi()],
  });

  function interceptSiteRequest(data: Errorable<Site>) {
    return interceptShowApiRequest(api.sites, injector, data, Site);
  }

  function interceptUserRequest(data: Errorable<User>) {
    return interceptShowApiRequest(api.users, injector, data, User);
  }

  function interceptAudioRecordingsRequest(
    data: Errorable<AudioRecording>,
  ): Promise<any> {
    return interceptShowApiRequest(
      api.recordings,
      injector,
      data,
      AudioRecording,
    );
  }

  function interceptTagsRequest(data: Errorable<Tag>[]): Promise<void>[] {
    const tagsApiResponses = new Map<Id, Errorable<Tag>>();
    data.forEach((tag: Tag) => {
      tagsApiResponses.set(tag.id, tag);
    });

    return interceptMappedApiRequests(api.tags.show, tagsApiResponses);
  }

  function interceptRequests(
    site: Errorable<Site>,
    user: Errorable<User>,
    recording: Errorable<AudioRecording>,
    tags: Errorable<Tag>[],
  ): { initial: Promise<any>; final: Promise<any> } {
    return {
      initial: Promise.all([
        interceptUserRequest(user),
        interceptAudioRecordingsRequest(recording),
        ...interceptTagsRequest(tags),
      ]),
      final: interceptSiteRequest(site),
    };
  }

  async function setup(
    state?: {
      awaitInitialRequests?: boolean;
      awaitFinalRequests?: boolean;
      isLoggedIn?: boolean;
    },
    annotations: AudioEvent[] = [defaultAnnotation],
    site: Errorable<Site> = defaultSite,
    user: Errorable<User> = defaultUser,
    recording: Errorable<AudioRecording> = defaultRecording,
    tags: Errorable<Tag>[] = defaultTags,
  ) {
    const promise = interceptRequests(site, user, recording, tags);
    setLoggedInState(state?.isLoggedIn);
    setAnnotations(annotations);
    spec.detectChanges();

    if (state?.awaitInitialRequests) {
      await promise.initial;
      spec.detectChanges();

      if (state?.awaitFinalRequests) {
        await promise.final;
        spec.detectChanges();
      }
    }
  }

  function setLoggedInState(isLoggedIn: boolean) {
    spyOnProperty(session, "isLoggedIn").and.callFake(() => isLoggedIn);
  }

  function setAnnotations(annotations: AudioEvent[]) {
    spec.setInput("annotations", annotations);
  }

  beforeEach(() => {
    spec = createComponent({ detectChanges: false });
    injector = spec.inject(ASSOCIATION_INJECTOR);
    api = {
      sites: spec.inject(SHALLOW_SITE.token),
      users: spec.inject(ACCOUNT.token),
      recordings: spec.inject(AUDIO_RECORDING.token),
      tags: spec.inject(TAG.token),
      security: spec.inject(SecurityService),
    };
    session = spec.inject(BawSessionService);

    defaultUser = new User(generateUser(), injector);
    defaultSite = new Site(generateSite(), injector);
    defaultRecording = new AudioRecording(
      generateAudioRecording({ siteId: defaultSite.id }),
      injector,
    );

    defaultTags = modelData.randomArray(2, 5, () =>
      new Tag(
        generateTag({ creatorId: defaultUser.id }),
        injector,
      ));

    // the audio events use the "taggings" property for the tag associations
    // therefore, the tagging ids and the tag ids must match
    const audioEventId = modelData.id();
    const taggings = defaultTags.map((tag) =>
      generateTagging({
        audioEventId: audioEventId,
        tagId: tag.id,
        creatorId: defaultUser.id,
      })
    );
    defaultAnnotation = new AudioEvent(
      generateAudioEvent({
        id: audioEventId,
        creatorId: defaultUser.id,
        taggings,
      }),
      injector,
    );
  });

  describe("table", () => {
    function getTable() {
      return spec.query(DatatableComponent);
    }

    it("should not have external paging", async () => {
      await setup();
      expect(getTable().externalPaging).toBeFalsy();
    });

    it("should not have external sorting", async () => {
      await setup();
      expect(getTable().externalSorting).toBeFalsy();
    });

    it("should not have footer", async () => {
      await setup();
      expect(getTable().footerHeight).toBe(0);
    });
  });

  describe("rows", () => {
    function getCellElements() {
      return spec
        .queryAll("datatable-body-cell")
        .map((el) => el.firstElementChild);
    }

    function assertCellLoading(element: Element, loading: boolean) {
      const spinner = element.querySelector("baw-loading");
      if (loading) {
        expect(spinner).toBeTruthy();
      } else {
        expect(spinner).toBeFalsy();
      }
    }

    describe("site", () => {
      const getSiteCell = () => datatableCells(spec)[0];
      const getSiteCellElement = () => getCellElements()[0];

      it("should not display column if not logged in", async () => {
        await setup({ isLoggedIn: false, awaitInitialRequests: true });
        expect(getSiteCell().column.name).not.toBe("Site");
      });

      it("should display column if logged in", async () => {
        await setup({ isLoggedIn: true, awaitInitialRequests: true });
        expect(getSiteCell().column.name).toBe("Site");
      });

      it("should display loading spinner while audio recording unresolved", async () => {
        await setup({ isLoggedIn: true });
        assertCellLoading(getSiteCellElement(), true);
      });

      it("should display loading spinner while site unresolved", async () => {
        await setup({ isLoggedIn: true, awaitInitialRequests: true });
        assertCellLoading(getSiteCellElement(), true);
      });

      it("should not display loading spinner when site resolved", async () => {
        await setup({
          isLoggedIn: true,
          awaitInitialRequests: true,
          awaitFinalRequests: true,
        });
        assertCellLoading(getSiteCellElement(), false);
      });

      it("should display site name when resolved", async () => {
        await setup({
          isLoggedIn: true,
          awaitInitialRequests: true,
          awaitFinalRequests: true,
        });
        expect(getSiteCellElement()).toContainText(defaultSite.name);
      });

      it("should display unknown site if unauthorized", async () => {
        const site = generateBawApiError();

        await setup(
          {
            isLoggedIn: true,
            awaitInitialRequests: true,
            awaitFinalRequests: true,
          },
          [defaultAnnotation],
          site,
        );

        expect(getSiteCellElement()).toContainText("Unknown Site");
      });
    });

    describe("user name", () => {
      const getUsernameCell = () => datatableCells(spec)[1];
      const getUsernameCellElement = () => getCellElements()[1];

      it("should not display column if not logged in", async () => {
        await setup({ isLoggedIn: false, awaitInitialRequests: true });
        expect(getUsernameCell().column.name).not.toBe("User");
      });

      it("should display column if logged in", async () => {
        await setup({ isLoggedIn: true, awaitInitialRequests: true });
        expect(getUsernameCell().column.name).toBe("User");
      });

      it("should display loading spinner while user is unresolved", async () => {
        await setup({ isLoggedIn: true });
        assertCellLoading(getUsernameCellElement(), true);
      });

      it("should not display loading spinner when user resolved", async () => {
        await setup({
          isLoggedIn: true,
          awaitInitialRequests: true,
          awaitFinalRequests: true,
        });
        assertCellLoading(getUsernameCellElement(), false);
      });

      it("should display user name when resolved", async () => {
        await setup({
          isLoggedIn: true,
          awaitInitialRequests: true,
          awaitFinalRequests: true,
        });
        expect(getUsernameCellElement()).toContainText(defaultUser.userName);
      });
    });

    describe("tags", () => {
      const getTagsCell = (isLoggedIn: boolean) =>
        datatableCells(spec)[isLoggedIn ? 2 : 0];
      const getTagsCellElement = (isLoggedIn: boolean) =>
        getCellElements()[isLoggedIn ? 2 : 0];

      it("should display column if not logged in", async () => {
        await setup({ isLoggedIn: false, awaitInitialRequests: true });
        expect(getTagsCell(false).column.name).toBe("Tags");
      });

      it("should display column if logged in", async () => {
        await setup({ isLoggedIn: true, awaitInitialRequests: true });
        expect(getTagsCell(true).column.name).toBe("Tags");
      });

      it("should display loading spinner while tags are unresolved", async () => {
        await setup({ isLoggedIn: true });
        assertCellLoading(getTagsCellElement(true), true);
      });

      it("should not display loading spinner when tags resolved", async () => {
        await setup({
          isLoggedIn: true,
          awaitInitialRequests: true,
          awaitFinalRequests: true,
        });
        assertCellLoading(getTagsCellElement(true), false);
      });

      it("should display (none) text if no tags exist when resolved", async () => {
        const annotations = [
          new AudioEvent(generateAudioEvent({ taggings: [] }), injector),
        ];

        await setup(
          {
            isLoggedIn: true,
            awaitInitialRequests: true,
            awaitFinalRequests: true,
          },
          annotations,
          defaultSite,
          defaultUser,
          defaultRecording,
          [],
        );

        expect(getTagsCellElement(true)).toContainText("(none)");
      });

      it("should displays tags when resolved", async () => {
        await setup({
          isLoggedIn: true,
          awaitInitialRequests: true,
          awaitFinalRequests: true,
        });

        for (const tag of defaultAnnotation.tags) {
          expect(getTagsCellElement(true)).toContainText(tag.text);
        }
      });
    });

    describe("updated", () => {
      const getUpdatedCellElement = (isLoggedIn: boolean) =>
        getCellElements()[isLoggedIn ? 3 : 1];

      function assertTimestamp(cell: Element, annotation: AudioEvent) {
        const expectedText = humanizedDuration(annotation.updatedAt);
        expect(cell).toContainText(expectedText);
      }

      it("should display time since updated when logged in", async () => {
        await setup({ isLoggedIn: true });
        assertTimestamp(getUpdatedCellElement(true), defaultAnnotation);
      });

      it("should display time since updated when not logged in", async () => {
        await setup({ isLoggedIn: false });
        assertTimestamp(getUpdatedCellElement(false), defaultAnnotation);
      });
    });

    describe("actions", () => {
      const getActionCellElement = (isLoggedIn: boolean) =>
        getCellElements()[isLoggedIn ? 4 : 2];
      const getPlayButton = (isLoggedIn: boolean) =>
        getActionCellElement(isLoggedIn).querySelector<HTMLAnchorElement>(
          "#playBtn",
        );
      const getAnnotationButton = (isLoggedIn: boolean) =>
        getActionCellElement(isLoggedIn).querySelector<HTMLAnchorElement>(
          "#annotationBtn",
        );

      [false, true].forEach((isLoggedIn) => {
        it(`should link to listen page when ${
          isLoggedIn ? "" : "not "
        }logged in`, async () => {
            await setup({ isLoggedIn });
            expect(getPlayButton(isLoggedIn)).toHaveUrl(
              defaultAnnotation.listenViewUrl,
            );
          },
        );

        it(`should link to annotations page when ${
          isLoggedIn ? "" : "not "
        }logged in`, async () => {
            await setup({ isLoggedIn });
            expect(getAnnotationButton(isLoggedIn)).toHaveUrl(
              defaultAnnotation.annotationViewUrl,
            );
          },
        );
      });
    });
  });
});

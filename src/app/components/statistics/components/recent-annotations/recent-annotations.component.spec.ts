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
import { createRoutingFactory, Spectator, SpyObject } from "@ngneat/spectator";
import { DatatableComponent } from "@swimlane/ngx-datatable";
import { generateAudioEvent } from "@test/fakes/AudioEvent";
import { generateAudioRecording } from "@test/fakes/AudioRecording";
import { generateBawApiError } from "@test/fakes/BawApiError";
import { generateSite } from "@test/fakes/Site";
import { generateTag } from "@test/fakes/Tag";
import { generateTagging } from "@test/fakes/Tagging";
import { humanizedDuration } from "@test/helpers/dateTime";
import { AssociationInjector } from "@models/ImplementsInjector";
import { ASSOCIATION_INJECTOR } from "@services/association-injector/association-injector.tokens";
import { modelData } from "@test/helpers/faker";
import { generateUser } from "@test/fakes/User";
import { IconsModule } from "@shared/icons/icons.module";
import { RecentAnnotationsComponent } from "./recent-annotations.component";
import { datatableCells } from "@test/helpers/datatable";
import { Subject } from "rxjs";
import { UnresolvedModel } from "@models/AbstractModel";

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

  function setup(
    state?: {
      sendInitialRequests?: boolean;
      sendSiteRequests?: boolean;
      isLoggedIn?: boolean;
    },
    annotations: AudioEvent[] = [defaultAnnotation],
    site: Errorable<Site> = defaultSite,
    user: Errorable<User> = defaultUser,
    recording: Errorable<AudioRecording> = defaultRecording,
    tags: Errorable<Tag>[] = defaultTags,
  ) {
    annotations.forEach((annotation: any) => {
      annotation.audioRecording = UnresolvedModel.one;
    });

    const userResponse = new Subject<typeof user>();
    api.users.show.and.returnValue(userResponse as any);

    const audioRecordingResponse = new Subject<typeof recording>();
    api.recordings.show.and.returnValue(audioRecordingResponse as any);

    const tagResponse = new Subject<typeof tags>();
    api.tags.show.and.returnValue(tagResponse as any);

    const siteResponse = new Subject<typeof site>();
    api.sites.show.and.returnValue(siteResponse as any);

    setLoggedInState(state?.isLoggedIn);
    setAnnotations(annotations);
    spec.detectChanges();

    if (state?.sendInitialRequests) {
      userResponse.next(user);
      audioRecordingResponse.next(recording);
      tagResponse.next(tags);

      spec.detectChanges();
    }

    if (state?.sendSiteRequests) {
      siteResponse.next(site);
      spec.detectChanges();
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

    defaultTags = modelData.randomArray(
      2,
      5,
      () => new Tag(generateTag({ creatorId: defaultUser.id }), injector),
    );

    // the audio events use the "taggings" property for the tag associations
    // therefore, the tagging ids and the tag ids must match
    const audioEventId = modelData.id();
    const taggings = defaultTags.map((tag) =>
      generateTagging({
        audioEventId: audioEventId,
        tagId: tag.id,
        creatorId: defaultUser.id,
      }),
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

    it("should not have external paging", () => {
      setup();
      expect(getTable().externalPaging).toBeFalsy();
    });

    it("should not have external sorting", () => {
      setup();
      expect(getTable().externalSorting).toBeFalsy();
    });

    it("should not have footer", () => {
      setup();
      expect(getTable().footerHeight).toBe(0);
    });
  });

  describe("rows", () => {
    function getCells() {
      return datatableCells(spec);
    }

    function getCellElements() {
      return spec
        .queryAll("datatable-body-cell")
        .map((el) => el.firstElementChild);
    }

    function assertCellLoading(element: Element) {
      const spinner = element.querySelector("baw-loading");
      expect(spinner).toExist();
    }

    function assertCellLoaded(element: Element) {
      const spinner = element.querySelector("baw-loading");
      expect(spinner).not.toExist();
    }

    describe("site", () => {
      const getSiteCell = () => getCells()[0];
      const getSiteCellElement = () => getCellElements()[0];

      it("should not display column if not logged in", () => {
        setup({ isLoggedIn: false, sendInitialRequests: true });
        expect(getSiteCell().column.name).not.toEqual("Site");
      });

      it("should display column if logged in", () => {
        setup({ isLoggedIn: true, sendInitialRequests: true });
        expect(getSiteCell().column.name).toEqual("Site");
      });

      it("should display loading spinner while audio recording unresolved", () => {
        setup({ isLoggedIn: true });
        const cell = getSiteCellElement();
        assertCellLoading(cell);
      });

      it("should display loading spinner while site unresolved", () => {
        setup({ isLoggedIn: true, sendInitialRequests: true });
        assertCellLoading(getSiteCellElement());
      });

      it("should not display loading spinner when site resolved", () => {
        setup({
          isLoggedIn: true,
          sendInitialRequests: true,
          sendSiteRequests: true,
        });
        assertCellLoading(getSiteCellElement());
      });

      it("should display site name when resolved", () => {
        setup({
          isLoggedIn: true,
          sendInitialRequests: true,
          sendSiteRequests: true,
        });
        expect(getSiteCellElement()).toContainText(defaultSite.name);
      });

      it("should display unknown site if unauthorized", () => {
        const site = generateBawApiError();

        setup(
          {
            isLoggedIn: true,
            sendInitialRequests: true,
            sendSiteRequests: true,
          },
          [defaultAnnotation],
          site,
        );

        expect(getSiteCellElement()).toContainText("Unknown Site");
      });
    });

    describe("user name", () => {
      const getUsernameCell = () => getCells()[1];
      const getUsernameCellElement = () => getCellElements()[1];

      it("should not display column if not logged in", () => {
        setup({ isLoggedIn: false, sendInitialRequests: true });
        expect(getUsernameCell().column.name).not.toBe("User");
      });

      it("should display column if logged in", () => {
        setup({ isLoggedIn: true, sendInitialRequests: true });
        expect(getUsernameCell().column.name).toBe("User");
      });

      it("should display loading spinner while user is unresolved", () => {
        setup({ isLoggedIn: true });
        assertCellLoading(getUsernameCellElement());
      });

      it("should not display loading spinner after the user model is resolved", () => {
        setup({
          isLoggedIn: true,
          sendInitialRequests: true,
          sendSiteRequests: true,
        });
        assertCellLoaded(getUsernameCellElement());
      });

      it("should display user name when resolved", () => {
        setup({
          isLoggedIn: true,
          sendInitialRequests: true,
          sendSiteRequests: true,
        });
        expect(getUsernameCellElement()).toContainText(defaultUser.userName);
      });
    });

    describe("tags", () => {
      const getTagsCell = (isLoggedIn: boolean) =>
        getCells()[isLoggedIn ? 2 : 0];
      const getTagsCellElement = (isLoggedIn: boolean) =>
        getCellElements()[isLoggedIn ? 2 : 0];

      it("should display column if not logged in", () => {
        setup({ isLoggedIn: false, sendInitialRequests: true });
        expect(getTagsCell(false).column.name).toBe("Tags");
      });

      it("should display column if logged in", () => {
        setup({ isLoggedIn: true, sendInitialRequests: true });
        expect(getTagsCell(true).column.name).toBe("Tags");
      });

      it("should display loading spinner while tags are unresolved", () => {
        setup({ isLoggedIn: true });
        assertCellLoading(getTagsCellElement(true));
      });

      it("should not display loading spinner after tags resolve", () => {
        setup({
          isLoggedIn: true,
          sendInitialRequests: true,
          sendSiteRequests: true,
        });
        assertCellLoaded(getTagsCellElement(true));
      });

      it("should display (none) text if no tags exist when resolved", () => {
        const annotations = [
          new AudioEvent(generateAudioEvent({ taggings: [] }), injector),
        ];

        setup(
          {
            isLoggedIn: true,
            sendInitialRequests: true,
            sendSiteRequests: true,
          },
          annotations,
          defaultSite,
          defaultUser,
          defaultRecording,
          [],
        );

        expect(getTagsCellElement(true)).toContainText("(none)");
      });

      it("should displays tags when resolved", () => {
        setup({
          isLoggedIn: true,
          sendInitialRequests: true,
          sendSiteRequests: true,
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

      it("should display time since updated when logged in", () => {
        setup({ isLoggedIn: true });
        assertTimestamp(getUpdatedCellElement(true), defaultAnnotation);
      });

      it("should display time since updated when not logged in", () => {
        setup({ isLoggedIn: false });
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
        }logged in`, () => {
          setup({ isLoggedIn });
          expect(getPlayButton(isLoggedIn)).toHaveUrl(
            defaultAnnotation.listenViewUrl,
          );
        });

        it(`should link to annotations page when ${
          isLoggedIn ? "" : "not "
        }logged in`, () => {
          setup({ isLoggedIn });
          expect(getAnnotationButton(isLoggedIn)).toHaveUrl(
            defaultAnnotation.annotationViewUrl,
          );
        });
      });
    });
  });
});

import { Injector } from "@angular/core";
import { RouterTestingModule } from "@angular/router/testing";
import { AccountsService } from "@baw-api/account/accounts.service";
import { isApiErrorDetails } from "@baw-api/api.interceptor.service";
import { AudioRecordingsService } from "@baw-api/audio-recording/audio-recordings.service";
import { MockBawApiModule } from "@baw-api/baw-apiMock.module";
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
import { AudioRecording, IAudioRecording } from "@models/AudioRecording";
import { ISite, Site } from "@models/Site";
import { ITag, Tag } from "@models/Tag";
import { IUser, User } from "@models/User";
import {
  createComponentFactory,
  Spectator,
  SpyObject,
} from "@ngneat/spectator";
import { SharedModule } from "@shared/shared.module";
import {
  DataTableBodyCellComponent,
  DatatableComponent,
} from "@swimlane/ngx-datatable";
import { generateApiErrorDetails } from "@test/fakes/ApiErrorDetails";
import { generateAudioEvent } from "@test/fakes/AudioEvent";
import { generateAudioRecording } from "@test/fakes/AudioRecording";
import { generateSite } from "@test/fakes/Site";
import { generateTag } from "@test/fakes/Tag";
import { generateTagging } from "@test/fakes/Tagging";
import { generateUser } from "@test/fakes/User";
import {
  interceptFilterApiRequest,
  interceptShowApiRequest,
} from "@test/helpers/general";
import { assertUrl } from "@test/helpers/html";
import { RecentAnnotationsComponent } from "./recent-annotations.component";

describe("RecentAnnotationsComponent", () => {
  let api: {
    sites: SpyObject<ShallowSitesService>;
    users: SpyObject<AccountsService>;
    recordings: SpyObject<AudioRecordingsService>;
    tags: SpyObject<TagsService>;
    security: SecurityService;
  };

  let defaultAnnotation: AudioEvent;
  let injector: Injector;
  let spec: Spectator<RecentAnnotationsComponent>;
  const createComponent = createComponentFactory({
    component: RecentAnnotationsComponent,
    imports: [SharedModule, MockBawApiModule, RouterTestingModule],
  });

  function interceptSiteRequest(
    data?: Errorable<Partial<ISite>>
  ): Promise<any> {
    const response = isApiErrorDetails(data) ? data : generateSite(data);
    return interceptShowApiRequest(api.sites, injector, response, Site);
  }

  function interceptUserRequest(
    data?: Errorable<Partial<IUser>>
  ): Promise<any> {
    const response = isApiErrorDetails(data) ? data : generateUser(data);
    return interceptShowApiRequest(api.users, injector, response, User);
  }

  function interceptAudioRecordingsRequest(
    data?: Errorable<Partial<IAudioRecording>>
  ): Promise<any> {
    const response = isApiErrorDetails(data)
      ? data
      : generateAudioRecording(data);
    return interceptShowApiRequest(
      api.recordings,
      injector,
      response,
      AudioRecording
    );
  }

  function interceptTagsRequest(
    data?: Errorable<Partial<ITag>[]>
  ): Promise<any> {
    const response = isApiErrorDetails(data)
      ? data
      : (data ?? []).map((model) => generateTag(model));
    return interceptFilterApiRequest(api.tags, injector, response, Tag);
  }

  function interceptRequests(data?: {
    site?: Errorable<Partial<ISite>>;
    user?: Errorable<Partial<IUser>>;
    recording?: Errorable<Partial<IAudioRecording>>;
    tags?: Errorable<Partial<ITag>[]>;
  }): { initial: Promise<any>; final: Promise<any> } {
    return {
      initial: Promise.all([
        interceptUserRequest(data?.user),
        interceptTagsRequest(data?.tags),
        interceptAudioRecordingsRequest(data?.recording),
      ]),
      final: interceptSiteRequest(data?.site),
    };
  }

  async function setup(data?: {
    annotations?: AudioEvent[];
    awaitInitialRequests?: boolean;
    awaitFinalRequests?: boolean;
    isLoggedIn?: boolean;
    site?: Errorable<Partial<ISite>>;
    user?: Errorable<Partial<IUser>>;
    recording?: Errorable<Partial<IAudioRecording>>;
    tags?: Errorable<Partial<ITag>[]>;
  }) {
    const promise = interceptRequests(data);
    setLoggedInState(data?.isLoggedIn);
    setAnnotations(data?.annotations ?? []);
    spec.detectChanges();

    if (data?.awaitInitialRequests) {
      await promise.initial;
      spec.detectChanges();

      if (data?.awaitFinalRequests) {
        await promise.final;
        spec.detectChanges();
      }
    }
  }

  function setLoggedInState(isLoggedIn: boolean) {
    spyOn(api.security, "isLoggedIn").and.callFake(() => isLoggedIn);
    spec.component.isLoggedIn = isLoggedIn;
  }

  function setAnnotations(annotations: AudioEvent[]) {
    spec.setInput("annotations", annotations);
  }

  beforeEach(() => {
    spec = createComponent({ detectChanges: false });
    injector = spec.inject(Injector);
    api = {
      sites: spec.inject(SHALLOW_SITE.token),
      users: spec.inject(ACCOUNT.token),
      recordings: spec.inject(AUDIO_RECORDING.token),
      tags: spec.inject(TAG.token),
      security: spec.inject(SecurityService),
    };
    defaultAnnotation = new AudioEvent(generateAudioEvent(), injector);
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
    function getCells() {
      return spec.queryAll(DataTableBodyCellComponent);
    }

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
      const getSiteCell = () => getCells()[0];
      const getSiteCellElement = () => getCellElements()[0];

      it("should not display column if not logged in", async () => {
        await setup({
          annotations: [defaultAnnotation],
          isLoggedIn: false,
          awaitInitialRequests: true,
        });
        expect(getSiteCell().column.name).not.toBe("Site");
      });

      it("should display column if logged in", async () => {
        await setup({
          annotations: [defaultAnnotation],
          isLoggedIn: true,
          awaitInitialRequests: true,
        });
        expect(getSiteCell().column.name).toBe("Site");
      });

      it("should display loading spinner while audio recording unresolved", async () => {
        await setup({ annotations: [defaultAnnotation], isLoggedIn: true });
        assertCellLoading(getSiteCellElement(), true);
      });

      it("should display loading spinner while site unresolved", async () => {
        await setup({
          annotations: [defaultAnnotation],
          isLoggedIn: true,
          awaitInitialRequests: true,
        });
        assertCellLoading(getSiteCellElement(), true);
      });

      it("should not display loading spinner when site resolved", async () => {
        await setup({
          annotations: [defaultAnnotation],
          isLoggedIn: true,
          awaitInitialRequests: true,
          awaitFinalRequests: true,
        });
        assertCellLoading(getSiteCellElement(), false);
      });

      it("should display site name when resolved", async () => {
        await setup({
          annotations: [defaultAnnotation],
          isLoggedIn: true,
          awaitInitialRequests: true,
          awaitFinalRequests: true,
          site: { name: "Example Site" },
        });
        expect(getSiteCellElement()).toContainText("Example Site");
      });

      it("should display unknown site if unauthorized", async () => {
        await setup({
          annotations: [defaultAnnotation],
          isLoggedIn: true,
          awaitInitialRequests: true,
          awaitFinalRequests: true,
          site: generateApiErrorDetails(),
        });
        expect(getSiteCellElement()).toContainText("Unknown Site");
      });
    });

    describe("user name", () => {
      const getUsernameCell = () => getCells()[1];
      const getUsernameCellElement = () => getCellElements()[1];

      it("should not display column if not logged in", async () => {
        await setup({
          annotations: [defaultAnnotation],
          isLoggedIn: false,
          awaitInitialRequests: true,
        });
        expect(getUsernameCell().column.name).not.toBe("User");
      });

      it("should display column if logged in", async () => {
        await setup({
          annotations: [defaultAnnotation],
          isLoggedIn: true,
          awaitInitialRequests: true,
        });
        expect(getUsernameCell().column.name).toBe("User");
      });

      it("should display loading spinner while user is unresolved", async () => {
        await setup({ annotations: [defaultAnnotation], isLoggedIn: true });
        assertCellLoading(getUsernameCellElement(), true);
      });

      it("should not display loading spinner when user resolved", async () => {
        await setup({
          annotations: [defaultAnnotation],
          isLoggedIn: true,
          awaitInitialRequests: true,
          awaitFinalRequests: true,
        });
        assertCellLoading(getUsernameCellElement(), false);
      });

      it("should display user name when resolved", async () => {
        await setup({
          annotations: [defaultAnnotation],
          isLoggedIn: true,
          awaitInitialRequests: true,
          awaitFinalRequests: true,
          user: { userName: "Example Username" },
        });
        expect(getUsernameCellElement()).toContainText("Example Username");
      });
    });

    describe("tags", () => {
      const getTagsCell = (isLoggedIn: boolean) =>
        getCells()[isLoggedIn ? 2 : 0];
      const getTagsCellElement = (isLoggedIn: boolean) =>
        getCellElements()[isLoggedIn ? 2 : 0];

      beforeEach(() => {
        // Set a minimum of one tagging for the audio event
        // Otherwise, if there are no tags, the table will skip
        // loading any tags, breaking test assumptions
        defaultAnnotation = new AudioEvent(
          generateAudioEvent({ taggings: [generateTagging()] }),
          injector
        );
      });

      it("should display column if not logged in", async () => {
        await setup({
          annotations: [defaultAnnotation],
          isLoggedIn: false,
          awaitInitialRequests: true,
        });
        expect(getTagsCell(false).column.name).toBe("Tags");
      });

      it("should display column if logged in", async () => {
        await setup({
          annotations: [defaultAnnotation],
          isLoggedIn: true,
          awaitInitialRequests: true,
        });
        expect(getTagsCell(true).column.name).toBe("Tags");
      });

      it("should display loading spinner while tags are unresolved", async () => {
        await setup({
          annotations: [defaultAnnotation],
          isLoggedIn: true,
        });
        assertCellLoading(getTagsCellElement(true), true);
      });

      it("should not display loading spinner when tags resolved", async () => {
        await setup({
          annotations: [defaultAnnotation],
          isLoggedIn: true,
          awaitInitialRequests: true,
          awaitFinalRequests: true,
        });
        assertCellLoading(getTagsCellElement(true), false);
      });

      it("should display (none) text if no tags exist when resolved", async () => {
        await setup({
          annotations: [
            new AudioEvent(generateAudioEvent({ taggings: [] }), injector),
          ],
          isLoggedIn: true,
          awaitInitialRequests: true,
          awaitFinalRequests: true,
          tags: [],
        });

        expect(getTagsCellElement(true)).toContainText("(none)");
      });

      it("should displays tags when resolved", async () => {
        await setup({
          annotations: [defaultAnnotation],
          isLoggedIn: true,
          awaitInitialRequests: true,
          awaitFinalRequests: true,
          tags: [{ text: "Tag 1" }, { text: "Tag 2" }],
        });
        expect(getTagsCellElement(true)).toContainText("Tag 1");
        expect(getTagsCellElement(true)).toContainText("Tag 2");
      });
    });

    describe("updated", () => {
      const getUpdatedCellElement = (isLoggedIn: boolean) =>
        getCellElements()[isLoggedIn ? 3 : 1];

      function assertTimestamp(cell: Element, annotation: AudioEvent) {
        expect(cell).toContainText(annotation.updatedAt.toRelative());
      }

      it("should display time since updated when logged in", async () => {
        await setup({ annotations: [defaultAnnotation], isLoggedIn: true });
        assertTimestamp(getUpdatedCellElement(true), defaultAnnotation);
      });

      it("should display time since updated when not logged in", async () => {
        await setup({ annotations: [defaultAnnotation], isLoggedIn: false });
        assertTimestamp(getUpdatedCellElement(false), defaultAnnotation);
      });
    });

    describe("actions", () => {
      const getActionCellElement = (isLoggedIn: boolean) =>
        getCellElements()[isLoggedIn ? 4 : 2];
      const getPlayButton = (isLoggedIn: boolean) =>
        getActionCellElement(isLoggedIn).querySelector<HTMLElement>("#playBtn");
      const getAnnotationButton = (isLoggedIn: boolean) =>
        getActionCellElement(isLoggedIn).querySelector<HTMLElement>(
          "#annotationBtn"
        );

      [false, true].forEach((isLoggedIn) => {
        it(`should link to listen page when ${
          isLoggedIn ? "" : "not "
        }logged in`, async () => {
          await setup({ annotations: [defaultAnnotation], isLoggedIn });
          assertUrl(getPlayButton(isLoggedIn), defaultAnnotation.listenViewUrl);
        });

        it(`should link to annotations page when ${
          isLoggedIn ? "" : "not "
        }logged in`, async () => {
          await setup({ annotations: [defaultAnnotation], isLoggedIn });
          assertUrl(
            getAnnotationButton(isLoggedIn),
            defaultAnnotation.annotationViewUrl
          );
        });
      });
    });
  });
});

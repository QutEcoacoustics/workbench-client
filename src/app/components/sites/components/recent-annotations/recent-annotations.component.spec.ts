import { Injector } from "@angular/core";
import { RouterTestingModule } from "@angular/router/testing";
import { ShallowAudioEventsService } from "@baw-api/audio-event/audio-events.service";
import { Filters } from "@baw-api/baw-api.service";
import { MockBawApiModule } from "@baw-api/baw-apiMock.module";
import { ACCOUNT, TAG } from "@baw-api/ServiceTokens";
import { Errorable } from "@helpers/advancedTypes";
import { isBawApiError } from "@helpers/custom-errors/baw-api-error";
import { AudioEvent } from "@models/AudioEvent";
import { Site } from "@models/Site";
import { Tag } from "@models/Tag";
import { Tagging } from "@models/Tagging";
import { User } from "@models/User";
import { createComponentFactory, Spectator } from "@ngneat/spectator";
import { SharedModule } from "@shared/shared.module";
import { generateAudioEvent } from "@test/fakes/AudioEvent";
import { generateBawApiError } from "@test/fakes/BawApiError";
import { generateSite } from "@test/fakes/Site";
import { generateTag } from "@test/fakes/Tag";
import { generateTagging } from "@test/fakes/Tagging";
import { generateUser } from "@test/fakes/User";
import { nStepObservable } from "@test/helpers/general";
import { MockProvider } from "ng-mocks";
import { ToastrService } from "ngx-toastr";
import { Subject } from "rxjs";
import { RecentAnnotationsComponent } from "./recent-annotations.component";

describe("RecentAnnotationsComponent", () => {
  let defaultSite: Site;
  let defaultTagging: Tagging;
  let defaultUser: User;
  let defaultTag: Tag;
  let injector: Injector;
  let spec: Spectator<RecentAnnotationsComponent>;
  const createComponent = createComponentFactory({
    component: RecentAnnotationsComponent,
    imports: [MockBawApiModule, SharedModule, RouterTestingModule],
    providers: [
      MockProvider(ToastrService, {
        error: jasmine.createSpy("error").and.stub(),
      }),
    ],
  });

  function getNavLinks() {
    return spec.queryAll(".nav-link");
  }

  function assertNavLink(navLink: Element, text) {
    expect(navLink).toHaveText(text);
  }

  function setAudioEvents(
    audioEvents: Errorable<AudioEvent[]>,
    creator: Errorable<User> = null,
    tag: Errorable<Tag> = null
  ) {
    const subjects = {
      audioEvents: new Subject<AudioEvent[]>(),
      creator: new Subject<User>(),
      tag: new Subject<Tag>(),
    };

    spec
      .inject(ShallowAudioEventsService)
      .filterBySite.and.callFake((filter: Filters<AudioEvent>, site: Site) => {
        expect(filter).toEqual({
          sorting: { orderBy: "updatedAt", direction: "desc" },
        });
        expect(site).toEqual(defaultSite);
        return subjects.audioEvents;
      });
    spec.inject(ACCOUNT.token).show.and.callFake(() => subjects.creator);
    spec.inject(TAG.token).show.and.callFake(() => subjects.tag);

    const promises: {
      events?: Promise<void>;
      creator?: Promise<void>;
      tag?: Promise<void>;
    } = {};

    if (audioEvents) {
      const promise = nStepObservable(
        subjects.audioEvents,
        () => audioEvents,
        isBawApiError(audioEvents),
        Object.keys(promises).length
      );
      promises.events = promise;
    }
    if (creator) {
      const promise = nStepObservable(
        subjects.creator,
        () => creator,
        isBawApiError(creator),
        Object.keys(promises).length
      );
      promises.creator = promise;
    }
    if (tag) {
      const promise = nStepObservable(
        subjects.tag,
        () => tag,
        isBawApiError(tag),
        Object.keys(promises).length
      );
      promises.tag = promise;
    }

    return promises;
  }

  beforeEach(() => {
    defaultSite = new Site(generateSite());

    spec = createComponent({
      detectChanges: false,
      props: { site: defaultSite },
    });

    injector = spec.inject(Injector);
    defaultSite["injector"] = injector;
    defaultTagging = new Tagging(generateTagging(), injector);
    defaultUser = new User(generateUser(), injector);
    defaultTag = new Tag(generateTag(), injector);
  });

  describe("audio events", () => {
    it("should show baw-loader while retrieving audio events", () => {
      setAudioEvents([]);
      spec.detectChanges();
      expect(spec.query("baw-loading#annotation-loader")).toBeTruthy();
    });

    it("should show default message if no audio events", async () => {
      const promises = setAudioEvents([]);
      spec.detectChanges();
      await promises.events;
      spec.detectChanges();
      expect(spec.query("#no-annotations")).toHaveText("No recent annotations");
    });

    it("should send error notification if audio event failure", async () => {
      const promises = setAudioEvents(generateBawApiError(), null, null);
      spec.detectChanges();
      await promises.events;
      spec.detectChanges();
      expect(spec.inject(ToastrService).error).toHaveBeenCalled();
    });
  });

  describe("taggings", () => {
    describe("not tagged", () => {
      it("should show baw-loader while retrieving creator", async () => {
        const audioEvent = new AudioEvent(
          generateAudioEvent({ taggings: [] }),
          injector
        );
        const promises = setAudioEvents([audioEvent]);
        spec.detectChanges();
        await promises.events;
        spec.detectChanges();
        expect(spec.query("baw-loading#tag-loader")).toBeTruthy();
      });

      it("should show (not tagged) with creator userName", async () => {
        const audioEvent = new AudioEvent(
          generateAudioEvent({ taggings: [] }),
          injector
        );
        const promises = setAudioEvents([audioEvent], defaultUser);
        spec.detectChanges();
        await promises.events;
        spec.detectChanges();
        await promises.creator;
        spec.detectChanges();
        assertNavLink(
          getNavLinks()[0],
          `(not tagged) by ${defaultUser.userName}`
        );
      });
    });

    describe("tagged", () => {
      function getTaggings(numTaggings: number) {
        return Array.from(
          { length: numTaggings },
          () => new Tagging(generateTagging(), injector)
        );
      }

      it("should show baw-loader while retrieving tag", async () => {
        const audioEvent = new AudioEvent(
          generateAudioEvent({ taggings: [defaultTagging] }),
          injector
        );
        const promises = setAudioEvents([audioEvent], defaultUser);
        spec.detectChanges();
        await promises.events;
        spec.detectChanges();
        await promises.creator;
        spec.detectChanges();
        expect(spec.query("baw-loading#tag-loader")).toBeTruthy();
      });

      it("should show baw-loader while retrieving creator", async () => {
        const audioEvent = new AudioEvent(
          generateAudioEvent({ taggings: [defaultTagging] }),
          injector
        );
        const promises = setAudioEvents([audioEvent], null, defaultTag);
        spec.detectChanges();
        await promises.events;
        spec.detectChanges();
        await promises.tag;
        spec.detectChanges();
        expect(spec.query("baw-loading#tag-loader")).toBeTruthy();
      });

      it("should show tag text and creator userName", async () => {
        const audioEvent = new AudioEvent(
          generateAudioEvent({ taggings: [defaultTagging] }),
          injector
        );
        const promises = setAudioEvents([audioEvent], defaultUser, defaultTag);
        spec.detectChanges();
        await promises.events;
        spec.detectChanges();
        await promises.creator;
        await promises.tag;
        spec.detectChanges();
        assertNavLink(
          getNavLinks()[0],
          `"${defaultTag.text}" by ${defaultUser.userName}`
        );
      });

      it("should show multiple taggings", async () => {
        const audioEvent1 = new AudioEvent(
          generateAudioEvent({ taggings: getTaggings(3) }),
          injector
        );
        const audioEvent2 = new AudioEvent(
          generateAudioEvent({ taggings: getTaggings(2) }),
          injector
        );
        const promises = setAudioEvents(
          [audioEvent1, audioEvent2],
          defaultUser,
          defaultTag
        );
        spec.detectChanges();
        await promises.events;
        spec.detectChanges();
        await promises.creator;
        await promises.tag;
        spec.detectChanges();

        const navLinks = getNavLinks();
        expect(navLinks).toHaveLength(5);
      });

      it("should limit number of shown tags to around 10", async () => {
        // 6 Tags
        const audioEvent1 = new AudioEvent(
          generateAudioEvent({ taggings: getTaggings(6) }),
          injector
        );
        // 1 Empty tag
        const audioEvent2 = new AudioEvent(
          generateAudioEvent({ taggings: getTaggings(0) }),
          injector
        );
        // 5 Tags
        const audioEvent3 = new AudioEvent(
          generateAudioEvent({ taggings: getTaggings(5) }),
          injector
        );
        // Past the 10 tag limit, should not appear
        const audioEvent4 = new AudioEvent(
          generateAudioEvent({ taggings: getTaggings(5) }),
          injector
        );
        const promises = setAudioEvents(
          [audioEvent1, audioEvent2, audioEvent3, audioEvent4],
          defaultUser,
          defaultTag
        );
        spec.detectChanges();
        await promises.events;
        spec.detectChanges();
        await promises.creator;
        await promises.tag;
        spec.detectChanges();

        const navLinks = getNavLinks();
        expect(navLinks).toHaveLength(12);
      });
    });
  });
});

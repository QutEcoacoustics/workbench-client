import { Injector } from "@angular/core";
import { AccountsService } from "@baw-api/account/accounts.service";
import { AudioRecordingsService } from "@baw-api/audio-recording/audio-recordings.service";
import { ShallowSitesService } from "@baw-api/site/sites.service";
import { TagsService } from "@baw-api/tag/tags.service";
import { IAudioRecording } from "@models/AudioRecording";
import { ISite } from "@models/Site";
import { ITag } from "@models/Tag";
import { IUser } from "@models/User";
import { createComponentFactory, Spectator } from "@ngneat/spectator";
import { SharedModule } from "@shared/shared.module";
import { RecentAnnotationsComponent } from "./recent-annotations.component";

describe("RecentAnnotationsComponent", () => {
  let api: {
    sites: ShallowSitesService;
    users: AccountsService;
    recordings: AudioRecordingsService;
    tags: TagsService;
  };

  let injector: Injector;
  let spec: Spectator<RecentAnnotationsComponent>;
  const createComponent = createComponentFactory({
    component: RecentAnnotationsComponent,
    imports: [SharedModule],
  });

  function interceptRequest() {}

  function interceptSiteRequest() {}

  function interceptUserRequest() {}

  function interceptAudioRecordingsRequest() {}

  function interceptTagsRequest() {}

  function setup(data: {
    site?: Partial<ISite>;
    user?: Partial<IUser>;
    recording?: Partial<IAudioRecording>;
    tags?: Partial<ITag>[];
  }) {}

  beforeEach(() => {
    spec = createComponent({ detectChanges: false });
    injector = spec.inject(Injector);
  });

  describe("table", () => {
    it("should not have external paging", () => {});
    it("should not have external sorting", () => {});
    it("should not have footer", () => {});
  });

  describe("rows", () => {
    describe("site", () => {
      it("should display loading spinner while audio recording unresolved", () => {});
      it("should display loading spinner while site unresolved", () => {});
      it("should display site name when resolved", () => {});
      it("should display unknown site if unauthorized", () => {});
    });

    describe("user name", () => {
      it("should display loading spinner while user is unresolved", () => {});
      it("should display user name when resolved", () => {});
      it("should create link to user page when resolved", () => {});
    });

    describe("tags", () => {
      it("should display loading spinner while tags are unresolved", () => {});
      it("should display (none) text if no tags exist when resolved", () => {});
      it("should displays tags when resolved", () => {});
      it("should display unknown for tags if unauthorized", () => {});
    });

    describe("updated", () => {
      it("should display time since updated", () => {});
    });

    describe("actions", () => {
      it("should link to listen page", () => {});
      it("should link to annotations page", () => {});
    });
  });
});

import { RouterTestingModule } from "@angular/router/testing";
import { MockBawApiModule } from "@baw-api/baw-apiMock.module";
import { DirectivesModule } from "@directives/directives.module";
import { AuthenticatedImageModule } from "@directives/image/image.module";
import { ImageSizes } from "@interfaces/apiInterfaces";
import { UnresolvedModel } from "@models/AbstractModel";
import { User } from "@models/User";
import { createComponentFactory, Spectator } from "@ngneat/spectator";
import { PipesModule } from "@pipes/pipes.module";
import { assetRoot } from "@services/config/config.service";
import { LoadingModule } from "@shared/loading/loading.module";
import { generateUser } from "@test/fakes/User";
import { assertImage, assertUrl, assertSpinner } from "@test/helpers/html";
import { websiteHttpUrl } from "@test/helpers/url";
import { DateTime } from "luxon";
import { UserBadgeComponent } from "./user-badge.component";

// TODO Update to validate multiple user badges
describe("UserBadgeComponent", () => {
  let spec: Spectator<UserBadgeComponent>;
  const createComponent = createComponentFactory({
    component: UserBadgeComponent,
    imports: [
      RouterTestingModule,
      AuthenticatedImageModule,
      DirectivesModule,
      MockBawApiModule,
      LoadingModule,
      PipesModule,
    ],
  });

  const getGhostUsername = (_spec?: Spectator<any>) =>
    (spec ?? _spec).query<HTMLAnchorElement>("#ghost-username");
  const getUsername = (_spec?: Spectator<any>) =>
    (spec ?? _spec).query<HTMLAnchorElement>("#username");
  const getImageWrapper = (_spec?: Spectator<any>) =>
    (spec ?? _spec).query<HTMLAnchorElement>("#imageLink");
  const getImage = (_spec?: Spectator<any>) =>
    (spec ?? _spec).query<HTMLImageElement>("img");
  const getTimespan = (_spec?: Spectator<any>) =>
    (spec ?? _spec).query<HTMLParagraphElement>("#lengthOfTime small");

  function setup(props?: Partial<UserBadgeComponent>) {
    spec = createComponent({
      props: {
        label: "label",
        users: [new User(generateUser())],
        timestamp: DateTime.utc(),
        ...props,
      },
    });
  }

  it("should create", () => {
    setup();
    spec.detectChanges();
    expect(spec.component).toBeTruthy();
  });

  describe("loading", () => {
    it("should display spinner when user is unresolved", () => {
      setup({ users: [UnresolvedModel.one as any] });
      spec.detectChanges();
      assertSpinner(spec.fixture, true);
    });

    it("should not display spinner when user is resolved", () => {
      setup({ users: [new User(generateUser())] });
      spec.detectChanges();
      assertSpinner(spec.fixture, false);
    });
  });

  describe("ghost users", () => {
    it("should display username", () => {
      const user = User.deletedUser;
      setup({ users: [user] });
      spec.detectChanges();
      expect(getGhostUsername().innerHTML.trim()).toBe(user.userName);
    });

    it("should display image", () => {
      const user = User.deletedUser;
      setup({ users: [user] });
      spec.detectChanges();
      assertImage(
        getImage(),
        `${websiteHttpUrl}${assetRoot}/images/user/user_span4.png`,
        user.userName + " profile picture"
      );
    });
  });

  describe("single user", () => {
    it("should display username", () => {
      const user = new User(generateUser());
      setup({ users: [user] });
      spec.detectChanges();
      expect(getUsername().innerHTML.trim()).toBe(user.userName);
    });

    it("username should route to user page", () => {
      const user = new User(generateUser());
      setup({ users: [user] });
      spec.detectChanges();
      assertUrl(getUsername(), user.viewUrl);
    });

    it("should display default image", () => {
      const user = new User({
        ...generateUser(),
        userName: "custom username",
        imageUrls: undefined,
      });
      setup({ users: [user] });
      spec.detectChanges();
      assertImage(
        getImage(),
        `${websiteHttpUrl}${assetRoot}/images/user/user_span4.png`,
        "custom username profile picture"
      );
    });

    it("should display custom image", () => {
      const imageIndex = 1;
      const user = new User({ ...generateUser(), userName: "custom username" });
      user.image[imageIndex].size = ImageSizes.small;
      setup({ users: [user] });
      spec.detectChanges();
      assertImage(
        getImage(),
        user.image[imageIndex].url,
        "custom username profile picture"
      );
    });

    it("image should route to user page", () => {
      const user = new User(generateUser());
      setup({ users: [user] });
      spec.detectChanges();
      assertUrl(getImageWrapper(), user.viewUrl);
    });

    it("should not display undefined timestamp", () => {
      setup({ timestamp: undefined });
      spec.detectChanges();
      expect(getTimespan()).toBeFalsy();
    });

    it("should display length of time calculated from timestamp", () => {
      const date = DateTime.utc();
      setup({ timestamp: date });
      spec.detectChanges();
      expect(getTimespan().innerText.trim()).toBe(date.toRelative());
    });
  });

  it("should detect changes to user", () => {
    const user = new User(generateUser());
    setup({ users: [UnresolvedModel.one as any] });
    spec.detectChanges();
    spec.setInput("users", [user]);
    spec.detectChanges();

    const username = getUsername(spec);
    expect(username).toBeTruthy();
    expect(username.innerHTML.trim()).toBe(user.userName);
  });
});

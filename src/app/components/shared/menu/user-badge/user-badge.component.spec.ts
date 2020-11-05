import { RouterTestingModule } from "@angular/router/testing";
import { MockBawApiModule } from "@baw-api/baw-apiMock.module";
import { AuthenticatedImageModule } from "@directives/image/image.module";
import { ImageSizes } from "@interfaces/apiInterfaces";
import { UnresolvedModel } from "@models/AbstractModel";
import { User } from "@models/User";
import { createComponentFactory, Spectator } from "@ngneat/spectator";
import { PipesModule } from "@pipes/pipes.module";
import { assetRoot } from "@services/app-config/app-config.service";
import { LoadingModule } from "@shared/loading/loading.module";
import { generateUser } from "@test/fakes/User";
import { assertImage, assertRoute, assertSpinner } from "@test/helpers/html";
import { websiteHttpUrl } from "@test/helpers/url";
import { DateTime } from "luxon";
import { UserBadgeComponent } from "./user-badge.component";

describe("UserBadgeComponent", () => {
  let spec: Spectator<UserBadgeComponent>;
  const createComponent = createComponentFactory({
    component: UserBadgeComponent,
    imports: [
      RouterTestingModule,
      AuthenticatedImageModule,
      MockBawApiModule,
      LoadingModule,
      PipesModule,
    ],
  });

  const getLabel = (_spec?: Spectator<any>) =>
    (spec ?? _spec).query<HTMLHeadingElement>("#label");
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
        user: new User(generateUser()),
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

  it("should display label", () => {
    setup({ label: "custom label" });
    spec.detectChanges();
    expect(getLabel().innerText.trim()).toBe("custom label");
  });

  describe("loading", () => {
    it("should display spinner when user is unresolved", () => {
      setup({ user: UnresolvedModel.one as any });
      spec.detectChanges();
      assertSpinner(spec.fixture, true);
    });

    it("should not display spinner when user is resolved", () => {
      setup({ user: new User(generateUser()) });
      spec.detectChanges();
      assertSpinner(spec.fixture, false);
    });
  });

  describe("ghost users", () => {
    it("should display username", () => {
      const user = User.deletedUser;
      setup({ user });
      spec.detectChanges();
      expect(getGhostUsername().innerHTML.trim()).toBe(user.userName);
    });

    it("should display image", () => {
      const user = User.deletedUser;
      setup({ user });
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
      setup({ user });
      spec.detectChanges();
      expect(getUsername().innerHTML.trim()).toBe(user.userName);
    });

    it("username should route to user page", () => {
      const user = new User(generateUser());
      setup({ user });
      spec.detectChanges();
      assertRoute(getUsername(), user.viewUrl);
    });

    it("should display default image", () => {
      const user = new User({
        ...generateUser(),
        userName: "custom username",
        imageUrls: undefined,
      });
      setup({ user });
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
      user.image[imageIndex].size = ImageSizes.SMALL;
      setup({ user });
      spec.detectChanges();
      assertImage(
        getImage(),
        user.image[imageIndex].url,
        "custom username profile picture"
      );
    });

    it("image should route to user page", () => {
      const user = new User(generateUser());
      setup({ user });
      spec.detectChanges();
      assertRoute(getImageWrapper(), user.viewUrl);
    });

    it("should not display undefined timestamp", () => {
      setup({ timestamp: undefined });
      spec.detectChanges();
      expect(getTimespan()).toBeFalsy();
    });

    it("should display length of time calculated from timestamp", () => {
      setup({ timestamp: DateTime.utc() });
      spec.detectChanges();
      expect(getTimespan().innerText.trim()).toBe("in 0 seconds");
    });
  });

  it("should detect changes to user", () => {
    const user = new User(generateUser());
    setup({ user: UnresolvedModel.one as any });
    spec.detectChanges();
    spec.setInput("user", user);
    spec.detectChanges();

    const username = getUsername(spec);
    expect(username).toBeTruthy();
    expect(username.innerHTML.trim()).toBe(user.userName);
  });
});

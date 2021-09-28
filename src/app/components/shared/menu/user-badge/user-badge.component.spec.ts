import { RouterTestingModule } from "@angular/router/testing";
import { MockBawApiModule } from "@baw-api/baw-apiMock.module";
import { DirectivesModule } from "@directives/directives.module";
import { AuthenticatedImageModule } from "@directives/image/image.module";
import { UnresolvedModel } from "@models/AbstractModel";
import { User } from "@models/User";
import { createComponentFactory, Spectator } from "@ngneat/spectator";
import { PipesModule } from "@pipes/pipes.module";
import { assetRoot } from "@services/config/config.service";
import { LoadingComponent } from "@shared/loading/loading.component";
import { LoadingModule } from "@shared/loading/loading.module";
import { generateUser } from "@test/fakes/User";
import { assertImage, assertUrl } from "@test/helpers/html";
import { websiteHttpUrl } from "@test/helpers/url";
import { DateTime } from "luxon";
import { UserBadgeComponent } from "./user-badge.component";

describe("UserBadgeComponent", () => {
  let spec: Spectator<UserBadgeComponent>;
  let defaultUser: User;
  let unresolvedUser: User;
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
    (spec ?? _spec).queryAll<HTMLAnchorElement>("#ghost-username");
  const getUsername = (_spec?: Spectator<any>) =>
    (spec ?? _spec).queryAll<HTMLAnchorElement>("#username");
  const getImageWrapper = (_spec?: Spectator<any>) =>
    (spec ?? _spec).queryAll<HTMLAnchorElement>("#imageLink");
  const getImage = (_spec?: Spectator<any>) =>
    (spec ?? _spec).queryAll<HTMLImageElement>("img");
  const getTimespan = (_spec?: Spectator<any>) =>
    (spec ?? _spec).queryAll<HTMLParagraphElement>("#lengthOfTime small");

  function setup(props?: Partial<UserBadgeComponent>) {
    spec = createComponent({
      props: {
        label: "label",
        users: [defaultUser],
        timestamp: DateTime.utc(),
        ...props,
      },
    });
  }

  beforeEach(() => {
    defaultUser = new User(generateUser());
    unresolvedUser = UnresolvedModel.one as any;
  });

  it("should create", () => {
    setup();
    spec.detectChanges();
    expect(spec.component).toBeTruthy();
  });

  describe("loading", () => {
    function getSpinner() {
      return spec.queryAll(LoadingComponent);
    }

    it("should display spinner when user is unresolved", () => {
      setup({ users: [unresolvedUser] });
      spec.detectChanges();
      expect(getSpinner().length).toBe(1);
    });

    it("should not display spinner when user is resolved", () => {
      setup({ users: [defaultUser] });
      spec.detectChanges();
      expect(getSpinner().length).toBe(0);
    });

    it("should display spinners for each user", () => {
      setup({ users: [unresolvedUser, unresolvedUser] });
      spec.detectChanges();
      expect(getSpinner().length).toBe(2);
    });

    it("should only display spinners for each unresolved user", () => {
      setup({ users: [defaultUser, unresolvedUser, unresolvedUser] });
      spec.detectChanges();
      expect(getSpinner().length).toBe(2);
    });
  });

  describe("ghost users", () => {
    it("should display username", () => {
      const user = User.deletedUser;
      setup({ users: [user] });
      spec.detectChanges();
      expect(getGhostUsername()[0]).toHaveText(user.userName);
    });

    it("should display image", () => {
      const user = User.deletedUser;
      setup({ users: [user] });
      spec.detectChanges();
      assertImage(
        getImage()[0],
        `${websiteHttpUrl}${assetRoot}/images/user/user_span4.png`,
        user.userName + " profile picture"
      );
    });
  });

  describe("single user", () => {
    it("should display username", () => {
      setup({ users: [defaultUser] });
      spec.detectChanges();
      expect(getUsername()[0]).toHaveText(defaultUser.userName);
    });

    it("username should route to user page", () => {
      setup({ users: [defaultUser] });
      spec.detectChanges();
      assertUrl(getUsername()[0], defaultUser.viewUrl);
    });

    it("should display default image", () => {
      const user = new User(
        generateUser({ userName: "custom username", imageUrls: undefined })
      );
      setup({ users: [user] });
      spec.detectChanges();
      assertImage(
        getImage()[0],
        `${websiteHttpUrl}${assetRoot}/images/user/user_span4.png`,
        "custom username profile picture"
      );
    });

    it("should display custom image", () => {
      const user = new User(generateUser({ userName: "custom username" }));
      setup({ users: [user] });
      spec.detectChanges();
      assertImage(
        getImage()[0],
        user.image[0].url,
        "custom username profile picture"
      );
    });

    it("image should route to user page", () => {
      setup({ users: [defaultUser] });
      spec.detectChanges();
      assertUrl(getImageWrapper()[0], defaultUser.viewUrl);
    });

    it("should not display undefined timestamp", () => {
      setup({ timestamp: undefined });
      spec.detectChanges();
      expect(getTimespan()[0]).toBeFalsy();
    });

    it("should display length of time calculated from timestamp", () => {
      const date = DateTime.utc();
      setup({ timestamp: date });
      spec.detectChanges();
      expect(getTimespan()[0]).toHaveText(date.toRelative());
    });
  });

  describe("multiple users", () => {
    it("should display username of each user", () => {
      const userA = new User(generateUser());
      const userB = new User(generateUser());
      setup({ users: [userA, userB] });
      spec.detectChanges();
      expect(getUsername()[0]).toHaveText(userA.userName);
      expect(getUsername()[1]).toHaveText(userB.userName);
    });
  });

  it("should detect changes to user", () => {
    const user = new User(generateUser());
    setup({ users: [unresolvedUser] });
    spec.detectChanges();
    spec.setInput("users", [user]);
    spec.detectChanges();

    const username = getUsername(spec)[0];
    expect(username).toHaveText(user.userName);
  });
});

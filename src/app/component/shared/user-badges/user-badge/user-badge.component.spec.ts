import { HttpClientTestingModule } from "@angular/common/http/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { AuthenticatedImageModule } from "@directives/image/image.module";
import { ImageSizes } from "@interfaces/apiInterfaces";
import { createComponentFactory, Spectator } from "@ngneat/spectator";
import { LoadingModule } from "@shared/loading/loading.module";
import { generateUser } from "@test/fakes/User";
import { assertImage, assertRoute, assertSpinner } from "@test/helpers/html";
import { testBawServices } from "@test/helpers/testbed";
import { List } from "immutable";
import { User } from "src/app/models/User";
import { UserBadgeComponent } from "./user-badge.component";

describe("UserBadgeComponent", () => {
  let spectator: Spectator<UserBadgeComponent>;
  const createComponent = createComponentFactory({
    component: UserBadgeComponent,
    imports: [
      RouterTestingModule,
      HttpClientTestingModule,
      AuthenticatedImageModule,
      LoadingModule,
    ],
    providers: testBawServices,
  });

  const getLabels = (spec?: Spectator<any>) =>
    (spec ?? spectator).queryAll<HTMLHeadingElement>("#label");
  const getGhostUsers = (spec?: Spectator<any>) =>
    (spec ?? spectator).queryAll<HTMLParagraphElement>("#notFound");
  const getUsernames = (spec?: Spectator<any>) =>
    (spec ?? spectator).queryAll<HTMLAnchorElement>("#username");
  const getImageWrappers = (spec?: Spectator<any>) =>
    (spec ?? spectator).queryAll<HTMLAnchorElement>("#imageLink");
  const getImages = (spec?: Spectator<any>) =>
    (spec ?? spectator).queryAll<HTMLImageElement>("#imageLink img");
  const getTimespans = (spec?: Spectator<any>) =>
    (spec ?? spectator).queryAll<HTMLParagraphElement>("#lengthOfTime");

  function detectChanges() {
    spectator.component.ngOnChanges();
  }

  beforeEach(() => (spectator = createComponent({ detectChanges: false })));

  it("should create", () => {
    spectator.setInput("label", "label");
    detectChanges();
    expect(spectator.component).toBeTruthy();
  });

  it("should display label", () => {
    spectator.setInput("label", "custom label");
    detectChanges();
    expect(getLabels()[0].innerText.trim()).toBe("custom label");
  });

  describe("loading", () => {
    it("should display loading spinner when loading is true", () => {
      spectator.setInput("label", "label");
      spectator.setInput("loading", true);
      detectChanges();

      assertSpinner(spectator.fixture, true);
      expect(getGhostUsers().length).toBe(0);
    });

    it("should not display loading spinner when loading is false", () => {
      spectator.setInput("label", "label");
      spectator.setInput("loading", false);
      detectChanges();

      assertSpinner(spectator.fixture, false);
      expect(getGhostUsers().length).toBe(1);
    });
  });

  describe("ghost users", () => {
    it("should show user not found", () => {
      spectator.setInput("label", "label");
      detectChanges();
      expect(getGhostUsers()[0].innerText.trim()).toBe("User not found");
    });

    it("should show user not found when users list is empty", () => {
      spectator.setInput("label", "label");
      spectator.setInput("users", List([]));
      detectChanges();
      expect(getGhostUsers()[0].innerText.trim()).toBe("User not found");
    });
  });

  describe("single user", () => {
    it("should display username", () => {
      const user = new User(generateUser());
      spectator.setInput("label", "label");
      spectator.setInput("users", List([user]));
      detectChanges();
      expect(getUsernames()[0].innerHTML.trim()).toBe(user.userName);
    });

    it("username should route to user page", () => {
      const user = new User(generateUser());
      spectator.setInput("label", "label");
      spectator.setInput("users", List([user]));
      detectChanges();
      assertRoute(getUsernames()[0], user.viewUrl);
    });

    it("should display default image", () => {
      const user = new User({
        ...generateUser(),
        userName: "custom username",
        imageUrls: undefined,
      });
      spectator.setInput("label", "label");
      spectator.setInput("users", List([user]));
      detectChanges();
      assertImage(
        getImages()[0],
        `http://${window.location.host}/assets/images/user/user_span4.png`,
        "custom username profile picture"
      );
    });

    it("should display custom image", () => {
      const imageIndex = 1;
      const user = new User({ ...generateUser(), userName: "custom username" });
      user.image[imageIndex].size = ImageSizes.SMALL;
      spectator.setInput("label", "label");
      spectator.setInput("users", List([user]));
      detectChanges();
      assertImage(
        getImages()[0],
        user.image[imageIndex].url,
        "custom username profile picture"
      );
    });

    it("image should route to user page", () => {
      const user = new User(generateUser());
      spectator.setInput("label", "label");
      spectator.setInput("users", List([user]));
      detectChanges();
      assertRoute(getImageWrappers()[0], user.viewUrl);
    });

    it("should handle missing length of time", () => {
      spectator.setInput("label", "label");
      spectator.setInput("users", List([new User(generateUser())]));
      detectChanges();
      expect(getTimespans()[0]).toBeFalsy();
    });

    it("should display length of time", () => {
      spectator.setInput("label", "label");
      spectator.setInput("users", List([new User(generateUser())]));
      spectator.setInput("lengthOfTime", "5 years ago");
      detectChanges();
      expect(getTimespans()[0].innerText.trim()).toBe("5 years ago");
    });
  });

  it("should display multiple users", () => {
    const users = [new User(generateUser()), new User(generateUser())];
    spectator.setInput("label", "label");
    spectator.setInput("users", List(users));
    detectChanges();

    const usernames = getUsernames();
    expect(usernames.length).toBe(2);
    expect(usernames[0].innerHTML.trim()).toBe(users[0].userName);
    expect(usernames[1].innerHTML.trim()).toBe(users[1].userName);
  });

  it("should detect changes list of users", () => {
    const users = [new User(generateUser()), new User(generateUser())];
    spectator.setInput("label", "label");
    spectator.setInput("users", List([]));
    detectChanges();
    spectator.setInput("users", List(users));
    detectChanges();

    const usernames = getUsernames(spectator);
    expect(usernames.length).toBe(2);
    expect(usernames[0].innerHTML.trim()).toBe(users[0].userName);
    expect(usernames[1].innerHTML.trim()).toBe(users[1].userName);
  });
});

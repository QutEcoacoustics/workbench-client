import { Component, Input, SimpleChange } from "@angular/core";
import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { assertImage, assertRoute } from "@test/helpers/html";
import { List } from "immutable";
import { User } from "src/app/models/User";
import { UserBadgeComponent } from "./user-badge.component";

@Component({
  template: `
    <app-user-badge
      [label]="label"
      [users]="users"
      [lengthOfTime]="lengthOfTime"
    ></app-user-badge>
  `,
})
class TestUserBadgeComponent {
  label: string;
  users: List<User>;
  lengthOfTime: string;

  updateComponent(label: string, lengthOfTime: string, users: List<User>) {
    this.label = label;
    this.users = users;
    this.lengthOfTime = lengthOfTime;
  }
}

describe("UserBadgeComponent", () => {
  let component: UserBadgeComponent;
  let fixture: ComponentFixture<UserBadgeComponent>;
  let defaultUser: User;
  const defaultImageSrc = `http://${window.location.host}/assets/images/user/user_span1.png`;

  const getLabels = (fix?: ComponentFixture<any>) =>
    (fix || fixture).nativeElement.querySelectorAll("#label");
  const getGhostUsers = (fix?: ComponentFixture<any>) =>
    (fix || fixture).nativeElement.querySelectorAll("#notFound");
  const getUsernames = (fix?: ComponentFixture<any>) =>
    (fix || fixture).nativeElement.querySelectorAll("#username");
  const getImageWrappers = (fix?: ComponentFixture<any>) =>
    (fix || fixture).nativeElement.querySelectorAll("#imageLink");
  const getImages = (fix?: ComponentFixture<any>) =>
    (fix || fixture).nativeElement.querySelectorAll("#imageLink img");
  const getTimespans = (fix?: ComponentFixture<any>) =>
    (fix || fixture).nativeElement.querySelectorAll("#lengthOfTime");

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [UserBadgeComponent, TestUserBadgeComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserBadgeComponent);
    component = fixture.componentInstance;

    defaultUser = new User({
      id: 1,
      userName: "username",
      rolesMask: 2,
      rolesMaskNames: ["user"],
      lastSeenAt: "2019-12-18T11:16:08.233+10:00",
    });
  });

  it("should create", () => {
    component.label = "custom label";
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it("should display label", () => {
    component.label = "custom label";
    fixture.detectChanges();
    expect(getLabels()[0].innerText.trim()).toBe("custom label");
  });

  describe("ghost users", () => {
    it("should show user not found", () => {
      component.label = "custom label";
      fixture.detectChanges();
      expect(getGhostUsers()[0].innerText.trim()).toBe("User not found");
    });

    it("should show user not found when users list is empty", () => {
      component.label = "custom label";
      component.users = List([]);
      fixture.detectChanges();
      expect(getGhostUsers()[0].innerText.trim()).toBe("User not found");
    });
  });

  describe("single user", () => {
    it("should display username", () => {
      component.label = "custom label";
      component.users = List<User>([
        new User({ ...defaultUser, userName: "custom username" }),
      ]);
      fixture.detectChanges();
      expect(getUsernames()[0].innerHTML.trim()).toBe("custom username");
    });

    it("username should route to user page", () => {
      component.label = "custom label";
      component.users = List<User>([
        new User({ ...defaultUser, userName: "custom username" }),
      ]);
      fixture.detectChanges();
      assertRoute(getUsernames()[0], "/user_accounts/1");
    });

    it("should display image", () => {
      component.label = "custom label";
      component.users = List<User>([
        new User({ ...defaultUser, userName: "custom username" }),
      ]);
      fixture.detectChanges();
      assertImage(
        getImages()[0],
        defaultImageSrc,
        "custom username profile picture"
      );
    });

    it("image should route to user page", () => {
      component.label = "custom label";
      component.users = List<User>([defaultUser]);
      fixture.detectChanges();
      assertRoute(getImageWrappers()[0], "/user_accounts/1");
    });

    it("should handle missing length of time", () => {
      component.label = "custom label";
      component.users = List<User>([defaultUser]);
      fixture.detectChanges();
      expect(getTimespans()[0]).toBeFalsy();
    });

    it("should display length of time", () => {
      component.label = "custom label";
      component.users = List<User>([defaultUser]);
      component.lengthOfTime = "5 years ago";
      fixture.detectChanges();
      expect(getTimespans()[0].innerText.trim()).toBe("5 years ago");
    });
  });

  it("should display multiple users", () => {
    component.label = "custom label";
    component.users = List<User>([
      new User({ ...defaultUser, id: 1, userName: "custom username 1" }),
      new User({ ...defaultUser, id: 2, userName: "custom username 2" }),
    ]);
    fixture.detectChanges();

    const usernames = getUsernames();
    expect(usernames.length).toBe(2);
    expect(usernames[0].innerHTML.trim()).toBe("custom username 1");
    expect(usernames[1].innerHTML.trim()).toBe("custom username 2");
  });

  describe("change detection", () => {
    let parentFixture: ComponentFixture<TestUserBadgeComponent>;
    let parentComponent: TestUserBadgeComponent;

    beforeEach(() => {
      parentFixture = TestBed.createComponent(TestUserBadgeComponent);
      parentComponent = parentFixture.componentInstance;
    });

    it("should detect changes", () => {
      parentComponent.updateComponent(
        "custom label",
        "5 years ago",
        List<User>([])
      );
      parentFixture.detectChanges();

      parentComponent.updateComponent(
        "custom label",
        "5 years ago",
        List<User>([
          new User({ ...defaultUser, id: 1, userName: "custom username 1" }),
          new User({ ...defaultUser, id: 2, userName: "custom username 2" }),
        ])
      );
      parentFixture.detectChanges();

      const usernames = getUsernames(parentFixture);
      expect(usernames.length).toBe(2);
      expect(usernames[0].innerHTML.trim()).toBe("custom username 1");
      expect(usernames[1].innerHTML.trim()).toBe("custom username 2");
    });
  });
});

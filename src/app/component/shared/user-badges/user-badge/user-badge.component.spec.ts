import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { List } from "immutable";
import { User } from "src/app/models/User";
import { UserBadgeComponent } from "./user-badge.component";

describe("UserBadgeComponent", () => {
  let component: UserBadgeComponent;
  let fixture: ComponentFixture<UserBadgeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [UserBadgeComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserBadgeComponent);
    component = fixture.componentInstance;
  });

  it("should create", () => {
    component.label = "custom label";
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it("should display label", () => {
    component.label = "custom label";
    fixture.detectChanges();

    const label = fixture.debugElement.nativeElement.querySelector("#label");
    expect(label).toBeTruthy();
    expect(label.innerText.trim()).toBe("custom label");
  });

  it("should show user not found when users not provided", () => {
    component.label = "custom label";
    fixture.detectChanges();

    const notFound = fixture.debugElement.nativeElement.querySelector(
      "#notFound"
    );
    expect(notFound).toBeTruthy();
    expect(notFound.innerText.trim()).toBe("User not found");
  });

  it("should show user not found when users list is empty", () => {
    component.label = "custom label";
    component.users = List([]);
    fixture.detectChanges();

    const notFound = fixture.debugElement.nativeElement.querySelector(
      "#notFound"
    );
    expect(notFound).toBeTruthy();
    expect(notFound.innerText.trim()).toBe("User not found");
  });

  it("should display single user username", () => {
    component.label = "custom label";
    component.users = List<User>([
      new User({
        id: 1,
        userName: "custom username",
        rolesMask: 2,
        rolesMaskNames: ["user"],
        lastSeenAt: "2019-12-18T11:16:08.233+10:00"
      })
    ]);
    fixture.detectChanges();

    const username = fixture.debugElement.nativeElement.querySelector(
      "#username"
    );
    expect(username).toBeTruthy("Username field should exist");
    expect(username.innerHTML.trim()).toBe("custom username");
    expect(
      username.attributes.getNamedItem("ng-reflect-router-link")
    ).toBeTruthy("Username should contain routerLink");
    expect(
      username.attributes.getNamedItem("ng-reflect-router-link").value
    ).toBe("/user_accounts/1");
  });

  it("should display single user image", () => {
    component.label = "custom label";
    component.users = List<User>([
      new User({
        id: 1,
        userName: "custom username",
        rolesMask: 2,
        rolesMaskNames: ["user"],
        lastSeenAt: "2019-12-18T11:16:08.233+10:00"
      })
    ]);
    fixture.detectChanges();

    const imageLink = fixture.debugElement.nativeElement.querySelector(
      "#imageLink"
    );
    const image = imageLink.querySelector("img");

    expect(imageLink).toBeTruthy();
    expect(
      imageLink.attributes.getNamedItem("ng-reflect-router-link")
    ).toBeTruthy("Image link should contain routerLink");
    expect(
      imageLink.attributes.getNamedItem("ng-reflect-router-link").value
    ).toBe("/user_accounts/1");
    expect(image).toBeTruthy();
    expect(image.src).toBe(
      `http://${window.location.host}/assets/images/user/user_span4.png`
    );
    expect(image.alt).toBe("custom username profile picture");
  });

  it("should handle single user no length of time", () => {
    component.label = "custom label";
    component.users = List<User>([
      new User({
        id: 1,
        userName: "custom username",
        rolesMask: 2,
        rolesMaskNames: ["user"],
        lastSeenAt: "2019-12-18T11:16:08.233+10:00"
      })
    ]);
    fixture.detectChanges();

    const lengthOfTime = fixture.debugElement.nativeElement.querySelector(
      "#lengthOfTime"
    );
    expect(lengthOfTime).toBeFalsy();
  });

  it("should display single user length of time", () => {
    component.label = "custom label";
    component.users = List<User>([
      new User({
        id: 1,
        userName: "custom username",
        rolesMask: 2,
        rolesMaskNames: ["user"],
        lastSeenAt: "2019-12-18T11:16:08.233+10:00"
      })
    ]);
    component.lengthOfTime = "5 years ago";
    fixture.detectChanges();

    const lengthOfTime = fixture.debugElement.nativeElement.querySelector(
      "#lengthOfTime"
    );
    expect(lengthOfTime).toBeTruthy();
    expect(lengthOfTime.innerText.trim()).toBe("5 years ago");
  });

  // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  it("should display multiple users username", () => {
    component.label = "custom label";
    component.users = List<User>([
      new User({
        id: 1,
        userName: "custom username 1",
        rolesMask: 2,
        rolesMaskNames: ["user"],
        lastSeenAt: "2019-12-18T11:16:08.233+10:00"
      }),
      new User({
        id: 2,
        userName: "custom username 2",
        rolesMask: 2,
        rolesMaskNames: ["user"],
        lastSeenAt: "2019-12-18T11:16:08.233+10:00"
      })
    ]);
    fixture.detectChanges();

    const usernames = fixture.debugElement.nativeElement.querySelectorAll(
      "#username"
    );
    expect(usernames).toBeTruthy("Username fields should exist");
    expect(usernames.length).toBe(2);
    expect(usernames[0].innerHTML.trim()).toBe("custom username 1");
    expect(
      usernames[0].attributes.getNamedItem("ng-reflect-router-link")
    ).toBeTruthy("Username should contain routerLink");
    expect(
      usernames[0].attributes.getNamedItem("ng-reflect-router-link").value
    ).toBe("/user_accounts/1");
    expect(usernames[1].innerHTML.trim()).toBe("custom username 2");
    expect(
      usernames[1].attributes.getNamedItem("ng-reflect-router-link")
    ).toBeTruthy("Username should contain routerLink");
    expect(
      usernames[1].attributes.getNamedItem("ng-reflect-router-link").value
    ).toBe("/user_accounts/2");
  });

  it("should display multiple user images", () => {
    component.label = "custom label";
    component.users = List<User>([
      new User({
        id: 1,
        userName: "custom username 1",
        rolesMask: 2,
        rolesMaskNames: ["user"],
        lastSeenAt: "2019-12-18T11:16:08.233+10:00"
      }),
      new User({
        id: 2,
        userName: "custom username 2",
        rolesMask: 2,
        rolesMaskNames: ["user"],
        lastSeenAt: "2019-12-18T11:16:08.233+10:00"
      })
    ]);
    fixture.detectChanges();

    const imageLinks = fixture.debugElement.nativeElement.querySelectorAll(
      "#imageLink"
    );
    expect(imageLinks).toBeTruthy();
    expect(imageLinks.length).toBe(2);

    let image = imageLinks[0].querySelector("img");

    expect(
      imageLinks[0].attributes.getNamedItem("ng-reflect-router-link")
    ).toBeTruthy("Image link should contain routerLink");
    expect(
      imageLinks[0].attributes.getNamedItem("ng-reflect-router-link").value
    ).toBe("/user_accounts/1");
    expect(image).toBeTruthy();
    expect(image.src).toBe(
      `http://${window.location.host}/assets/images/user/user_span4.png`
    );
    expect(image.alt).toBe("custom username 1 profile picture");

    image = imageLinks[1].querySelector("img");

    expect(
      imageLinks[1].attributes.getNamedItem("ng-reflect-router-link")
    ).toBeTruthy("Image link should contain routerLink");
    expect(
      imageLinks[1].attributes.getNamedItem("ng-reflect-router-link").value
    ).toBe("/user_accounts/2");
    expect(image).toBeTruthy();
    expect(image.src).toBe(
      `http://${window.location.host}/assets/images/user/user_span4.png`
    );
    expect(image.alt).toBe("custom username 2 profile picture");
  });

  it("should handle multiple users no length of time", () => {
    component.label = "custom label";
    component.users = List<User>([
      new User({
        id: 1,
        userName: "custom username 1",
        rolesMask: 2,
        rolesMaskNames: ["user"],
        lastSeenAt: "2019-12-18T11:16:08.233+10:00"
      }),
      new User({
        id: 2,
        userName: "custom username 2",
        rolesMask: 2,
        rolesMaskNames: ["user"],
        lastSeenAt: "2019-12-18T11:16:08.233+10:00"
      })
    ]);
    fixture.detectChanges();

    const lengthOfTimes = fixture.debugElement.nativeElement.querySelectorAll(
      "#lengthOfTime"
    );
    expect(lengthOfTimes).toBeTruthy();
    expect(lengthOfTimes.length).toBe(0);
  });

  it("should display multiple users length of time", () => {
    component.label = "custom label";
    component.users = List<User>([
      new User({
        id: 1,
        userName: "custom username 1",
        rolesMask: 2,
        rolesMaskNames: ["user"],
        lastSeenAt: "2019-12-18T11:16:08.233+10:00"
      }),
      new User({
        id: 2,
        userName: "custom username 2",
        rolesMask: 2,
        rolesMaskNames: ["user"],
        lastSeenAt: "2019-12-18T11:16:08.233+10:00"
      })
    ]);
    component.lengthOfTime = "5 years ago";
    fixture.detectChanges();

    const lengthOfTimes = fixture.debugElement.nativeElement.querySelectorAll(
      "#lengthOfTime"
    );
    expect(lengthOfTimes).toBeTruthy();
    expect(lengthOfTimes.length).toBe(2);
    expect(lengthOfTimes[0].innerText.trim()).toBe("5 years ago");
    expect(lengthOfTimes[1].innerText.trim()).toBe("5 years ago");
  });
});

import { HttpClientTestingModule } from "@angular/common/http/testing";
import { ComponentFixture, fakeAsync, TestBed } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { AccountsService } from "@baw-api/account/accounts.service";
import { BehaviorSubject } from "rxjs";
import { Id } from "src/app/interfaces/apiInterfaces";
import { Project } from "src/app/models/Project";
import { Site } from "src/app/models/Site";
import { User } from "src/app/models/User";
import { testBawServices } from "src/app/test/helpers/testbed";
import { MenuModule } from "../menu/menu.module";
import { UserBadgesComponent } from "./user-badges.component";

describe("UserBadgesComponent", () => {
  const defaultId: Id = 1;
  let api: AccountsService;
  let component: UserBadgesComponent;
  let fixture: ComponentFixture<UserBadgesComponent>;
  let defaultProject: Project;
  let defaultSite: Site;
  let defaultUser: User;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [MenuModule, HttpClientTestingModule, RouterTestingModule],
      declarations: [UserBadgesComponent],
      providers: [...testBawServices],
    }).compileComponents();

    fixture = TestBed.createComponent(UserBadgesComponent);
    api = TestBed.inject(AccountsService);
    component = fixture.componentInstance;

    defaultProject = new Project({
      id: defaultId,
      name: "Project",
    });
    defaultSite = new Site({
      id: defaultId,
      name: "Site",
    });
    defaultUser = new User({
      id: defaultId,
      userName: "UserName",
    });
  });

  function interceptApiRequest(user: User) {
    spyOn(api, "show").and.callFake(() => {
      return new BehaviorSubject<User>(user);
    });
  }

  function getUserBadges() {
    return fixture.nativeElement.querySelectorAll("baw-user-badge");
  }

  function assertBadgeLabel(badge: HTMLElement, label: string) {
    const labelEl = badge.querySelector("h4");
    expect(labelEl.innerText.trim()).toBe(label);
  }

  function assertBadgeUserName(badge: HTMLElement, userName: string) {
    const usernameEl = badge.querySelector<HTMLAnchorElement>("a#username");
    expect(usernameEl.innerText.trim()).toBe(userName);
  }

  it("should create", () => {
    component.model = defaultProject;
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it("should handle no users", () => {
    component.model = defaultProject;
    fixture.detectChanges();

    const badges = getUserBadges();
    expect(badges).toBeTruthy();
    expect(badges.length).toBe(0);
  });

  const userTypes = [
    {
      title: "Created By",
      keys: {
        creatorId: defaultId,
        createdAt: "2019-12-18T11:16:08.233+10:00",
      },
    },
    {
      title: "Updated By",
      keys: {
        updaterId: defaultId,
        updatedBy: "2019-12-18T11:16:08.233+10:00",
      },
    },
    {
      title: "Owned By",
      keys: {
        ownerId: defaultId,
      },
    },
  ];

  userTypes.forEach((userType) => {
    describe(userType.title + " User Badge", () => {
      beforeEach(() => {
        component.model = new Project({
          ...defaultProject,
          ...userType.keys,
        });
      });

      it("should handle user badge", () => {
        interceptApiRequest(defaultUser);
        fixture.detectChanges();

        const badges = getUserBadges();
        expect(badges).toBeTruthy();
        expect(badges.length).toBe(1);
      });

      it("should handle user badge title", () => {
        interceptApiRequest(defaultUser);
        fixture.detectChanges();

        const badges = getUserBadges();
        assertBadgeLabel(badges[0], userType.title);
      });

      it("should handle user badge username", () => {
        interceptApiRequest(
          new User({ ...defaultUser, userName: "Custom Username" })
        );
        fixture.detectChanges();

        const badges = getUserBadges();
        assertBadgeUserName(badges[0], "Custom Username");
      });
    });
  });

  it("should handle all badges for project", fakeAsync(() => {
    interceptApiRequest(defaultUser);
    component.model = new Project({
      ...defaultProject,
      creatorId: defaultId,
      createdAt: "2019-12-18T11:16:08.233+10:00",
      updaterId: defaultId,
      updatedAt: "2019-12-18T11:16:08.233+10:00",
      ownerId: defaultId,
    });
    fixture.detectChanges();

    const badges = fixture.nativeElement.querySelectorAll("baw-user-badge");
    expect(badges).toBeTruthy();
    expect(badges.length).toBe(3);
  }));

  it("should handle all badges for site", fakeAsync(() => {
    interceptApiRequest(defaultUser);
    component.model = new Site({
      ...defaultSite,
      creatorId: defaultId,
      createdAt: "2019-12-18T11:16:08.233+10:00",
      updaterId: defaultId,
      updatedAt: "2019-12-18T11:16:08.233+10:00",
    });

    fixture.detectChanges();

    const badges = fixture.nativeElement.querySelectorAll("baw-user-badge");
    expect(badges).toBeTruthy();
    expect(badges.length).toBe(2);
  }));

  it("should use luxon.toRelative to get length of time", () => {
    component.model = new Project({
      ...defaultProject,
      creatorId: defaultId,
      createdAt: "2019-12-18T11:16:08.233+10:00",
    });
    const spy = spyOn(
      component.model.createdAt,
      "toRelative"
    ).and.callThrough();
    interceptApiRequest(defaultUser);
    fixture.detectChanges();

    expect(spy).toHaveBeenCalled();
  });
});

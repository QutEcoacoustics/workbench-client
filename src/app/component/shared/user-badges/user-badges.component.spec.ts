import { HttpClientTestingModule } from "@angular/common/http/testing";
import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick
} from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { List } from "immutable";
import { DateTime } from "luxon";
import { Subject } from "rxjs";
import { Project } from "src/app/models/Project";
import { Site } from "src/app/models/Site";
import { User } from "src/app/models/User";
import { AccountService } from "src/app/services/baw-api/account.service";
import { testBawServices } from "src/app/test.helper";
import { MenuModule } from "../menu/menu.module";
import { UserBadgeComponent } from "./user-badge/user-badge.component";
import { UserBadgesComponent } from "./user-badges.component";

describe("UserBadgesComponent", () => {
  let api: AccountService;
  let component: UserBadgesComponent;
  let fixture: ComponentFixture<UserBadgesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [MenuModule, HttpClientTestingModule, RouterTestingModule],
      declarations: [UserBadgesComponent],
      providers: [...testBawServices]
    }).compileComponents();

    fixture = TestBed.createComponent(UserBadgesComponent);
    api = TestBed.get(AccountService);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    jasmine.clock().uninstall();
  });

  function createBadge(label: string, users: List<User>, lengthOfTime: string) {
    const testFixture = TestBed.createComponent(UserBadgeComponent);
    const testComponent = testFixture.componentInstance;
    testComponent.label = label;
    testComponent.users = users;
    testComponent.lengthOfTime = lengthOfTime;
    testFixture.detectChanges();

    return testFixture.nativeElement.querySelector("#users").innerHTML;
  }

  it("should create", () => {
    component.model = new Project({
      id: 1,
      name: "test project",
      creatorId: 1,
      createdAt: "2019-01-01",
      description: "test description",
      siteIds: new Set([])
    });
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it("should handle no users", () => {
    component.model = new Project({
      id: 1,
      name: "test project",
      description: "test description",
      siteIds: new Set([])
    } as any);

    fixture.detectChanges();

    const badges = fixture.nativeElement.querySelectorAll("app-user-badge");
    expect(badges).toBeTruthy();
    expect(badges.length).toBe(0);
  });

  it("should handle creator user badge", fakeAsync(() => {
    spyOn(api, "show").and.callFake(() => {
      const subject = new Subject<User>();

      setTimeout(() => {
        subject.next(
          new User({
            id: 1,
            userName: "custom username",
            rolesMask: 2,
            rolesMaskNames: ["user"],
            lastSeenAt: "2019-12-18T11:16:08.233+10:00"
          })
        );
      }, 50);

      return subject;
    });

    component.model = new Project({
      id: 1,
      name: "test project",
      creatorId: 1,
      createdAt: "2019-01-01",
      description: "test description",
      siteIds: new Set([])
    });

    fixture.detectChanges();
    tick(100);
    fixture.detectChanges();

    const badges = fixture.nativeElement.querySelectorAll("app-user-badge");
    expect(badges).toBeTruthy();
    expect(badges.length).toBe(1);
  }));

  it("should handle creator user badge title", fakeAsync(() => {
    spyOn(api, "show").and.callFake(() => {
      const subject = new Subject<User>();

      setTimeout(() => {
        subject.next(
          new User({
            id: 1,
            userName: "custom username",
            rolesMask: 2,
            rolesMaskNames: ["user"],
            lastSeenAt: "2019-12-18T11:16:08.233+10:00"
          })
        );
      }, 50);

      return subject;
    });

    component.model = new Project({
      id: 1,
      name: "test project",
      creatorId: 1,
      createdAt: "2019-01-01",
      description: "test description",
      siteIds: new Set([])
    });

    fixture.detectChanges();
    tick(100);
    fixture.detectChanges();

    const badge = fixture.nativeElement.querySelectorAll("app-user-badge")[0];
    expect(badge.attributes.getNamedItem("ng-reflect-label")).toBeTruthy();
    expect(badge.attributes.getNamedItem("ng-reflect-label").value).toBe(
      "Created By"
    );
  }));

  it("should handle creator user badge users", fakeAsync(() => {
    spyOn(api, "show").and.callFake(() => {
      const subject = new Subject<User>();

      setTimeout(() => {
        subject.next(
          new User({
            id: 1,
            userName: "custom username",
            rolesMask: 2,
            rolesMaskNames: ["user"],
            lastSeenAt: "2019-12-18T11:16:08.233+10:00"
          })
        );
      }, 50);

      return subject;
    });

    const date = new Date();
    date.setDate(date.getDate() - 1);

    component.model = new Project({
      id: 1,
      name: "test project",
      creatorId: 1,
      createdAt: DateTime.fromJSDate(date).toISO(),
      description: "test description",
      siteIds: new Set([])
    });

    fixture.detectChanges();
    tick(100);
    fixture.detectChanges();

    const users = fixture.nativeElement.querySelector("app-user-badge #users");
    const testUsers = createBadge(
      "Created By",
      List<User>([
        new User({
          id: 1,
          userName: "custom username",
          rolesMask: 2,
          rolesMaskNames: ["user"],
          lastSeenAt: "2019-12-18T11:16:08.233+10:00"
        })
      ]),
      "1 day ago"
    );

    expect(users.innerHTML).toEqual(testUsers);
  }));

  it("should handle creator user year length of time", fakeAsync(() => {
    spyOn(api, "show").and.callFake(() => {
      const subject = new Subject<User>();

      setTimeout(() => {
        subject.next(
          new User({
            id: 1,
            userName: "custom username",
            rolesMask: 2,
            rolesMaskNames: ["user"],
            lastSeenAt: "2019-12-18T11:16:08.233+10:00"
          })
        );
      }, 50);

      return subject;
    });

    const date = new Date();
    date.setFullYear(date.getFullYear() - 1);

    component.model = new Project({
      id: 1,
      name: "test project",
      creatorId: 1,
      createdAt: DateTime.fromJSDate(date).toISO(),
      description: "test description",
      siteIds: new Set([])
    });

    fixture.detectChanges();
    tick(100);
    fixture.detectChanges();

    const badge = fixture.nativeElement.querySelectorAll("app-user-badge")[0];
    expect(
      badge.attributes.getNamedItem("ng-reflect-length-of-time")
    ).toBeTruthy();
    expect(
      badge.attributes.getNamedItem("ng-reflect-length-of-time").value
    ).toBe("1 year ago");
  }));

  it("should handle creator user years length of time", fakeAsync(() => {
    spyOn(api, "show").and.callFake(() => {
      const subject = new Subject<User>();

      setTimeout(() => {
        subject.next(
          new User({
            id: 1,
            userName: "custom username",
            rolesMask: 2,
            rolesMaskNames: ["user"],
            lastSeenAt: "2019-12-18T11:16:08.233+10:00"
          })
        );
      }, 50);

      return subject;
    });

    const date = new Date();
    date.setFullYear(date.getFullYear() - 10);

    component.model = new Project({
      id: 1,
      name: "test project",
      creatorId: 1,
      createdAt: DateTime.fromJSDate(date).toISO(),
      description: "test description",
      siteIds: new Set([])
    });

    fixture.detectChanges();
    tick(100);
    fixture.detectChanges();

    const badge = fixture.nativeElement.querySelectorAll("app-user-badge")[0];
    expect(
      badge.attributes.getNamedItem("ng-reflect-length-of-time")
    ).toBeTruthy();
    expect(
      badge.attributes.getNamedItem("ng-reflect-length-of-time").value
    ).toBe("10 years ago");
  }));

  it("should handle creator user month length of time", fakeAsync(() => {
    spyOn(api, "show").and.callFake(() => {
      const subject = new Subject<User>();

      setTimeout(() => {
        subject.next(
          new User({
            id: 1,
            userName: "custom username",
            rolesMask: 2,
            rolesMaskNames: ["user"],
            lastSeenAt: "2019-12-18T11:16:08.233+10:00"
          })
        );
      }, 50);

      return subject;
    });

    const date = new Date();
    date.setMonth(date.getMonth() - 1);
    date.setDate(date.getDate() - 5);

    component.model = new Project({
      id: 1,
      name: "test project",
      creatorId: 1,
      createdAt: DateTime.fromJSDate(date).toISO(),
      description: "test description",
      siteIds: new Set([])
    });

    fixture.detectChanges();
    tick(100);
    fixture.detectChanges();

    const badge = fixture.nativeElement.querySelectorAll("app-user-badge")[0];
    expect(
      badge.attributes.getNamedItem("ng-reflect-length-of-time")
    ).toBeTruthy();
    expect(
      badge.attributes.getNamedItem("ng-reflect-length-of-time").value
    ).toBe("1 month ago");
  }));

  it("should handle creator user months length of time", fakeAsync(() => {
    spyOn(api, "show").and.callFake(() => {
      const subject = new Subject<User>();

      setTimeout(() => {
        subject.next(
          new User({
            id: 1,
            userName: "custom username",
            rolesMask: 2,
            rolesMaskNames: ["user"],
            lastSeenAt: "2019-12-18T11:16:08.233+10:00"
          })
        );
      }, 50);

      return subject;
    });

    const date = new Date();
    date.setMonth(date.getMonth() - 11);
    date.setDate(date.getDate() - 5);

    component.model = new Project({
      id: 1,
      name: "test project",
      creatorId: 1,
      createdAt: DateTime.fromJSDate(date).toISO(),
      description: "test description",
      siteIds: new Set([])
    });

    fixture.detectChanges();
    tick(100);
    fixture.detectChanges();

    const badge = fixture.nativeElement.querySelectorAll("app-user-badge")[0];
    expect(
      badge.attributes.getNamedItem("ng-reflect-length-of-time")
    ).toBeTruthy();
    expect(
      badge.attributes.getNamedItem("ng-reflect-length-of-time").value
    ).toBe("11 months ago");
  }));

  it("should handle creator user day length of time", fakeAsync(() => {
    spyOn(api, "show").and.callFake(() => {
      const subject = new Subject<User>();

      setTimeout(() => {
        subject.next(
          new User({
            id: 1,
            userName: "custom username",
            rolesMask: 2,
            rolesMaskNames: ["user"],
            lastSeenAt: "2019-12-18T11:16:08.233+10:00"
          })
        );
      }, 50);

      return subject;
    });

    const date = new Date();
    date.setDate(date.getDate() - 1);

    component.model = new Project({
      id: 1,
      name: "test project",
      creatorId: 1,
      createdAt: DateTime.fromJSDate(date).toISO(),
      description: "test description",
      siteIds: new Set([])
    });

    fixture.detectChanges();
    tick(100);
    fixture.detectChanges();

    const badge = fixture.nativeElement.querySelectorAll("app-user-badge")[0];
    expect(
      badge.attributes.getNamedItem("ng-reflect-length-of-time")
    ).toBeTruthy();
    expect(
      badge.attributes.getNamedItem("ng-reflect-length-of-time").value
    ).toBe("1 day ago");
  }));

  it("should handle creator user days length of time", fakeAsync(() => {
    spyOn(api, "show").and.callFake(() => {
      const subject = new Subject<User>();

      setTimeout(() => {
        subject.next(
          new User({
            id: 1,
            userName: "custom username",
            rolesMask: 2,
            rolesMaskNames: ["user"],
            lastSeenAt: "2019-12-18T11:16:08.233+10:00"
          })
        );
      }, 50);

      return subject;
    });

    const date = new Date();
    date.setDate(date.getDate() - 10);

    component.model = new Project({
      id: 1,
      name: "test project",
      creatorId: 1,
      createdAt: DateTime.fromJSDate(date).toISO(),
      description: "test description",
      siteIds: new Set([])
    });

    fixture.detectChanges();
    tick(100);
    fixture.detectChanges();

    const badge = fixture.nativeElement.querySelectorAll("app-user-badge")[0];
    expect(
      badge.attributes.getNamedItem("ng-reflect-length-of-time")
    ).toBeTruthy();
    expect(
      badge.attributes.getNamedItem("ng-reflect-length-of-time").value
    ).toBe("10 days ago");
  }));

  it("should handle creator user less than one day length of time", fakeAsync(() => {
    spyOn(api, "show").and.callFake(() => {
      const subject = new Subject<User>();

      setTimeout(() => {
        subject.next(
          new User({
            id: 1,
            userName: "custom username",
            rolesMask: 2,
            rolesMaskNames: ["user"],
            lastSeenAt: "2019-12-18T11:16:08.233+10:00"
          })
        );
      }, 50);

      return subject;
    });

    const date = new Date();

    component.model = new Project({
      id: 1,
      name: "test project",
      creatorId: 1,
      createdAt: DateTime.fromJSDate(date).toISO(),
      description: "test description",
      siteIds: new Set([])
    });

    fixture.detectChanges();
    tick(100);
    fixture.detectChanges();

    const badge = fixture.nativeElement.querySelectorAll("app-user-badge")[0];
    expect(
      badge.attributes.getNamedItem("ng-reflect-length-of-time")
    ).toBeTruthy();
    expect(
      badge.attributes.getNamedItem("ng-reflect-length-of-time").value
    ).toBe("Less than a day ago");
  }));

  it("should handle updater user badge", fakeAsync(() => {
    spyOn(api, "show").and.callFake(() => {
      const subject = new Subject<User>();

      setTimeout(() => {
        subject.next(
          new User({
            id: 1,
            userName: "custom username",
            rolesMask: 2,
            rolesMaskNames: ["user"],
            lastSeenAt: "2019-12-18T11:16:08.233+10:00"
          })
        );
      }, 50);

      return subject;
    });

    component.model = new Project({
      id: 1,
      name: "test project",
      updaterId: 1,
      updatedAt: "2019-01-01",
      description: "test description",
      siteIds: new Set([])
    } as any);

    fixture.detectChanges();
    tick(100);
    fixture.detectChanges();

    const badges = fixture.nativeElement.querySelectorAll("app-user-badge");
    expect(badges).toBeTruthy();
    expect(badges.length).toBe(1);
  }));

  it("should handle updater user badge title", fakeAsync(() => {
    spyOn(api, "show").and.callFake(() => {
      const subject = new Subject<User>();

      setTimeout(() => {
        subject.next(
          new User({
            id: 1,
            userName: "custom username",
            rolesMask: 2,
            rolesMaskNames: ["user"],
            lastSeenAt: "2019-12-18T11:16:08.233+10:00"
          })
        );
      }, 50);

      return subject;
    });

    component.model = new Project({
      id: 1,
      name: "test project",
      updaterId: 1,
      updatedAt: "2019-01-01",
      description: "test description",
      siteIds: new Set([])
    } as any);

    fixture.detectChanges();
    tick(100);
    fixture.detectChanges();

    const badge = fixture.nativeElement.querySelectorAll("app-user-badge")[0];
    expect(badge.attributes.getNamedItem("ng-reflect-label")).toBeTruthy();
    expect(badge.attributes.getNamedItem("ng-reflect-label").value).toBe(
      "Updated By"
    );
  }));

  it("should handle updater user badge users", fakeAsync(() => {
    spyOn(api, "show").and.callFake(() => {
      const subject = new Subject<User>();

      setTimeout(() => {
        subject.next(
          new User({
            id: 1,
            userName: "custom username",
            rolesMask: 2,
            rolesMaskNames: ["user"],
            lastSeenAt: "2019-12-18T11:16:08.233+10:00"
          })
        );
      }, 50);

      return subject;
    });

    const date = new Date();
    date.setDate(date.getDate() - 1);

    component.model = new Project({
      id: 1,
      name: "test project",
      updaterId: 1,
      updatedAt: DateTime.fromJSDate(date).toISO(),
      description: "test description",
      siteIds: new Set([])
    } as any);

    fixture.detectChanges();
    tick(100);
    fixture.detectChanges();

    const users = fixture.nativeElement.querySelector("app-user-badge #users");
    const testUsers = createBadge(
      "Updated By",
      List<User>([
        new User({
          id: 1,
          userName: "custom username",
          rolesMask: 2,
          rolesMaskNames: ["user"],
          lastSeenAt: "2019-12-18T11:16:08.233+10:00"
        })
      ]),
      "1 day ago"
    );

    expect(users.innerHTML).toEqual(testUsers);
  }));

  it("should handle updater user year length of time", fakeAsync(() => {
    spyOn(api, "show").and.callFake(() => {
      const subject = new Subject<User>();

      setTimeout(() => {
        subject.next(
          new User({
            id: 1,
            userName: "custom username",
            rolesMask: 2,
            rolesMaskNames: ["user"],
            lastSeenAt: "2019-12-18T11:16:08.233+10:00"
          })
        );
      }, 50);

      return subject;
    });

    const date = new Date();
    date.setFullYear(date.getFullYear() - 1);

    component.model = new Project({
      id: 1,
      name: "test project",
      updaterId: 1,
      updatedAt: DateTime.fromJSDate(date).toISO(),
      description: "test description",
      siteIds: new Set([])
    } as any);

    fixture.detectChanges();
    tick(100);
    fixture.detectChanges();

    const badge = fixture.nativeElement.querySelectorAll("app-user-badge")[0];
    expect(
      badge.attributes.getNamedItem("ng-reflect-length-of-time")
    ).toBeTruthy();
    expect(
      badge.attributes.getNamedItem("ng-reflect-length-of-time").value
    ).toBe("1 year ago");
  }));

  it("should handle updater user years length of time", fakeAsync(() => {
    spyOn(api, "show").and.callFake(() => {
      const subject = new Subject<User>();

      setTimeout(() => {
        subject.next(
          new User({
            id: 1,
            userName: "custom username",
            rolesMask: 2,
            rolesMaskNames: ["user"],
            lastSeenAt: "2019-12-18T11:16:08.233+10:00"
          })
        );
      }, 50);

      return subject;
    });

    const date = new Date();
    date.setFullYear(date.getFullYear() - 10);

    component.model = new Project({
      id: 1,
      name: "test project",
      updaterId: 1,
      updatedAt: DateTime.fromJSDate(date).toISO(),
      description: "test description",
      siteIds: new Set([])
    } as any);

    fixture.detectChanges();
    tick(100);
    fixture.detectChanges();

    const badge = fixture.nativeElement.querySelectorAll("app-user-badge")[0];
    expect(
      badge.attributes.getNamedItem("ng-reflect-length-of-time")
    ).toBeTruthy();
    expect(
      badge.attributes.getNamedItem("ng-reflect-length-of-time").value
    ).toBe("10 years ago");
  }));

  it("should handle updater user month length of time", fakeAsync(() => {
    spyOn(api, "show").and.callFake(() => {
      const subject = new Subject<User>();

      setTimeout(() => {
        subject.next(
          new User({
            id: 1,
            userName: "custom username",
            rolesMask: 2,
            rolesMaskNames: ["user"],
            lastSeenAt: "2019-12-18T11:16:08.233+10:00"
          })
        );
      }, 50);

      return subject;
    });

    const date = new Date();
    date.setMonth(date.getMonth() - 1);
    date.setDate(date.getDate() - 5);

    component.model = new Project({
      id: 1,
      name: "test project",
      updaterId: 1,
      updatedAt: DateTime.fromJSDate(date).toISO(),
      description: "test description",
      siteIds: new Set([])
    } as any);

    fixture.detectChanges();
    tick(100);
    fixture.detectChanges();

    const badge = fixture.nativeElement.querySelectorAll("app-user-badge")[0];
    expect(
      badge.attributes.getNamedItem("ng-reflect-length-of-time")
    ).toBeTruthy();
    expect(
      badge.attributes.getNamedItem("ng-reflect-length-of-time").value
    ).toBe("1 month ago");
  }));

  it("should handle updater user months length of time", fakeAsync(() => {
    spyOn(api, "show").and.callFake(() => {
      const subject = new Subject<User>();

      setTimeout(() => {
        subject.next(
          new User({
            id: 1,
            userName: "custom username",
            rolesMask: 2,
            rolesMaskNames: ["user"],
            lastSeenAt: "2019-12-18T11:16:08.233+10:00"
          })
        );
      }, 50);

      return subject;
    });

    const date = new Date();
    date.setMonth(date.getMonth() - 11);
    date.setDate(date.getDate() - 5);

    component.model = new Project({
      id: 1,
      name: "test project",
      updaterId: 1,
      updatedAt: DateTime.fromJSDate(date).toISO(),
      description: "test description",
      siteIds: new Set([])
    } as any);

    fixture.detectChanges();
    tick(100);
    fixture.detectChanges();

    const badge = fixture.nativeElement.querySelectorAll("app-user-badge")[0];
    expect(
      badge.attributes.getNamedItem("ng-reflect-length-of-time")
    ).toBeTruthy();
    expect(
      badge.attributes.getNamedItem("ng-reflect-length-of-time").value
    ).toBe("11 months ago");
  }));

  it("should handle updater user day length of time", fakeAsync(() => {
    spyOn(api, "show").and.callFake(() => {
      const subject = new Subject<User>();

      setTimeout(() => {
        subject.next(
          new User({
            id: 1,
            userName: "custom username",
            rolesMask: 2,
            rolesMaskNames: ["user"],
            lastSeenAt: "2019-12-18T11:16:08.233+10:00"
          })
        );
      }, 50);

      return subject;
    });

    const date = new Date();
    date.setDate(date.getDate() - 1);

    component.model = new Project({
      id: 1,
      name: "test project",
      updaterId: 1,
      updatedAt: DateTime.fromJSDate(date).toISO(),
      description: "test description",
      siteIds: new Set([])
    } as any);

    fixture.detectChanges();
    tick(100);
    fixture.detectChanges();

    const badge = fixture.nativeElement.querySelectorAll("app-user-badge")[0];
    expect(
      badge.attributes.getNamedItem("ng-reflect-length-of-time")
    ).toBeTruthy();
    expect(
      badge.attributes.getNamedItem("ng-reflect-length-of-time").value
    ).toBe("1 day ago");
  }));

  it("should handle updater user days length of time", fakeAsync(() => {
    spyOn(api, "show").and.callFake(() => {
      const subject = new Subject<User>();

      setTimeout(() => {
        subject.next(
          new User({
            id: 1,
            userName: "custom username",
            rolesMask: 2,
            rolesMaskNames: ["user"],
            lastSeenAt: "2019-12-18T11:16:08.233+10:00"
          })
        );
      }, 50);

      return subject;
    });

    const date = new Date();
    date.setDate(date.getDate() - 10);

    component.model = new Project({
      id: 1,
      name: "test project",
      updaterId: 1,
      updatedAt: DateTime.fromJSDate(date).toISO(),
      description: "test description",
      siteIds: new Set([])
    } as any);

    fixture.detectChanges();
    tick(100);
    fixture.detectChanges();

    const badge = fixture.nativeElement.querySelectorAll("app-user-badge")[0];
    expect(
      badge.attributes.getNamedItem("ng-reflect-length-of-time")
    ).toBeTruthy();
    expect(
      badge.attributes.getNamedItem("ng-reflect-length-of-time").value
    ).toBe("10 days ago");
  }));

  it("should handle updater user less than one day length of time", fakeAsync(() => {
    spyOn(api, "show").and.callFake(() => {
      const subject = new Subject<User>();

      setTimeout(() => {
        subject.next(
          new User({
            id: 1,
            userName: "custom username",
            rolesMask: 2,
            rolesMaskNames: ["user"],
            lastSeenAt: "2019-12-18T11:16:08.233+10:00"
          })
        );
      }, 50);

      return subject;
    });

    const date = new Date();

    component.model = new Project({
      id: 1,
      name: "test project",
      updaterId: 1,
      updatedAt: DateTime.fromJSDate(date).toISO(),
      description: "test description",
      siteIds: new Set([])
    } as any);

    fixture.detectChanges();
    tick(100);
    fixture.detectChanges();

    const badge = fixture.nativeElement.querySelectorAll("app-user-badge")[0];
    expect(
      badge.attributes.getNamedItem("ng-reflect-length-of-time")
    ).toBeTruthy();
    expect(
      badge.attributes.getNamedItem("ng-reflect-length-of-time").value
    ).toBe("Less than a day ago");
  }));

  it("should handle owner user badge", fakeAsync(() => {
    spyOn(api, "show").and.callFake(() => {
      const subject = new Subject<User>();

      setTimeout(() => {
        subject.next(
          new User({
            id: 1,
            userName: "custom username",
            rolesMask: 2,
            rolesMaskNames: ["user"],
            lastSeenAt: "2019-12-18T11:16:08.233+10:00"
          })
        );
      }, 50);

      return subject;
    });

    component.model = new Project({
      id: 1,
      name: "test project",
      ownerId: 1,
      description: "test description",
      siteIds: new Set([])
    } as any);

    fixture.detectChanges();
    tick(100);
    fixture.detectChanges();

    const badges = fixture.nativeElement.querySelectorAll("app-user-badge");
    expect(badges).toBeTruthy();
    expect(badges.length).toBe(1);
  }));

  it("should handle owner user badge title", fakeAsync(() => {
    spyOn(api, "show").and.callFake(() => {
      const subject = new Subject<User>();

      setTimeout(() => {
        subject.next(
          new User({
            id: 1,
            userName: "custom username",
            rolesMask: 2,
            rolesMaskNames: ["user"],
            lastSeenAt: "2019-12-18T11:16:08.233+10:00"
          })
        );
      }, 50);

      return subject;
    });

    component.model = new Project({
      id: 1,
      name: "test project",
      ownerId: 1,
      description: "test description",
      siteIds: new Set([])
    } as any);

    fixture.detectChanges();
    tick(100);
    fixture.detectChanges();

    const badge = fixture.nativeElement.querySelectorAll("app-user-badge")[0];
    expect(badge.attributes.getNamedItem("ng-reflect-label")).toBeTruthy();
    expect(badge.attributes.getNamedItem("ng-reflect-label").value).toBe(
      "Owned By"
    );
  }));

  it("should handle owner user badge users", fakeAsync(() => {
    spyOn(api, "show").and.callFake(() => {
      const subject = new Subject<User>();

      setTimeout(() => {
        subject.next(
          new User({
            id: 1,
            userName: "custom username",
            rolesMask: 2,
            rolesMaskNames: ["user"],
            lastSeenAt: "2019-12-18T11:16:08.233+10:00"
          })
        );
      }, 50);

      return subject;
    });

    component.model = new Project({
      id: 1,
      name: "test project",
      ownerId: 1,
      description: "test description",
      siteIds: new Set([])
    } as any);

    fixture.detectChanges();
    tick(100);
    fixture.detectChanges();

    const users = fixture.nativeElement.querySelector("app-user-badge #users");
    const testUsers = createBadge(
      "Updated By",
      List<User>([
        new User({
          id: 1,
          userName: "custom username",
          rolesMask: 2,
          rolesMaskNames: ["user"],
          lastSeenAt: "2019-12-18T11:16:08.233+10:00"
        })
      ]),
      undefined
    );

    expect(users.innerHTML).toEqual(testUsers);
  }));

  it("should handle all badges for project", fakeAsync(() => {
    spyOn(api, "show").and.callFake(() => {
      const subject = new Subject<User>();

      setTimeout(() => {
        subject.next(
          new User({
            id: 1,
            userName: "custom username",
            rolesMask: 2,
            rolesMaskNames: ["user"],
            lastSeenAt: "2019-12-18T11:16:08.233+10:00"
          })
        );
      }, 50);

      return subject;
    });

    const date = new Date();
    date.setDate(date.getDate() - 10);

    component.model = new Project({
      id: 1,
      name: "test project",
      creatorId: 1,
      createdAt: DateTime.fromJSDate(date).toISO(),
      updaterId: 1,
      updatedAt: DateTime.fromJSDate(date).toISO(),
      ownerId: 1,
      description: "test description",
      siteIds: new Set([])
    });

    fixture.detectChanges();
    tick(100);
    fixture.detectChanges();

    const badges = fixture.nativeElement.querySelectorAll("app-user-badge");
    expect(badges).toBeTruthy();
    expect(badges.length).toBe(3);
  }));

  it("should handle all badges for site", fakeAsync(() => {
    spyOn(api, "show").and.callFake(() => {
      const subject = new Subject<User>();

      setTimeout(() => {
        subject.next(
          new User({
            id: 1,
            userName: "custom username",
            rolesMask: 2,
            rolesMaskNames: ["user"],
            lastSeenAt: "2019-12-18T11:16:08.233+10:00"
          })
        );
      }, 50);

      return subject;
    });

    const date = new Date();
    date.setDate(date.getDate() - 10);

    component.model = new Site({
      id: 1,
      name: "test site",
      creatorId: 1,
      createdAt: DateTime.fromJSDate(date).toISO(),
      updaterId: 1,
      updatedAt: DateTime.fromJSDate(date).toISO(),
      description: "test description",
      projectIds: new Set([])
    });

    fixture.detectChanges();
    tick(100);
    fixture.detectChanges();

    const badges = fixture.nativeElement.querySelectorAll("app-user-badge");
    expect(badges).toBeTruthy();
    expect(badges.length).toBe(2);
  }));
});

/// <reference types="karma-viewport" />

import { HttpClientModule } from "@angular/common/http";
import {
  async,
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick
} from "@angular/core/testing";
import { Router } from "@angular/router";
import { RouterTestingModule } from "@angular/router/testing";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { BehaviorSubject, Subject } from "rxjs";
import { User } from "src/app/models/User";
import { SecurityService } from "src/app/services/baw-api/security.service";
import { UserService } from "src/app/services/baw-api/user.service";
import { testBawServices } from "src/app/test.helper";
import { environment } from "src/environments/environment";
import { contactUsMenuItem } from "../../about/about.menus";
import { homeMenuItem } from "../../home/home.menus";
import { myAccountMenuItem } from "../../profile/profile.menus";
import { projectsMenuItem } from "../../projects/projects.menus";
import { loginMenuItem, registerMenuItem } from "../../security/security.menus";
import { SharedModule } from "../shared.module";
import { HeaderDropdownComponent } from "./header-dropdown/header-dropdown.component";
import { HeaderItemComponent } from "./header-item/header-item.component";
import { HeaderComponent } from "./header.component";

describe("HeaderComponent", () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let securityApi: SecurityService;
  let userApi: UserService;
  let router: Router;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        HeaderComponent,
        HeaderItemComponent,
        HeaderDropdownComponent
      ],
      imports: [
        SharedModule,
        RouterTestingModule,
        FontAwesomeModule,
        HttpClientModule
      ],
      providers: [...testBawServices]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderComponent);
    securityApi = TestBed.inject(SecurityService);
    userApi = TestBed.inject(UserService);
    router = TestBed.inject(Router);
    component = fixture.componentInstance;

    viewport.set("extra-large");
  });

  afterAll(() => {
    viewport.reset();
  });

  it("should create", () => {
    spyOn(securityApi, "isLoggedIn").and.callFake(() => {
      return false;
    });
    spyOn(securityApi, "getAuthTrigger").and.callFake(
      () => new BehaviorSubject(null)
    );
    fixture.detectChanges();

    expect(component).toBeTruthy();
  });

  it("should collapse at bootstrap md size", () => {
    spyOn(securityApi, "isLoggedIn").and.callFake(() => {
      return false;
    });
    spyOn(securityApi, "getAuthTrigger").and.callFake(
      () => new BehaviorSubject(null)
    );
    fixture.detectChanges();

    const navbar = fixture.nativeElement.querySelector("nav");
    let expandLgClass = false;
    navbar.classList.forEach((className: string) => {
      if (className === "navbar-expand-lg") {
        expandLgClass = true;
      }
    });
    expect(expandLgClass).toBeTrue();

    const button = fixture.nativeElement.querySelector("button.navbar-toggler");
    expect(button).toBeTruthy();
  });

  it("should create brand name link", () => {
    spyOn(securityApi, "isLoggedIn").and.callFake(() => {
      return false;
    });
    spyOn(securityApi, "getAuthTrigger").and.callFake(
      () => new BehaviorSubject(null)
    );
    fixture.detectChanges();

    const brand = fixture.nativeElement.querySelector("a.navbar-brand");
    expect(brand).toBeTruthy();
    expect(brand.innerText).toContain(environment.values.brand.name);
    expect(
      brand.attributes.getNamedItem("ng-reflect-router-link")
    ).toBeTruthy();
    expect(brand.attributes.getNamedItem("ng-reflect-router-link").value).toBe(
      homeMenuItem.route.toString()
    );
  });

  it("should create projects link", () => {
    spyOn(securityApi, "isLoggedIn").and.callFake(() => {
      return false;
    });
    spyOn(securityApi, "getAuthTrigger").and.callFake(
      () => new BehaviorSubject(null)
    );
    fixture.detectChanges();

    const link = fixture.nativeElement.querySelectorAll("a.nav-link")[0];
    expect(link).toBeTruthy();
    expect(link.innerText).toContain(projectsMenuItem.label);
    expect(link.attributes.getNamedItem("ng-reflect-router-link")).toBeTruthy();
    expect(link.attributes.getNamedItem("ng-reflect-router-link").value).toBe(
      projectsMenuItem.route.toString()
    );
  });

  it("should create header links from external config", () => {
    spyOn(securityApi, "isLoggedIn").and.callFake(() => {
      return false;
    });
    spyOn(securityApi, "getAuthTrigger").and.callFake(
      () => new BehaviorSubject(null)
    );
    fixture.detectChanges();

    const link = fixture.nativeElement.querySelectorAll("a.nav-link")[1];
    expect(link).toBeTruthy();
    expect(link.innerText).toContain("<< content1 >>");
  });

  it("should create header dropdown links from external config", () => {
    spyOn(securityApi, "isLoggedIn").and.callFake(() => {
      return false;
    });
    spyOn(securityApi, "getAuthTrigger").and.callFake(
      () => new BehaviorSubject(null)
    );
    fixture.detectChanges();

    const dropdown = fixture.nativeElement.querySelector("app-header-dropdown");
    expect(dropdown).toBeTruthy();
    expect(
      dropdown.querySelector("button#dropdownBasic").innerText.trim()
    ).toBe("<< content2 >>");
    expect(dropdown.querySelectorAll(".dropdown-item").length).toBe(2);
  });

  it("should create contact us link", () => {
    spyOn(securityApi, "getAuthTrigger").and.callFake(
      () => new BehaviorSubject(null)
    );
    fixture.detectChanges();

    const link = fixture.nativeElement.querySelectorAll("a.nav-link")[2];
    expect(link).toBeTruthy();
    expect(link.innerText).toContain(contactUsMenuItem.label);
    expect(link.attributes.getNamedItem("ng-reflect-router-link")).toBeTruthy();
    expect(link.attributes.getNamedItem("ng-reflect-router-link").value).toBe(
      contactUsMenuItem.route.toString()
    );
  });

  it("should display register link", () => {
    spyOn(securityApi, "isLoggedIn").and.callFake(() => {
      return false;
    });
    spyOn(securityApi, "getAuthTrigger").and.callFake(
      () => new BehaviorSubject(null)
    );
    fixture.detectChanges();

    const link = fixture.nativeElement.querySelectorAll("a.nav-link")[3];
    expect(link).toBeTruthy();
    expect(link.innerText).toContain(registerMenuItem.label);
    expect(link.attributes.getNamedItem("ng-reflect-router-link")).toBeTruthy();
    expect(link.attributes.getNamedItem("ng-reflect-router-link").value).toBe(
      registerMenuItem.route.toString()
    );
  });

  it("should display login link", () => {
    spyOn(securityApi, "getAuthTrigger").and.callFake(
      () => new BehaviorSubject(null)
    );
    fixture.detectChanges();

    const link = fixture.nativeElement.querySelectorAll("a.nav-link")[4];
    expect(link).toBeTruthy();
    expect(link.innerText).toContain(loginMenuItem.label);
    expect(link.attributes.getNamedItem("ng-reflect-router-link")).toBeTruthy();
    expect(link.attributes.getNamedItem("ng-reflect-router-link").value).toBe(
      loginMenuItem.route.toString()
    );
  });

  it("should display profile name on logged in", fakeAsync(() => {
    spyOn(securityApi, "isLoggedIn").and.callFake(() => {
      return true;
    });
    spyOn(securityApi, "getAuthTrigger").and.callFake(
      () => new BehaviorSubject(null)
    );
    spyOn(userApi, "show").and.callFake(() => {
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
    fixture.detectChanges();
    tick(100);
    fixture.detectChanges();

    const profile = fixture.nativeElement.querySelector("a.login-widget");
    expect(profile).toBeTruthy();
    expect(profile.innerText.trim()).toBe("custom username");
    expect(
      profile.attributes.getNamedItem("ng-reflect-router-link")
    ).toBeTruthy();
    expect(
      profile.attributes.getNamedItem("ng-reflect-router-link").value
    ).toBe(myAccountMenuItem.route.toString());
  }));

  it("should display profile icon on logged in", fakeAsync(() => {
    spyOn(securityApi, "isLoggedIn").and.callFake(() => {
      return true;
    });
    spyOn(securityApi, "getAuthTrigger").and.callFake(
      () => new BehaviorSubject(null)
    );
    spyOn(userApi, "show").and.callFake(() => {
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
    fixture.detectChanges();
    tick(100);
    fixture.detectChanges();

    const profile = fixture.nativeElement.querySelector("a.login-widget");
    expect(profile).toBeTruthy();

    const icon = profile.querySelector("img");
    expect(icon).toBeTruthy();
    expect(icon.alt).toBe("Profile Icon");
    expect(icon.src).toBe(
      `http://${window.location.host}/assets/images/user/user_span1.png`
    );
  }));

  it("should display profile custom icon on logged in", fakeAsync(() => {
    spyOn(securityApi, "isLoggedIn").and.callFake(() => {
      return true;
    });
    spyOn(securityApi, "getAuthTrigger").and.callFake(
      () => new BehaviorSubject(null)
    );
    spyOn(userApi, "show").and.callFake(() => {
      const subject = new Subject<User>();

      setTimeout(() => {
        subject.next(
          new User({
            id: 1,
            userName: "custom username",
            rolesMask: 2,
            rolesMaskNames: ["user"],
            lastSeenAt: "2019-12-18T11:16:08.233+10:00",
            imageUrls: [
              {
                size: "extralarge",
                url: "http://brokenlink/",
                width: 300,
                height: 300
              },
              {
                size: "large",
                url: "http://brokenlink/",
                width: 220,
                height: 220
              },
              {
                size: "medium",
                url: "http://brokenlink/",
                width: 140,
                height: 140
              },
              {
                size: "small",
                url: "http://brokenlink/",
                width: 60,
                height: 60
              },
              {
                size: "tiny",
                url: "http://brokenlink/",
                width: 30,
                height: 30
              }
            ]
          })
        );
      }, 50);

      return subject;
    });
    fixture.detectChanges();
    tick(100);
    fixture.detectChanges();

    const profile = fixture.nativeElement.querySelector("a.login-widget");
    expect(profile).toBeTruthy();

    const icon = profile.querySelector("img");
    expect(icon).toBeTruthy();
    expect(icon.alt).toBe("Profile Icon");
    expect(icon.src).toBe("http://brokenlink/");
  }));

  it("should display logout on logged in", fakeAsync(() => {
    spyOn(securityApi, "isLoggedIn").and.callFake(() => {
      return true;
    });
    spyOn(securityApi, "getAuthTrigger").and.callFake(
      () => new BehaviorSubject(null)
    );
    spyOn(userApi, "show").and.callFake(() => {
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
    fixture.detectChanges();
    tick(100);
    fixture.detectChanges();

    const logout = fixture.nativeElement.querySelectorAll("button.nav-link")[1];
    expect(logout).toBeTruthy();
    expect(logout.innerText.trim()).toBe("Logout");
  }));

  it("should allow logout", fakeAsync(() => {
    const spy = jasmine.createSpy();
    spyOn(securityApi, "isLoggedIn").and.callFake(() => {
      return true;
    });
    spyOn(securityApi, "getAuthTrigger").and.callFake(
      () => new BehaviorSubject(null)
    );
    spyOn(userApi, "show").and.callFake(() => {
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
    component.logout = spy;
    fixture.detectChanges();
    tick(100);
    fixture.detectChanges();

    const logout = fixture.nativeElement.querySelectorAll("button.nav-link")[1];
    logout.click();

    expect(spy).toHaveBeenCalled();
  }));

  it("should call signOut when logout button pressed", fakeAsync(() => {
    const spy = jasmine.createSpy();
    spyOn(securityApi, "isLoggedIn").and.callFake(() => {
      return true;
    });
    spyOn(securityApi, "getAuthTrigger").and.callFake(
      () => new BehaviorSubject(null)
    );
    spyOn(securityApi, "signOut").and.callFake(() => {
      spy();

      const subject = new Subject<any>();

      setTimeout(() => {
        subject.complete();
      }, 50);

      return subject;
    });
    spyOn(userApi, "show").and.callFake(() => {
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
    fixture.detectChanges();
    tick(100);
    fixture.detectChanges();

    const logout = fixture.nativeElement.querySelectorAll("button.nav-link")[1];
    logout.click();

    tick(100);

    expect(spy).toHaveBeenCalled();
  }));

  it("should redirect to home page when logout successful", fakeAsync(() => {
    const spy = jasmine.createSpy();
    spyOn(securityApi, "isLoggedIn").and.callFake(() => {
      return true;
    });
    spyOn(securityApi, "getAuthTrigger").and.callFake(
      () => new BehaviorSubject(null)
    );
    spyOn(securityApi, "signOut").and.callFake(() => {
      const subject = new Subject<any>();

      setTimeout(() => {
        subject.complete();
      }, 50);

      return subject;
    });
    router.navigate = spy;
    spyOn(userApi, "show").and.callFake(() => {
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
    fixture.detectChanges();
    tick(100);
    fixture.detectChanges();

    const logout = fixture.nativeElement.querySelectorAll("button.nav-link")[1];
    logout.click();

    tick(100);

    expect(spy).toHaveBeenCalledWith([homeMenuItem.route.toString()]);
  }));

  it("should display register after logout", fakeAsync(() => {
    let count = 0;
    const loggedInTrigger = new BehaviorSubject(null);
    spyOn(securityApi, "isLoggedIn").and.callFake(() => {
      count++;
      return count === 1;
    });
    spyOn(securityApi, "getAuthTrigger").and.callFake(() => loggedInTrigger);
    spyOn(securityApi, "signOut").and.callFake(() => {
      const subject = new Subject<any>();

      setTimeout(() => {
        subject.complete();
      }, 50);

      return subject;
    });
    spyOn(router, "navigate").and.stub();
    spyOn(userApi, "show").and.callFake(() => {
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
    fixture.detectChanges();
    tick(100);
    fixture.detectChanges();

    const logout = fixture.nativeElement.querySelectorAll("button.nav-link")[1];
    logout.click();

    // Wait for sign out, and trigger logged in status update
    tick(100);
    loggedInTrigger.next(null);
    fixture.detectChanges();

    const link = fixture.nativeElement.querySelectorAll("a.nav-link")[3];
    expect(link).toBeTruthy();
    expect(link.innerText).toContain(registerMenuItem.label);
    expect(link.attributes.getNamedItem("ng-reflect-router-link")).toBeTruthy();
    expect(link.attributes.getNamedItem("ng-reflect-router-link").value).toBe(
      registerMenuItem.route.toString()
    );
  }));

  it("should display login after logout", fakeAsync(() => {
    let count = 0;
    const loggedInTrigger = new BehaviorSubject(null);
    spyOn(securityApi, "isLoggedIn").and.callFake(() => {
      count++;
      return count === 1;
    });
    spyOn(securityApi, "getAuthTrigger").and.callFake(() => loggedInTrigger);
    spyOn(securityApi, "signOut").and.callFake(() => {
      const subject = new Subject<any>();

      setTimeout(() => {
        subject.complete();
      }, 50);

      return subject;
    });
    spyOn(router, "navigate").and.stub();
    spyOn(userApi, "show").and.callFake(() => {
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
    fixture.detectChanges();
    tick(100);
    fixture.detectChanges();

    const logout = fixture.nativeElement.querySelectorAll("button.nav-link")[1];
    logout.click();

    // Wait for sign out, and trigger logged in status update
    tick(100);
    loggedInTrigger.next(null);
    fixture.detectChanges();

    const link = fixture.nativeElement.querySelectorAll("a.nav-link")[4];
    expect(link).toBeTruthy();
    expect(link.innerText).toContain(loginMenuItem.label);
    expect(link.attributes.getNamedItem("ng-reflect-router-link")).toBeTruthy();
    expect(link.attributes.getNamedItem("ng-reflect-router-link").value).toBe(
      loginMenuItem.route.toString()
    );
  }));

  it("navbar should initially be collapsed", () => {
    viewport.set("medium");
    spyOn(securityApi, "isLoggedIn").and.callFake(() => {
      return false;
    });
    spyOn(securityApi, "getAuthTrigger").and.callFake(
      () => new BehaviorSubject(null)
    );
    fixture.detectChanges();

    const navbar = fixture.nativeElement.querySelector("div.collapse");
    expect(navbar).toBeTruthy();
  });

  it("navbar should open on toggle button press", () => {
    viewport.set("medium");
    spyOn(securityApi, "isLoggedIn").and.callFake(() => {
      return false;
    });
    spyOn(securityApi, "getAuthTrigger").and.callFake(
      () => new BehaviorSubject(null)
    );
    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector("button.navbar-toggler");
    expect(button).toBeTruthy();
    button.click();

    fixture.detectChanges();

    const navbar = fixture.nativeElement.querySelector("div.collapse");
    expect(navbar).toBeFalsy();
  });

  it("navbar should close on toggle button press", () => {
    viewport.set("medium");
    spyOn(securityApi, "isLoggedIn").and.callFake(() => {
      return false;
    });
    spyOn(securityApi, "getAuthTrigger").and.callFake(
      () => new BehaviorSubject(null)
    );
    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector("button.navbar-toggler");
    expect(button).toBeTruthy();
    button.click();
    fixture.detectChanges();

    button.click();
    fixture.detectChanges();

    const navbar = fixture.nativeElement.querySelector("div.collapse");
    expect(navbar).toBeTruthy();
  });

  xit("navbar should close on navigation", () => {});
});

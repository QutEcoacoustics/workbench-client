import { HttpClientTestingModule } from "@angular/common/http/testing";
import {
  async,
  ComponentFixture,
  fakeAsync,
  TestBed,
} from "@angular/core/testing";
import { Router } from "@angular/router";
import { RouterTestingModule } from "@angular/router/testing";
import { MockBawApiModule } from "@baw-api/baw-apiMock.module";
import { SecurityService } from "@baw-api/security/security.service";
import { generateSessionUser, generateUser } from "@test/fakes/User";
import { modelData } from "@test/helpers/faker";
import { assertImage, assertRoute } from "@test/helpers/html";
import { BehaviorSubject, Subject } from "rxjs";
import { appLibraryImports } from "src/app/app.module";
import { SessionUser } from "src/app/models/User";
import { AppConfigService } from "src/app/services/app-config/app-config.service";
import { contactUsMenuItem } from "../../about/about.menus";
import { adminDashboardMenuItem } from "../../admin/admin.menus";
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
  let api: SecurityService;
  let env: AppConfigService;
  let router: Router;

  function setUser(isLoggedIn: boolean, user?: SessionUser) {
    spyOn(api, "getLocalUser").and.callFake(() => (isLoggedIn ? user : null));
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        HeaderComponent,
        HeaderItemComponent,
        HeaderDropdownComponent,
      ],
      imports: [
        ...appLibraryImports,
        SharedModule,
        RouterTestingModule,
        HttpClientTestingModule,
        MockBawApiModule,
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderComponent);
    api = TestBed.inject(SecurityService);
    router = TestBed.inject(Router);
    env = TestBed.inject(AppConfigService);
    component = fixture.componentInstance;

    viewport.set("extra-large");
  });

  afterAll(() => {
    viewport.reset();
  });

  it("should create", () => {
    setUser(false);
    fixture.detectChanges();

    expect(component).toBeTruthy();
  });

  describe("links", () => {
    const userRoles = [
      { type: "guest", links: { register: true, login: true } },
      { type: "logged in", links: { profile: true, logout: true } },
      { type: "admin", links: { profile: true, logout: true, admin: true } },
    ];

    userRoles.forEach((userType) => {
      describe(userType.type + " user", () => {
        let isLoggedIn: boolean;
        let user: SessionUser;

        beforeEach(() => {
          if (userType.type === "guest") {
            isLoggedIn = false;
            user = undefined;
          } else {
            isLoggedIn = true;
            user = new SessionUser({
              id: 1,
              authToken: "xxxxxxxxxxxxxxx",
              userName: "Username",
              rolesMask: userType.type === "admin" ? 1 : 2,
              rolesMaskNames: userType.type === "user" ? ["user"] : ["admin"],
            });
          }
        });

        it("should create brand name link", () => {
          setUser(isLoggedIn, user);
          fixture.detectChanges();

          const brand = fixture.nativeElement.querySelector("a.navbar-brand");
          assertRoute(brand, homeMenuItem.route.toString());
          expect(brand.innerText).toContain(env.values.brand.name);
        });

        it("should create projects link", () => {
          setUser(isLoggedIn, user);
          fixture.detectChanges();

          const link = fixture.nativeElement.querySelectorAll("a.nav-link")[0];
          assertRoute(link, projectsMenuItem.route.toString());
          expect(link.innerText).toContain(projectsMenuItem.label);
        });

        it("should create contact us link", () => {
          setUser(isLoggedIn, user);
          fixture.detectChanges();

          const link = fixture.nativeElement.querySelectorAll("a.nav-link")[2];
          assertRoute(link, contactUsMenuItem.route.toString());
          expect(link.innerText).toContain(contactUsMenuItem.label);
        });

        it("should create header links from external config", () => {
          setUser(isLoggedIn, user);
          fixture.detectChanges();

          const link = fixture.nativeElement.querySelectorAll("a.nav-link")[1];
          expect(link).toBeTruthy();
          expect(link.innerText).toContain("<< content1 >>");
        });

        it("should create header dropdown links from external config", () => {
          setUser(isLoggedIn, user);
          fixture.detectChanges();

          const dropdown = fixture.nativeElement.querySelector(
            "baw-header-dropdown"
          );
          expect(dropdown).toBeTruthy();
          expect(
            dropdown.querySelector("button#dropdownBasic").innerText.trim()
          ).toBe("<< content2 >>");
          expect(dropdown.querySelectorAll(".dropdown-item").length).toBe(2);
        });

        it(
          "should" +
            (!userType.links.register ? " not" : "") +
            " display register link",
          () => {
            setUser(isLoggedIn, user);
            fixture.detectChanges();

            const link = fixture.nativeElement.querySelector(
              "#register-header-link"
            );

            if (userType.links.register) {
              assertRoute(link, registerMenuItem.route.toString());
              expect(link.innerText).toContain(registerMenuItem.label);
            } else {
              expect(link).toBeFalsy();
            }
          }
        );

        it(
          "should" +
            (!userType.links.login ? " not" : "") +
            " display login link",
          () => {
            setUser(isLoggedIn, user);
            fixture.detectChanges();

            const link = fixture.nativeElement.querySelector(
              "#login-header-link"
            );

            if (userType.links.login) {
              assertRoute(link, loginMenuItem.route.toString());
              expect(link.innerText).toContain(loginMenuItem.label);
            } else {
              expect(link).toBeFalsy();
            }
          }
        );

        it(
          "should" +
            (!userType.links.profile ? " not" : "") +
            " display profile name",
          fakeAsync(() => {
            setUser(isLoggedIn, user);
            fixture.detectChanges();

            const profile = fixture.nativeElement.querySelector(
              "#login-widget"
            );

            if (userType.links.profile) {
              assertRoute(profile, myAccountMenuItem.route.toString());
              expect(profile.innerText.trim()).toBe("Username");
            } else {
              expect(profile).toBeFalsy();
            }
          })
        );

        if (userType.links.profile) {
          it("should display default profile icon", fakeAsync(() => {
            setUser(isLoggedIn, user);
            fixture.detectChanges();

            const profile = fixture.nativeElement.querySelector(
              "#login-widget"
            );
            const image = profile.querySelector("img");
            assertImage(
              image,
              `http://${window.location.host}/assets/images/user/user_span4.png`,
              "Profile Icon"
            );
          }));

          it("should display small profile custom icon", fakeAsync(() => {
            const url = modelData.image.imageUrl(60, 60);
            const customUser = new SessionUser({
              ...user,
              imageUrls: [
                {
                  size: "medium",
                  url: modelData.image.imageUrl(140, 140),
                  width: 140,
                  height: 140,
                },
                {
                  size: "small",
                  url,
                  width: 60,
                  height: 60,
                },
                {
                  size: "tiny",
                  url: modelData.image.imageUrl(30, 30),
                  width: 30,
                  height: 30,
                },
              ],
            });
            setUser(isLoggedIn, customUser);
            fixture.detectChanges();

            const profile = fixture.nativeElement.querySelector(
              "#login-widget"
            );
            const image = profile.querySelector("img");
            assertImage(image, url, "Profile Icon");
          }));
        }

        it(
          "should" + (!userType.links.logout ? " not" : "") + " display logout",
          fakeAsync(() => {
            setUser(isLoggedIn, user);
            fixture.detectChanges();

            const logout = fixture.nativeElement.querySelectorAll(
              "button.nav-link"
            )[1];

            if (userType.links.logout) {
              expect(logout).toBeTruthy();
              expect(logout.innerText.trim()).toBe("Logout");
            } else {
              expect(logout).toBeFalsy();
            }
          })
        );

        it(
          "should" +
            (!userType.links.admin ? " not" : "") +
            " display admin settings",
          fakeAsync(() => {
            setUser(isLoggedIn, user);
            fixture.detectChanges();

            const settings = fixture.nativeElement.querySelector(
              "#admin-settings"
            );

            if (userType.links.admin) {
              expect(settings).toBeTruthy();
              assertRoute(settings, adminDashboardMenuItem.route.toString());
            } else {
              expect(settings).toBeFalsy();
            }
          })
        );
      });
    });
  });

  describe("logout", () => {
    it("should call signOut when logout button pressed", fakeAsync(() => {
      setUser(
        true,
        new SessionUser({
          id: 1,
          authToken: "xxxxxxxxxxxxxxx",
          userName: "custom username",
          rolesMask: 2,
          rolesMaskNames: ["user"],
          lastSeenAt: "2019-12-18T11:16:08.233+10:00",
        })
      );
      spyOn(api, "signOut").and.callFake(() => {
        return new BehaviorSubject<void>(null);
      });
      fixture.detectChanges();

      const logout = fixture.nativeElement.querySelectorAll(
        "button.nav-link"
      )[1];
      logout.click();

      expect(api.signOut).toHaveBeenCalled();
    }));

    it("should redirect to home page when logout successful", fakeAsync(() => {
      setUser(
        true,
        new SessionUser({ ...generateSessionUser(), ...generateUser() })
      );
      spyOn(api, "signOut").and.callFake(() => {
        const subject = new Subject<void>();
        subject.complete();
        return subject;
      });
      spyOn(router, "navigate").and.stub();
      fixture.detectChanges();

      const logout = fixture.nativeElement.querySelectorAll(
        "button.nav-link"
      )[1];
      logout.click();

      expect(router.navigate).toHaveBeenCalledWith([
        homeMenuItem.route.toString(),
      ]);
    }));

    // TODO Move to E2E Tests
    it("should display register after logout", fakeAsync(() => {
      let count = 0;
      const loggedInTrigger = new BehaviorSubject(null);
      spyOn(api, "getAuthTrigger").and.callFake(() => loggedInTrigger);
      spyOn(api, "signOut").and.callFake(() => {
        const subject = new Subject<any>();
        subject.complete();
        return subject;
      });
      spyOn(router, "navigate").and.stub();
      spyOn(api, "getLocalUser").and.callFake(() => {
        if (count !== 0) {
          return null;
        } else {
          count++;
        }

        return new SessionUser({ ...generateSessionUser(), ...generateUser() });
      });
      fixture.detectChanges();

      const logout = fixture.nativeElement.querySelectorAll(
        "button.nav-link"
      )[1];
      logout.click();

      // Wait for sign out, and trigger logged in status update
      loggedInTrigger.next(null);
      fixture.detectChanges();

      const link = fixture.nativeElement.querySelectorAll("a.nav-link")[3];
      expect(link).toBeTruthy();
      expect(link.innerText).toContain(registerMenuItem.label);
      assertRoute(link, registerMenuItem.route.toString());
    }));

    // TODO Move to E2E Tests
    it("should display login after logout", fakeAsync(() => {
      let count = 0;
      const loggedInTrigger = new BehaviorSubject(null);
      spyOn(api, "getAuthTrigger").and.callFake(() => loggedInTrigger);
      spyOn(api, "signOut").and.callFake(() => {
        const subject = new Subject<any>();
        subject.complete();
        return subject;
      });
      spyOn(router, "navigate").and.stub();
      spyOn(api, "getLocalUser").and.callFake(() => {
        if (count !== 0) {
          return null;
        } else {
          count++;
        }

        return new SessionUser({ ...generateSessionUser(), ...generateUser() });
      });
      fixture.detectChanges();

      const logout = fixture.nativeElement.querySelectorAll(
        "button.nav-link"
      )[1];
      logout.click();

      // Wait for sign out, and trigger logged in status update
      loggedInTrigger.next(null);
      fixture.detectChanges();

      const link = fixture.nativeElement.querySelectorAll("a.nav-link")[4];
      expect(link).toBeTruthy();
      expect(link.innerText).toContain(loginMenuItem.label);
      assertRoute(link, loginMenuItem.route.toString());
    }));
  });

  // TODO Fix these tests, they don't appear to actually tests the component
  describe("navbar collapsed logic", () => {
    it("should collapse at bootstrap md size", () => {
      setUser(false);
      fixture.detectChanges();

      const navbar = fixture.nativeElement.querySelector("nav");
      let expandLgClass = false;
      navbar.classList.forEach((className: string) => {
        if (className === "navbar-expand-lg") {
          expandLgClass = true;
        }
      });
      expect(expandLgClass).toBeTrue();

      const button = fixture.nativeElement.querySelector(
        "button.navbar-toggler"
      );
      expect(button).toBeTruthy();
    });

    it("navbar should initially be collapsed", () => {
      viewport.set("medium");
      setUser(false);
      fixture.detectChanges();

      const navbar = fixture.nativeElement.querySelector("div.collapse");
      expect(navbar).toBeTruthy();
    });

    it("navbar should open on toggle button press", () => {
      viewport.set("medium");
      setUser(false);
      fixture.detectChanges();

      const button = fixture.nativeElement.querySelector(
        "button.navbar-toggler"
      );
      button.click();
      fixture.detectChanges();

      const navbar = fixture.nativeElement.querySelector("div.collapse");
      expect(navbar).toBeFalsy();
    });

    it("navbar should close on toggle button press", () => {
      viewport.set("medium");
      setUser(false);
      fixture.detectChanges();

      const button = fixture.nativeElement.querySelector(
        "button.navbar-toggler"
      );
      button.click();
      fixture.detectChanges();

      button.click();
      fixture.detectChanges();

      const navbar = fixture.nativeElement.querySelector("div.collapse");
      expect(navbar).toBeTruthy();
    });

    xit("navbar should close on navigation", () => {});
  });
});

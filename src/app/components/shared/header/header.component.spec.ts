import { fakeAsync } from "@angular/core/testing";
import { Router } from "@angular/router";
import { RouterTestingModule } from "@angular/router/testing";
import { MockBawApiModule } from "@baw-api/baw-apiMock.module";
import { SecurityService } from "@baw-api/security/security.service";
import { libraryMenuItem } from "@components/library/library.menus";
import { listenMenuItem } from "@components/listen/listen.menus";
import { AuthenticatedImageModule } from "@directives/image/image.module";
import { SessionUser } from "@models/User";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { createComponentFactory, Spectator } from "@ngneat/spectator";
import { ConfigService, assetRoot } from "@services/config/config.service";
import { IconsModule } from "@shared/icons/icons.module";
import { generateSessionUser, generateUser } from "@test/fakes/User";
import { modelData } from "@test/helpers/faker";
import { viewports } from "@test/helpers/general";
import { assertImage, assertRoute } from "@test/helpers/html";
import { websiteHttpUrl } from "@test/helpers/url";
import { MockProvider } from "ng-mocks";
import { ToastrService } from "ngx-toastr";
import { BehaviorSubject, Subject } from "rxjs";
import { contactUsMenuItem } from "../../about/about.menus";
import { adminDashboardMenuItem } from "../../admin/admin.menus";
import { homeMenuItem } from "../../home/home.menus";
import { myAccountMenuItem } from "../../profile/profile.menus";
import { projectsMenuItem } from "../../projects/projects.menus";
import { loginMenuItem, registerMenuItem } from "../../security/security.menus";
import { HeaderDropdownComponent } from "./header-dropdown/header-dropdown.component";
import { HeaderItemComponent } from "./header-item/header-item.component";
import { HeaderComponent } from "./header.component";

describe("HeaderComponent", () => {
  let api: SecurityService;
  let config: ConfigService;
  let router: Router;
  let spec: Spectator<HeaderComponent>;
  const createComponent = createComponentFactory({
    component: HeaderComponent,
    providers: [MockProvider(ToastrService)],
    declarations: [
      HeaderComponent,
      HeaderItemComponent,
      HeaderDropdownComponent,
    ],
    imports: [
      RouterTestingModule,
      MockBawApiModule,
      NgbModule,
      AuthenticatedImageModule,
      IconsModule,
    ],
  });

  function setUser(isLoggedIn: boolean, user?: SessionUser) {
    spyOn(api, "getLocalUser").and.callFake(() => (isLoggedIn ? user : null));
  }

  beforeEach(() => {
    spec = createComponent({ detectChanges: false });
    spec.component["reloadPage"] = jasmine.createSpy().and.stub();

    api = spec.inject(SecurityService);
    config = spec.inject(ConfigService);
    router = spec.inject(Router);
    viewport.set(viewports.extraLarge);
  });

  afterAll(() => viewport.reset());

  it("should create", () => {
    setUser(false);
    spec.detectChanges();
    expect(spec.component).toBeTruthy();
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
        let defaultUser: SessionUser;
        const linkIndex = {
          project: 0,
          listen: 1,
          library: 2,
          contactUs: 4,
        };

        function getNavLinks() {
          return spec.queryAll<HTMLElement>("a.nav-link");
        }

        beforeEach(() => {
          if (userType.type === "guest") {
            isLoggedIn = false;
            defaultUser = undefined;
          } else {
            isLoggedIn = true;
            defaultUser = new SessionUser({
              ...generateUser(),
              ...generateSessionUser(),
              rolesMask: userType.type === "admin" ? 1 : 2,
              rolesMaskNames: userType.type === "user" ? ["user"] : ["admin"],
            });
          }
        });

        it("should create brand name link", () => {
          setUser(isLoggedIn, defaultUser);
          spec.detectChanges();

          const brand = spec.query<HTMLElement>("a.navbar-brand");
          assertRoute(brand, homeMenuItem.route.toRouterLink());
          expect(brand.innerText).toContain(config.values.brand.name);
        });

        [
          { link: "projects", index: 0, menuItem: projectsMenuItem },
          { link: "listen", index: 1, menuItem: listenMenuItem },
          { link: "library", index: 2, menuItem: libraryMenuItem },
          { link: "contact us", index: 4, menuItem: contactUsMenuItem },
        ].forEach(({ link, index, menuItem }) => {
          it(`should create ${link} link`, () => {
            setUser(isLoggedIn, defaultUser);
            spec.detectChanges();

            const item = getNavLinks()[index];
            assertRoute(item, menuItem.route.toRouterLink());
            expect(item.innerText).toContain(menuItem.label);
          });
        });

        it("should create header links from external config", () => {
          setUser(isLoggedIn, defaultUser);
          spec.detectChanges();

          const link = getNavLinks()[3];
          expect(link).toBeTruthy();
          expect(link.innerText).toContain("<< content1 >>");
        });

        it("should create header dropdown links from external config", () => {
          setUser(isLoggedIn, defaultUser);
          spec.detectChanges();

          const dropdown = spec.query<HTMLElement>("baw-header-dropdown");
          expect(dropdown).toBeTruthy();
          expect(
            dropdown
              .querySelector<HTMLElement>("button#dropdownBasic")
              .innerText.trim()
          ).toBe("<< content2 >>");
          expect(dropdown.querySelectorAll(".dropdown-item").length).toBe(2);
        });

        it(`should ${
          !userType.links.register ? "not " : ""
        }display register link`, () => {
          setUser(isLoggedIn, defaultUser);
          spec.detectChanges();

          const link = spec.query<HTMLElement>("#register-header-link");

          if (userType.links.register) {
            assertRoute(link, registerMenuItem.route.toRouterLink());
            expect(link.innerText).toContain(registerMenuItem.label);
          } else {
            expect(link).toBeFalsy();
          }
        });

        it(`should ${
          !userType.links.login ? "not " : ""
        }display login link`, () => {
          setUser(isLoggedIn, defaultUser);
          spec.detectChanges();

          const link = spec.query<HTMLElement>("#login-header-link");

          if (userType.links.login) {
            assertRoute(link, loginMenuItem.route.toRouterLink());
            expect(link.innerText).toContain(loginMenuItem.label);
          } else {
            expect(link).toBeFalsy();
          }
        });

        it(`should ${
          !userType.links.profile ? "not " : ""
        }display profile link`, () => {
          setUser(isLoggedIn, defaultUser);
          spec.detectChanges();

          const profile = spec.query<HTMLElement>("#login-widget");

          if (userType.links.profile) {
            assertRoute(profile, myAccountMenuItem.route.toRouterLink());
            expect(profile.innerText.trim()).toBe(defaultUser.userName);
          } else {
            expect(profile).toBeFalsy();
          }
        });

        if (userType.links.profile) {
          it("should display default profile icon", () => {
            const user = new SessionUser({
              ...defaultUser.toJSON(),
              imageUrls: undefined,
            });
            setUser(isLoggedIn, user);
            spec.detectChanges();

            const profile = spec.query<HTMLElement>("#login-widget");
            const image = profile.querySelector("img");
            assertImage(
              image,
              `${websiteHttpUrl}${assetRoot}/images/user/user_span4.png`,
              "Profile Icon"
            );
          });

          it("should display small profile custom icon", () => {
            const url = modelData.image.imageUrl(60, 60);
            const imageUrls = modelData.imageUrls();
            imageUrls[3].url = url;
            const customUser = new SessionUser({ ...defaultUser, imageUrls });
            setUser(isLoggedIn, customUser);
            spec.detectChanges();

            const profile = spec.query<HTMLElement>("#login-widget");
            const image = profile.querySelector("img");
            assertImage(image, url, "Profile Icon");
          });
        }

        it(`should ${
          !userType.links.logout ? "not " : ""
        }display logout`, () => {
          setUser(isLoggedIn, defaultUser);
          spec.detectChanges();

          const logout = spec.queryAll<HTMLElement>("button.nav-link")[1];

          if (userType.links.logout) {
            expect(logout).toBeTruthy();
            expect(logout.innerText.trim()).toBe("Logout");
          } else {
            expect(logout).toBeFalsy();
          }
        });

        it(`should ${
          !userType.links.admin ? "not " : ""
        } display admin settings`, () => {
          setUser(isLoggedIn, defaultUser);
          spec.detectChanges();

          const settings = spec.query<HTMLElement>("#admin-settings");

          if (userType.links.admin) {
            expect(settings).toBeTruthy();
            assertRoute(settings, adminDashboardMenuItem.route.toRouterLink());
          } else {
            expect(settings).toBeFalsy();
          }
        });
      });
    });
  });

  describe("logout", () => {
    let defaultUser: SessionUser;

    function getLogoutButton() {
      return spec.queryAll<HTMLButtonElement>("button.nav-link")[1];
    }

    function handleLogout() {
      spyOn(api, "signOut").and.callFake(() => {
        const subject = new Subject<void>();
        subject.complete();
        return subject;
      });
    }

    beforeEach(() => {
      defaultUser = new SessionUser({
        ...generateUser(),
        ...generateSessionUser(),
      });
    });

    it("should call signOut when logout button pressed", () => {
      setUser(true, defaultUser);
      spyOn(api, "signOut").and.callFake(() => new BehaviorSubject<void>(null));
      spec.detectChanges();

      getLogoutButton().click();
      expect(api.signOut).toHaveBeenCalled();
    });

    it("should reload page when logging out", () => {
      setUser(true, defaultUser);
      handleLogout();
      spec.detectChanges();

      getLogoutButton().click();
      expect(spec.component["reloadPage"]).toHaveBeenCalled();
    });

    it("should redirect to home page when logging out if location is undefined", () => {
      setUser(true, defaultUser);
      handleLogout();
      spyOn(router, "navigateByUrl").and.stub();
      spec.component["hasLocationGlobal"] = jasmine
        .createSpy()
        .and.callFake(() => false);
      spec.detectChanges();

      getLogoutButton().click();
      expect(router.navigateByUrl).toHaveBeenCalledWith(
        homeMenuItem.route.toRouterLink()
      );
    });

    // TODO Move to E2E Tests
    it("should display register after logout", () => {
      let count = 0;
      const loggedInTrigger = new BehaviorSubject(null);
      handleLogout();
      spyOn(api, "getAuthTrigger").and.callFake(() => loggedInTrigger);
      spyOn(api, "getLocalUser").and.callFake(() => {
        if (count !== 0) {
          return null;
        }
        count++;
        return defaultUser;
      });
      spec.detectChanges();

      // Wait for sign out, and trigger logged in status update
      getLogoutButton().click();
      loggedInTrigger.next(null);
      spec.detectChanges();

      const link = spec.queryAll<HTMLElement>("a.nav-link")[5];
      expect(link).toBeTruthy();
      expect(link.innerText).toContain(registerMenuItem.label);
      assertRoute(link, registerMenuItem.route.toRouterLink());
    });

    // TODO Move to E2E Tests
    it("should display login after logout", fakeAsync(() => {
      let count = 0;
      const loggedInTrigger = new BehaviorSubject(null);
      handleLogout();
      spyOn(api, "getAuthTrigger").and.callFake(() => loggedInTrigger);
      spyOn(api, "getLocalUser").and.callFake(() => {
        if (count !== 0) {
          return null;
        }
        count++;
        return defaultUser;
      });
      spec.detectChanges();

      // Wait for sign out, and trigger logged in status update
      getLogoutButton().click();
      loggedInTrigger.next(null);
      spec.detectChanges();

      const link = spec.queryAll<HTMLElement>("a.nav-link")[6];
      expect(link).toBeTruthy();
      expect(link.innerText).toContain(loginMenuItem.label);
      assertRoute(link, loginMenuItem.route.toRouterLink());
    }));
  });

  describe("navbar collapse logic", () => {
    function getToggleButton() {
      return spec.query<HTMLButtonElement>("button.navbar-toggler");
    }

    function assertCollapsed(isCollapsed: boolean) {
      const nav = spec.query<HTMLElement>(".navbar-collapse");

      if (isCollapsed) {
        expect(nav).toHaveClass("collapse");
      } else {
        expect(nav).not.toHaveClass("collapse");
      }
    }

    it("should set navbar to use large bootstrap navbar class", () => {
      setUser(false);
      spec.detectChanges();

      const nav = spec.query<HTMLElement>("nav");
      expect(nav).toHaveClass("navbar");
      expect(nav).toHaveClass("navbar-expand-lg");
    });

    it("should hide toggle button at large screen size", () => {
      viewport.set(viewports.large);
      setUser(false);
      spec.detectChanges();
      expect(getToggleButton()).toHaveStyle({ display: "none" });
    });

    it("should display toggle button at medium screen size", () => {
      viewport.set(viewports.medium);
      setUser(false);
      spec.detectChanges();
      expect(getToggleButton()).not.toHaveStyle({ display: "none" });
    });

    it("navbar should initially be collapsed", () => {
      viewport.set(viewports.medium);
      setUser(false);
      spec.detectChanges();
      assertCollapsed(true);
    });

    it("navbar should open on toggle button press", () => {
      viewport.set(viewports.medium);
      setUser(false);
      spec.detectChanges();

      // Open navbar
      getToggleButton().click();
      spec.detectChanges();

      assertCollapsed(false);
    });

    it("navbar should close on toggle button press", () => {
      viewport.set(viewports.medium);
      setUser(false);
      spec.detectChanges();

      // Open and close navbar
      const button = getToggleButton();
      button.click();
      spec.detectChanges();
      button.click();
      spec.detectChanges();

      assertCollapsed(true);
    });

    xit("navbar should close on navigation", () => {});
  });
});

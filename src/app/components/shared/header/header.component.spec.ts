import { fakeAsync } from "@angular/core/testing";
import { Router } from "@angular/router";
import { RouterTestingModule } from "@angular/router/testing";
import { MockBawApiModule } from "@baw-api/baw-apiMock.module";
import { SecurityService } from "@baw-api/security/security.service";
import { libraryMenuItem } from "@components/library/library.menus";
import { listenMenuItem } from "@components/listen/listen.menus";
import { shallowRegionsMenuItem } from "@components/regions/regions.menus";
import { DirectivesModule } from "@directives/directives.module";
import { AuthenticatedImageModule } from "@directives/image/image.module";
import { Settings } from "@helpers/app-initializer/app-initializer";
import { SessionUser } from "@models/User";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { createComponentFactory, Spectator } from "@ngneat/spectator";
import { assetRoot, ConfigService } from "@services/config/config.service";
import { testApiConfig } from "@services/config/configMock.service";
import { IconsModule } from "@shared/icons/icons.module";
import { generateSessionUser, generateUser } from "@test/fakes/User";
import { modelData } from "@test/helpers/faker";
import { viewports } from "@test/helpers/general";
import {
  assertImage,
  assertStrongRouteLink,
  assertUrl,
} from "@test/helpers/html";
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
      DirectivesModule,
    ],
  });

  function setUser(isLoggedIn: boolean, user?: SessionUser) {
    spyOn(api, "getLocalUser").and.callFake(() => (isLoggedIn ? user : null));
  }

  function setConfigHideProjects(hidden: boolean) {
    spyOnProperty(config, "settings").and.callFake(
      () => ({ ...testApiConfig.settings, hideProjects: !!hidden } as Settings)
    );
    config.settings.hideProjects = hidden;
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
      { type: "guest" as const, links: { register: true, login: true } },
      { type: "logged in" as const, links: { profile: true, logout: true } },
      {
        type: "admin" as const,
        links: { profile: true, logout: true, admin: true },
      },
    ];

    userRoles.forEach(({ type, links }) => {
      describe(type + " user", () => {
        let isLoggedIn: boolean;
        let isAdmin: boolean;
        let defaultUser: SessionUser;

        function getNavLinks() {
          return spec.queryAll<HTMLElement>("a.nav-link");
        }

        beforeEach(() => {
          if (type === "guest") {
            isLoggedIn = false;
            defaultUser = undefined;
          } else {
            isLoggedIn = true;
            isAdmin = type === "admin";
            defaultUser = new SessionUser({
              ...generateSessionUser({}, generateUser({}, isAdmin)),
            });
          }
        });

        it("should create brand name link", () => {
          setUser(isLoggedIn, defaultUser);
          spec.detectChanges();

          const brand = spec.query<HTMLElement>("a.navbar-brand");
          expect(brand).toContainText(config.settings.brand.short);
          assertStrongRouteLink(brand, homeMenuItem.route.toRouterLink());
        });

        [
          {
            link: "sites",
            index: 0,
            menuItem: shallowRegionsMenuItem,
            hideProject: true,
          },
          { link: "projects", index: 0, menuItem: projectsMenuItem },
          { link: "listen", index: 1, menuItem: listenMenuItem },
          { link: "library", index: 2, menuItem: libraryMenuItem },
          { link: "contact us", index: 4, menuItem: contactUsMenuItem },
        ].forEach(({ link, index, menuItem, hideProject }) => {
          it(`should create ${link} link`, () => {
            setConfigHideProjects(!!hideProject);
            setUser(isLoggedIn, defaultUser);
            spec.detectChanges();

            const item = getNavLinks()[index];
            expect(item).toContainText(menuItem.label);
            assertStrongRouteLink(item, menuItem.route.toRouterLink());
          });
        });

        it("should create header links from external config", () => {
          setUser(isLoggedIn, defaultUser);
          spec.detectChanges();

          const link = getNavLinks()[3];
          expect(link).toContainText("<< content1 >>");
        });

        it("should create header dropdown links from external config", () => {
          setUser(isLoggedIn, defaultUser);
          spec.detectChanges();

          const dropdown = spec.query("baw-header-dropdown");
          expect(dropdown).toBeTruthy();
          expect(dropdown.querySelector("button#dropdownBasic")).toContainText(
            "<< content2 >>"
          );
          expect(dropdown.querySelectorAll(".dropdown-item").length).toBe(2);
        });

        it(`should ${
          !links.register ? "not " : ""
        }display register link`, () => {
          setUser(isLoggedIn, defaultUser);
          spec.detectChanges();

          const link = spec.query<HTMLElement>("#register-header-link");

          if (links.register) {
            assertStrongRouteLink(link, registerMenuItem.route.toRouterLink());
            expect(link).toContainText(registerMenuItem.label);
          } else {
            expect(link).toBeFalsy();
          }
        });

        it(`should ${!links.login ? "not " : ""}display login link`, () => {
          setUser(isLoggedIn, defaultUser);
          spec.detectChanges();

          const link = spec.query<HTMLElement>("#logIn-header-link");

          if (links.login) {
            assertStrongRouteLink(link, loginMenuItem.route.toRouterLink());
            expect(link).toContainText(loginMenuItem.label);
          } else {
            expect(link).toBeFalsy();
          }
        });

        it(`should ${!links.profile ? "not " : ""}display profile link`, () => {
          setUser(isLoggedIn, defaultUser);
          spec.detectChanges();

          const profile = spec.query<HTMLElement>("#login-widget");

          if (links.profile) {
            assertUrl(profile, myAccountMenuItem.route.toRouterLink());
            expect(profile).toContainText(defaultUser.userName);
          } else {
            expect(profile).toBeFalsy();
          }
        });

        if (links.profile) {
          it("should display default profile icon", () => {
            const user = new SessionUser(
              generateSessionUser(
                {},
                generateUser({ imageUrls: undefined }, isAdmin)
              )
            );
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

          it("should display profile custom icon", () => {
            const imageUrls = modelData.imageUrls();
            const customUser = new SessionUser(generateUser({ imageUrls }));
            setUser(isLoggedIn, customUser);
            spec.detectChanges();

            const profile = spec.query<HTMLElement>("#login-widget");
            const image = profile.querySelector("img");
            assertImage(image, imageUrls[0].url, "Profile Icon");
          });
        }

        it(`should ${!links.logout ? "not " : ""}display logout`, () => {
          setUser(isLoggedIn, defaultUser);
          spec.detectChanges();

          const logout = spec.queryAll<HTMLElement>("button.nav-link")[1];

          if (links.logout) {
            expect(logout).toContainText("Logout");
          } else {
            expect(logout).toBeFalsy();
          }
        });

        it(`should ${
          !links.admin ? "not " : ""
        } display admin settings`, () => {
          setUser(isLoggedIn, defaultUser);
          spec.detectChanges();

          const settings = spec.query<HTMLElement>("#adminHome-header-link");

          if (links.admin) {
            expect(settings).toBeTruthy();
            assertStrongRouteLink(
              settings,
              adminDashboardMenuItem.route.toRouterLink()
            );
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
      expect(link).toContainText(registerMenuItem.label);
      assertStrongRouteLink(link, registerMenuItem.route.toRouterLink());
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
      expect(link).toContainText(loginMenuItem.label);
      assertStrongRouteLink(link, loginMenuItem.route.toRouterLink());
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

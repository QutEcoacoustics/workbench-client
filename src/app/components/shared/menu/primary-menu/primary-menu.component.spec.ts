import { fakeAsync } from "@angular/core/testing";
import { Router } from "@angular/router";
import { RouterTestingModule } from "@angular/router/testing";
import { MockBawApiModule } from "@baw-api/baw-apiMock.module";
import { SecurityService } from "@baw-api/security/security.service";
import { contactUsMenuItem } from "@components/about/about.menus";
import { adminDashboardMenuItem } from "@components/admin/admin.menus";
import { homeMenuItem } from "@components/home/home.menus";
import { libraryMenuItem } from "@components/library/library.menus";
import { listenMenuItem } from "@components/listen/listen.menus";
import { myAccountMenuItem } from "@components/profile/profile.menus";
import { projectsMenuItem } from "@components/projects/projects.menus";
import { shallowRegionsMenuItem } from "@components/regions/regions.menus";
import {
  loginMenuItem,
  registerMenuItem,
} from "@components/security/security.menus";
import { DirectivesModule } from "@directives/directives.module";
import { AuthenticatedImageModule } from "@directives/image/image.module";
import {
  CustomMenuItem,
  Settings,
} from "@helpers/app-initializer/app-initializer";
import { Session } from "@models/User";
import { createComponentFactory, Spectator } from "@ngneat/spectator";
import { assetRoot, ConfigService } from "@services/config/config.service";
import { MenuService } from "@services/menu/menu.service";
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
import { HeaderDropdownComponent } from "../header-dropdown/header-dropdown.component";
import { HeaderItemComponent } from "../header-item/header-item.component";
import { PrimaryMenuComponent } from "./primary-menu.component";

describe("PrimaryMenuComponent", () => {
  let api: SecurityService;
  let router: Router;
  let spec: Spectator<PrimaryMenuComponent>;
  const createComponent = createComponentFactory({
    component: PrimaryMenuComponent,
    providers: [MockProvider(ToastrService)],
    declarations: [HeaderItemComponent, HeaderDropdownComponent],
    imports: [
      RouterTestingModule,
      MockBawApiModule,
      AuthenticatedImageModule,
      IconsModule,
      DirectivesModule,
    ],
  });

  /**
   * @param props.user If null or set, will intercept getLocalUser and return
   * value. Will do nothing if undefined
   */
  function setup(props: {
    hideProjects?: boolean;
    customMenu?: CustomMenuItem[];
    isFullscreen?: boolean;
    isSideNav?: boolean;
    user?: Session;
  }) {
    spec = createComponent({
      detectChanges: false,
      providers: [
        MockProvider(ConfigService, {
          settings: {
            hideProjects: props?.hideProjects ?? false,
            customMenu: props.customMenu ?? [],
          } as Settings,
        }),
        MockProvider(MenuService, {
          isFullscreen: props?.isFullscreen ?? false,
        }),
      ],
      props: { isSideNav: props?.isSideNav ?? false },
    });
    spec.component["reloadPage"] = jasmine.createSpy().and.stub();

    api = spec.inject(SecurityService);
    router = spec.inject(Router);

    if (props?.user !== undefined) {
      spyOn(api, "getLocalUser").and.callFake(() => props?.user ?? null);
    }
  }

  afterEach(() => {
    viewport.reset();
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
        let isAdmin: boolean;
        let defaultUser: Session | null;

        function getNavLinks() {
          return spec.queryAll<HTMLElement>("a.nav-link");
        }

        beforeEach(() => {
          if (type === "guest") {
            defaultUser = null;
          } else {
            isAdmin = type === "admin";
            defaultUser = new Session({
              ...generateSessionUser({}, generateUser({}, isAdmin)),
            });
          }
        });

        [
          {
            link: "sites",
            index: 0,
            menuItem: shallowRegionsMenuItem,
            hideProjects: true,
          },
          { link: "projects", index: 0, menuItem: projectsMenuItem },
          { link: "listen", index: 1, menuItem: listenMenuItem },
          { link: "library", index: 2, menuItem: libraryMenuItem },
          { link: "contact us", index: 3, menuItem: contactUsMenuItem },
        ].forEach(({ link, index, menuItem, hideProjects }) => {
          it(`should create ${link} link`, () => {
            setup({ hideProjects, user: defaultUser });
            spec.detectChanges();

            const item = getNavLinks()[index];
            expect(item).toContainText(menuItem.label);
            assertStrongRouteLink(item, menuItem.route.toRouterLink());
          });
        });

        it("should create header links from external config", () => {
          setup({
            user: defaultUser,
            customMenu: [
              {
                title: "<< content1 >>",
                url: "<< contentUrl1 >>",
              },
            ],
          });
          spec.detectChanges();

          const link = getNavLinks()[3];
          expect(link).toContainText("<< content1 >>");
        });

        it("should create header dropdown links from external config", () => {
          setup({
            user: defaultUser,
            customMenu: [
              {
                title: "<< content2 >>",
                items: [
                  {
                    title: "<< content3 >>",
                    url: "<< contentUrl3 >>",
                  },
                  {
                    title: "<< content4 >>",
                    url: "<< contentUrl4 >>",
                  },
                ],
              },
            ],
          });
          spec.detectChanges();

          const dropdown = spec.query("baw-header-dropdown");
          expect(dropdown).toBeTruthy();
          expect(dropdown.querySelector("button")).toContainText(
            "<< content2 >>"
          );
          expect(dropdown.querySelectorAll("a").length).toBe(2);
        });

        it(`should ${
          !links.register ? "not " : ""
        }display register link`, () => {
          setup({ user: defaultUser });
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
          setup({ user: defaultUser });
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
          setup({ user: defaultUser });
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
            const user = new Session(
              generateSessionUser(
                {},
                generateUser({ imageUrls: undefined }, isAdmin)
              )
            );
            setup({ user });
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
            const customUser = new Session(generateUser({ imageUrls }));
            setup({ user: customUser });
            spec.detectChanges();

            const profile = spec.query<HTMLElement>("#login-widget");
            const image = profile.querySelector("img");
            assertImage(image, imageUrls[0].url, "Profile Icon");
          });
        }

        it(`should ${!links.logout ? "not " : ""}display logout`, () => {
          setup({ user: defaultUser });
          spec.detectChanges();

          const logout = spec.query<HTMLElement>("#logout-header-link");

          if (links.logout) {
            expect(logout).toContainText("Logout");
          } else {
            expect(logout).toBeFalsy();
          }
        });

        it(`should ${
          !links.admin ? "not " : ""
        } display admin settings`, () => {
          setup({ user: defaultUser });
          spec.detectChanges();

          const settings = spec.query<HTMLElement>("#admin-header-link");

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
    let defaultUser: Session;

    function getLogoutButton() {
      return spec.query<HTMLButtonElement>("#logout-header-link");
    }

    function handleLogout() {
      spyOn(api, "signOut").and.callFake(() => {
        const subject = new Subject<void>();
        subject.complete();
        return subject;
      });
    }

    beforeEach(() => {
      defaultUser = new Session({
        ...generateUser(),
        ...generateSessionUser(),
      });
    });

    it("should call signOut when logout button pressed", () => {
      setup({ user: defaultUser });
      spyOn(api, "signOut").and.callFake(() => new BehaviorSubject<void>(null));
      spec.detectChanges();

      getLogoutButton().click();
      expect(api.signOut).toHaveBeenCalled();
    });

    it("should reload page when logging out", () => {
      setup({ user: defaultUser });
      handleLogout();
      spec.detectChanges();

      getLogoutButton().click();
      expect(spec.component["reloadPage"]).toHaveBeenCalled();
    });

    it("should redirect to home page when logging out if location is undefined", () => {
      setup({ user: defaultUser });
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

    function getLoggedInTrigger() {
      const loggedInTrigger = new BehaviorSubject(null);
      spyOn(api, "getAuthTrigger").and.callFake(() => loggedInTrigger);
      return loggedInTrigger;
    }

    function onFirstLoadSetGuestUserOnSecondLoadSetLoggedIn() {
      let count = 0;
      spyOn(api, "getLocalUser").and.callFake(() => {
        if (count !== 0) {
          return null;
        }
        count++;
        return defaultUser;
      });
    }

    // TODO Move to E2E Tests
    it("should display register after logout", () => {
      setup({ user: undefined });
      handleLogout();
      const loggedInTrigger = getLoggedInTrigger();
      onFirstLoadSetGuestUserOnSecondLoadSetLoggedIn();
      spec.detectChanges();

      // Wait for sign out, and trigger logged in status update
      getLogoutButton().click();
      loggedInTrigger.next(null);
      spec.detectChanges();

      const link = spec.queryAll<HTMLElement>("a.nav-link")[4];
      expect(link).toContainText(registerMenuItem.label);
      assertStrongRouteLink(link, registerMenuItem.route.toRouterLink());
    });

    // TODO Move to E2E Tests
    it("should display login after logout", fakeAsync(() => {
      setup({ user: undefined });
      handleLogout();
      const loggedInTrigger = getLoggedInTrigger();
      onFirstLoadSetGuestUserOnSecondLoadSetLoggedIn();
      spec.detectChanges();

      // Wait for sign out, and trigger logged in status update
      getLogoutButton().click();
      loggedInTrigger.next(null);
      spec.detectChanges();

      const link = spec.queryAll<HTMLElement>("a.nav-link")[5];
      expect(link).toContainText(loginMenuItem.label);
      assertStrongRouteLink(link, loginMenuItem.route.toRouterLink());
    }));
  });

  describe("display logic", () => {
    [
      {
        fullscreen: true,
        sideNav: true,
        width: viewports.large,
        style: { display: "none" },
      },
      {
        fullscreen: true,
        sideNav: true,
        width: viewports.medium,
        style: { display: "block" },
      },
      {
        fullscreen: true,
        sideNav: false,
        width: viewports.large,
        style: { display: "flex" },
      },
      {
        fullscreen: true,
        sideNav: false,
        width: viewports.medium,
        style: { display: "none" },
      },
      {
        fullscreen: false,
        sideNav: true,
        width: viewports.large,
        style: {
          display: "block",
        },
      },
      {
        fullscreen: false,
        sideNav: true,
        width: viewports.medium,
        style: {
          display: "block",
          // 100% height is 240px for viewport
          height: "240px",
        },
      },
      {
        fullscreen: false,
        sideNav: false,
        width: viewports.large,
        style: {
          display: "flex",
        },
      },
      {
        fullscreen: false,
        sideNav: false,
        width: viewports.medium,
        style: {
          display: "none",
        },
      },
    ].forEach(({ fullscreen, sideNav, width, style }) => {
      const layout = fullscreen ? "fullscreen" : "menu layout";
      const position = sideNav ? "side nav" : "header";
      const viewportSize = width === viewports.large ? "large" : "medium";

      let location: string;

      switch (style.display) {
        case "none":
          location = "not appear";
          break;
        case "flex":
          location = "appear in header";
          break;
        case "block":
          location = "appear in side nav";
          break;
      }

      describe(layout, () => {
        describe(position, () => {
          describe(viewportSize, () => {
            it(`should ${location}`, () => {
              viewport.set(width);
              setup({
                user: null,
                isFullscreen: fullscreen,
                isSideNav: sideNav,
              });
              spec.detectChanges();

              expect(spec.query("nav")).toHaveComputedStyle(style);
            });
          });
        });
      });
    });
  });
});

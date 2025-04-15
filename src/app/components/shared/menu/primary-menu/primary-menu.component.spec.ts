import { fakeAsync } from "@angular/core/testing";
import { Router } from "@angular/router";
import { RouterTestingModule } from "@angular/router/testing";
import { MockBawApiModule } from "@baw-api/baw-apiMock.module";
import {
  AuthTriggerData,
  BawSessionService,
  GuestUser,
  guestUser,
} from "@baw-api/baw-session.service";
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

import {
  CustomMenuItem,
  Settings,
} from "@helpers/app-initializer/app-initializer";
import { MenuRoute } from "@interfaces/menusInterfaces";
import { User } from "@models/User";
import { createComponentFactory, Spectator } from "@ngneat/spectator";
import { assetRoot, ConfigService } from "@services/config/config.service";
import { MenuService } from "@services/menu/menu.service";
import { IconsModule } from "@shared/icons/icons.module";
import { generateUser } from "@test/fakes/User";
import { modelData } from "@test/helpers/faker";
import { viewports } from "@test/helpers/general";
import { websiteHttpUrl } from "@test/helpers/url";
import camelCase from "just-camel-case";
import { MockComponent, MockDirective, MockProvider } from "ng-mocks";
import { ToastService } from "@services/toasts/toasts.service";
import { BehaviorSubject, Subject } from "rxjs";
import { WebsiteStatusIndicatorComponent } from "@menu/website-status-indicator/website-status-indicator.component";
import { StrongRouteActiveDirective } from "@directives/strongRoute/strong-route-active.directive";
import { StrongRouteDirective } from "@directives/strongRoute/strong-route.directive";
import { UrlActiveDirective } from "@directives/url/url-active.directive";
import { HeaderDropdownComponent } from "../header-dropdown/header-dropdown.component";
import { HeaderItemComponent } from "../header-item/header-item.component";
import { PrimaryMenuComponent } from "./primary-menu.component";

describe("PrimaryMenuComponent", () => {
  let api: SecurityService;
  let session: BawSessionService;
  let router: Router;
  let spec: Spectator<PrimaryMenuComponent>;

  const registerLinkSelector = "#register-header-link";
  const adminLinkSelector = "#admin-header-link";
  const profileWidgetSelector = "#profile-widget";
  const logoutLinkSelector = "#logout-header-link";

  const createComponent = createComponentFactory({
    component: PrimaryMenuComponent,
    providers: [MockProvider(ToastService)],
    declarations: [
      MockComponent(WebsiteStatusIndicatorComponent),
      HeaderItemComponent,
      HeaderDropdownComponent,
    ],
    imports: [
      RouterTestingModule,
      MockBawApiModule,
      IconsModule,
      MockDirective(StrongRouteActiveDirective),
      MockDirective(StrongRouteDirective),
      MockDirective(UrlActiveDirective),
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
    user?: User;
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

    api = spec.inject(SecurityService);
    session = spec.inject(BawSessionService);
    router = spec.inject(Router);

    if (props?.user !== undefined) {
      spyOnProperty(session, "authTrigger").and.returnValue(
        new BehaviorSubject({ user: props?.user ?? guestUser })
      );
    }
  }

  function getLinkId(item: MenuRoute) {
    return `#${camelCase(item.label)}-header-link`;
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
        let defaultUser: User | GuestUser;

        function getNavLinks() {
          return spec.queryAll<HTMLElement>("a.nav-link");
        }

        beforeEach(() => {
          if (type === "guest") {
            defaultUser = guestUser;
          } else {
            isAdmin = type === "admin";
            defaultUser = new User(generateUser({}, isAdmin));
          }
        });

        [
          {
            link: "sites",
            menuItem: shallowRegionsMenuItem,
            hideProjects: true,
          },
          { link: "projects", menuItem: projectsMenuItem },
          { link: "listen", menuItem: listenMenuItem },
          { link: "library", menuItem: libraryMenuItem },
          { link: "contact us", menuItem: contactUsMenuItem },
        ].forEach(({ link, menuItem, hideProjects }) => {
          it(`should create ${link} link`, () => {
            setup({ hideProjects, user: defaultUser });
            spec.detectChanges();

            const element = spec.query<HTMLAnchorElement>(getLinkId(menuItem));
            expect(element).toContainText(menuItem.label);
            expect(element).toHaveStrongRoute(menuItem.route);
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

          const link = spec.query<HTMLAnchorElement>(registerLinkSelector);
          if (links.register) {
            expect(link).toContainText(registerMenuItem.label);
            expect(link).toHaveStrongRoute(registerMenuItem.route);
          } else {
            expect(link).toBeFalsy();
          }
        });

        it(`should ${!links.login ? "not " : ""}display login link`, () => {
          setup({ user: defaultUser });
          spec.detectChanges();

          const selector = getLinkId(loginMenuItem);
          const link = spec.query<HTMLAnchorElement>(selector);

          if (links.login) {
            expect(link).toHaveStrongRoute(loginMenuItem.route);
            expect(link).toContainText(loginMenuItem.label);
          } else {
            expect(link).toBeFalsy();
          }
        });

        it(`should ${!links.profile ? "not " : ""}display profile link`, () => {
          setup({ user: defaultUser });
          spec.detectChanges();

          const profile = spec.query<HTMLAnchorElement>(profileWidgetSelector);
          if (links.profile) {
            expect(profile).toHaveStrongRoute(myAccountMenuItem.route);
            expect(profile).toContainText(defaultUser.userName);
          } else {
            expect(profile).toBeFalsy();
          }
        });

        if (links.profile) {
          it("should display default profile icon", () => {
            const user = new User(
              generateUser({ imageUrls: undefined }, isAdmin)
            );
            setup({ user });
            spec.detectChanges();

            const profile = spec.query<HTMLElement>(profileWidgetSelector);
            const image = profile.querySelector("img");
            expect(image).toHaveImage(
              `${websiteHttpUrl}${assetRoot}/images/user/user_span4.png`,
              { alt: "Profile Icon" }
            );
          });

          it("should display profile custom icon", () => {
            const imageUrls = modelData.imageUrls();
            const customUser = new User(generateUser({ imageUrls }));
            setup({ user: customUser });
            spec.detectChanges();

            const profile = spec.query<HTMLElement>(profileWidgetSelector);
            const image = profile.querySelector("img");
            expect(image).toHaveImage(imageUrls[0].url, {
              alt: "Profile Icon",
            });
          });
        }

        it(`should ${!links.logout ? "not " : ""}display logout`, () => {
          setup({ user: defaultUser });
          spec.detectChanges();

          const logout = spec.query<HTMLElement>(logoutLinkSelector);

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

          const settings = spec.query<HTMLAnchorElement>(adminLinkSelector);
          if (links.admin) {
            expect(settings).toBeTruthy();
            expect(settings).toHaveStrongRoute(adminDashboardMenuItem.route);
          } else {
            expect(settings).toBeFalsy();
          }
        });
      });
    });
  });

  describe("logout", () => {
    let defaultUser: User;

    function getLogoutButton() {
      return spec.query<HTMLButtonElement>(logoutLinkSelector);
    }

    function handleLogout() {
      spyOn(api, "signOut").and.callFake(() => {
        const subject = new Subject<void>();
        subject.complete();
        return subject;
      });
    }

    beforeEach(() => {
      defaultUser = new User(generateUser());
    });

    it("should call signOut when logout button pressed", () => {
      setup({ user: defaultUser });
      spyOn(api, "signOut").and.callFake(() => new BehaviorSubject<void>(null));
      spec.detectChanges();

      getLogoutButton().click();
      expect(api.signOut).toHaveBeenCalled();
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
      const loggedInTrigger = new BehaviorSubject<AuthTriggerData>({
        user: guestUser,
      });
      spyOnProperty(session, "authTrigger").and.callFake(() => loggedInTrigger);
      return loggedInTrigger;
    }

    it("should display register after logout", () => {
      setup({ user: undefined });
      const loggedInTrigger = getLoggedInTrigger();
      loggedInTrigger.next({ user: defaultUser });
      handleLogout();
      spec.detectChanges();

      // Wait for sign out, and trigger logged in status update
      getLogoutButton().click();
      loggedInTrigger.next({ user: guestUser });
      spec.detectChanges();

      const link = spec.query<HTMLElement>(getLinkId(registerMenuItem));
      expect(link).toContainText(registerMenuItem.label);
    });

    it("should display login after logout", fakeAsync(() => {
      setup({ user: undefined });
      const loggedInTrigger = getLoggedInTrigger();
      loggedInTrigger.next({ user: defaultUser });
      handleLogout();
      spec.detectChanges();

      // Wait for sign out, and trigger logged in status update
      getLogoutButton().click();
      loggedInTrigger.next({ user: guestUser });
      spec.detectChanges();

      const link = spec.query<HTMLElement>(getLinkId(loginMenuItem));
      expect(link).toContainText(loginMenuItem.label);
    }));
  });

  describe("status indicator", () => {
    const statusIndicatorElement = (): HTMLElement =>
      spec.query("baw-website-status-indicator");

    // the functionality of the status indicator is tested within the website-status-indicator component
    // therefore, we only need to assert that the indicator is shown under the correct conditions
    it("should show the status indicator when not in the sidebar and on desktop", () => {
      setup({
        user: null,
        isFullscreen: false,
        isSideNav: false,
      });
      viewport.set(viewports.large);

      spec.detectChanges();

      expect(statusIndicatorElement()).toExist();
    });

    it("should hide the status indicator when in the sidebar", () => {
      setup({
        user: null,
        isFullscreen: false,
        isSideNav: true,
      });

      spec.detectChanges();

      expect(statusIndicatorElement()).not.toExist();
    });
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
          display: "none",
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

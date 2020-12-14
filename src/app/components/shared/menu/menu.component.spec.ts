import { Data, Params } from "@angular/router";
import { RouterTestingModule } from "@angular/router/testing";
import { MockBawApiModule } from "@baw-api/baw-apiMock.module";
import { SecurityService } from "@baw-api/security/security.service";
import {
  MenuAction,
  menuAction,
  MenuLink,
  menuLink,
  MenuRoute,
  menuRoute,
} from "@interfaces/menusInterfaces";
import { StrongRoute } from "@interfaces/strongRoute";
import { WidgetDirective } from "@menu/widget.directive";
import { SessionUser } from "@models/User";
import { createRoutingFactory, SpectatorRouting } from "@ngneat/spectator";
import { IconsModule } from "@shared/icons/icons.module";
import { generateSessionUser } from "@test/fakes/User";
import { assertIcon } from "@test/helpers/html";
import { List } from "immutable";
import { MockComponent } from "ng-mocks";
import { MenuButtonComponent } from "./button/button.component";
import { MenuExternalLinkComponent } from "./external-link/external-link.component";
import { MenuInternalLinkComponent } from "./internal-link/internal-link.component";
import { MenuComponent } from "./menu.component";

const mock = {
  action: MockComponent(MenuButtonComponent),
  external: MockComponent(MenuExternalLinkComponent),
  internal: MockComponent(MenuInternalLinkComponent),
};

describe("MenuComponent", () => {
  let api: SecurityService;
  let defaultUser: SessionUser;
  let defaultMenuAction: MenuAction;
  let defaultMenuLink: MenuLink;
  let defaultMenuRoute: MenuRoute;
  let spec: SpectatorRouting<MenuComponent>;
  const createComponent = createRoutingFactory({
    component: MenuComponent,
    declarations: [mock.action, mock.external, mock.internal, WidgetDirective],
    imports: [IconsModule, RouterTestingModule, MockBawApiModule],
  });
  const menuTypes: ("action" | "secondary")[] = ["action", "secondary"];

  function getMenuActions() {
    return spec.queryAll(mock.action);
  }

  function getMenuLinks() {
    return spec.queryAll(mock.external);
  }

  function getMenuRoutes() {
    return spec.queryAll(mock.internal);
  }

  function setLoggedInState(user: SessionUser = defaultUser) {
    spyOn(api, "getLocalUser").and.callFake(() => user);
  }

  function setup(
    props?: Partial<MenuComponent>,
    data: Data = {},
    params: Params = {}
  ) {
    spec = createComponent({
      detectChanges: false,
      props,
      params,
      data,
    });
    api = spec.inject(SecurityService);
  }

  beforeEach(() => {
    defaultUser = new SessionUser(generateSessionUser());
    defaultMenuAction = menuAction({
      label: "label",
      icon: ["fas", "home"],
      tooltip: () => "tooltip",
      action: () => {},
    });
    defaultMenuLink = menuLink({
      label: "label",
      icon: ["fas", "home"],
      tooltip: () => "tooltip",
      uri: () => "http://brokenlink/",
    });
    defaultMenuRoute = menuRoute({
      label: "label",
      icon: ["fas", "home"],
      tooltip: () => "tooltip",
      route: StrongRoute.newRoot().add("home"),
    });
  });

  describe("menu", () => {
    function getTitle() {
      return spec.query<HTMLHeadingElement>("h6");
    }

    function getWidget() {
      return spec.query("#widget");
    }

    function assertTitle(title: string) {
      expect(getTitle()).toHaveText(title);
    }

    it("should create default title when none provided", () => {
      setup({ links: List([]) });
      spec.detectChanges();
      assertTitle("MENU");
    });

    it("should create title when provided", () => {
      setup({
        links: List([]),
        title: { label: "SECONDARY", icon: ["fas", "home"] },
      });
      spec.detectChanges();
      assertTitle("SECONDARY");
    });

    it("should create title icon when provided", () => {
      setup({
        links: List([]),
        title: { label: "SECONDARY", icon: ["fas", "home"] },
      });
      spec.detectChanges();
      assertIcon(getTitle(), "fas,home");
    });

    it("should create capitalized title", () => {
      setup({
        links: List([]),
        title: { label: "secondary", icon: ["fas", "home"] },
      });
      spec.detectChanges();
      assertTitle("SECONDARY");
    });

    menuTypes.forEach((menuType) => {
      it(`should create no links on ${menuType} menu`, () => {
        setup({ menuType, links: List([]) });
        spec.detectChanges();
        expect(getMenuActions().length).toBe(0);
        expect(getMenuLinks().length).toBe(0);
        expect(getMenuRoutes().length).toBe(0);
      });

      it(`should create mixed links on ${menuType} menu`, () => {
        setup({
          menuType,
          links: List([defaultMenuAction, defaultMenuLink, defaultMenuRoute]),
        });
        spec.detectChanges();
        expect(getMenuActions().length).toBe(1);
        expect(getMenuLinks().length).toBe(1);
        expect(getMenuRoutes().length).toBe(1);
      });
    });

    it("should not create widget when none provided", () => {
      setup({ links: List([]) });
      spec.detectChanges();
      expect(getWidget().childElementCount).toBe(0);
    });

    xit("should create widget when provided", () => {});
  });

  [
    {
      title: "Menu Action",
      baseLink: () => defaultMenuAction,
      create: (data) => menuAction(data),
      getLink: () => getMenuActions(),
      action: true,
    },
    {
      title: "Menu External Link",
      baseLink: () => defaultMenuLink,
      create: (data) => menuLink(data),
      getLink: () => getMenuLinks(),
      link: true,
    },
    {
      title: "Menu Internal Link",
      baseLink: () => defaultMenuRoute,
      create: (data) => menuRoute(data),
      getLink: () => getMenuRoutes(),
      route: true,
    },
  ].forEach((test) => {
    function createLink(args: any = {}) {
      return test.create({ ...test.baseLink(), ...args });
    }

    function assertLinks(length: number) {
      expect(getMenuActions().length).toBe(test.action ? length : 0);
      expect(getMenuLinks().length).toBe(test.link ? length : 0);
      expect(getMenuRoutes().length).toBe(test.route ? length : 0);
    }

    describe(test.title, () => {
      menuTypes.forEach((menuType) => {
        it(`should create single link for ${menuType} menu`, () => {
          setup({ menuType, links: List([createLink()]) });
          spec.detectChanges();
          assertLinks(1);
        });

        it(`should create multiple links for ${menuType} menu`, () => {
          setup({ menuType, links: List([createLink(), createLink()]) });
          spec.detectChanges();
          assertLinks(2);
        });

        it(`should set link id for ${menuType} menu`, () => {
          setup({ menuType, links: List([createLink()]) });
          spec.detectChanges();
          expect(test.getLink()[0].id).toBe(`${menuType}-tooltip-0`);
        });

        it(`should set link ids for ${menuType} menu`, () => {
          setup({ menuType, links: List([createLink(), createLink()]) });
          spec.detectChanges();
          expect(test.getLink()[0].id).toBe(`${menuType}-tooltip-0`);
          expect(test.getLink()[1].id).toBe(`${menuType}-tooltip-1`);
        });

        it(`should set link placement for ${menuType} menu`, () => {
          setup({ menuType, links: List([createLink()]) });
          spec.detectChanges();
          expect(test.getLink()[0].placement).toBe(
            menuType === "action" ? "left" : "right"
          );
        });
      });

      it("should set link tooltip", () => {
        const link = createLink();
        setup({ menuType: "action", links: List([link]) });
        spec.detectChanges();
        expect(test.getLink()[0].tooltip).toBe(link.tooltip());
      });

      it("should set link tooltip with username", () => {
        const link = createLink({
          tooltip: (user: SessionUser) => `Custom tooltip for ${user.userName}`,
        });
        setup({ menuType: "action", links: List([link]) });
        setLoggedInState();
        spec.detectChanges();
        expect(test.getLink()[0].tooltip).toBe(
          `Custom tooltip for ${defaultUser.userName}`
        );
      });

      it("should set link link", () => {
        const link = createLink();
        setup({ menuType: "action", links: List([link]) });
        spec.detectChanges();
        expect(test.getLink()[0].link).toEqual(link);
      });

      describe("predicate", () => {
        it("should filter links without passing predicate", () => {
          setup({
            menuType: "action",
            links: List([
              createLink({ predicate: undefined }),
              createLink({ predicate: () => false }),
              createLink({ predicate: () => true }),
            ]),
          });
          spec.detectChanges();
          assertLinks(2);
        });

        it("should filter duplicate links (by object identity)", () => {
          const link = createLink();
          setup({ menuType: "action", links: List([link, link, link]) });
          spec.detectChanges();
          assertLinks(1);
        });

        it("should not provide user to predicate function when unauthenticated", (done) => {
          const link = createLink({
            predicate: (_user) => {
              expect(_user).toBe(undefined);
              done();
            },
          });
          setup({ menuType: "action", links: List([link]) });
          spec.detectChanges();
        });

        it("should provide user to predicate function when authenticated", (done) => {
          const user = new SessionUser(generateSessionUser());
          const link = createLink({
            predicate: (_user) => {
              expect(_user).toEqual(user);
              done();
            },
          });
          setup({ menuType: "action", links: List([link]) });
          setLoggedInState(user);
          spec.detectChanges();
        });

        it("should provide page data to predicate function", (done) => {
          const data = { value: 42 };
          const link = createLink({
            predicate: (_, _data) => {
              expect(_data).toEqual(data);
              done();
            },
          });
          setup({ menuType: "action", links: List([link]) }, data);
          spec.detectChanges();
        });
      });
    });
  });

  describe("Menu External Link", () => {
    it("should set uri route", () => {
      setup({ menuType: "action", links: List([defaultMenuLink]) });
      spec.detectChanges();
      expect(getMenuLinks()[0].uri).toBe(defaultMenuLink.uri({}));
    });

    it("should set uri route with parameter", () => {
      const params = { attribute: 10 };
      const link = menuLink({
        ...defaultMenuLink,
        uri: (_params: Params) => `http://broken_link/${_params.attribute}`,
      });
      setup({ menuType: "action", links: List([link]) }, undefined, params);
      spec.detectChanges();
      expect(getMenuLinks()[0].uri).toBe("http://broken_link/10");
    });
  });

  describe("Menu Internal Link", () => {
    it("should set link route", () => {
      setup({ menuType: "action", links: List([defaultMenuRoute]) });
      spec.detectChanges();
      expect(getMenuRoutes()[0].link.route).toBe(defaultMenuRoute.route);
    });

    it("should set link route with parameter", () => {
      const params = { attribute: 10 };
      const link = menuRoute({
        ...defaultMenuRoute,
        route: StrongRoute.newRoot().add("home").add(":attribute"),
      });
      setup({ menuType: "action", links: List([link]) }, undefined, params);
      spec.detectChanges();
      expect(getMenuRoutes()[0].link.route).toEqual(link.route);
    });
  });

  describe("item ordering", () => {
    function arrange(a: number, b: number, c: number) {
      // Labels are set so that lexicographical order can be determined
      const linkA = menuRoute({ ...defaultMenuRoute, label: "b", order: a });
      const linkB = menuLink({ ...defaultMenuLink, label: "a", order: b });
      const linkC = menuAction({ ...defaultMenuAction, label: "z", order: c });
      return List([linkA, linkB, linkC]);
    }

    function getAllLinks() {
      return spec.queryAll<HTMLElement>("li");
    }

    function assertLinkA(el: HTMLElement) {
      expect(el.querySelector("baw-menu-internal-link")).toBeTruthy();
    }

    function assertLinkB(el: HTMLElement) {
      expect(el.querySelector("baw-menu-external-link")).toBeTruthy();
    }

    function assertLinkC(el: HTMLElement) {
      expect(el.querySelector("baw-menu-button")).toBeTruthy();
    }

    menuTypes.forEach((menuType) => {
      describe(menuType, () => {
        it("should order links", () => {
          setup({ menuType, links: arrange(3, 2, 1) });
          spec.detectChanges();

          const links = getAllLinks();
          assertLinkA(links[3]);
          assertLinkB(links[2]);
          assertLinkC(links[1]);
        });

        it("ensures order is stable if not specified", () => {
          setup({ menuType, links: arrange(undefined, undefined, undefined) });
          spec.detectChanges();

          const links = getAllLinks();
          assertLinkA(links[1]);
          assertLinkB(links[2]);
          assertLinkC(links[3]);
        });

        it("should sort lexicographically only if order is equal", () => {
          setup({ menuType, links: arrange(3, 3, 3) });
          spec.detectChanges();

          const links = getAllLinks();
          assertLinkA(links[2]);
          assertLinkB(links[1]);
          assertLinkC(links[3]);
        });

        it("should order links with order link first", () => {
          setup({ menuType, links: arrange(undefined, undefined, -3) });
          spec.detectChanges();

          const links = getAllLinks();
          assertLinkA(links[2]);
          assertLinkB(links[3]);
          assertLinkC(links[1]);
        });

        it("should order sub-links", () => {
          const parent = menuRoute({ ...defaultMenuRoute, order: 1 });
          const child = menuRoute({ ...defaultMenuRoute, parent, order: 1 });
          setup({ menuType, links: List([child, parent]) });
          spec.detectChanges();

          const links = getMenuRoutes();
          expect(links[0].link).toEqual(parent);
          expect(links[1].link).toEqual(child);
        });

        it("should order sub-links inside a parent", () => {
          const parent = menuRoute({ ...defaultMenuRoute, order: 1 });
          const child1 = menuRoute({
            ...defaultMenuRoute,
            parent,
            label: "b",
            order: 1,
          });
          const child2 = menuRoute({
            ...defaultMenuRoute,
            parent,
            label: "a",
            order: 1,
          });
          setup({ menuType, links: List([child2, child1, parent]) });
          spec.detectChanges();

          const links = getMenuRoutes();
          expect(links[0].link).toEqual(parent);
          expect(links[1].link).toEqual(child2);
          expect(links[2].link).toEqual(child1);
        });
      });
    });
  });
});

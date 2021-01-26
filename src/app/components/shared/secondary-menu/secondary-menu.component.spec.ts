import { HttpClientModule } from "@angular/common/http";
import { Params } from "@angular/router";
import { RouterTestingModule } from "@angular/router/testing";
import { MockBawApiModule } from "@baw-api/baw-apiMock.module";
import { StrongRouteDirective } from "@directives/strongRoute/strong-route.directive";
import { defaultMenu } from "@helpers/page/defaultMenus";
import { IPageInfo } from "@helpers/page/pageInfo";
import {
  Category,
  menuLink,
  MenuRoute,
  menuRoute,
  NavigableMenuItem,
} from "@interfaces/menusInterfaces";
import { StrongRoute } from "@interfaces/strongRoute";
import { createRoutingFactory, SpectatorRouting } from "@ngneat/spectator";
import { assertIcon, assertTooltip } from "@test/helpers/html";
import { fromJS, List } from "immutable";
import { homeCategory } from "../../home/home.menus";
import { SharedModule } from "../shared.module";
import { SecondaryMenuComponent } from "./secondary-menu.component";

xdescribe("SecondaryMenuComponent", () => {
  let storedDefaultMenu: any;
  let defaultRoute: StrongRoute;
  let defaultPageRouteLink: MenuRoute;
  let defaultCategory: Category;
  let spec: SpectatorRouting<SecondaryMenuComponent>;
  const selfLinkCount = 1;
  const createComponent = createRoutingFactory({
    component: SecondaryMenuComponent,
    imports: [
      RouterTestingModule,
      HttpClientModule,
      SharedModule,
      MockBawApiModule,
    ],
    mocks: [StrongRouteDirective],
    stubsEnabled: false,
  });

  function assertLink(
    link: HTMLElement,
    label: string,
    icon: string,
    tooltip: string
  ) {
    assertLabel(link, label);
    assertIcon(link, icon);
    assertTooltip(link, tooltip);
  }

  function assertTitle(target: HTMLElement, header: string) {
    expect(target).toHaveText(header);
  }

  function assertLabel(target: HTMLElement, labelText: string) {
    expect(target.querySelector<HTMLElement>("#label")).toHaveText(labelText);
  }

  function findLinks(selector: "internal-link" | "external-link" | "button") {
    return spec.queryAll<HTMLElement>("baw-menu-" + selector);
  }

  function setup(params: Params, data: IPageInfo) {
    spec = createComponent({ data, params });
  }

  beforeAll(() => {
    // Make a non-referenced copy of DefaultMenuItem
    storedDefaultMenu = fromJS(defaultMenu);
  });

  afterAll(() => {
    // Restore DefaultMenu
    const temp = storedDefaultMenu.toJS();
    defaultMenu.contextLinks = temp.contextLinks;
    defaultMenu.defaultCategory = temp.defaultCategory;
  });

  beforeEach(() => {
    // Clear DefaultMenu
    defaultMenu.contextLinks = List<NavigableMenuItem>([]);
    defaultMenu.defaultCategory = homeCategory;

    defaultRoute = StrongRoute.newRoot().add("");
    defaultPageRouteLink = menuRoute({
      label: "Self Label",
      icon: ["fas", "question-circle"],
      tooltip: () => "Self Tooltip",
      order: 999, // Force to be last link
      route: defaultRoute,
    });

    defaultCategory = {
      label: "Custom Category",
      icon: ["fas", "home"],
      route: defaultRoute,
    };
  });

  describe("title", () => {
    let pageInfo: IPageInfo;

    beforeEach(() => {
      pageInfo = {
        pageRoute: defaultPageRouteLink,
        category: defaultCategory,
        menus: { actions: List([]), links: List([]) },
      };
    });

    it("should display menu title", () => {
      setup({}, pageInfo);
      spec.detectChanges();
      assertTitle(spec.query("h6"), "MENU");
    });

    it("should not display menu icon", () => {
      setup({}, pageInfo);
      spec.detectChanges();
      expect(spec.query("h6 fa-icon")).toBeFalsy();
    });
  });

  describe("links", () => {
    it("should handle undefined links", () => {
      setup({}, {
        pageRoute: defaultPageRouteLink,
        category: defaultCategory,
        menus: { actions: List([]), links: undefined },
      } as IPageInfo);
      spec.detectChanges();

      expect(findLinks("internal-link").length).toBe(1);
      expect(findLinks("external-link").length).toBe(0);
    });

    it("should create self link", () => {
      setup({}, {
        pageRoute: defaultPageRouteLink,
        category: defaultCategory,
        menus: { actions: List([]), links: List([]) },
      } as IPageInfo);
      spec.detectChanges();

      expect(findLinks("internal-link").length).toBe(1);
      expect(findLinks("external-link").length).toBe(0);
    });

    it("should handle mixed links", () => {
      setup({}, {
        pageRoute: defaultPageRouteLink,
        category: defaultCategory,
        menus: {
          actions: List([]),
          links: List([
            menuRoute({
              label: "Custom Label",
              icon: ["fas", "tag"],
              tooltip: () => "Custom Tooltip",
              route: defaultRoute,
            }),
            menuLink({
              label: "Custom Label",
              icon: ["fas", "tag"],
              tooltip: () => "Custom Tooltip",
              uri: () => "http://brokenlink/",
            }),
          ]),
        },
      } as IPageInfo);
      spec.detectChanges();

      expect(findLinks("internal-link").length).toBe(2);
      expect(findLinks("external-link").length).toBe(1);
    });
  });

  describe("self link", () => {
    it("should handle self link", () => {
      setup({}, {
        pageRoute: menuRoute({
          label: "CLabel",
          icon: ["fas", "ad"],
          tooltip: () => "CTooltip",
          order: 999,
          route: defaultRoute,
        }),
        category: defaultCategory,
        menus: { actions: List([]), links: List([]) },
      } as IPageInfo);
      spec.detectChanges();

      const links = findLinks("internal-link");
      assertLink(links[0], "CLabel", "fas,ad", "CTooltip");
    });

    it("should handle parent link", () => {
      const parentRoute = StrongRoute.newRoot().add("home");
      const childRoute = parentRoute.add("house");
      const parentLink = menuRoute({
        label: "PLabel",
        icon: ["fas", "question"],
        order: 999,
        tooltip: () => "Tooltip 1",
        route: parentRoute,
      });

      setup({}, {
        pageRoute: menuRoute({
          label: "CLabel",
          icon: ["fas", "ad"],
          tooltip: () => "Tooltip 2",
          order: 999,
          parent: parentLink,
          route: childRoute,
        }),
        category: defaultCategory,
        menus: { actions: List([]), links: List([]) },
      } as IPageInfo);
      spec.detectChanges();

      const links = findLinks("internal-link");
      assertLink(links[0], "PLabel", "fas,question", "Tooltip 1");
      assertLink(links[1], "CLabel", "fas,ad", "Tooltip 2");
    });

    it("should handle grandparent link", () => {
      const grandParentRoute = StrongRoute.newRoot().add("home");
      const parentRoute = grandParentRoute.add("house");
      const childRoute = parentRoute.add("door");
      const grandParentLink = menuRoute({
        label: "GLabel",
        icon: ["fas", "question"],
        order: 999,
        tooltip: () => "Tooltip 1",
        route: grandParentRoute,
      });
      const parentLink = menuRoute({
        label: "PLabel",
        icon: ["fas", "circle"],
        order: 999,
        tooltip: () => "Tooltip 2",
        parent: grandParentLink,
        route: parentRoute,
      });

      setup({}, {
        pageRoute: menuRoute({
          label: "CLabel",
          icon: ["fas", "ad"],
          tooltip: () => "Tooltip 3",
          order: 999,
          parent: parentLink,
          route: childRoute,
        }),
        category: defaultCategory,
        menus: { actions: List([]), links: List([]) },
      } as IPageInfo);
      spec.detectChanges();

      const links = findLinks("internal-link");
      assertLink(links[0], "GLabel", "fas,question", "Tooltip 1");
      assertLink(links[1], "PLabel", "fas,circle", "Tooltip 2");
      assertLink(links[2], "CLabel", "fas,ad", "Tooltip 3");
    });

    it("should not hide self link if predicate fails", () => {
      const parentRoute = StrongRoute.newRoot().add("home");
      const childRoute = parentRoute.add("house");
      const parentLink = menuRoute({
        label: "PLabel",
        icon: ["fas", "question"],
        order: 999,
        tooltip: () => "Tooltip 1",
        route: parentRoute,
        predicate: () => false,
      });

      setup({}, {
        pageRoute: menuRoute({
          label: "CLabel",
          icon: ["fas", "circle"],
          tooltip: () => "Tooltip 2",
          order: 999,
          parent: parentLink,
          route: childRoute,
          predicate: () => false,
        }),
        category: defaultCategory,
        menus: { actions: List([]), links: List([]) },
      } as IPageInfo);

      spec.detectChanges();

      const links = findLinks("internal-link");
      assertLink(links[0], "PLabel", "fas,question", "Tooltip 1");
      assertLink(links[1], "CLabel", "fas,circle", "Tooltip 2");
    });
  });

  describe("internal links", () => {
    it("should handle single link", () => {
      setup({}, {
        pageRoute: defaultPageRouteLink,
        category: defaultCategory,
        menus: {
          actions: List([]),
          links: List([
            menuRoute({
              label: "Custom Label",
              icon: ["fas", "tag"],
              tooltip: () => "Custom Tooltip",
              route: defaultRoute,
            }),
          ]),
        },
      } as IPageInfo);
      spec.detectChanges();

      const links = findLinks("internal-link");

      expect(links.length).toBe(1 + selfLinkCount);
      expect(findLinks("external-link").length).toBe(0);
      expect(findLinks("button").length).toBe(0);

      // Links offset by one because order is infinite so they are placed after self link
      assertLink(links[1], "Custom Label", "fas,tag", "Custom Tooltip");
    });

    it("should handle multiple links", () => {
      setup({}, {
        pageRoute: defaultPageRouteLink,
        category: defaultCategory,
        menus: {
          actions: List([]),
          links: List([
            menuRoute({
              label: "Custom Label 1",
              icon: ["fas", "tag"],
              tooltip: () => "Custom Tooltip 1",
              route: defaultRoute,
            }),
            menuRoute({
              label: "Custom Label 2",
              icon: ["fas", "tags"],
              tooltip: () => "Custom Tooltip 2",
              route: defaultRoute,
            }),
          ]),
        },
      } as IPageInfo);
      spec.detectChanges();

      const links = findLinks("internal-link");

      expect(links.length).toBe(2 + selfLinkCount);
      expect(findLinks("external-link").length).toBe(0);
      expect(findLinks("button").length).toBe(0);

      // Links offset by one because order is infinite so they are placed after self link
      assertLink(links[1], "Custom Label 1", "fas,tag", "Custom Tooltip 1");
      assertLink(links[2], "Custom Label 2", "fas,tags", "Custom Tooltip 2");
    });
  });

  describe("external links", () => {
    it("should handle single link", () => {
      setup({}, {
        pageRoute: defaultPageRouteLink,
        category: defaultCategory,
        menus: {
          links: List([
            menuLink({
              label: "Custom Label",
              icon: ["fas", "tag"],
              tooltip: () => "Custom Tooltip",
              uri: () => "http://brokenlink/",
            }),
          ]),
        },
      } as IPageInfo);
      spec.detectChanges();

      const links = findLinks("external-link");

      expect(findLinks("internal-link").length).toBe(selfLinkCount);
      expect(links.length).toBe(1);
      expect(findLinks("button").length).toBe(0);

      assertLink(links[0], "Custom Label", "fas,tag", "Custom Tooltip");
    });

    it("should handle multiple links", () => {
      setup({}, {
        pageRoute: defaultPageRouteLink,
        category: defaultCategory,
        menus: {
          links: List([
            menuLink({
              label: "Custom Label 1",
              icon: ["fas", "tag"],
              tooltip: () => "Custom Tooltip 1",
              uri: () => "http://brokenlink/1",
            }),
            menuLink({
              label: "Custom Label 2",
              icon: ["fas", "tags"],
              tooltip: () => "Custom Tooltip 2",
              uri: () => "http://brokenlink/2",
            }),
          ]),
        },
      } as IPageInfo);
      spec.detectChanges();

      const links = findLinks("external-link");

      expect(findLinks("internal-link").length).toBe(selfLinkCount);
      expect(links.length).toBe(2);
      expect(findLinks("button").length).toBe(0);

      assertLink(links[0], "Custom Label 1", "fas,tag", "Custom Tooltip 1");
      assertLink(links[1], "Custom Label 2", "fas,tags", "Custom Tooltip 2");
    });
  });

  describe("default menu", () => {
    it("should handle single link", () => {
      const homeRoute = StrongRoute.newRoot().add("");
      defaultMenu.contextLinks = List([
        menuRoute({
          icon: ["fas", "home"],
          label: "Home",
          route: homeRoute,
          tooltip: () => "Home page",
          order: 1,
        }),
      ]);

      setup({}, { pageRoute: defaultPageRouteLink } as IPageInfo);
      spec.detectChanges();

      const links = findLinks("internal-link");
      expect(findLinks("internal-link").length).toBe(1 + selfLinkCount);
      expect(findLinks("external-link").length).toBe(0);
      assertLink(links[0], "Home", "fas,home", "Home page");
    });

    it("should handle multiple links", () => {
      const homeRoute = StrongRoute.newRoot().add("");
      const projectsRoute = StrongRoute.newRoot().add("projects");

      defaultMenu.contextLinks = List([
        menuRoute({
          icon: ["fas", "home"],
          label: "Home",
          route: homeRoute,
          tooltip: () => "Home page",
          order: 1,
        }),
        menuRoute({
          icon: ["fas", "globe-asia"],
          label: "Projects",
          route: projectsRoute,
          tooltip: () => "View projects I have access to",
          order: 4,
        }),
      ]);

      setup({}, { pageRoute: defaultPageRouteLink } as IPageInfo);
      spec.detectChanges();

      const links = findLinks("internal-link");
      expect(findLinks("internal-link").length).toBe(2 + selfLinkCount);
      expect(findLinks("external-link").length).toBe(0);
      assertLink(links[0], "Home", "fas,home", "Home page");
      assertLink(
        links[1],
        "Projects",
        "fas,globe-asia",
        "View projects I have access to"
      );
    });

    it("should hide duplicate if self link exists in default menu", () => {
      const homeRoute = StrongRoute.newRoot().add("");
      const projectsRoute = StrongRoute.newRoot().add("projects");

      const selfRoute = menuRoute({
        icon: ["fas", "globe-asia"],
        label: "Projects",
        route: projectsRoute,
        tooltip: () => "View projects I have access to",
        order: 4,
      });

      defaultMenu.contextLinks = List([
        menuRoute({
          icon: ["fas", "home"],
          label: "Home",
          route: homeRoute,
          tooltip: () => "Home page",
          order: 1,
        }),
        selfRoute,
      ]);

      setup({}, { pageRoute: selfRoute } as IPageInfo);
      spec.detectChanges();

      const links = findLinks("internal-link");
      expect(findLinks("internal-link").length).toBe(2);
      expect(findLinks("external-link").length).toBe(0);
      assertLink(links[0], "Home", "fas,home", "Home page");
      assertLink(
        links[1],
        "Projects",
        "fas,globe-asia",
        "View projects I have access to"
      );
    });
  });
});

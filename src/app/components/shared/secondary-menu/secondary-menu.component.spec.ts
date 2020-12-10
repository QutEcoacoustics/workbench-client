import { HttpClientModule } from "@angular/common/http";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ActivatedRoute } from "@angular/router";
import { RouterTestingModule } from "@angular/router/testing";
import { MockBawApiModule } from "@baw-api/baw-apiMock.module";
import { defaultMenu } from "@helpers/page/defaultMenus";
import { IPageInfo } from "@helpers/page/pageInfo";
import {
  AnyMenuItem,
  Category,
  menuLink,
  menuRoute,
  NavigableMenuItem,
} from "@interfaces/menusInterfaces";
import { StrongRoute } from "@interfaces/strongRoute";
import { assertIcon, assertTooltip } from "@test/helpers/html";
import { mockActivatedRoute, MockParams } from "@test/helpers/testbed";
import { fromJS, List } from "immutable";
import { homeCategory } from "../../home/home.menus";
import { SharedModule } from "../shared.module";
import { SecondaryMenuComponent } from "./secondary-menu.component";

describe("SecondaryMenuComponent", () => {
  let component: SecondaryMenuComponent;
  let fixture: ComponentFixture<SecondaryMenuComponent>;
  let storedDefaultMenu: any;
  const defaultRoute = StrongRoute.newRoot().add("/");
  const selfLinkCount = 1;
  const defaultPageRouteLink = menuRoute({
    label: "Self Label",
    icon: ["fas", "question-circle"],
    tooltip: () => "Self Tooltip",
    order: 999, // Force to be last link
    route: defaultRoute,
  });
  const defaultCategory = {
    label: "Custom Category",
    icon: ["fas", "home"],
    route: defaultRoute,
  } as Category;

  function assertTitle(target: HTMLElement, header: string) {
    expect(target).toBeTruthy("Title is missing");
    expect(target.innerText.trim()).toBe(header);
  }

  function assertLabel(target: HTMLElement, labelText: string) {
    const label: HTMLElement = target.querySelector("#label");
    expect(label).toBeTruthy("Label is missing");
    expect(label.innerText.trim()).toBe(labelText);
  }

  function findLinks(
    selector: "internal-link" | "external-link" | "button"
  ): HTMLElement[] {
    return fixture.nativeElement.querySelectorAll("baw-menu-" + selector);
  }

  function createTestBed(params: MockParams, data: IPageInfo) {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientModule,
        SharedModule,
        MockBawApiModule,
      ],
      declarations: [SecondaryMenuComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useClass: mockActivatedRoute(undefined, data, params),
        },
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(SecondaryMenuComponent);
    component = fixture.componentInstance;
  }

  beforeAll(() => {
    // Make a non-referenced copy of DefaultMenuItem
    storedDefaultMenu = fromJS(defaultMenu);
  });

  beforeEach(() => {
    // Clear DefaultMenu
    defaultMenu.contextLinks = List<NavigableMenuItem>([]);
    defaultMenu.defaultCategory = homeCategory;
  });

  afterAll(() => {
    // Restore DefaultMenu
    const temp = storedDefaultMenu.toJS();
    defaultMenu.contextLinks = temp.contextLinks;
    defaultMenu.defaultCategory = temp.defaultCategory;
  });

  describe("title", () => {
    it("should display menu title", () => {
      createTestBed({}, {
        pageRoute: defaultPageRouteLink,
        category: defaultCategory,
        menus: {
          actions: List<AnyMenuItem>([]),
          links: List<NavigableMenuItem>([]),
        },
      } as IPageInfo);

      fixture.detectChanges();

      assertTitle(fixture.nativeElement.querySelector("h6"), "MENU");
    });

    it("should not display menu icon", () => {
      createTestBed({}, {
        pageRoute: defaultPageRouteLink,
        category: defaultCategory,
        menus: {
          actions: List<AnyMenuItem>([]),
          links: List<NavigableMenuItem>([]),
        },
      } as IPageInfo);

      fixture.detectChanges();

      const icon = fixture.nativeElement.querySelector("h6 fa-icon");
      expect(icon).toBeFalsy();
    });
  });

  describe("links", () => {
    it("should handle undefined links", () => {
      createTestBed({}, {
        pageRoute: defaultPageRouteLink,
        category: defaultCategory,
        menus: {
          actions: List<AnyMenuItem>([]),
          links: undefined,
        },
      } as IPageInfo);

      fixture.detectChanges();

      expect(findLinks("internal-link").length).toBe(1);
      expect(findLinks("external-link").length).toBe(0);
    });

    it("should create self link", () => {
      createTestBed({}, {
        pageRoute: defaultPageRouteLink,
        category: defaultCategory,
        menus: {
          actions: List<AnyMenuItem>([]),
          links: List<NavigableMenuItem>([]),
        },
      } as IPageInfo);

      fixture.detectChanges();

      expect(findLinks("internal-link").length).toBe(1);
      expect(findLinks("external-link").length).toBe(0);
    });

    it("should handle mixed links", () => {
      createTestBed({}, {
        pageRoute: defaultPageRouteLink,
        category: defaultCategory,
        menus: {
          actions: List<AnyMenuItem>([]),
          links: List<NavigableMenuItem>([
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

      fixture.detectChanges();

      expect(findLinks("internal-link").length).toBe(2);
      expect(findLinks("external-link").length).toBe(1);
    });
  });

  describe("self link", () => {
    it("should handle self link", () => {
      createTestBed({}, {
        pageRoute: menuRoute({
          label: "Custom Label",
          icon: ["fas", "exclamation-triangle"],
          tooltip: () => "Custom Tooltip",
          order: 999,
          route: defaultRoute,
        }),
        category: defaultCategory,
        menus: {
          actions: List<AnyMenuItem>([]),
          links: List<NavigableMenuItem>([]),
        },
      } as IPageInfo);

      fixture.detectChanges();

      const links = findLinks("internal-link");

      assertLabel(links[0], "Custom Label");
      assertIcon(links[0], "fas,exclamation-triangle");
      assertTooltip(links[0], "Custom Tooltip");
    });

    it("should handle parent link", () => {
      const parentRoute = StrongRoute.newRoot().add("home");
      const childRoute = parentRoute.add("house");
      const parentLink = menuRoute({
        label: "Parent Label",
        icon: ["fas", "question"],
        order: 999,
        tooltip: () => "Custom Tooltip 1",
        route: parentRoute,
      });

      createTestBed({}, {
        pageRoute: menuRoute({
          label: "Child Label",
          icon: ["fas", "exclamation-triangle"],
          tooltip: () => "Custom Tooltip 2",
          order: 999,
          parent: parentLink,
          route: childRoute,
        }),
        category: defaultCategory,
        menus: {
          actions: List<AnyMenuItem>([]),
          links: List<NavigableMenuItem>([]),
        },
      } as IPageInfo);

      fixture.detectChanges();

      const links = findLinks("internal-link");

      assertLabel(links[0], "Parent Label");
      assertIcon(links[0], "fas,question");
      assertTooltip(links[0], "Custom Tooltip 1");

      assertLabel(links[1], "Child Label");
      assertIcon(links[1], "fas,exclamation-triangle");
      assertTooltip(links[1], "Custom Tooltip 2");
    });

    it("should handle grandparent link", () => {
      const grandParentRoute = StrongRoute.newRoot().add("home");
      const parentRoute = grandParentRoute.add("house");
      const childRoute = parentRoute.add("door");
      const grandParentLink = menuRoute({
        label: "GrandParent Label",
        icon: ["fas", "question"],
        order: 999,
        tooltip: () => "Custom Tooltip 1",
        route: grandParentRoute,
      });
      const parentLink = menuRoute({
        label: "Parent Label",
        icon: ["fas", "question-circle"],
        order: 999,
        tooltip: () => "Custom Tooltip 2",
        parent: grandParentLink,
        route: parentRoute,
      });

      createTestBed({}, {
        pageRoute: menuRoute({
          label: "Child Label",
          icon: ["fas", "exclamation-triangle"],
          tooltip: () => "Custom Tooltip 3",
          order: 999,
          parent: parentLink,
          route: childRoute,
        }),
        category: defaultCategory,
        menus: {
          actions: List<AnyMenuItem>([]),
          links: List<NavigableMenuItem>([]),
        },
      } as IPageInfo);

      fixture.detectChanges();

      const links = findLinks("internal-link");

      assertLabel(links[0], "GrandParent Label");
      assertIcon(links[0], "fas,question");
      assertTooltip(links[0], "Custom Tooltip 1");

      assertLabel(links[1], "Parent Label");
      assertIcon(links[1], "fas,question-circle");
      assertTooltip(links[1], "Custom Tooltip 2");

      assertLabel(links[2], "Child Label");
      assertIcon(links[2], "fas,exclamation-triangle");
      assertTooltip(links[2], "Custom Tooltip 3");
    });

    it("should not hide self link if predicate fails", () => {
      const parentRoute = StrongRoute.newRoot().add("home");
      const childRoute = parentRoute.add("house");
      const parentLink = menuRoute({
        label: "Parent Label",
        icon: ["fas", "question"],
        order: 999,
        tooltip: () => "Custom Tooltip 1",
        route: parentRoute,
        predicate: () => false,
      });

      createTestBed({}, {
        pageRoute: menuRoute({
          label: "Child Label",
          icon: ["fas", "exclamation-triangle"],
          tooltip: () => "Custom Tooltip 2",
          order: 999,
          parent: parentLink,
          route: childRoute,
          predicate: () => false,
        }),
        category: defaultCategory,
        menus: {
          actions: List<AnyMenuItem>([]),
          links: List<NavigableMenuItem>([]),
        },
      } as IPageInfo);

      fixture.detectChanges();

      const links = findLinks("internal-link");

      assertLabel(links[0], "Parent Label");
      assertIcon(links[0], "fas,question");
      assertTooltip(links[0], "Custom Tooltip 1");

      assertLabel(links[1], "Child Label");
      assertIcon(links[1], "fas,exclamation-triangle");
      assertTooltip(links[1], "Custom Tooltip 2");
    });
  });

  describe("internal links", () => {
    it("should handle single link", () => {
      createTestBed({}, {
        pageRoute: defaultPageRouteLink,
        category: defaultCategory,
        menus: {
          actions: List<AnyMenuItem>([]),
          links: List<NavigableMenuItem>([
            menuRoute({
              label: "Custom Label",
              icon: ["fas", "tag"],
              tooltip: () => "Custom Tooltip",
              route: defaultRoute,
            }),
          ]),
        },
      } as IPageInfo);

      fixture.detectChanges();

      const links = findLinks("internal-link");

      expect(links.length).toBe(1 + selfLinkCount);
      expect(findLinks("external-link").length).toBe(0);
      expect(findLinks("button").length).toBe(0);

      // Links offset by one because order is infinite so they are placed after self link
      assertLabel(links[1], "Custom Label");
      assertTooltip(links[1], "Custom Tooltip");
      assertIcon(links[1], "fas,tag");
    });

    it("should handle multiple links", () => {
      createTestBed({}, {
        pageRoute: defaultPageRouteLink,
        category: defaultCategory,
        menus: {
          actions: List<AnyMenuItem>([]),
          links: List<NavigableMenuItem>([
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

      fixture.detectChanges();

      const links = findLinks("internal-link");

      expect(links.length).toBe(2 + selfLinkCount);
      expect(findLinks("external-link").length).toBe(0);
      expect(findLinks("button").length).toBe(0);

      // Links offset by one because order is infinite so they are placed after self link
      assertLabel(links[1], "Custom Label 1");
      assertTooltip(links[1], "Custom Tooltip 1");
      assertIcon(links[1], "fas,tag");

      assertLabel(links[2], "Custom Label 2");
      assertTooltip(links[2], "Custom Tooltip 2");
      assertIcon(links[2], "fas,tags");
    });
  });

  describe("external links", () => {
    it("should handle single link", () => {
      createTestBed({}, {
        pageRoute: defaultPageRouteLink,
        category: defaultCategory,
        menus: {
          actions: List<AnyMenuItem>([]),
          links: List<NavigableMenuItem>([
            menuLink({
              label: "Custom Label",
              icon: ["fas", "tag"],
              tooltip: () => "Custom Tooltip",
              uri: () => "http://brokenlink/",
            }),
          ]),
        },
      } as IPageInfo);

      fixture.detectChanges();

      const links = findLinks("external-link");

      expect(findLinks("internal-link").length).toBe(selfLinkCount);
      expect(links.length).toBe(1);
      expect(findLinks("button").length).toBe(0);

      assertLabel(links[0], "Custom Label");
      assertTooltip(links[0], "Custom Tooltip");
      assertIcon(links[0], "fas,tag");
    });

    it("should handle multiple links", () => {
      createTestBed({}, {
        pageRoute: defaultPageRouteLink,
        category: defaultCategory,
        menus: {
          actions: List<AnyMenuItem>([]),
          links: List<NavigableMenuItem>([
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

      fixture.detectChanges();

      const links = findLinks("external-link");

      expect(findLinks("internal-link").length).toBe(selfLinkCount);
      expect(links.length).toBe(2);
      expect(findLinks("button").length).toBe(0);

      assertLabel(links[0], "Custom Label 1");
      assertTooltip(links[0], "Custom Tooltip 1");
      assertIcon(links[0], "fas,tag");

      assertLabel(links[1], "Custom Label 2");
      assertTooltip(links[1], "Custom Tooltip 2");
      assertIcon(links[1], "fas,tags");
    });
  });

  describe("default menu", () => {
    it("should handle single link", () => {
      const homeRoute = StrongRoute.newRoot().add("");

      defaultMenu.contextLinks = List<NavigableMenuItem>([
        menuRoute({
          icon: ["fas", "home"],
          label: "Home",
          route: homeRoute,
          tooltip: () => "Home page",
          order: 1,
        }),
      ]);

      createTestBed({}, {
        pageRoute: defaultPageRouteLink,
        menus: {
          actions: List<AnyMenuItem>([]),
          links: List<NavigableMenuItem>([]),
        },
      } as IPageInfo);

      fixture.detectChanges();

      const links = findLinks("internal-link");

      expect(findLinks("internal-link").length).toBe(1 + selfLinkCount);
      expect(findLinks("external-link").length).toBe(0);

      assertLabel(links[0], "Home");
      assertTooltip(links[0], "Home page");
      assertIcon(links[0], "fas,home");
    });

    it("should handle multiple links", () => {
      const homeRoute = StrongRoute.newRoot().add("");
      const projectsRoute = StrongRoute.newRoot().add("projects");

      defaultMenu.contextLinks = List<NavigableMenuItem>([
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

      createTestBed({}, {
        pageRoute: defaultPageRouteLink,
        menus: {
          actions: List<AnyMenuItem>([]),
          links: List<NavigableMenuItem>([]),
        },
      } as IPageInfo);

      fixture.detectChanges();

      const links = findLinks("internal-link");

      expect(findLinks("internal-link").length).toBe(2 + selfLinkCount);
      expect(findLinks("external-link").length).toBe(0);

      assertLabel(links[0], "Home");
      assertTooltip(links[0], "Home page");
      assertIcon(links[0], "fas,home");

      assertLabel(links[1], "Projects");
      assertTooltip(links[1], "View projects I have access to");
      assertIcon(links[1], "fas,globe-asia");
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

      defaultMenu.contextLinks = List<NavigableMenuItem>([
        menuRoute({
          icon: ["fas", "home"],
          label: "Home",
          route: homeRoute,
          tooltip: () => "Home page",
          order: 1,
        }),
        selfRoute,
      ]);

      createTestBed({}, {
        pageRoute: selfRoute,
        menus: {
          actions: List<AnyMenuItem>([]),
          links: List<NavigableMenuItem>([]),
        },
      } as IPageInfo);

      fixture.detectChanges();

      const links = findLinks("internal-link");

      expect(findLinks("internal-link").length).toBe(2);
      expect(findLinks("external-link").length).toBe(0);

      assertLabel(links[0], "Home");
      assertTooltip(links[0], "Home page");
      assertIcon(links[0], "fas,home");

      assertLabel(links[1], "Projects");
      assertTooltip(links[1], "View projects I have access to");
      assertIcon(links[1], "fas,globe-asia");
    });
  });
});

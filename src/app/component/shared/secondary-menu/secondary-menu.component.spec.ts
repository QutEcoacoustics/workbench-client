import { HttpClientModule } from "@angular/common/http";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ActivatedRoute } from "@angular/router";
import { RouterTestingModule } from "@angular/router/testing";
import { fromJS, List } from "immutable";
import { BehaviorSubject } from "rxjs";
import { DefaultMenu } from "src/app/helpers/page/defaultMenus";
import { PageInfo, PageInfoInterface } from "src/app/helpers/page/pageInfo";
import { assertIcon, assertTooltip } from "src/app/helpers/tests/helpers";
import {
  AnyMenuItem,
  Category,
  MenuLink,
  MenuRoute,
  NavigableMenuItem
} from "src/app/interfaces/menusInterfaces";
import { StrongRoute } from "src/app/interfaces/strongRoute";
import { testAppInitializer } from "src/app/test.helper";
import { homeCategory } from "../../home/home.menus";
import { SharedModule } from "../shared.module";
import { SecondaryMenuComponent } from "./secondary-menu.component";

describe("SecondaryMenuComponent", () => {
  let component: SecondaryMenuComponent;
  let fixture: ComponentFixture<SecondaryMenuComponent>;
  let storedDefaultMenu: any;
  const defaultRoute = StrongRoute.Base.add("/");
  const selfLinkCount = 1;
  const defaultSelfLink = MenuRoute({
    label: "Self Label",
    icon: ["fas", "question-circle"],
    tooltip: () => "Self Tooltip",
    order: 999, // Force to be last link
    route: defaultRoute
  });
  const defaultCategory = {
    label: "Custom Category",
    icon: ["fas", "home"],
    route: defaultRoute
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
    return fixture.nativeElement.querySelectorAll("app-menu-" + selector);
  }

  function createTestBed(params: any, data: PageInfoInterface) {
    class MockActivatedRoute {
      public data = new BehaviorSubject<PageInfoInterface>(data);
      public snapshot = {
        params
      };
    }
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientModule, SharedModule],
      declarations: [SecondaryMenuComponent],
      providers: [
        ...testAppInitializer,
        { provide: ActivatedRoute, useClass: MockActivatedRoute }
      ]
    }).compileComponents();
    fixture = TestBed.createComponent(SecondaryMenuComponent);
    component = fixture.componentInstance;
  }

  beforeAll(() => {
    // Make a non-referenced copy of DefaultMenuItem
    storedDefaultMenu = fromJS(DefaultMenu);
  });

  beforeEach(() => {
    // Clear DefaultMenu
    DefaultMenu.contextLinks = List<NavigableMenuItem>([]);
    DefaultMenu.defaultCategory = homeCategory;
  });

  afterAll(() => {
    // Restore DefaultMenu
    const temp = storedDefaultMenu.toJS();
    DefaultMenu.contextLinks = temp.contextLinks;
    DefaultMenu.defaultCategory = temp.defaultCategory;
  });

  describe("title", () => {
    it("should display menu title", () => {
      createTestBed({}, {
        self: defaultSelfLink,
        category: defaultCategory,
        menus: {
          actions: List<AnyMenuItem>([]),
          links: List<NavigableMenuItem>([])
        }
      } as PageInfoInterface);

      fixture.detectChanges();

      assertTitle(fixture.nativeElement.querySelector("h6"), "MENU");
    });

    it("should not display menu icon", () => {
      createTestBed({}, {
        self: defaultSelfLink,
        category: defaultCategory,
        menus: {
          actions: List<AnyMenuItem>([]),
          links: List<NavigableMenuItem>([])
        }
      } as PageInfoInterface);

      fixture.detectChanges();

      const icon = fixture.nativeElement.querySelector("h6 fa-icon");
      expect(icon).toBeFalsy();
    });
  });

  describe("links", () => {
    it("should handle undefined links", () => {
      createTestBed({}, {
        self: defaultSelfLink,
        category: defaultCategory,
        menus: {
          actions: List<AnyMenuItem>([]),
          links: undefined
        }
      } as PageInfoInterface);

      fixture.detectChanges();

      expect(findLinks("internal-link").length).toBe(1);
      expect(findLinks("external-link").length).toBe(0);
    });

    it("should create self link", () => {
      createTestBed({}, {
        self: defaultSelfLink,
        category: defaultCategory,
        menus: {
          actions: List<AnyMenuItem>([]),
          links: List<NavigableMenuItem>([])
        }
      } as PageInfoInterface);

      fixture.detectChanges();

      expect(findLinks("internal-link").length).toBe(1);
      expect(findLinks("external-link").length).toBe(0);
    });

    it("should handle mixed links", () => {
      createTestBed({}, {
        self: defaultSelfLink,
        category: defaultCategory,
        menus: {
          actions: List<AnyMenuItem>([]),
          links: List<NavigableMenuItem>([
            MenuRoute({
              label: "Custom Label",
              icon: ["fas", "tag"],
              tooltip: () => "Custom Tooltip",
              route: defaultRoute
            }),
            MenuLink({
              label: "Custom Label",
              icon: ["fas", "tag"],
              tooltip: () => "Custom Tooltip",
              uri: () => "http://brokenlink/"
            })
          ])
        }
      } as PageInfoInterface);

      fixture.detectChanges();

      expect(findLinks("internal-link").length).toBe(2);
      expect(findLinks("external-link").length).toBe(1);
    });
  });

  describe("self link", () => {
    it("should handle self link", () => {
      createTestBed({}, {
        self: MenuRoute({
          label: "Custom Label",
          icon: ["fas", "exclamation-triangle"],
          tooltip: () => "Custom Tooltip",
          order: 999,
          route: defaultRoute
        }),
        category: defaultCategory,
        menus: {
          actions: List<AnyMenuItem>([]),
          links: List<NavigableMenuItem>([])
        }
      } as PageInfoInterface);

      fixture.detectChanges();

      const links = findLinks("internal-link");

      assertLabel(links[0], "Custom Label");
      assertIcon(links[0], "fas,exclamation-triangle");
      assertTooltip(links[0], "Custom Tooltip");
    });

    it("should handle parent link", () => {
      const parentRoute = StrongRoute.Base.add("home");
      const childRoute = parentRoute.add("house");
      const parentLink = MenuRoute({
        label: "Parent Label",
        icon: ["fas", "question"],
        order: 999,
        tooltip: () => "Custom Tooltip 1",
        route: parentRoute
      });

      createTestBed({}, {
        self: MenuRoute({
          label: "Child Label",
          icon: ["fas", "exclamation-triangle"],
          tooltip: () => "Custom Tooltip 2",
          order: 999,
          parent: parentLink,
          route: childRoute
        }),
        category: defaultCategory,
        menus: {
          actions: List<AnyMenuItem>([]),
          links: List<NavigableMenuItem>([])
        }
      } as PageInfoInterface);

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
      const grandParentRoute = StrongRoute.Base.add("home");
      const parentRoute = grandParentRoute.add("house");
      const childRoute = parentRoute.add("door");
      const grandParentLink = MenuRoute({
        label: "GrandParent Label",
        icon: ["fas", "question"],
        order: 999,
        tooltip: () => "Custom Tooltip 1",
        route: grandParentRoute
      });
      const parentLink = MenuRoute({
        label: "Parent Label",
        icon: ["fas", "question-circle"],
        order: 999,
        tooltip: () => "Custom Tooltip 2",
        parent: grandParentLink,
        route: parentRoute
      });

      createTestBed({}, {
        self: MenuRoute({
          label: "Child Label",
          icon: ["fas", "exclamation-triangle"],
          tooltip: () => "Custom Tooltip 3",
          order: 999,
          parent: parentLink,
          route: childRoute
        }),
        category: defaultCategory,
        menus: {
          actions: List<AnyMenuItem>([]),
          links: List<NavigableMenuItem>([])
        }
      } as PageInfoInterface);

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
      const parentRoute = StrongRoute.Base.add("home");
      const childRoute = parentRoute.add("house");
      const parentLink = MenuRoute({
        label: "Parent Label",
        icon: ["fas", "question"],
        order: 999,
        tooltip: () => "Custom Tooltip 1",
        route: parentRoute,
        predicate: () => false
      });

      createTestBed({}, {
        self: MenuRoute({
          label: "Child Label",
          icon: ["fas", "exclamation-triangle"],
          tooltip: () => "Custom Tooltip 2",
          order: 999,
          parent: parentLink,
          route: childRoute,
          predicate: () => false
        }),
        category: defaultCategory,
        menus: {
          actions: List<AnyMenuItem>([]),
          links: List<NavigableMenuItem>([])
        }
      } as PageInfoInterface);

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
        self: defaultSelfLink,
        category: defaultCategory,
        menus: {
          actions: List<AnyMenuItem>([]),
          links: List<NavigableMenuItem>([
            MenuRoute({
              label: "Custom Label",
              icon: ["fas", "tag"],
              tooltip: () => "Custom Tooltip",
              route: defaultRoute
            })
          ])
        }
      } as PageInfoInterface);

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
        self: defaultSelfLink,
        category: defaultCategory,
        menus: {
          actions: List<AnyMenuItem>([]),
          links: List<NavigableMenuItem>([
            MenuRoute({
              label: "Custom Label 1",
              icon: ["fas", "tag"],
              tooltip: () => "Custom Tooltip 1",
              route: defaultRoute
            }),
            MenuRoute({
              label: "Custom Label 2",
              icon: ["fas", "tags"],
              tooltip: () => "Custom Tooltip 2",
              route: defaultRoute
            })
          ])
        }
      } as PageInfoInterface);

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
        self: defaultSelfLink,
        category: defaultCategory,
        menus: {
          actions: List<AnyMenuItem>([]),
          links: List<NavigableMenuItem>([
            MenuLink({
              label: "Custom Label",
              icon: ["fas", "tag"],
              tooltip: () => "Custom Tooltip",
              uri: () => "http://brokenlink/"
            })
          ])
        }
      } as PageInfoInterface);

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
        self: defaultSelfLink,
        category: defaultCategory,
        menus: {
          actions: List<AnyMenuItem>([]),
          links: List<NavigableMenuItem>([
            MenuLink({
              label: "Custom Label 1",
              icon: ["fas", "tag"],
              tooltip: () => "Custom Tooltip 1",
              uri: () => "http://brokenlink/1"
            }),
            MenuLink({
              label: "Custom Label 2",
              icon: ["fas", "tags"],
              tooltip: () => "Custom Tooltip 2",
              uri: () => "http://brokenlink/2"
            })
          ])
        }
      } as PageInfoInterface);

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
      const homeRoute = StrongRoute.Base.add("");

      DefaultMenu.contextLinks = List<NavigableMenuItem>([
        MenuRoute({
          icon: ["fas", "home"],
          label: "Home",
          route: homeRoute,
          tooltip: () => "Home page",
          order: 1
        })
      ]);

      createTestBed({}, {
        self: defaultSelfLink,
        menus: {
          actions: List<AnyMenuItem>([]),
          links: List<NavigableMenuItem>([])
        }
      } as PageInfoInterface);

      fixture.detectChanges();

      const links = findLinks("internal-link");

      expect(findLinks("internal-link").length).toBe(2);
      expect(findLinks("external-link").length).toBe(0);

      assertLabel(links[0], "Home");
      assertTooltip(links[0], "Home page");
      assertIcon(links[0], "fas,home");
    });

    it("should handle multiple links", () => {
      const homeRoute = StrongRoute.Base.add("");
      const projectsRoute = StrongRoute.Base.add("projects");

      DefaultMenu.contextLinks = List<NavigableMenuItem>([
        MenuRoute({
          icon: ["fas", "home"],
          label: "Home",
          route: homeRoute,
          tooltip: () => "Home page",
          order: 1
        }),
        MenuRoute({
          icon: ["fas", "globe-asia"],
          label: "Projects",
          route: projectsRoute,
          tooltip: () => "View projects I have access to",
          order: 4
        })
      ]);

      createTestBed({}, {
        self: defaultSelfLink,
        menus: {
          actions: List<AnyMenuItem>([]),
          links: List<NavigableMenuItem>([])
        }
      } as PageInfoInterface);

      fixture.detectChanges();

      const links = findLinks("internal-link");

      expect(findLinks("internal-link").length).toBe(3);
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

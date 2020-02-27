import { HttpClientModule } from "@angular/common/http";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ActivatedRoute } from "@angular/router";
import { RouterTestingModule } from "@angular/router/testing";
import { List } from "immutable";
import { BehaviorSubject } from "rxjs";
import { PageInfoInterface } from "src/app/helpers/page/pageInfo";
import { assertIcon, assertTooltip } from "src/app/helpers/tests/helpers";
import {
  AnyMenuItem,
  Category,
  MenuAction,
  MenuLink,
  MenuRoute,
  NavigableMenuItem
} from "src/app/interfaces/menusInterfaces";
import { StrongRoute } from "src/app/interfaces/strongRoute";
import { testBawServices } from "src/app/test.helper";
import { SharedModule } from "../shared.module";
import { ActionMenuComponent } from "./action-menu.component";

describe("ActionMenuComponent", () => {
  let component: ActionMenuComponent;
  let fixture: ComponentFixture<ActionMenuComponent>;
  const defaultRoute = StrongRoute.Base.add("/");
  const defaultSelfLink = MenuRoute({
    label: "Self Label",
    icon: ["fas", "question-circle"],
    tooltip: () => "Self Tooltip",
    order: 999,
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
      declarations: [ActionMenuComponent],
      providers: [
        ...testBawServices,
        { provide: ActivatedRoute, useClass: MockActivatedRoute }
      ]
    }).compileComponents();
    fixture = TestBed.createComponent(ActionMenuComponent);
    component = fixture.componentInstance;
  }

  describe("category", () => {
    it("should display custom title", () => {
      const route = StrongRoute.Base.add("/");

      createTestBed({}, {
        self: MenuRoute({
          label: "Custom Label",
          icon: ["fas", "question-circle"],
          tooltip: () => "Custom Tooltip",
          route
        }),
        category: {
          label: "Custom Category",
          icon: ["fas", "home"],
          route
        },
        menus: {
          actions: List<AnyMenuItem>([]),
          links: List<NavigableMenuItem>([])
        }
      } as PageInfoInterface);

      fixture.detectChanges();

      assertTitle(fixture.nativeElement, "CUSTOM CATEGORY");
    });

    it("should display custom icon", () => {
      const route = StrongRoute.Base.add("/");

      createTestBed({}, {
        self: MenuRoute({
          label: "Custom Label",
          icon: ["fas", "question-circle"],
          tooltip: () => "Custom Tooltip",
          route
        }),
        category: {
          label: "Custom Category",
          icon: ["fas", "circle"],
          route
        },
        menus: {
          actions: List<AnyMenuItem>([]),
          links: List<NavigableMenuItem>([])
        }
      } as PageInfoInterface);

      fixture.detectChanges();

      assertIcon(fixture.nativeElement, "fas,circle");
    });

    it("should display default title", () => {
      const route = StrongRoute.Base.add("/");

      createTestBed({}, {
        self: MenuRoute({
          label: "Custom Label",
          icon: ["fas", "question-circle"],
          tooltip: () => "Custom Tooltip",
          route
        }),
        menus: {
          actions: List<AnyMenuItem>([]),
          links: List<NavigableMenuItem>([])
        }
      } as PageInfoInterface);

      fixture.detectChanges();

      assertTitle(fixture.nativeElement, "HOME");
    });

    it("should display default icon", () => {
      const route = StrongRoute.Base.add("/");

      createTestBed({}, {
        self: MenuRoute({
          label: "Custom Label",
          icon: ["fas", "question-circle"],
          tooltip: () => "Custom Tooltip",
          route
        }),
        menus: {
          actions: List<AnyMenuItem>([]),
          links: List<NavigableMenuItem>([])
        }
      } as PageInfoInterface);

      fixture.detectChanges();

      assertIcon(fixture.nativeElement, "fas,home");
    });
  });

  describe("links", () => {
    it("should handle undefined links", () => {
      const route = StrongRoute.Base.add("/");

      createTestBed({}, {
        self: MenuRoute({
          label: "Custom Label",
          icon: ["fas", "question-circle"],
          tooltip: () => "Custom Tooltip",
          route
        }),
        category: {
          label: "Custom Category",
          icon: ["fas", "home"],
          route
        },
        menus: {
          actions: undefined,
          links: List<NavigableMenuItem>([])
        }
      } as PageInfoInterface);

      fixture.detectChanges();

      expect(findLinks("internal-link").length).toBe(0);
      expect(findLinks("external-link").length).toBe(0);
      expect(findLinks("button").length).toBe(0);
    });

    it("should handle no links", () => {
      const route = StrongRoute.Base.add("/");

      createTestBed({}, {
        self: MenuRoute({
          label: "Custom Label",
          icon: ["fas", "question-circle"],
          tooltip: () => "Custom Tooltip",
          route
        }),
        category: {
          label: "Custom Category",
          icon: ["fas", "home"],
          route
        },
        menus: {
          actions: List<AnyMenuItem>([]),
          links: List<NavigableMenuItem>([])
        }
      } as PageInfoInterface);

      fixture.detectChanges();

      expect(findLinks("internal-link").length).toBe(0);
      expect(findLinks("external-link").length).toBe(0);
      expect(findLinks("button").length).toBe(0);
    });

    it("should handle mixed links", () => {
      const route = StrongRoute.Base.add("/");

      createTestBed({}, {
        self: MenuRoute({
          label: "Custom Label",
          icon: ["fas", "question-circle"],
          tooltip: () => "Custom Tooltip",
          route
        }),
        category: {
          label: "Custom Category",
          icon: ["fas", "home"],
          route
        },
        menus: {
          actions: List<AnyMenuItem>([
            MenuRoute({
              label: "Custom Label",
              icon: ["fas", "tag"],
              tooltip: () => "Custom Tooltip",
              route
            }),
            MenuLink({
              label: "Custom Label",
              icon: ["fas", "tag"],
              tooltip: () => "Custom Tooltip",
              uri: () => "http://brokenlink/"
            }),
            MenuAction({
              label: "Custom Label",
              icon: ["fas", "tag"],
              tooltip: () => "Custom Tooltip",
              action: () => console.log("action")
            })
          ]),
          links: List<NavigableMenuItem>([])
        }
      } as PageInfoInterface);

      fixture.detectChanges();

      expect(findLinks("internal-link").length).toBe(1);
      expect(findLinks("external-link").length).toBe(1);
      expect(findLinks("button").length).toBe(1);
    });
  });

  describe("internal links", () => {
    it("should handle single link", () => {
      createTestBed({}, {
        self: defaultSelfLink,
        category: defaultCategory,
        menus: {
          actions: List<AnyMenuItem>([
            MenuRoute({
              label: "Custom Label",
              icon: ["fas", "tag"],
              tooltip: () => "Custom Tooltip",
              route: defaultRoute
            })
          ]),
          links: List<NavigableMenuItem>([])
        }
      } as PageInfoInterface);

      fixture.detectChanges();

      const links = findLinks("internal-link");

      expect(links.length).toBe(1);
      expect(findLinks("external-link").length).toBe(0);
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
          actions: List<AnyMenuItem>([
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
          ]),
          links: List<NavigableMenuItem>([])
        }
      } as PageInfoInterface);

      fixture.detectChanges();

      const links = findLinks("internal-link");

      expect(links.length).toBe(2);
      expect(findLinks("external-link").length).toBe(0);
      expect(findLinks("button").length).toBe(0);

      assertLabel(links[0], "Custom Label 1");
      assertTooltip(links[0], "Custom Tooltip 1");
      assertIcon(links[0], "fas,tag");

      assertLabel(links[1], "Custom Label 2");
      assertTooltip(links[1], "Custom Tooltip 2");
      assertIcon(links[1], "fas,tags");
    });
  });

  describe("external links", () => {
    it("should handle single link", () => {
      createTestBed({}, {
        self: defaultSelfLink,
        category: defaultCategory,
        menus: {
          actions: List<AnyMenuItem>([
            MenuLink({
              label: "Custom Label",
              icon: ["fas", "tag"],
              tooltip: () => "Custom Tooltip",
              uri: () => "http://brokenlink/"
            })
          ]),
          links: List<NavigableMenuItem>([])
        }
      } as PageInfoInterface);

      fixture.detectChanges();

      const links = findLinks("external-link");

      expect(findLinks("internal-link").length).toBe(0);
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
          actions: List<AnyMenuItem>([
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
          ]),
          links: List<NavigableMenuItem>([])
        }
      } as PageInfoInterface);

      fixture.detectChanges();

      const links = findLinks("external-link");

      expect(findLinks("internal-link").length).toBe(0);
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

  describe("action buttons", () => {
    it("should handle single action button", () => {
      createTestBed({}, {
        self: defaultSelfLink,
        category: defaultCategory,
        menus: {
          actions: List<AnyMenuItem>([
            MenuAction({
              label: "Custom Label",
              icon: ["fas", "tag"],
              tooltip: () => "Custom Tooltip",
              action: () => console.log("action")
            })
          ]),
          links: List<NavigableMenuItem>([])
        }
      } as PageInfoInterface);

      fixture.detectChanges();

      const links = findLinks("button");

      expect(findLinks("internal-link").length).toBe(0);
      expect(findLinks("external-link").length).toBe(0);
      expect(links.length).toBe(1);

      assertLabel(links[0], "Custom Label");
      assertTooltip(links[0], "Custom Tooltip");
      assertIcon(links[0], "fas,tag");
    });

    it("should handle multiple action button", () => {
      createTestBed({}, {
        self: defaultSelfLink,
        category: defaultCategory,
        menus: {
          actions: List<AnyMenuItem>([
            MenuAction({
              label: "Custom Label 1",
              icon: ["fas", "tag"],
              tooltip: () => "Custom Tooltip 1",
              action: () => console.log("action")
            }),
            MenuAction({
              label: "Custom Label 2",
              icon: ["fas", "tags"],
              tooltip: () => "Custom Tooltip 2",
              action: () => console.log("action")
            })
          ]),
          links: List<NavigableMenuItem>([])
        }
      } as PageInfoInterface);

      fixture.detectChanges();

      const links = findLinks("button");

      expect(findLinks("internal-link").length).toBe(0);
      expect(findLinks("external-link").length).toBe(0);
      expect(links.length).toBe(2);

      assertLabel(links[0], "Custom Label 1");
      assertTooltip(links[0], "Custom Tooltip 1");
      assertIcon(links[0], "fas,tag");

      assertLabel(links[1], "Custom Label 2");
      assertTooltip(links[1], "Custom Tooltip 2");
      assertIcon(links[1], "fas,tags");
    });
  });

  xit("should handle no widget", () => {});
  xit("should handle widget", () => {});
});

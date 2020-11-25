import { HttpClientModule } from "@angular/common/http";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ActivatedRoute } from "@angular/router";
import { RouterTestingModule } from "@angular/router/testing";
import { MockBawApiModule } from "@baw-api/baw-apiMock.module";
import { IPageInfo } from "@helpers/page/pageInfo";
import {
  AnyMenuItem,
  Category,
  menuAction,
  menuLink,
  menuRoute,
  NavigableMenuItem,
} from "@interfaces/menusInterfaces";
import { StrongRoute } from "@interfaces/strongRoute";
import { assertIcon, assertTooltip } from "@test/helpers/html";
import { mockActivatedRoute } from "@test/helpers/testbed";
import { List } from "immutable";
import { SharedModule } from "../shared.module";
import { ActionMenuComponent } from "./action-menu.component";

describe("ActionMenuComponent", () => {
  let component: ActionMenuComponent;
  let fixture: ComponentFixture<ActionMenuComponent>;
  const defaultRoute = StrongRoute.base.add("/");
  const defaultSelfLink = menuRoute({
    label: "Self Label",
    icon: ["fas", "question-circle"],
    tooltip: () => "Self Tooltip",
    order: 999,
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

  function createTestBed(params: any, data: IPageInfo) {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientModule,
        SharedModule,
        MockBawApiModule,
      ],
      declarations: [ActionMenuComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useClass: mockActivatedRoute(undefined, data, params),
        },
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(ActionMenuComponent);
    component = fixture.componentInstance;
  }

  describe("category", () => {
    it("should display custom title", () => {
      const route = StrongRoute.base.add("/");

      createTestBed({}, {
        pageRoute: menuRoute({
          label: "Custom Label",
          icon: ["fas", "question-circle"],
          tooltip: () => "Custom Tooltip",
          route,
        }),
        category: {
          label: "Custom Category",
          icon: ["fas", "home"],
          route,
        },
        menus: {
          actions: List<AnyMenuItem>([]),
          links: List<NavigableMenuItem>([]),
        },
      } as IPageInfo);

      fixture.detectChanges();

      assertTitle(fixture.nativeElement, "CUSTOM CATEGORY");
    });

    it("should display custom icon", () => {
      const route = StrongRoute.base.add("/");

      createTestBed({}, {
        pageRoute: menuRoute({
          label: "Custom Label",
          icon: ["fas", "question-circle"],
          tooltip: () => "Custom Tooltip",
          route,
        }),
        category: {
          label: "Custom Category",
          icon: ["fas", "circle"],
          route,
        },
        menus: {
          actions: List<AnyMenuItem>([]),
          links: List<NavigableMenuItem>([]),
        },
      } as IPageInfo);

      fixture.detectChanges();

      assertIcon(fixture.nativeElement, "fas,circle");
    });

    it("should display default title", () => {
      const route = StrongRoute.base.add("/");

      createTestBed({}, {
        pageRoute: menuRoute({
          label: "Custom Label",
          icon: ["fas", "question-circle"],
          tooltip: () => "Custom Tooltip",
          route,
        }),
        menus: {
          actions: List<AnyMenuItem>([]),
          links: List<NavigableMenuItem>([]),
        },
      } as IPageInfo);

      fixture.detectChanges();

      assertTitle(fixture.nativeElement, "HOME");
    });

    it("should display default icon", () => {
      const route = StrongRoute.base.add("/");

      createTestBed({}, {
        pageRoute: menuRoute({
          label: "Custom Label",
          icon: ["fas", "question-circle"],
          tooltip: () => "Custom Tooltip",
          route,
        }),
        menus: {
          actions: List<AnyMenuItem>([]),
          links: List<NavigableMenuItem>([]),
        },
      } as IPageInfo);

      fixture.detectChanges();

      assertIcon(fixture.nativeElement, "fas,home");
    });
  });

  describe("links", () => {
    it("should handle undefined links", () => {
      const route = StrongRoute.base.add("/");

      createTestBed({}, {
        pageRoute: menuRoute({
          label: "Custom Label",
          icon: ["fas", "question-circle"],
          tooltip: () => "Custom Tooltip",
          route,
        }),
        category: {
          label: "Custom Category",
          icon: ["fas", "home"],
          route,
        },
        menus: {
          actions: undefined,
          links: List<NavigableMenuItem>([]),
        },
      } as IPageInfo);

      fixture.detectChanges();

      expect(findLinks("internal-link").length).toBe(0);
      expect(findLinks("external-link").length).toBe(0);
      expect(findLinks("button").length).toBe(0);
    });

    it("should handle no links", () => {
      const route = StrongRoute.base.add("/");

      createTestBed({}, {
        pageRoute: menuRoute({
          label: "Custom Label",
          icon: ["fas", "question-circle"],
          tooltip: () => "Custom Tooltip",
          route,
        }),
        category: {
          label: "Custom Category",
          icon: ["fas", "home"],
          route,
        },
        menus: {
          actions: List<AnyMenuItem>([]),
          links: List<NavigableMenuItem>([]),
        },
      } as IPageInfo);

      fixture.detectChanges();

      expect(findLinks("internal-link").length).toBe(0);
      expect(findLinks("external-link").length).toBe(0);
      expect(findLinks("button").length).toBe(0);
    });

    it("should handle mixed links", () => {
      const route = StrongRoute.base.add("/");

      createTestBed({}, {
        pageRoute: menuRoute({
          label: "Custom Label",
          icon: ["fas", "question-circle"],
          tooltip: () => "Custom Tooltip",
          route,
        }),
        category: {
          label: "Custom Category",
          icon: ["fas", "home"],
          route,
        },
        menus: {
          actions: List<AnyMenuItem>([
            menuRoute({
              label: "Custom Label",
              icon: ["fas", "tag"],
              tooltip: () => "Custom Tooltip",
              route,
            }),
            menuLink({
              label: "Custom Label",
              icon: ["fas", "tag"],
              tooltip: () => "Custom Tooltip",
              uri: () => "http://brokenlink/",
            }),
            menuAction({
              label: "Custom Label",
              icon: ["fas", "tag"],
              tooltip: () => "Custom Tooltip",
              action: () => {},
            }),
          ]),
          links: List<NavigableMenuItem>([]),
        },
      } as IPageInfo);

      fixture.detectChanges();

      expect(findLinks("internal-link").length).toBe(1);
      expect(findLinks("external-link").length).toBe(1);
      expect(findLinks("button").length).toBe(1);
    });
  });

  describe("internal links", () => {
    it("should handle single link", () => {
      createTestBed({}, {
        pageRoute: defaultSelfLink,
        category: defaultCategory,
        menus: {
          actions: List<AnyMenuItem>([
            menuRoute({
              label: "Custom Label",
              icon: ["fas", "tag"],
              tooltip: () => "Custom Tooltip",
              route: defaultRoute,
            }),
          ]),
          links: List<NavigableMenuItem>([]),
        },
      } as IPageInfo);

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
        pageRoute: defaultSelfLink,
        category: defaultCategory,
        menus: {
          actions: List<AnyMenuItem>([
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
          links: List<NavigableMenuItem>([]),
        },
      } as IPageInfo);

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
        pageRoute: defaultSelfLink,
        category: defaultCategory,
        menus: {
          actions: List<AnyMenuItem>([
            menuLink({
              label: "Custom Label",
              icon: ["fas", "tag"],
              tooltip: () => "Custom Tooltip",
              uri: () => "http://brokenlink/",
            }),
          ]),
          links: List<NavigableMenuItem>([]),
        },
      } as IPageInfo);

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
        pageRoute: defaultSelfLink,
        category: defaultCategory,
        menus: {
          actions: List<AnyMenuItem>([
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
          links: List<NavigableMenuItem>([]),
        },
      } as IPageInfo);

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
        pageRoute: defaultSelfLink,
        category: defaultCategory,
        menus: {
          actions: List<AnyMenuItem>([
            menuAction({
              label: "Custom Label",
              icon: ["fas", "tag"],
              tooltip: () => "Custom Tooltip",
              action: () => {},
            }),
          ]),
          links: List<NavigableMenuItem>([]),
        },
      } as IPageInfo);

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
        pageRoute: defaultSelfLink,
        category: defaultCategory,
        menus: {
          actions: List<AnyMenuItem>([
            menuAction({
              label: "Custom Label 1",
              icon: ["fas", "tag"],
              tooltip: () => "Custom Tooltip 1",
              action: () => {},
            }),
            menuAction({
              label: "Custom Label 2",
              icon: ["fas", "tags"],
              tooltip: () => "Custom Tooltip 2",
              action: () => {},
            }),
          ]),
          links: List<NavigableMenuItem>([]),
        },
      } as IPageInfo);

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

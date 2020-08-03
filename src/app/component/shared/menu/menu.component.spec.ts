import { HttpClientModule } from "@angular/common/http";
import { DebugElement } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ActivatedRoute } from "@angular/router";
import { RouterTestingModule } from "@angular/router/testing";
import { MockBawApiModule } from "@baw-api/baw-apiMock.module";
import { SecurityService } from "@baw-api/security/security.service";
import { List } from "immutable";
import {
  AnyMenuItem,
  MenuAction,
  MenuLink,
  MenuRoute,
} from "src/app/interfaces/menusInterfaces";
import { StrongRoute } from "src/app/interfaces/strongRoute";
import { SessionUser } from "src/app/models/User";
import { assertIcon, assertTooltip, getText } from "src/app/test/helpers/html";
import { mockActivatedRoute } from "src/app/test/helpers/testbed";
import { SharedModule } from "../shared.module";
import { MenuButtonComponent } from "./button/button.component";
import { MenuExternalLinkComponent } from "./external-link/external-link.component";
import { MenuInternalLinkComponent } from "./internal-link/internal-link.component";
import { MenuComponent } from "./menu.component";

describe("MenuComponent", () => {
  let router: ActivatedRoute;
  let component: MenuComponent;
  let fixture: ComponentFixture<MenuComponent>;
  let api: SecurityService;
  let componentElement: DebugElement;
  const sessionUser = new SessionUser({
    userName: "username",
    authToken: "xxxxxxxxxxxxxxx",
  });

  function assertTitle(target: HTMLElement, header: string) {
    expect(target).toBeTruthy();
    expect(target.innerText.trim()).toBe(header);
  }

  function assertLabel(target: HTMLElement, labelText: string) {
    const label: HTMLElement = target.querySelector("#label");
    expect(label).toBeTruthy();
    expect(label.innerText.trim()).toBe(labelText);
  }

  function findLinks(
    selector: "internal-link" | "external-link" | "button"
  ): HTMLElement[] {
    return fixture.nativeElement.querySelectorAll("baw-menu-" + selector);
  }

  function setLoggedInState() {
    spyOn(api, "getLocalUser").and.callFake(() => sessionUser);
  }

  function configureTestingModule(data?: any) {
    TestBed.configureTestingModule({
      imports: [
        SharedModule,
        HttpClientModule,
        RouterTestingModule.withRoutes([]),
        MockBawApiModule,
      ],
      declarations: [
        MenuComponent,
        MenuButtonComponent,
        MenuExternalLinkComponent,
        MenuInternalLinkComponent,
      ],
      providers: [
        {
          provide: ActivatedRoute,
          useClass: mockActivatedRoute(undefined, data, { attribute: 10 }),
        },
      ],
    }).compileComponents();

    router = TestBed.inject(ActivatedRoute);
    api = TestBed.inject(SecurityService);
    fixture = TestBed.createComponent(MenuComponent);
    component = fixture.componentInstance;
    componentElement = fixture.debugElement;
  }

  afterEach(() => {
    localStorage.clear();
  });

  describe("menu", () => {
    beforeEach(() => {
      configureTestingModule();
    });

    it("should create default title when none provided", () => {
      component.links = List<AnyMenuItem>([]);
      fixture.detectChanges();

      const title = fixture.nativeElement.querySelector("h6");
      assertTitle(title, "MENU");
    });

    it("should create title when provided", () => {
      component.title = { label: "SECONDARY", icon: ["fas", "home"] };
      component.links = List<AnyMenuItem>([]);
      fixture.detectChanges();

      const title = fixture.nativeElement.querySelector("h6");
      assertTitle(title, "SECONDARY");
    });

    it("should create title icon when provided", () => {
      component.title = { label: "SECONDARY", icon: ["fas", "home"] };
      component.links = List<AnyMenuItem>([]);
      fixture.detectChanges();

      const title = fixture.nativeElement.querySelector("h6");
      assertIcon(title, "fas,home");
    });

    it("should create capitalized title", () => {
      component.title = { label: "secondary", icon: ["fas", "home"] };
      component.links = List<AnyMenuItem>([]);
      fixture.detectChanges();

      const title = fixture.nativeElement.querySelector("h6");
      assertTitle(title, "SECONDARY");
    });

    it("should create no links on action menu", () => {
      component.menuType = "action";
      component.links = List<AnyMenuItem>([]);
      fixture.detectChanges();

      expect(findLinks("internal-link").length).toBe(0);
      expect(findLinks("external-link").length).toBe(0);
      expect(findLinks("button").length).toBe(0);
    });

    it("should create no links on secondary menu", () => {
      component.menuType = "secondary";
      component.links = List<AnyMenuItem>([]);
      fixture.detectChanges();

      expect(findLinks("internal-link").length).toBe(0);
      expect(findLinks("external-link").length).toBe(0);
      expect(findLinks("button").length).toBe(0);
    });

    it("should create mixed links on action menu", () => {
      component.menuType = "action";
      component.links = List<AnyMenuItem>([
        MenuRoute({
          label: "label",
          icon: ["fas", "home"],
          tooltip: () => "tooltip",
          route: StrongRoute.Base.add("home"),
        }),
        MenuLink({
          label: "label",
          icon: ["fas", "home"],
          tooltip: () => "tooltip",
          uri: () => "http://brokenlink/",
        }),
        MenuAction({
          label: "label",
          icon: ["fas", "home"],
          tooltip: () => "tooltip",
          action: () => {},
        }),
      ]);
      fixture.detectChanges();

      expect(findLinks("internal-link").length).toBe(1);
      expect(findLinks("external-link").length).toBe(1);
      expect(findLinks("button").length).toBe(1);
    });

    it("should create mixed links on secondary menu", () => {
      component.menuType = "secondary";
      component.links = List<AnyMenuItem>([
        MenuRoute({
          label: "label",
          icon: ["fas", "home"],
          tooltip: () => "tooltip",
          route: StrongRoute.Base.add("home"),
        }),
        MenuLink({
          label: "label",
          icon: ["fas", "home"],
          tooltip: () => "tooltip",
          uri: () => "http://brokenlink/",
        }),
        MenuAction({
          label: "label",
          icon: ["fas", "home"],
          tooltip: () => "tooltip",
          action: () => {},
        }),
      ]);
      fixture.detectChanges();

      expect(findLinks("internal-link").length).toBe(1);
      expect(findLinks("external-link").length).toBe(1);
      expect(findLinks("button").length).toBe(1);
    });

    xit("should not create widget when none provided", () => {});
    xit("should create widget when provided", () => {});
  });

  describe("internal links", () => {
    const linkSelector = "internal-link";
    let defaultLink: MenuRoute;

    function assertRoute(target: HTMLElement, route: string) {
      const anchor: HTMLElement = target.querySelector("a");
      expect(anchor).toBeTruthy();
      expect(
        anchor.attributes.getNamedItem("ng-reflect-router-link")
      ).toBeTruthy();
      expect(
        anchor.attributes.getNamedItem("ng-reflect-router-link").value.trim()
      ).toBe(route);
    }

    beforeEach(() => {
      configureTestingModule();

      defaultLink = MenuRoute({
        label: "label",
        icon: ["fas", "home"],
        tooltip: () => "tooltip",
        route: StrongRoute.Base.add("home"),
      });
    });

    it("should create single link in action menu", () => {
      component.menuType = "action";
      component.links = List<AnyMenuItem>([defaultLink]);
      fixture.detectChanges();

      expect(findLinks("internal-link").length).toBe(1);
      expect(findLinks("external-link").length).toBe(0);
      expect(findLinks("button").length).toBe(0);
    });

    it("should create single link in secondary menu", () => {
      component.menuType = "secondary";
      component.links = List<AnyMenuItem>([defaultLink]);
      fixture.detectChanges();

      expect(findLinks("internal-link").length).toBe(1);
      expect(findLinks("external-link").length).toBe(0);
      expect(findLinks("button").length).toBe(0);
    });

    it("should create multiple links", () => {
      component.menuType = "action";
      component.links = List<AnyMenuItem>([
        MenuRoute({
          ...defaultLink,
          label: "label 1",
        }),
        MenuRoute({
          ...defaultLink,
          label: "label 2",
        }),
      ]);
      fixture.detectChanges();

      expect(findLinks("internal-link").length).toBe(2);
      expect(findLinks("external-link").length).toBe(0);
      expect(findLinks("button").length).toBe(0);
    });

    it("should label link", () => {
      component.menuType = "action";
      component.links = List<AnyMenuItem>([
        MenuRoute({
          ...defaultLink,
          label: "Custom Label",
        }),
      ]);
      fixture.detectChanges();

      const link = findLinks(linkSelector)[0];
      assertLabel(link, "Custom Label");
    });

    it("should create link icon", () => {
      component.menuType = "action";
      component.links = List<AnyMenuItem>([
        MenuRoute({
          ...defaultLink,
          icon: ["fas", "exclamation-triangle"],
        }),
      ]);
      fixture.detectChanges();

      const link = findLinks(linkSelector)[0];
      assertIcon(link, "fas,exclamation-triangle");
    });

    it("should create link tooltip", () => {
      component.menuType = "action";
      component.links = List<AnyMenuItem>([
        MenuRoute({
          ...defaultLink,
          tooltip: () => "Custom Tooltip",
        }),
      ]);
      fixture.detectChanges();

      const link = findLinks(linkSelector)[0];
      assertTooltip(link, "Custom Tooltip");
    });

    it("should create link tooltip with username", () => {
      setLoggedInState();
      component.menuType = "action";
      component.links = List<AnyMenuItem>([
        MenuRoute({
          ...defaultLink,
          tooltip: (user) => `${user.userName} tooltip`,
        }),
      ]);
      fixture.detectChanges();

      const link = findLinks(linkSelector)[0];
      assertTooltip(link, `${sessionUser.userName} tooltip`);
    });

    it("should create link route", () => {
      component.menuType = "action";
      component.links = List<AnyMenuItem>([
        MenuRoute({
          ...defaultLink,
          route: StrongRoute.Base.add("custom_route"),
        }),
      ]);
      fixture.detectChanges();

      const link = findLinks(linkSelector)[0];
      assertRoute(link, "/custom_route");
    });

    it("should create link route with parameter", () => {
      component.menuType = "action";
      component.links = List<AnyMenuItem>([
        MenuRoute({
          ...defaultLink,
          route: StrongRoute.Base.add("home").add(":attribute"),
        }),
      ]);
      fixture.detectChanges();

      const link = findLinks(linkSelector)[0];
      assertRoute(link, "/home/10");
    });

    it("should not filter links without predicate", () => {
      setLoggedInState();
      component.menuType = "action";
      component.links = List<AnyMenuItem>([
        MenuRoute({
          ...defaultLink,
          route: StrongRoute.Base.add("home"),
        }),
      ]);
      fixture.detectChanges();

      const links = findLinks(linkSelector);
      expect(links.length).toBe(1);
    });

    it("should filter links without passing predicates", () => {
      component.menuType = "action";
      component.links = List<AnyMenuItem>([
        MenuRoute({
          ...defaultLink,
          label: "label 1",
          predicate: () => true,
        }),
        MenuRoute({
          ...defaultLink,
          label: "label 2",
          predicate: () => false,
        }),
      ]);
      fixture.detectChanges();

      const links = findLinks(linkSelector);
      expect(links.length).toBe(1);
      assertLabel(links[0], "label 1");
    });

    it("should filter duplicate links (by object identity)", () => {
      component.menuType = "action";
      component.links = List<AnyMenuItem>([defaultLink, defaultLink]);
      fixture.detectChanges();

      const links = findLinks(linkSelector);
      expect(links.length).toBe(1);
    });
  });

  describe("external links", () => {
    const linkSelector = "external-link";
    let defaultLink: MenuLink;

    function assertHref(target: HTMLElement, href: string) {
      const anchor: HTMLAnchorElement = target.querySelector("a");
      expect(anchor).toBeTruthy();
      expect(anchor.href).toBe(href);
    }

    beforeEach(() => {
      configureTestingModule();
      defaultLink = MenuLink({
        label: "label",
        icon: ["fas", "home"],
        tooltip: () => "tooltip",
        uri: () => "http://brokenlink/",
      });
    });

    it("should create single link in action menu", () => {
      component.menuType = "action";
      component.links = List<AnyMenuItem>([defaultLink]);
      fixture.detectChanges();

      expect(findLinks("internal-link").length).toBe(0);
      expect(findLinks("external-link").length).toBe(1);
      expect(findLinks("button").length).toBe(0);
    });

    it("should create single link in secondary menu", () => {
      component.menuType = "secondary";
      component.links = List<AnyMenuItem>([defaultLink]);
      fixture.detectChanges();

      expect(findLinks("internal-link").length).toBe(0);
      expect(findLinks("external-link").length).toBe(1);
      expect(findLinks("button").length).toBe(0);
    });

    it("should create multiple links", () => {
      component.menuType = "action";
      component.links = List<AnyMenuItem>([
        MenuLink({
          ...defaultLink,
          label: "label 1",
        }),
        MenuLink({
          ...defaultLink,
          label: "label 2",
        }),
      ]);
      fixture.detectChanges();

      expect(findLinks("internal-link").length).toBe(0);
      expect(findLinks("external-link").length).toBe(2);
      expect(findLinks("button").length).toBe(0);
    });

    it("should label link", () => {
      component.menuType = "action";
      component.links = List<AnyMenuItem>([
        MenuLink({
          ...defaultLink,
          label: "Custom Label",
        }),
      ]);
      fixture.detectChanges();

      const link = findLinks(linkSelector)[0];
      assertLabel(link, "Custom Label");
    });

    it("should create link icon", () => {
      component.menuType = "action";
      component.links = List<AnyMenuItem>([
        MenuLink({
          ...defaultLink,
          icon: ["fas", "exclamation-triangle"],
        }),
      ]);
      fixture.detectChanges();

      const link = findLinks(linkSelector)[0];
      assertIcon(link, "fas,exclamation-triangle");
    });

    it("should create link tooltip", () => {
      component.menuType = "action";
      component.links = List<AnyMenuItem>([
        MenuLink({
          ...defaultLink,
          tooltip: () => "Custom Tooltip",
        }),
      ]);
      fixture.detectChanges();

      const link = findLinks(linkSelector)[0];
      assertTooltip(link, "Custom Tooltip");
    });

    it("should create link tooltip with username", () => {
      setLoggedInState();
      component.menuType = "action";
      component.links = List<AnyMenuItem>([
        MenuLink({
          ...defaultLink,
          tooltip: (user) => `${user.userName} tooltip`,
        }),
      ]);
      fixture.detectChanges();

      const link = findLinks(linkSelector)[0];
      assertTooltip(link, `${sessionUser.userName} tooltip`);
    });

    it("should create link href", () => {
      component.menuType = "action";
      component.links = List<AnyMenuItem>([
        MenuLink({
          ...defaultLink,
          uri: () => "http://brokenlink/",
        }),
      ]);
      fixture.detectChanges();

      const link = findLinks(linkSelector)[0];
      assertHref(link, "http://brokenlink/");
    });

    it("should create link href with router params", () => {
      component.menuType = "action";
      component.links = List<AnyMenuItem>([
        MenuLink({
          ...defaultLink,
          uri: (params) => "http://brokenlink/" + params.attribute,
        }),
      ]);
      fixture.detectChanges();

      const link = findLinks(linkSelector)[0];
      assertHref(link, "http://brokenlink/10");
    });

    it("should not filter links without predicate", () => {
      setLoggedInState();
      component.menuType = "action";
      component.links = List<AnyMenuItem>([defaultLink]);
      fixture.detectChanges();

      const links = findLinks(linkSelector);
      expect(links.length).toBe(1);
    });

    it("should filter links without passing predicates", () => {
      component.menuType = "action";
      component.links = List<AnyMenuItem>([
        MenuLink({
          ...defaultLink,
          label: "label 1",
          predicate: () => true,
        }),
        MenuLink({
          ...defaultLink,
          label: "label 2",
          predicate: () => false,
        }),
      ]);
      fixture.detectChanges();

      const links = findLinks(linkSelector);
      expect(links.length).toBe(1);
      assertLabel(links[0], "label 1");
    });

    it("should filter duplicate links (by object identity)", () => {
      component.menuType = "action";
      component.links = List<AnyMenuItem>([defaultLink, defaultLink]);
      fixture.detectChanges();

      const links = findLinks(linkSelector);
      expect(links.length).toBe(1);
    });
  });

  describe("action buttons", () => {
    const linkSelector = "button";
    let defaultLink: MenuAction;

    function assertFunction(target: HTMLElement, spy: jasmine.Spy) {
      const button: HTMLButtonElement = target.querySelector("button");
      expect(button).toBeTruthy();

      button.click();
      expect(spy).toHaveBeenCalled();
    }

    beforeEach(() => {
      configureTestingModule();
      defaultLink = MenuAction({
        label: "label",
        icon: ["fas", "home"],
        tooltip: () => "tooltip",
        action: () => {},
      });
    });

    it("should create single link in action menu", () => {
      component.menuType = "action";
      component.links = List<AnyMenuItem>([defaultLink]);
      fixture.detectChanges();

      expect(findLinks("internal-link").length).toBe(0);
      expect(findLinks("external-link").length).toBe(0);
      expect(findLinks("button").length).toBe(1);
    });

    it("should create single link in secondary menu", () => {
      component.menuType = "secondary";
      component.links = List<AnyMenuItem>([defaultLink]);
      fixture.detectChanges();

      expect(findLinks("internal-link").length).toBe(0);
      expect(findLinks("external-link").length).toBe(0);
      expect(findLinks("button").length).toBe(1);
    });

    it("should create multiple links", () => {
      component.menuType = "action";
      component.links = List<AnyMenuItem>([
        MenuAction({
          ...defaultLink,
          label: "label 1",
        }),
        MenuAction({
          ...defaultLink,
          label: "label 2",
        }),
      ]);
      fixture.detectChanges();

      expect(findLinks("internal-link").length).toBe(0);
      expect(findLinks("external-link").length).toBe(0);
      expect(findLinks("button").length).toBe(2);
    });

    it("should label link", () => {
      component.menuType = "action";
      component.links = List<AnyMenuItem>([
        MenuAction({
          ...defaultLink,
          label: "Custom Label",
        }),
      ]);
      fixture.detectChanges();

      const link = findLinks(linkSelector)[0];
      assertLabel(link, "Custom Label");
    });

    it("should create link icon", () => {
      component.menuType = "action";
      component.links = List<AnyMenuItem>([
        MenuAction({
          ...defaultLink,
          icon: ["fas", "exclamation-triangle"],
        }),
      ]);
      fixture.detectChanges();

      const link = findLinks(linkSelector)[0];
      assertIcon(link, "fas,exclamation-triangle");
    });

    it("should create link tooltip", () => {
      component.menuType = "action";
      component.links = List<AnyMenuItem>([
        MenuAction({
          ...defaultLink,
          tooltip: () => "Custom Tooltip",
        }),
      ]);
      fixture.detectChanges();

      const link = findLinks(linkSelector)[0];
      assertTooltip(link, "Custom Tooltip");
    });

    it("should create link tooltip with username", () => {
      setLoggedInState();
      component.menuType = "action";
      component.links = List<AnyMenuItem>([
        MenuAction({
          ...defaultLink,
          tooltip: (user) => `${user.userName} tooltip`,
        }),
      ]);
      fixture.detectChanges();

      const link = findLinks(linkSelector)[0];
      assertTooltip(link, `${sessionUser.userName} tooltip`);
    });

    it("should not filter links without predicate", () => {
      setLoggedInState();
      component.menuType = "action";
      component.links = List<AnyMenuItem>([
        MenuAction({
          ...defaultLink,
        }),
      ]);
      fixture.detectChanges();

      const links = findLinks(linkSelector);
      expect(links.length).toBe(1);
    });

    it("should filter links without passing predicates", () => {
      component.menuType = "action";
      component.links = List<AnyMenuItem>([
        MenuAction({
          ...defaultLink,
          label: "label 1",
          predicate: () => true,
        }),
        MenuAction({
          ...defaultLink,
          label: "label 2",
          predicate: () => false,
        }),
      ]);
      fixture.detectChanges();

      const links = findLinks(linkSelector);
      expect(links.length).toBe(1);
      assertLabel(links[0], "label 1");
    });

    it("should filter duplicate links (by object identity)", () => {
      component.menuType = "action";
      component.links = List<AnyMenuItem>([defaultLink, defaultLink]);
      fixture.detectChanges();

      const links = findLinks(linkSelector);
      expect(links.length).toBe(1);
    });

    it("should execute action", () => {
      const spy = jasmine.createSpy();
      component.menuType = "action";
      component.links = List<AnyMenuItem>([
        MenuAction({
          ...defaultLink,
          action: spy,
        }),
      ]);
      fixture.detectChanges();

      const link = findLinks(linkSelector)[0];
      assertFunction(link, spy);
    });
  });

  describe("item ordering", () => {
    function arrange(a, b, c, menuType) {
      const link1 = MenuRoute({
        label: "label b",
        icon: ["fas", "home"],
        tooltip: () => "tooltip",
        route: StrongRoute.Base.add("home"),
        order: a,
      });
      const link2 = MenuRoute({
        label: "label a",
        icon: ["fas", "home"],
        tooltip: () => "tooltip",
        route: StrongRoute.Base.add("house"),
        order: b,
      });
      const link3 = MenuRoute({
        label: "label z",
        icon: ["fas", "home"],
        tooltip: () => "tooltip",
        route: StrongRoute.Base.add("house"),
        order: c,
      });
      const links = List<AnyMenuItem>([link1, link2, link3]);
      component.links = links;
      component.menuType = menuType;
      fixture.detectChanges();
    }

    beforeEach(() => {
      configureTestingModule();
    });

    it("should order links on secondary menu", () => {
      arrange(3, 2, 1, "secondary");

      const linksText = getText(
        componentElement,
        "baw-menu-internal-link span"
      );

      expect(linksText).toEqual([
        "label z",
        "tooltip",
        "label a",
        "tooltip",
        "label b",
        "tooltip",
      ]);
    });

    it("should order links on action menu", () => {
      arrange(2, 3, 1, "action");

      const linksText = getText(
        componentElement,
        "baw-menu-internal-link span"
      );

      expect(linksText).toEqual([
        "label z",
        "tooltip",
        "label b",
        "tooltip",
        "label a",
        "tooltip",
      ]);
    });

    it("ensures order is stable if not specified for the secondary menu", async () => {
      arrange(undefined, undefined, undefined, "secondary");

      const linksText = getText(
        componentElement,
        "baw-menu-internal-link span"
      );

      expect(linksText).toEqual([
        "label b",
        "tooltip",
        "label a",
        "tooltip",
        "label z",
        "tooltip",
      ]);
    });

    it("ensures order is stable if not specified for the action menu", async () => {
      arrange(undefined, undefined, undefined, "action");

      const linksText = getText(
        componentElement,
        "baw-menu-internal-link span"
      );

      expect(linksText).toEqual([
        "label b",
        "tooltip",
        "label a",
        "tooltip",
        "label z",
        "tooltip",
      ]);
    });

    it("should sort lexicographically only if order is equal on secondary menu", () => {
      arrange(3, 3, 3, "action");

      const linksText = getText(
        componentElement,
        "baw-menu-internal-link span"
      );

      expect(linksText).toEqual([
        "label a",
        "tooltip",
        "label b",
        "tooltip",
        "label z",
        "tooltip",
      ]);
    });

    it("should sort lexicographically only if order is equal on action menu", () => {
      arrange(3, 3, 3, "action");

      const linksText = getText(
        componentElement,
        "baw-menu-internal-link span"
      );

      expect(linksText).toEqual([
        "label a",
        "tooltip",
        "label b",
        "tooltip",
        "label z",
        "tooltip",
      ]);
    });

    it("should order links with ordered link first on secondary menu", () => {
      arrange(undefined, undefined, -3, "secondary");

      const linksText = getText(
        componentElement,
        "baw-menu-internal-link span"
      );

      expect(linksText).toEqual([
        "label z",
        "tooltip",
        "label b",
        "tooltip",
        "label a",
        "tooltip",
      ]);
    });

    it("should order links with ordered link first on action menu", () => {
      arrange(undefined, undefined, -3, "action");

      const linksText = getText(
        componentElement,
        "baw-menu-internal-link span"
      );

      expect(linksText).toEqual([
        "label z",
        "tooltip",
        "label b",
        "tooltip",
        "label a",
        "tooltip",
      ]);
    });

    it("should order sub-links on secondary menu", () => {
      const parent = MenuRoute({
        label: "parent",
        icon: ["fas", "home"],
        tooltip: () => "tooltip",
        route: StrongRoute.Base.add("home"),
        order: 1,
      });
      const link2 = MenuRoute({
        label: "label a",
        icon: ["fas", "home"],
        tooltip: () => "tooltip",
        route: StrongRoute.Base.add("house"),
        parent,
        order: 1,
      });
      component.links = List<AnyMenuItem>([link2, parent]);
      component.menuType = "secondary";
      fixture.detectChanges();

      const linksText = getText(
        componentElement,
        "baw-menu-internal-link span"
      );

      expect(linksText).toEqual(["parent", "tooltip", "label a", "tooltip"]);
    });

    it("should order sub-links inside a parent on secondary menu", () => {
      const parent = MenuRoute({
        label: "parent",
        icon: ["fas", "home"],
        tooltip: () => "tooltip",
        route: StrongRoute.Base.add("home"),
        order: 1,
      });
      const link1 = MenuRoute({
        label: "label b",
        icon: ["fas", "home"],
        tooltip: () => "tooltip",
        route: StrongRoute.Base.add("home"),
        parent,
        order: 1,
      });
      const link2 = MenuRoute({
        label: "label a",
        icon: ["fas", "home"],
        tooltip: () => "tooltip",
        route: StrongRoute.Base.add("house"),
        parent,
        order: 1,
      });
      component.links = List<AnyMenuItem>([link2, link1, parent]);
      component.menuType = "secondary";
      fixture.detectChanges();

      const linksText = getText(
        componentElement,
        "baw-menu-internal-link span"
      );

      expect(linksText).toEqual([
        "parent",
        "tooltip",
        "label a",
        "tooltip",
        "label b",
        "tooltip",
      ]);
    });
  });

  describe("predicate", () => {
    it("should not call predicate with user when unauthenticated", () => {
      configureTestingModule();
      const link = MenuRoute({
        label: "label",
        icon: ["fas", "home"],
        tooltip: () => "tooltip",
        route: StrongRoute.Base.add("home"),
        predicate: (user, data) => true,
      });

      spyOn(link, "predicate").and.callThrough();

      component.menuType = "action";
      component.links = List<AnyMenuItem>([link]);
      fixture.detectChanges();

      expect(link.predicate).toHaveBeenCalledWith(null, { resolvers: {} });
    });

    it("should call predicate with user with authenticated", () => {
      configureTestingModule();
      setLoggedInState();
      const link = MenuRoute({
        label: "label",
        icon: ["fas", "home"],
        tooltip: () => "tooltip",
        route: StrongRoute.Base.add("home"),
        predicate: (user, data) => true,
      });

      spyOn(link, "predicate").and.callThrough();

      component.menuType = "action";
      component.links = List<AnyMenuItem>([link]);
      fixture.detectChanges();

      expect(link.predicate).toHaveBeenCalledWith(sessionUser, {
        resolvers: {},
      });
    });

    it("should call predicate with page data when unauthenticated", () => {
      const pageData = {
        resolvers: {},
        value1: 1,
        value2: 2,
      };

      configureTestingModule(pageData);
      const link = MenuRoute({
        label: "label",
        icon: ["fas", "home"],
        tooltip: () => "tooltip",
        route: StrongRoute.Base.add("home"),
        predicate: (user, data) => true,
      });

      spyOn(link, "predicate").and.callThrough();

      component.menuType = "action";
      component.links = List<AnyMenuItem>([link]);
      fixture.detectChanges();

      expect(link.predicate).toHaveBeenCalledWith(null, pageData);
    });

    it("should call predicate with page data when authenticated", () => {
      const pageData = {
        resolvers: {},
        value1: 1,
        value2: 2,
      };

      configureTestingModule(pageData);
      setLoggedInState();
      const link = MenuRoute({
        label: "label",
        icon: ["fas", "home"],
        tooltip: () => "tooltip",
        route: StrongRoute.Base.add("home"),
        predicate: (user, data) => true,
      });

      spyOn(link, "predicate").and.callThrough();

      component.menuType = "action";
      component.links = List<AnyMenuItem>([link]);
      fixture.detectChanges();

      expect(link.predicate).toHaveBeenCalledWith(sessionUser, pageData);
    });
  });
});

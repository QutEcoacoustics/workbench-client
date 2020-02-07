import { HttpClientModule } from "@angular/common/http";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ActivatedRoute } from "@angular/router";
import { RouterTestingModule } from "@angular/router/testing";
import { List } from "immutable";
import { BehaviorSubject } from "rxjs";
import { testAppInitializer } from "src/app/app.helper";
import { DefaultMenu } from "src/app/helpers/page/defaultMenus";
import { PageInfo, PageInfoInterface } from "src/app/helpers/page/pageInfo";
import {
  AnyMenuItem,
  MenuLink,
  MenuRoute,
  NavigableMenuItem
} from "src/app/interfaces/menusInterfaces";
import { StrongRoute } from "src/app/interfaces/strongRoute";
import { SharedModule } from "../shared.module";
import { SecondaryMenuComponent } from "./secondary-menu.component";

describe("SecondaryMenuComponent", () => {
  let component: SecondaryMenuComponent;
  let fixture: ComponentFixture<SecondaryMenuComponent>;
  const defaultLinks = DefaultMenu.contextLinks;

  it("should display menu title", () => {
    class MockActivatedRoute {
      private route = StrongRoute.Base.add("/");

      public params = new BehaviorSubject<any>({});
      public data = new BehaviorSubject<PageInfoInterface>(
        new PageInfo(SecondaryMenuComponent, {
          self: MenuRoute({
            label: "Custom Label",
            icon: ["fas", "question-circle"],
            tooltip: () => "Custom Tooltip",
            route: this.route
          }),
          category: {
            label: "Custom Category",
            icon: ["fas", "home"],
            route: this.route
          },
          menus: {
            actions: List<AnyMenuItem>([]),
            links: List<NavigableMenuItem>([])
          }
        } as PageInfoInterface)
      );
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

    fixture.detectChanges();

    const title = fixture.nativeElement.querySelector("h6");
    const icon = title.querySelector("fa-icon");
    expect(title).toBeTruthy();
    expect(icon).toBeFalsy();
    expect(title.innerText.trim()).toBe("MENU");
  });

  it("should handle no links", () => {
    class MockActivatedRoute {
      private route = StrongRoute.Base.add("/");

      public params = new BehaviorSubject<any>({});
      public data = new BehaviorSubject<PageInfoInterface>(
        new PageInfo(SecondaryMenuComponent, {
          self: MenuRoute({
            label: "Custom Label",
            icon: ["fas", "question-circle"],
            tooltip: () => "Custom Tooltip",
            route: this.route
          }),
          category: {
            label: "Custom Category",
            icon: ["fas", "home"],
            route: this.route
          }
        } as PageInfoInterface)
      );
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

    fixture.detectChanges();

    // Number of elements should be the default links,
    // plus self link, plus menu title, minus 2 links which require authentication
    const menuElements = fixture.nativeElement.querySelectorAll("li.nav-item");
    expect(menuElements.length).toBe(defaultLinks.count() + 2 - 2);
  });

  it("should handle default links", () => {
    class MockActivatedRoute {
      private route = StrongRoute.Base.add("/");

      public params = new BehaviorSubject<any>({});
      public data = new BehaviorSubject<PageInfoInterface>(
        new PageInfo(SecondaryMenuComponent, {
          self: MenuRoute({
            label: "Custom Label",
            icon: ["fas", "question-circle"],
            tooltip: () => "Custom Tooltip",
            route: this.route
          }),
          category: {
            label: "Custom Category",
            icon: ["fas", "home"],
            route: this.route
          },
          menus: {
            actions: List<AnyMenuItem>([]),
            links: List<NavigableMenuItem>([])
          }
        } as PageInfoInterface)
      );
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

    fixture.detectChanges();

    // Number of elements should be the default links,
    // plus self link, plus menu title, minus 2 links which require authentication
    const menuElements = fixture.nativeElement.querySelectorAll("li.nav-item");
    expect(menuElements.length).toBe(defaultLinks.count() + 2 - 2);
  });

  it("should create self link", () => {
    class MockActivatedRoute {
      private route = StrongRoute.Base.add("/");

      public params = new BehaviorSubject<any>({});
      public data = new BehaviorSubject<PageInfoInterface>(
        new PageInfo(SecondaryMenuComponent, {
          self: MenuRoute({
            label: "ZZZCustom Label",
            icon: ["fas", "question-circle"],
            order: 999, // Force to be last link
            tooltip: () => "Custom Tooltip",
            route: this.route
          }),
          category: {
            label: "Custom Category",
            icon: ["fas", "home"],
            route: this.route
          },
          menus: {
            actions: List<AnyMenuItem>([]),
            links: List<NavigableMenuItem>([])
          }
        } as PageInfoInterface)
      );
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

    fixture.detectChanges();

    // Number of elements should be the default links,
    // plus self link, plus menu title, minus 2 links which require authentication
    const menuElements = fixture.nativeElement.querySelectorAll("li.nav-item");
    expect(menuElements.length).toBe(defaultLinks.count() + 2 - 2);

    const item = menuElements[defaultLinks.count() + 2 - 2 - 1].querySelector(
      "app-menu-internal-link a"
    );
    expect(item).toBeTruthy();

    const icon = item.querySelector("fa-icon");
    const label = item.querySelector("#label");

    expect(label).toBeTruthy();
    expect(icon).toBeTruthy();
    expect(item.attributes.getNamedItem("ng-reflect-ngb-tooltip")).toBeTruthy();
    expect(item.attributes.getNamedItem("ng-reflect-ngb-tooltip").value).toBe(
      "Custom Tooltip"
    );
    expect(label.innerText.trim()).toBe("ZZZCustom Label");
    expect(icon.attributes.getNamedItem("ng-reflect-icon-prop")).toBeTruthy();
    expect(icon.attributes.getNamedItem("ng-reflect-icon-prop").value).toBe(
      "fas,question-circle"
    );
  });

  it("should handle single internal link", () => {
    class MockActivatedRoute {
      private route = StrongRoute.Base.add("/");

      public params = new BehaviorSubject<any>({});
      public data = new BehaviorSubject<PageInfoInterface>(
        new PageInfo(SecondaryMenuComponent, {
          self: MenuRoute({
            label: "Custom Label",
            icon: ["fas", "question-circle"],
            tooltip: () => "Custom Tooltip",
            route: this.route
          }),
          category: {
            label: "Custom Category",
            icon: ["fas", "home"],
            route: this.route
          },
          menus: {
            actions: List<AnyMenuItem>([]),
            links: List<NavigableMenuItem>([
              MenuRoute({
                label: "ZZZCustom Label",
                icon: ["fas", "tag"],
                order: 999, // Force to be last link
                tooltip: () => "Custom Tooltip",
                route: this.route
              })
            ])
          }
        } as PageInfoInterface)
      );
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

    fixture.detectChanges();

    // Number of elements should be the default links,
    // plus self link, plus menu title, plus added link,
    // minus 2 links which require authentication
    const menuElements = fixture.nativeElement.querySelectorAll("li.nav-item");
    expect(menuElements.length).toBe(defaultLinks.count() + 3 - 2);

    const item = menuElements[defaultLinks.count() + 3 - 2 - 1].querySelector(
      "app-menu-internal-link a"
    );
    expect(item).toBeTruthy();

    const icon = item.querySelector("fa-icon");
    const label = item.querySelector("#label");

    expect(label).toBeTruthy();
    expect(icon).toBeTruthy();
    expect(item.attributes.getNamedItem("ng-reflect-ngb-tooltip")).toBeTruthy();
    expect(item.attributes.getNamedItem("ng-reflect-ngb-tooltip").value).toBe(
      "Custom Tooltip"
    );
    expect(label.innerText.trim()).toBe("ZZZCustom Label");
    expect(icon.attributes.getNamedItem("ng-reflect-icon-prop")).toBeTruthy();
    expect(icon.attributes.getNamedItem("ng-reflect-icon-prop").value).toBe(
      "fas,tag"
    );
  });

  it("should handle multiple internal links", () => {
    class MockActivatedRoute {
      private route = StrongRoute.Base.add("/");

      public params = new BehaviorSubject<any>({});
      public data = new BehaviorSubject<PageInfoInterface>(
        new PageInfo(SecondaryMenuComponent, {
          self: MenuRoute({
            label: "Custom Label",
            icon: ["fas", "question-circle"],
            tooltip: () => "Custom Tooltip",
            route: this.route
          }),
          category: {
            label: "Custom Category",
            icon: ["fas", "home"],
            route: this.route
          },
          menus: {
            actions: List<AnyMenuItem>([]),
            links: List<NavigableMenuItem>([
              MenuRoute({
                label: "ZZZCustom Label 1",
                icon: ["fas", "tag"],
                order: 999, // Force to be last link
                tooltip: () => "Custom Tooltip 1",
                route: this.route
              }),
              MenuRoute({
                label: "ZZZCustom Label 2",
                icon: ["fas", "tags"],
                order: 1000, // Force to be last link
                tooltip: () => "Custom Tooltip 2",
                route: this.route
              })
            ])
          }
        } as PageInfoInterface)
      );
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

    fixture.detectChanges();

    // Number of elements should be the default links,
    // plus self link, plus menu title, plus added links,
    // minus 2 links which require authentication
    const menuElements = fixture.nativeElement.querySelectorAll("li.nav-item");
    expect(menuElements.length).toBe(defaultLinks.count() + 4 - 2);

    let item = menuElements[defaultLinks.count() + 4 - 2 - 2].querySelector(
      "app-menu-internal-link a"
    );
    expect(item).toBeTruthy();

    let icon = item.querySelector("fa-icon");
    let label = item.querySelector("#label");

    expect(label).toBeTruthy();
    expect(icon).toBeTruthy();
    expect(item.attributes.getNamedItem("ng-reflect-ngb-tooltip")).toBeTruthy();
    expect(item.attributes.getNamedItem("ng-reflect-ngb-tooltip").value).toBe(
      "Custom Tooltip 1"
    );
    expect(label.innerText.trim()).toBe("ZZZCustom Label 1");
    expect(icon.attributes.getNamedItem("ng-reflect-icon-prop")).toBeTruthy();
    expect(icon.attributes.getNamedItem("ng-reflect-icon-prop").value).toBe(
      "fas,tag"
    );

    item = menuElements[defaultLinks.count() + 4 - 2 - 1].querySelector(
      "app-menu-internal-link a"
    );
    expect(item).toBeTruthy();

    icon = item.querySelector("fa-icon");
    label = item.querySelector("#label");

    expect(label).toBeTruthy();
    expect(icon).toBeTruthy();
    expect(item.attributes.getNamedItem("ng-reflect-ngb-tooltip")).toBeTruthy();
    expect(item.attributes.getNamedItem("ng-reflect-ngb-tooltip").value).toBe(
      "Custom Tooltip 2"
    );
    expect(label.innerText.trim()).toBe("ZZZCustom Label 2");
    expect(icon.attributes.getNamedItem("ng-reflect-icon-prop")).toBeTruthy();
    expect(icon.attributes.getNamedItem("ng-reflect-icon-prop").value).toBe(
      "fas,tags"
    );
  });

  it("should handle single external link", () => {
    class MockActivatedRoute {
      private route = StrongRoute.Base.add("/");

      public params = new BehaviorSubject<any>({});
      public data = new BehaviorSubject<PageInfoInterface>(
        new PageInfo(SecondaryMenuComponent, {
          self: MenuRoute({
            label: "Custom Label",
            icon: ["fas", "question-circle"],
            tooltip: () => "Custom Tooltip",
            route: this.route
          }),
          category: {
            label: "Custom Category",
            icon: ["fas", "home"],
            route: this.route
          },
          menus: {
            actions: List<AnyMenuItem>([]),
            links: List<NavigableMenuItem>([
              MenuLink({
                label: "ZZZCustom Label",
                icon: ["fas", "tag"],
                order: 999, // Force to be last link
                tooltip: () => "Custom Tooltip",
                uri: "http://brokenlink/"
              })
            ])
          }
        } as PageInfoInterface)
      );
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

    fixture.detectChanges();

    // Number of elements should be the default links,
    // plus self link, plus menu title, plus added link,
    // minus 2 links which require authentication
    const menuElements = fixture.nativeElement.querySelectorAll("li.nav-item");
    expect(menuElements.length).toBe(defaultLinks.count() + 3 - 2);

    const item = menuElements[defaultLinks.count() + 3 - 2 - 1].querySelector(
      "app-menu-external-link a"
    );
    expect(item).toBeTruthy();

    const icon = item.querySelector("fa-icon");
    const label = item.querySelector("#label");

    expect(label).toBeTruthy();
    expect(icon).toBeTruthy();
    expect(item.attributes.getNamedItem("ng-reflect-ngb-tooltip")).toBeTruthy();
    expect(item.attributes.getNamedItem("ng-reflect-ngb-tooltip").value).toBe(
      "Custom Tooltip"
    );
    expect(label.innerText.trim()).toBe("ZZZCustom Label");
    expect(icon.attributes.getNamedItem("ng-reflect-icon-prop")).toBeTruthy();
    expect(icon.attributes.getNamedItem("ng-reflect-icon-prop").value).toBe(
      "fas,tag"
    );
  });

  it("should handle multiple external links", () => {
    class MockActivatedRoute {
      private route = StrongRoute.Base.add("/");

      public params = new BehaviorSubject<any>({});
      public data = new BehaviorSubject<PageInfoInterface>(
        new PageInfo(SecondaryMenuComponent, {
          self: MenuRoute({
            label: "Custom Label",
            icon: ["fas", "question-circle"],
            tooltip: () => "Custom Tooltip",
            route: this.route
          }),
          category: {
            label: "Custom Category",
            icon: ["fas", "home"],
            route: this.route
          },
          menus: {
            actions: List<AnyMenuItem>([]),
            links: List<NavigableMenuItem>([
              MenuLink({
                label: "ZZZCustom Label 1",
                icon: ["fas", "tag"],
                order: 999, // Force to be last link
                tooltip: () => "Custom Tooltip 1",
                uri: "http://brokenlink/1"
              }),
              MenuLink({
                label: "ZZZCustom Label 2",
                icon: ["fas", "tags"],
                order: 999, // Force to be last link
                tooltip: () => "Custom Tooltip 2",
                uri: "http://brokenlink/2"
              })
            ])
          }
        } as PageInfoInterface)
      );
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

    fixture.detectChanges();

    // Number of elements should be the default links,
    // plus self link, plus menu title, plus added links,
    // minus 2 links which require authentication
    const menuElements = fixture.nativeElement.querySelectorAll("li.nav-item");
    expect(menuElements.length).toBe(defaultLinks.count() + 4 - 2);

    let item = menuElements[defaultLinks.count() + 4 - 2 - 2].querySelector(
      "app-menu-external-link a"
    );
    expect(item).toBeTruthy();

    let icon = item.querySelector("fa-icon");
    let label = item.querySelector("#label");

    expect(label).toBeTruthy();
    expect(icon).toBeTruthy();
    expect(item.attributes.getNamedItem("ng-reflect-ngb-tooltip")).toBeTruthy();
    expect(item.attributes.getNamedItem("ng-reflect-ngb-tooltip").value).toBe(
      "Custom Tooltip 1"
    );
    expect(label.innerText.trim()).toBe("ZZZCustom Label 1");
    expect(icon.attributes.getNamedItem("ng-reflect-icon-prop")).toBeTruthy();
    expect(icon.attributes.getNamedItem("ng-reflect-icon-prop").value).toBe(
      "fas,tag"
    );

    item = menuElements[defaultLinks.count() + 4 - 2 - 1].querySelector(
      "app-menu-external-link a"
    );
    expect(item).toBeTruthy();

    icon = item.querySelector("fa-icon");
    label = item.querySelector("#label");

    expect(label).toBeTruthy();
    expect(icon).toBeTruthy();
    expect(item.attributes.getNamedItem("ng-reflect-ngb-tooltip")).toBeTruthy();
    expect(item.attributes.getNamedItem("ng-reflect-ngb-tooltip").value).toBe(
      "Custom Tooltip 2"
    );
    expect(label.innerText.trim()).toBe("ZZZCustom Label 2");
    expect(icon.attributes.getNamedItem("ng-reflect-icon-prop")).toBeTruthy();
    expect(icon.attributes.getNamedItem("ng-reflect-icon-prop").value).toBe(
      "fas,tags"
    );
  });

  it("should handle mixed links", () => {
    class MockActivatedRoute {
      private route = StrongRoute.Base.add("/");

      public params = new BehaviorSubject<any>({});
      public data = new BehaviorSubject<PageInfoInterface>(
        new PageInfo(SecondaryMenuComponent, {
          self: MenuRoute({
            label: "Custom Label",
            icon: ["fas", "question-circle"],
            tooltip: () => "Custom Tooltip",
            route: this.route
          }),
          category: {
            label: "Custom Category",
            icon: ["fas", "home"],
            route: this.route
          },
          menus: {
            actions: List<AnyMenuItem>([]),
            links: List<NavigableMenuItem>([
              MenuRoute({
                label: "ZZZCustom Label 1",
                icon: ["fas", "tag"],
                order: 999, // Force to be last link
                tooltip: () => "Custom Tooltip 1",
                route: this.route
              }),
              MenuLink({
                label: "ZZZCustom Label 2",
                icon: ["fas", "tags"],
                order: 1000, // Force to be last link
                tooltip: () => "Custom Tooltip 2",
                uri: "http://brokenlink/2"
              })
            ])
          }
        } as PageInfoInterface)
      );
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

    fixture.detectChanges();

    // Number of elements should be the default links,
    // plus self link, plus menu title, plus added links,
    // minus 2 links which require authentication
    const menuElements = fixture.nativeElement.querySelectorAll("li.nav-item");
    expect(menuElements.length).toBe(defaultLinks.count() + 4 - 2);

    let item = menuElements[defaultLinks.count() + 4 - 2 - 2].querySelector(
      "app-menu-internal-link a"
    );
    expect(item).toBeTruthy();

    let icon = item.querySelector("fa-icon");
    let label = item.querySelector("#label");

    expect(label).toBeTruthy();
    expect(icon).toBeTruthy();
    expect(item.attributes.getNamedItem("ng-reflect-ngb-tooltip")).toBeTruthy();
    expect(item.attributes.getNamedItem("ng-reflect-ngb-tooltip").value).toBe(
      "Custom Tooltip 1"
    );
    expect(label.innerText.trim()).toBe("ZZZCustom Label 1");
    expect(icon.attributes.getNamedItem("ng-reflect-icon-prop")).toBeTruthy();
    expect(icon.attributes.getNamedItem("ng-reflect-icon-prop").value).toBe(
      "fas,tag"
    );

    item = menuElements[defaultLinks.count() + 4 - 2 - 1].querySelector(
      "app-menu-external-link a"
    );
    expect(item).toBeTruthy();

    icon = item.querySelector("fa-icon");
    label = item.querySelector("#label");

    expect(label).toBeTruthy();
    expect(icon).toBeTruthy();
    expect(item.attributes.getNamedItem("ng-reflect-ngb-tooltip")).toBeTruthy();
    expect(item.attributes.getNamedItem("ng-reflect-ngb-tooltip").value).toBe(
      "Custom Tooltip 2"
    );
    expect(label.innerText.trim()).toBe("ZZZCustom Label 2");
    expect(icon.attributes.getNamedItem("ng-reflect-icon-prop")).toBeTruthy();
    expect(icon.attributes.getNamedItem("ng-reflect-icon-prop").value).toBe(
      "fas,tags"
    );
  });

  it("should handle self link with parent links", () => {
    class MockActivatedRoute {
      private parentRoute = StrongRoute.Base.add("home");
      private childRoute = this.parentRoute.add("house");
      private parentLink = MenuRoute({
        label: "ZZZCustom Label",
        icon: ["fas", "question"],
        order: 999, // Force to be last link
        tooltip: () => "Custom Tooltip 1",
        route: this.parentRoute
      });

      public params = new BehaviorSubject<any>({});
      public data = new BehaviorSubject<PageInfoInterface>(
        new PageInfo(SecondaryMenuComponent, {
          self: MenuRoute({
            label: "ZZZZCustom Label",
            icon: ["fas", "question-circle"],
            tooltip: () => "Custom Tooltip 2",
            order: 999, // Force to be last link
            route: this.childRoute,
            parent: this.parentLink
          }),
          category: {
            label: "Custom Category",
            icon: ["fas", "home"],
            route: this.parentRoute
          },
          menus: {
            actions: List<AnyMenuItem>([]),
            links: List<NavigableMenuItem>([])
          }
        } as PageInfoInterface)
      );
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

    fixture.detectChanges();

    // Number of elements should be the default links,
    // plus self link and parent, plus menu title,
    // minus 2 links which require authentication
    const menuElements = fixture.nativeElement.querySelectorAll("li.nav-item");
    expect(menuElements.length).toBe(defaultLinks.count() + 3 - 2);

    let item = menuElements[defaultLinks.count() + 3 - 2 - 2].querySelector(
      "app-menu-internal-link a"
    );
    expect(item).toBeTruthy();

    let icon = item.querySelector("fa-icon");
    let label = item.querySelector("#label");

    expect(label).toBeTruthy();
    expect(icon).toBeTruthy();
    expect(item.attributes.getNamedItem("ng-reflect-ngb-tooltip")).toBeTruthy();
    expect(item.attributes.getNamedItem("ng-reflect-ngb-tooltip").value).toBe(
      "Custom Tooltip 1"
    );
    expect(label.innerText.trim()).toBe("ZZZCustom Label");
    expect(icon.attributes.getNamedItem("ng-reflect-icon-prop")).toBeTruthy();
    expect(icon.attributes.getNamedItem("ng-reflect-icon-prop").value).toBe(
      "fas,question"
    );

    item = menuElements[defaultLinks.count() + 3 - 2 - 1].querySelector(
      "app-menu-internal-link a"
    );
    expect(item).toBeTruthy();

    icon = item.querySelector("fa-icon");
    label = item.querySelector("#label");

    expect(label).toBeTruthy();
    expect(icon).toBeTruthy();
    expect(item.attributes.getNamedItem("ng-reflect-ngb-tooltip")).toBeTruthy();
    expect(item.attributes.getNamedItem("ng-reflect-ngb-tooltip").value).toBe(
      "Custom Tooltip 2"
    );
    expect(label.innerText.trim()).toBe("ZZZZCustom Label");
    expect(icon.attributes.getNamedItem("ng-reflect-icon-prop")).toBeTruthy();
    expect(icon.attributes.getNamedItem("ng-reflect-icon-prop").value).toBe(
      "fas,question-circle"
    );
  });

  it("should handle self link with grand-parent link", () => {
    class MockActivatedRoute {
      private grandParentRoute = StrongRoute.Base.add("home");
      private parentRoute = this.grandParentRoute.add("house");
      private childRoute = this.parentRoute.add("room");
      private grandParentLink = MenuRoute({
        label: "ZZZCustom Label",
        icon: ["fas", "tag"],
        order: 999, // Force to be last link
        tooltip: () => "Custom Tooltip 1",
        route: this.parentRoute
      });
      private parentLink = MenuRoute({
        label: "ZZZZCustom Label",
        icon: ["fas", "question"],
        order: 999, // Force to be last link
        tooltip: () => "Custom Tooltip 2",
        route: this.parentRoute,
        parent: this.grandParentLink
      });

      public params = new BehaviorSubject<any>({});
      public data = new BehaviorSubject<PageInfoInterface>(
        new PageInfo(SecondaryMenuComponent, {
          self: MenuRoute({
            label: "ZZZZZCustom Label",
            icon: ["fas", "question-circle"],
            order: 999, // Force to be last link
            tooltip: () => "Custom Tooltip 3",
            route: this.childRoute,
            parent: this.parentLink
          }),
          category: {
            label: "Custom Category",
            icon: ["fas", "home"],
            route: this.parentRoute
          },
          menus: {
            actions: List<AnyMenuItem>([]),
            links: List<NavigableMenuItem>([])
          }
        } as PageInfoInterface)
      );
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

    fixture.detectChanges();

    // Number of elements should be the default links,
    // plus self link and parent and grandparent, plus menu title,
    // minus 2 links which require authentication
    const menuElements = fixture.nativeElement.querySelectorAll("li.nav-item");
    expect(menuElements.length).toBe(defaultLinks.count() + 4 - 2);

    let item = menuElements[defaultLinks.count() + 4 - 2 - 3].querySelector(
      "app-menu-internal-link a"
    );
    expect(item).toBeTruthy();

    let icon = item.querySelector("fa-icon");
    let label = item.querySelector("#label");

    expect(label).toBeTruthy();
    expect(icon).toBeTruthy();
    expect(item.attributes.getNamedItem("ng-reflect-ngb-tooltip")).toBeTruthy();
    expect(item.attributes.getNamedItem("ng-reflect-ngb-tooltip").value).toBe(
      "Custom Tooltip 1"
    );
    expect(label.innerText.trim()).toBe("ZZZCustom Label");
    expect(icon.attributes.getNamedItem("ng-reflect-icon-prop")).toBeTruthy();
    expect(icon.attributes.getNamedItem("ng-reflect-icon-prop").value).toBe(
      "fas,tag"
    );

    item = menuElements[defaultLinks.count() + 4 - 2 - 2].querySelector(
      "app-menu-internal-link a"
    );
    expect(item).toBeTruthy();

    icon = item.querySelector("fa-icon");
    label = item.querySelector("#label");

    expect(label).toBeTruthy();
    expect(icon).toBeTruthy();
    expect(item.attributes.getNamedItem("ng-reflect-ngb-tooltip")).toBeTruthy();
    expect(item.attributes.getNamedItem("ng-reflect-ngb-tooltip").value).toBe(
      "Custom Tooltip 2"
    );
    expect(label.innerText.trim()).toBe("ZZZZCustom Label");
    expect(icon.attributes.getNamedItem("ng-reflect-icon-prop")).toBeTruthy();
    expect(icon.attributes.getNamedItem("ng-reflect-icon-prop").value).toBe(
      "fas,question"
    );

    item = menuElements[defaultLinks.count() + 4 - 2 - 1].querySelector(
      "app-menu-internal-link a"
    );
    expect(item).toBeTruthy();

    icon = item.querySelector("fa-icon");
    label = item.querySelector("#label");

    expect(label).toBeTruthy();
    expect(icon).toBeTruthy();
    expect(item.attributes.getNamedItem("ng-reflect-ngb-tooltip")).toBeTruthy();
    expect(item.attributes.getNamedItem("ng-reflect-ngb-tooltip").value).toBe(
      "Custom Tooltip 3"
    );
    expect(label.innerText.trim()).toBe("ZZZZZCustom Label");
    expect(icon.attributes.getNamedItem("ng-reflect-icon-prop")).toBeTruthy();
    expect(icon.attributes.getNamedItem("ng-reflect-icon-prop").value).toBe(
      "fas,question-circle"
    );
  });

  it("should create menu link with no indentation", () => {
    class MockActivatedRoute {
      private route = StrongRoute.Base.add("/");

      public params = new BehaviorSubject<any>({});
      public data = new BehaviorSubject<PageInfoInterface>(
        new PageInfo(SecondaryMenuComponent, {
          self: MenuRoute({
            label: "Custom Label",
            icon: ["fas", "question-circle"],
            tooltip: () => "Custom Tooltip",
            route: this.route,
            order: 100,
            indentation: 0
          }),
          category: {
            label: "Custom Category",
            icon: ["fas", "home"],
            route: this.route
          },
          menus: {
            actions: List<AnyMenuItem>([]),
            links: List<NavigableMenuItem>([
              MenuRoute({
                label: "ZZZCustom Label",
                icon: ["fas", "tag"],
                order: 999, // Force to be last link
                tooltip: () => "Custom Tooltip",
                route: this.route
              })
            ])
          }
        } as PageInfoInterface)
      );
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

    fixture.detectChanges();

    // Number of elements should be the default links,
    // plus self link, plus menu title, plus added link,
    // minus 2 links which require authentication
    const menuElements = fixture.nativeElement.querySelectorAll("li.nav-item");
    expect(menuElements.length).toBe(defaultLinks.count() + 3 - 2);

    const item = menuElements[defaultLinks.count() + 3 - 2 - 1];
    expect(item).toBeTruthy();
    expect(item.attributes.style).toBeTruthy();
    expect(item.attributes.style.value).toBe("padding-left: 0em;");
  });

  it("should set padding on menu item with parent", () => {
    class MockActivatedRoute {
      private parentRoute = StrongRoute.Base.add("home");
      private childRoute = this.parentRoute.add("house");
      private parentLink = MenuRoute({
        label: "ZZZCustom Label",
        icon: ["fas", "question"],
        order: 999, // Force to be last link
        tooltip: () => "Custom Tooltip 1",
        route: this.parentRoute,
        indentation: 0
      });

      public params = new BehaviorSubject<any>({});
      public data = new BehaviorSubject<PageInfoInterface>(
        new PageInfo(SecondaryMenuComponent, {
          self: MenuRoute({
            label: "ZZZZCustom Label",
            icon: ["fas", "question-circle"],
            order: 999, // Force to be last link
            tooltip: () => "Custom Tooltip 2",
            route: this.childRoute,
            parent: this.parentLink,
            indentation: 1
          }),
          category: {
            label: "Custom Category",
            icon: ["fas", "home"],
            route: this.parentRoute
          },
          menus: {
            actions: List<AnyMenuItem>([]),
            links: List<NavigableMenuItem>([])
          }
        } as PageInfoInterface)
      );
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

    fixture.detectChanges();

    // Number of elements should be the default links,
    // plus self link, plus parent, plus menu title, plus added link,
    // minus 2 links which require authentication
    const menuElements = fixture.nativeElement.querySelectorAll("li.nav-item");

    expect(menuElements.length).toBe(defaultLinks.count() + 3 - 2);

    const child = menuElements[defaultLinks.count() + 3 - 2 - 1];
    const parent = menuElements[defaultLinks.count() + 3 - 2 - 2];

    expect(child).toBeTruthy();
    expect(child.attributes.style).toBeTruthy();
    expect(child.attributes.style.value).toBe("padding-left: 1em;");

    expect(parent).toBeTruthy();
    expect(parent.attributes.style).toBeTruthy();
    expect(parent.attributes.style.value).toBe("padding-left: 0em;");
  });

  it("should should set padding on menu item with grand-parent", () => {
    class MockActivatedRoute {
      private grandParentRoute = StrongRoute.Base.add("home");
      private parentRoute = this.grandParentRoute.add("house");
      private childRoute = this.parentRoute.add("room");
      private grandParentLink = MenuRoute({
        label: "ZZZCustom Label",
        icon: ["fas", "tag"],
        order: 999, // Force to be last link
        tooltip: () => "Custom Tooltip 1",
        route: this.parentRoute,
        indentation: 0
      });
      private parentLink = MenuRoute({
        label: "ZZZZCustom Label",
        icon: ["fas", "question"],
        order: 999, // Force to be last link
        tooltip: () => "Custom Tooltip 2",
        route: this.parentRoute,
        parent: this.grandParentLink,
        indentation: 1
      });

      public params = new BehaviorSubject<any>({});
      public data = new BehaviorSubject<PageInfoInterface>(
        new PageInfo(SecondaryMenuComponent, {
          self: MenuRoute({
            label: "ZZZZZCustom Label",
            icon: ["fas", "question-circle"],
            order: 999, // Force to be last link
            tooltip: () => "Custom Tooltip 3",
            route: this.childRoute,
            parent: this.parentLink,
            indentation: 2
          }),
          category: {
            label: "Custom Category",
            icon: ["fas", "home"],
            route: this.parentRoute
          },
          menus: {
            actions: List<AnyMenuItem>([]),
            links: List<NavigableMenuItem>([])
          }
        } as PageInfoInterface)
      );
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

    fixture.detectChanges();

    // Number of elements should be the default links,
    // plus self link, plus parent, plus menu title, plus added link,
    // minus 2 links which require authentication
    const menuElements = fixture.nativeElement.querySelectorAll("li.nav-item");

    expect(menuElements.length).toBe(defaultLinks.count() + 4 - 2);

    const grandParent = menuElements[defaultLinks.count() + 4 - 2 - 3];
    const parent = menuElements[defaultLinks.count() + 4 - 2 - 2];
    const child = menuElements[defaultLinks.count() + 4 - 2 - 1];

    expect(child).toBeTruthy();
    expect(child.attributes.style).toBeTruthy();
    expect(child.attributes.style.value).toBe("padding-left: 2em;");

    expect(parent).toBeTruthy();
    expect(parent.attributes.style).toBeTruthy();
    expect(parent.attributes.style.value).toBe("padding-left: 1em;");

    expect(grandParent).toBeTruthy();
    expect(grandParent.attributes.style).toBeTruthy();
    expect(grandParent.attributes.style.value).toBe("padding-left: 0em;");
  });

  it("should should set padding on menu item with grand-parent without priority", () => {
    class MockActivatedRoute {
      private grandParentRoute = StrongRoute.Base.add("home");
      private parentRoute = this.grandParentRoute.add("house");
      private childRoute = this.parentRoute.add("room");
      private grandParentLink = MenuRoute({
        label: "ZZZCustom Label",
        icon: ["fas", "tag"],
        order: 999, // Force to be last link
        tooltip: () => "Custom Tooltip 1",
        route: this.parentRoute
      });
      private parentLink = MenuRoute({
        label: "ZZZZCustom Label",
        icon: ["fas", "question"],
        order: 999, // Force to be last link
        tooltip: () => "Custom Tooltip 2",
        route: this.parentRoute,
        parent: this.grandParentLink
      });

      public params = new BehaviorSubject<any>({});
      public data = new BehaviorSubject<PageInfoInterface>(
        new PageInfo(SecondaryMenuComponent, {
          self: MenuRoute({
            label: "ZZZZZCustom Label",
            icon: ["fas", "question-circle"],
            order: 999, // Force to be last link
            tooltip: () => "Custom Tooltip 3",
            route: this.childRoute,
            parent: this.parentLink
          }),
          category: {
            label: "Custom Category",
            icon: ["fas", "home"],
            route: this.parentRoute
          },
          menus: {
            actions: List<AnyMenuItem>([]),
            links: List<NavigableMenuItem>([])
          }
        } as PageInfoInterface)
      );
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

    fixture.detectChanges();

    // Number of elements should be the default links,
    // plus self link, plus parent, plus menu title, plus added link,
    // minus 2 links which require authentication
    const menuElements = fixture.nativeElement.querySelectorAll("li.nav-item");

    expect(menuElements.length).toBe(defaultLinks.count() + 4 - 2);

    const grandParent = menuElements[defaultLinks.count() + 4 - 2 - 3];
    const parent = menuElements[defaultLinks.count() + 4 - 2 - 2];
    const child = menuElements[defaultLinks.count() + 4 - 2 - 1];

    expect(child).toBeTruthy();
    expect(child.attributes.style).toBeTruthy();
    expect(child.attributes.style.value).toBe("padding-left: 2em;");

    expect(parent).toBeTruthy();
    expect(parent.attributes.style).toBeTruthy();
    expect(parent.attributes.style.value).toBe("padding-left: 1em;");

    expect(grandParent).toBeTruthy();
    expect(grandParent.attributes.style).toBeTruthy();
    expect(grandParent.attributes.style.value).toBe("padding-left: 0em;");
  });
});

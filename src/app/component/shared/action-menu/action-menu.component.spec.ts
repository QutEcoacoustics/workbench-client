import { HttpClientModule } from "@angular/common/http";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ActivatedRoute } from "@angular/router";
import { RouterTestingModule } from "@angular/router/testing";
import { List } from "immutable";
import { BehaviorSubject } from "rxjs";
import { testAppInitializer } from "src/app/app.helper";
import { PageInfo, PageInfoInterface } from "src/app/helpers/page/pageInfo";
import {
  AnyMenuItem,
  MenuAction,
  MenuLink,
  MenuRoute,
  NavigableMenuItem
} from "src/app/interfaces/menusInterfaces";
import { StrongRoute } from "src/app/interfaces/strongRoute";
import { SharedModule } from "../shared.module";
import { ActionMenuComponent } from "./action-menu.component";

describe("ActionMenuComponent", () => {
  let component: ActionMenuComponent;
  let fixture: ComponentFixture<ActionMenuComponent>;

  it("should display category", () => {
    class MockActivatedRoute {
      private route = StrongRoute.Base.add("/");

      public params = new BehaviorSubject<any>({});
      public data = new BehaviorSubject<PageInfoInterface>(
        new PageInfo(ActionMenuComponent, {
          self: {
            kind: "MenuRoute",
            label: "Custom Label",
            icon: ["fas", "question-circle"],
            tooltip: () => "Custom Tooltip",
            route: this.route
          },
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
      declarations: [ActionMenuComponent],
      providers: [
        ...testAppInitializer,
        { provide: ActivatedRoute, useClass: MockActivatedRoute }
      ]
    }).compileComponents();
    fixture = TestBed.createComponent(ActionMenuComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();

    const title = fixture.nativeElement.querySelector("h6");
    const icon = fixture.nativeElement.querySelector("fa-icon");
    expect(title).toBeTruthy();
    expect(icon).toBeTruthy();
    expect(title.innerText.trim()).toBe("CUSTOM CATEGORY");
    expect(icon.attributes.getNamedItem("ng-reflect-icon-prop")).toBeTruthy();
    expect(icon.attributes.getNamedItem("ng-reflect-icon-prop").value).toBe(
      "fas,home"
    );
  });

  it("should handle no links", () => {
    class MockActivatedRoute {
      private route = StrongRoute.Base.add("/");

      public params = new BehaviorSubject<any>({});
      public data = new BehaviorSubject<PageInfoInterface>(
        new PageInfo(ActionMenuComponent, {
          self: {
            kind: "MenuRoute",
            label: "Custom Label",
            icon: ["fas", "question-circle"],
            tooltip: () => "Custom Tooltip",
            route: this.route
          },
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
      declarations: [ActionMenuComponent],
      providers: [
        ...testAppInitializer,
        { provide: ActivatedRoute, useClass: MockActivatedRoute }
      ]
    }).compileComponents();
    fixture = TestBed.createComponent(ActionMenuComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();

    const menuElements = fixture.nativeElement.querySelectorAll("li.nav-item");
    expect(menuElements.length).toBe(1);
  });

  it("should handle single internal link", () => {
    class MockActivatedRoute {
      private route = StrongRoute.Base.add("/");

      public params = new BehaviorSubject<any>({});
      public data = new BehaviorSubject<PageInfoInterface>(
        new PageInfo(ActionMenuComponent, {
          self: {
            kind: "MenuRoute",
            label: "Custom Label",
            icon: ["fas", "question-circle"],
            tooltip: () => "Custom Tooltip",
            route: this.route
          },
          category: {
            label: "Custom Category",
            icon: ["fas", "home"],
            route: this.route
          },
          menus: {
            actions: List<AnyMenuItem>([
              {
                kind: "MenuRoute",
                label: "Custom Label",
                icon: ["fas", "tag"],
                tooltip: () => "Custom Tooltip",
                route: this.route
              } as MenuRoute
            ]),
            links: List<NavigableMenuItem>([])
          }
        } as PageInfoInterface)
      );
    }

    TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientModule, SharedModule],
      declarations: [ActionMenuComponent],
      providers: [
        ...testAppInitializer,
        { provide: ActivatedRoute, useClass: MockActivatedRoute }
      ]
    }).compileComponents();
    fixture = TestBed.createComponent(ActionMenuComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();

    const menuElements = fixture.nativeElement.querySelectorAll("li.nav-item");
    expect(menuElements.length).toBe(2);

    const item = menuElements[1].querySelector("app-menu-internal-link a");
    expect(item).toBeTruthy();

    const icon = item.querySelector("fa-icon");
    const label = item.querySelector("#label");

    expect(label).toBeTruthy();
    expect(icon).toBeTruthy();
    expect(item.attributes.getNamedItem("ng-reflect-ngb-tooltip")).toBeTruthy();
    expect(item.attributes.getNamedItem("ng-reflect-ngb-tooltip").value).toBe(
      "Custom Tooltip"
    );
    expect(label.innerText.trim()).toBe("Custom Label");
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
        new PageInfo(ActionMenuComponent, {
          self: {
            kind: "MenuRoute",
            label: "Custom Label",
            icon: ["fas", "question-circle"],
            tooltip: () => "Custom Tooltip",
            route: this.route
          },
          category: {
            label: "Custom Category",
            icon: ["fas", "home"],
            route: this.route
          },
          menus: {
            actions: List<AnyMenuItem>([
              {
                kind: "MenuRoute",
                label: "Custom Label 1",
                icon: ["fas", "tag"],
                tooltip: () => "Custom Tooltip 1",
                route: this.route
              } as MenuRoute,
              {
                kind: "MenuRoute",
                label: "Custom Label 2",
                icon: ["fas", "tags"],
                tooltip: () => "Custom Tooltip 2",
                route: this.route
              } as MenuRoute
            ]),
            links: List<NavigableMenuItem>([])
          }
        } as PageInfoInterface)
      );
    }

    TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientModule, SharedModule],
      declarations: [ActionMenuComponent],
      providers: [
        ...testAppInitializer,
        { provide: ActivatedRoute, useClass: MockActivatedRoute }
      ]
    }).compileComponents();
    fixture = TestBed.createComponent(ActionMenuComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();

    const menuElements = fixture.nativeElement.querySelectorAll("li.nav-item");
    expect(menuElements.length).toBe(3);

    let item = menuElements[1].querySelector("app-menu-internal-link a");
    expect(item).toBeTruthy();

    let icon = item.querySelector("fa-icon");
    let label = item.querySelector("#label");

    expect(label).toBeTruthy();
    expect(icon).toBeTruthy();
    expect(item.attributes.getNamedItem("ng-reflect-ngb-tooltip")).toBeTruthy();
    expect(item.attributes.getNamedItem("ng-reflect-ngb-tooltip").value).toBe(
      "Custom Tooltip 1"
    );
    expect(label.innerText.trim()).toBe("Custom Label 1");
    expect(icon.attributes.getNamedItem("ng-reflect-icon-prop")).toBeTruthy();
    expect(icon.attributes.getNamedItem("ng-reflect-icon-prop").value).toBe(
      "fas,tag"
    );

    item = menuElements[2].querySelector("app-menu-internal-link a");
    expect(item).toBeTruthy();

    icon = item.querySelector("fa-icon");
    label = item.querySelector("#label");

    expect(label).toBeTruthy();
    expect(icon).toBeTruthy();
    expect(item.attributes.getNamedItem("ng-reflect-ngb-tooltip")).toBeTruthy();
    expect(item.attributes.getNamedItem("ng-reflect-ngb-tooltip").value).toBe(
      "Custom Tooltip 2"
    );
    expect(label.innerText.trim()).toBe("Custom Label 2");
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
        new PageInfo(ActionMenuComponent, {
          self: {
            kind: "MenuRoute",
            label: "Custom Label",
            icon: ["fas", "question-circle"],
            tooltip: () => "Custom Tooltip",
            route: this.route
          },
          category: {
            label: "Custom Category",
            icon: ["fas", "home"],
            route: this.route
          },
          menus: {
            actions: List<AnyMenuItem>([
              {
                kind: "MenuLink",
                label: "Custom Label",
                icon: ["fas", "tag"],
                tooltip: () => "Custom Tooltip",
                uri: "http://brokenlink/"
              } as MenuLink
            ]),
            links: List<NavigableMenuItem>([])
          }
        } as PageInfoInterface)
      );
    }

    TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientModule, SharedModule],
      declarations: [ActionMenuComponent],
      providers: [
        ...testAppInitializer,
        { provide: ActivatedRoute, useClass: MockActivatedRoute }
      ]
    }).compileComponents();
    fixture = TestBed.createComponent(ActionMenuComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();

    const menuElements = fixture.nativeElement.querySelectorAll("li.nav-item");
    expect(menuElements.length).toBe(2);

    const item = menuElements[1].querySelector("app-menu-external-link a");
    expect(item).toBeTruthy();

    const icon = item.querySelector("fa-icon");
    const label = item.querySelector("#label");

    expect(label).toBeTruthy();
    expect(icon).toBeTruthy();
    expect(item.attributes.getNamedItem("ng-reflect-ngb-tooltip")).toBeTruthy();
    expect(item.attributes.getNamedItem("ng-reflect-ngb-tooltip").value).toBe(
      "Custom Tooltip"
    );
    expect(label.innerText.trim()).toBe("Custom Label");
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
        new PageInfo(ActionMenuComponent, {
          self: {
            kind: "MenuRoute",
            label: "Custom Label",
            icon: ["fas", "question-circle"],
            tooltip: () => "Custom Tooltip",
            route: this.route
          },
          category: {
            label: "Custom Category",
            icon: ["fas", "home"],
            route: this.route
          },
          menus: {
            actions: List<AnyMenuItem>([
              {
                kind: "MenuLink",
                label: "Custom Label 1",
                icon: ["fas", "tag"],
                tooltip: () => "Custom Tooltip 1",
                uri: "http://brokenlink/1"
              } as MenuLink,
              {
                kind: "MenuLink",
                label: "Custom Label 2",
                icon: ["fas", "tags"],
                tooltip: () => "Custom Tooltip 2",
                uri: "http://brokenlink/2"
              } as MenuLink
            ]),
            links: List<NavigableMenuItem>([])
          }
        } as PageInfoInterface)
      );
    }

    TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientModule, SharedModule],
      declarations: [ActionMenuComponent],
      providers: [
        ...testAppInitializer,
        { provide: ActivatedRoute, useClass: MockActivatedRoute }
      ]
    }).compileComponents();
    fixture = TestBed.createComponent(ActionMenuComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();

    const menuElements = fixture.nativeElement.querySelectorAll("li.nav-item");
    expect(menuElements.length).toBe(3);

    let item = menuElements[1].querySelector("app-menu-external-link a");
    expect(item).toBeTruthy();

    let icon = item.querySelector("fa-icon");
    let label = item.querySelector("#label");

    expect(label).toBeTruthy();
    expect(icon).toBeTruthy();
    expect(item.attributes.getNamedItem("ng-reflect-ngb-tooltip")).toBeTruthy();
    expect(item.attributes.getNamedItem("ng-reflect-ngb-tooltip").value).toBe(
      "Custom Tooltip 1"
    );
    expect(label.innerText.trim()).toBe("Custom Label 1");
    expect(icon.attributes.getNamedItem("ng-reflect-icon-prop")).toBeTruthy();
    expect(icon.attributes.getNamedItem("ng-reflect-icon-prop").value).toBe(
      "fas,tag"
    );

    item = menuElements[2].querySelector("app-menu-external-link a");
    expect(item).toBeTruthy();

    icon = item.querySelector("fa-icon");
    label = item.querySelector("#label");

    expect(label).toBeTruthy();
    expect(icon).toBeTruthy();
    expect(item.attributes.getNamedItem("ng-reflect-ngb-tooltip")).toBeTruthy();
    expect(item.attributes.getNamedItem("ng-reflect-ngb-tooltip").value).toBe(
      "Custom Tooltip 2"
    );
    expect(label.innerText.trim()).toBe("Custom Label 2");
    expect(icon.attributes.getNamedItem("ng-reflect-icon-prop")).toBeTruthy();
    expect(icon.attributes.getNamedItem("ng-reflect-icon-prop").value).toBe(
      "fas,tags"
    );
  });

  it("should handle single action button", () => {
    class MockActivatedRoute {
      private route = StrongRoute.Base.add("/");

      public params = new BehaviorSubject<any>({});
      public data = new BehaviorSubject<PageInfoInterface>(
        new PageInfo(ActionMenuComponent, {
          self: {
            kind: "MenuRoute",
            label: "Custom Label",
            icon: ["fas", "question-circle"],
            tooltip: () => "Custom Tooltip",
            route: this.route
          },
          category: {
            label: "Custom Category",
            icon: ["fas", "home"],
            route: this.route
          },
          menus: {
            actions: List<AnyMenuItem>([
              {
                kind: "MenuAction",
                label: "Custom Label",
                icon: ["fas", "tag"],
                tooltip: () => "Custom Tooltip",
                action: () => console.log("action")
              } as MenuAction
            ]),
            links: List<NavigableMenuItem>([])
          }
        } as PageInfoInterface)
      );
    }

    TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientModule, SharedModule],
      declarations: [ActionMenuComponent],
      providers: [
        ...testAppInitializer,
        { provide: ActivatedRoute, useClass: MockActivatedRoute }
      ]
    }).compileComponents();
    fixture = TestBed.createComponent(ActionMenuComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();

    const menuElements = fixture.nativeElement.querySelectorAll("li.nav-item");
    expect(menuElements.length).toBe(2);

    const item = menuElements[1].querySelector("app-menu-button button");
    expect(item).toBeTruthy();

    const icon = item.querySelector("fa-icon");
    const label = item.querySelector("#label");

    expect(label).toBeTruthy();
    expect(icon).toBeTruthy();
    expect(item.attributes.getNamedItem("ng-reflect-ngb-tooltip")).toBeTruthy();
    expect(item.attributes.getNamedItem("ng-reflect-ngb-tooltip").value).toBe(
      "Custom Tooltip"
    );
    expect(label.innerText.trim()).toBe("Custom Label");
    expect(icon.attributes.getNamedItem("ng-reflect-icon-prop")).toBeTruthy();
    expect(icon.attributes.getNamedItem("ng-reflect-icon-prop").value).toBe(
      "fas,tag"
    );
  });

  it("should handle multiple action button", () => {
    class MockActivatedRoute {
      private route = StrongRoute.Base.add("/");

      public params = new BehaviorSubject<any>({});
      public data = new BehaviorSubject<PageInfoInterface>(
        new PageInfo(ActionMenuComponent, {
          self: {
            kind: "MenuRoute",
            label: "Custom Label",
            icon: ["fas", "question-circle"],
            tooltip: () => "Custom Tooltip",
            route: this.route
          },
          category: {
            label: "Custom Category",
            icon: ["fas", "home"],
            route: this.route
          },
          menus: {
            actions: List<AnyMenuItem>([
              {
                kind: "MenuAction",
                label: "Custom Label 1",
                icon: ["fas", "tag"],
                tooltip: () => "Custom Tooltip 1",
                action: () => console.log("action")
              } as MenuAction,
              {
                kind: "MenuAction",
                label: "Custom Label 2",
                icon: ["fas", "tags"],
                tooltip: () => "Custom Tooltip 2",
                action: () => console.log("action")
              } as MenuAction
            ]),
            links: List<NavigableMenuItem>([])
          }
        } as PageInfoInterface)
      );
    }

    TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientModule, SharedModule],
      declarations: [ActionMenuComponent],
      providers: [
        ...testAppInitializer,
        { provide: ActivatedRoute, useClass: MockActivatedRoute }
      ]
    }).compileComponents();
    fixture = TestBed.createComponent(ActionMenuComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();

    const menuElements = fixture.nativeElement.querySelectorAll("li.nav-item");
    expect(menuElements.length).toBe(3);

    let item = menuElements[1].querySelector("app-menu-button button");
    expect(item).toBeTruthy();

    let icon = item.querySelector("fa-icon");
    let label = item.querySelector("#label");

    expect(label).toBeTruthy();
    expect(icon).toBeTruthy();
    expect(item.attributes.getNamedItem("ng-reflect-ngb-tooltip")).toBeTruthy();
    expect(item.attributes.getNamedItem("ng-reflect-ngb-tooltip").value).toBe(
      "Custom Tooltip 1"
    );
    expect(label.innerText.trim()).toBe("Custom Label 1");
    expect(icon.attributes.getNamedItem("ng-reflect-icon-prop")).toBeTruthy();
    expect(icon.attributes.getNamedItem("ng-reflect-icon-prop").value).toBe(
      "fas,tag"
    );

    item = menuElements[2].querySelector("app-menu-button button");
    expect(item).toBeTruthy();

    icon = item.querySelector("fa-icon");
    label = item.querySelector("#label");

    expect(label).toBeTruthy();
    expect(icon).toBeTruthy();
    expect(item.attributes.getNamedItem("ng-reflect-ngb-tooltip")).toBeTruthy();
    expect(item.attributes.getNamedItem("ng-reflect-ngb-tooltip").value).toBe(
      "Custom Tooltip 2"
    );
    expect(label.innerText.trim()).toBe("Custom Label 2");
    expect(icon.attributes.getNamedItem("ng-reflect-icon-prop")).toBeTruthy();
    expect(icon.attributes.getNamedItem("ng-reflect-icon-prop").value).toBe(
      "fas,tags"
    );
  });

  it("should handle mixed actions", () => {
    class MockActivatedRoute {
      private route = StrongRoute.Base.add("/");

      public params = new BehaviorSubject<any>({});
      public data = new BehaviorSubject<PageInfoInterface>(
        new PageInfo(ActionMenuComponent, {
          self: {
            kind: "MenuRoute",
            label: "Custom Label",
            icon: ["fas", "question-circle"],
            tooltip: () => "Custom Tooltip",
            route: this.route
          },
          category: {
            label: "Custom Category",
            icon: ["fas", "home"],
            route: this.route
          },
          menus: {
            actions: List<AnyMenuItem>([
              {
                kind: "MenuRoute",
                label: "Custom Label 1",
                icon: ["fas", "tag"],
                tooltip: () => "Custom Tooltip 1",
                route: this.route
              } as MenuRoute,
              {
                kind: "MenuLink",
                label: "Custom Label 2",
                icon: ["fas", "tags"],
                tooltip: () => "Custom Tooltip 2",
                uri: "http://brokenlink/2"
              } as MenuLink,
              {
                kind: "MenuAction",
                label: "Custom Label 3",
                icon: ["fas", "home"],
                tooltip: () => "Custom Tooltip 3",
                action: () => console.log("action")
              } as MenuAction
            ]),
            links: List<NavigableMenuItem>([])
          }
        } as PageInfoInterface)
      );
    }

    TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientModule, SharedModule],
      declarations: [ActionMenuComponent],
      providers: [
        ...testAppInitializer,
        { provide: ActivatedRoute, useClass: MockActivatedRoute }
      ]
    }).compileComponents();
    fixture = TestBed.createComponent(ActionMenuComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();

    const menuElements = fixture.nativeElement.querySelectorAll("li.nav-item");
    expect(menuElements.length).toBe(4);

    let item = menuElements[1].querySelector("app-menu-internal-link a");
    expect(item).toBeTruthy();

    let icon = item.querySelector("fa-icon");
    let label = item.querySelector("#label");

    expect(label).toBeTruthy();
    expect(icon).toBeTruthy();
    expect(item.attributes.getNamedItem("ng-reflect-ngb-tooltip")).toBeTruthy();
    expect(item.attributes.getNamedItem("ng-reflect-ngb-tooltip").value).toBe(
      "Custom Tooltip 1"
    );
    expect(label.innerText.trim()).toBe("Custom Label 1");
    expect(icon.attributes.getNamedItem("ng-reflect-icon-prop")).toBeTruthy();
    expect(icon.attributes.getNamedItem("ng-reflect-icon-prop").value).toBe(
      "fas,tag"
    );

    item = menuElements[2].querySelector("app-menu-external-link a");
    expect(item).toBeTruthy();

    icon = item.querySelector("fa-icon");
    label = item.querySelector("#label");

    expect(label).toBeTruthy();
    expect(icon).toBeTruthy();
    expect(item.attributes.getNamedItem("ng-reflect-ngb-tooltip")).toBeTruthy();
    expect(item.attributes.getNamedItem("ng-reflect-ngb-tooltip").value).toBe(
      "Custom Tooltip 2"
    );
    expect(label.innerText.trim()).toBe("Custom Label 2");
    expect(icon.attributes.getNamedItem("ng-reflect-icon-prop")).toBeTruthy();
    expect(icon.attributes.getNamedItem("ng-reflect-icon-prop").value).toBe(
      "fas,tags"
    );

    item = menuElements[3].querySelector("app-menu-button button");
    expect(item).toBeTruthy();

    icon = item.querySelector("fa-icon");
    label = item.querySelector("#label");

    expect(label).toBeTruthy();
    expect(icon).toBeTruthy();
    expect(item.attributes.getNamedItem("ng-reflect-ngb-tooltip")).toBeTruthy();
    expect(item.attributes.getNamedItem("ng-reflect-ngb-tooltip").value).toBe(
      "Custom Tooltip 3"
    );
    expect(label.innerText.trim()).toBe("Custom Label 3");
    expect(icon.attributes.getNamedItem("ng-reflect-icon-prop")).toBeTruthy();
    expect(icon.attributes.getNamedItem("ng-reflect-icon-prop").value).toBe(
      "fas,home"
    );
  });

  xit("should handle no widget", () => {});
  xit("should handle widget", () => {});
});

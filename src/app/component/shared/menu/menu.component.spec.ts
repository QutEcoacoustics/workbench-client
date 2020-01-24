import { HttpClientModule } from "@angular/common/http";
import { ComponentFixture, fakeAsync, TestBed } from "@angular/core/testing";
import { ActivatedRoute } from "@angular/router";
import { RouterTestingModule } from "@angular/router/testing";
import { List } from "immutable";
import { BehaviorSubject } from "rxjs";
import { testBawServices } from "src/app/app.helper";
import {
  AnyMenuItem,
  MenuAction,
  MenuLink,
  MenuRoute
} from "src/app/interfaces/menusInterfaces";
import { StrongRoute } from "src/app/interfaces/strongRoute";
import { SessionUser } from "src/app/models/User";
import { BawApiService } from "src/app/services/baw-api/base-api.service";
import { mockSessionStorage } from "src/app/services/baw-api/mock/sessionStorageMock";
import { SharedModule } from "../shared.module";
import { MenuButtonComponent } from "./button/button.component";
import { MenuExternalLinkComponent } from "./external-link/external-link.component";
import { MenuInternalLinkComponent } from "./internal-link/internal-link.component";
import { MenuComponent } from "./menu.component";

describe("MenuComponent", () => {
  let router: ActivatedRoute;
  let component: MenuComponent;
  let fixture: ComponentFixture<MenuComponent>;

  class MockActivatedRoute {
    public params = new BehaviorSubject<any>({ attribute: 10 });
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        SharedModule,
        HttpClientModule,
        RouterTestingModule.withRoutes([])
      ],
      declarations: [
        MenuComponent,
        MenuButtonComponent,
        MenuExternalLinkComponent,
        MenuInternalLinkComponent
      ],
      providers: [
        ...testBawServices,
        { provide: ActivatedRoute, useClass: MockActivatedRoute }
      ]
    }).compileComponents();

    router = TestBed.get(ActivatedRoute);
    fixture = TestBed.createComponent(MenuComponent);
    component = fixture.componentInstance;

    Object.defineProperty(window, "sessionStorage", {
      value: mockSessionStorage
    });
  });

  afterEach(() => {
    sessionStorage.clear();
  });

  it("should create", () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it("should create default title when none provided", () => {
    component.links = List<AnyMenuItem>([]);
    fixture.detectChanges();

    const title = fixture.debugElement.nativeElement.querySelector("h6");
    expect(title).toBeTruthy();
    expect(title.innerText).toBe("MENU");
  });

  it("should create title when provided", () => {
    component.title = { label: "SECONDARY", icon: ["fas", "home"] };
    component.links = List<AnyMenuItem>([]);
    fixture.detectChanges();

    const title = fixture.debugElement.nativeElement.querySelector("h6");
    expect(title).toBeTruthy();
    expect(title.innerText.trim()).toBe("SECONDARY");
  });

  it("should create title icon when provided", () => {
    component.title = { label: "SECONDARY", icon: ["fas", "home"] };
    component.links = List<AnyMenuItem>([]);
    fixture.detectChanges();

    const icon = fixture.debugElement.nativeElement.querySelector("h6 fa-icon");
    expect(icon).toBeTruthy();
    expect(icon.attributes.getNamedItem("ng-reflect-icon-prop")).toBeTruthy();
    expect(icon.attributes.getNamedItem("ng-reflect-icon-prop").value).toBe(
      "fas,home"
    );
  });

  it("should create capitalized title", () => {
    component.title = { label: "secondary", icon: ["fas", "home"] };
    component.links = List<AnyMenuItem>([]);
    fixture.detectChanges();

    const title = fixture.debugElement.nativeElement.querySelector("h6");
    expect(title).toBeTruthy("Title should exist");
    expect(title.innerText.trim()).toBe(
      "SECONDARY",
      "Title text should be capitalized"
    );
  });

  it("should create no links", () => {
    component.links = List<AnyMenuItem>([]);
    fixture.detectChanges();

    const title = fixture.debugElement.nativeElement.querySelector("h6");
    expect(title).toBeTruthy("Title should exist");
    expect(title.innerText.trim()).toBe("MENU");

    const internalLinks = fixture.debugElement.nativeElement.querySelectorAll(
      "app-menu-internal-link"
    );
    const externalLinks = fixture.debugElement.nativeElement.querySelectorAll(
      "app-menu-external-link"
    );
    const buttons = fixture.debugElement.nativeElement.querySelectorAll(
      "app-menu-button"
    );
    expect(internalLinks.length).toBe(0, "Should not be any internal links");
    expect(externalLinks.length).toBe(0, "Should not be any external links");
    expect(buttons.length).toBe(0, "Should not be any buttons");
  });

  it("should create internal link", () => {
    component.menuType = "action";
    component.links = List<AnyMenuItem>([
      MenuRoute({
        label: "label",
        icon: ["fas", "home"],
        tooltip: () => "tooltip",
        route: StrongRoute.Base.add("home")
      })
    ]);
    fixture.detectChanges();

    const internalLinkFixture = TestBed.createComponent(
      MenuInternalLinkComponent
    );
    const internalLinkComponent = internalLinkFixture.componentInstance;
    internalLinkComponent.id = "action-tooltip-0";
    internalLinkComponent.link = MenuRoute({
      label: "label",
      icon: ["fas", "home"],
      tooltip: () => "tooltip",
      route: StrongRoute.Base.add("home")
    });
    internalLinkComponent.placement = "left";
    internalLinkComponent.tooltip = "tooltip";
    internalLinkFixture.detectChanges();

    const links = fixture.debugElement.nativeElement.querySelectorAll(
      "app-menu-internal-link"
    );
    expect(links.length).toBe(1, "Should be one internal link");

    const link = links[0];
    const internalLink = internalLinkFixture.debugElement.nativeElement;
    expect(link.innerHTML).toEqual(
      internalLink.innerHTML,
      "Internal link HTML should match"
    );
  });

  it("should create internal link with user dependant tooltip", () => {
    const api: BawApiService = TestBed.get(BawApiService);
    spyOn(api, "getSessionUser").and.callFake(
      () =>
        new SessionUser({ userName: "username", authToken: "xxxxxxxxxxxxxxx" })
    );
    component.menuType = "action";
    component.links = List<AnyMenuItem>([
      MenuRoute({
        label: "label",
        icon: ["fas", "home"],
        tooltip: user => `${user.userName} tooltip`,
        route: StrongRoute.Base.add("home")
      })
    ]);
    fixture.detectChanges();

    const internalLinkFixture = TestBed.createComponent(
      MenuInternalLinkComponent
    );
    const internalLinkComponent = internalLinkFixture.componentInstance;
    internalLinkComponent.id = "action-tooltip-0";
    internalLinkComponent.link = MenuRoute({
      label: "label",
      icon: ["fas", "home"],
      tooltip: user => `${user.userName} tooltip`,
      route: StrongRoute.Base.add("home")
    });
    internalLinkComponent.placement = "left";
    internalLinkComponent.tooltip = "username tooltip";
    internalLinkFixture.detectChanges();

    const link = fixture.debugElement.nativeElement.querySelectorAll(
      "app-menu-internal-link"
    )[0];
    const internalLink = internalLinkFixture.debugElement.nativeElement;
    expect(link.innerHTML).toEqual(
      internalLink.innerHTML,
      "Internal link HTML should match"
    );
  });

  it("should create multiple internal links", () => {
    const internalLink1Obj = MenuRoute({
      label: "label a",
      icon: ["fas", "home"],
      tooltip: () => "tooltip",
      route: StrongRoute.Base.add("home"),
      order: 1
    });
    const internalLink2Obj = MenuRoute({
      label: "label b",
      icon: ["fas", "home"],
      tooltip: () => "tooltip",
      route: StrongRoute.Base.add("house"),
      order: 2
    });

    component.menuType = "action";
    component.links = List<AnyMenuItem>([internalLink1Obj, internalLink2Obj]);
    fixture.detectChanges();

    const internalLinkFixture1 = TestBed.createComponent(
      MenuInternalLinkComponent
    );
    const internalLinkComponent1 = internalLinkFixture1.componentInstance;
    internalLinkComponent1.id = "action-tooltip-0";
    internalLinkComponent1.link = internalLink1Obj;
    internalLinkComponent1.placement = "left";
    internalLinkComponent1.tooltip = "tooltip";
    internalLinkFixture1.detectChanges();

    const internalLinkFixture2 = TestBed.createComponent(
      MenuInternalLinkComponent
    );
    const internalLinkComponent2 = internalLinkFixture2.componentInstance;
    internalLinkComponent2.id = "action-tooltip-1";
    internalLinkComponent2.link = internalLink2Obj;
    internalLinkComponent2.placement = "left";
    internalLinkComponent2.tooltip = "tooltip";
    internalLinkFixture2.detectChanges();

    const links = fixture.debugElement.nativeElement.querySelectorAll(
      "app-menu-internal-link"
    );
    expect(links.length).toBe(2, "Should be two internal links");

    const internalLink1 = internalLinkFixture1.debugElement.nativeElement;
    const internalLink2 = internalLinkFixture2.debugElement.nativeElement;
    expect(links[0].innerHTML).toEqual(
      internalLink1.innerHTML,
      "First internal link HTML should match"
    );
    expect(links[1].innerHTML).toEqual(
      internalLink2.innerHTML,
      "Second internal link HTML should match"
    );
  });

  it("should create external link", () => {
    component.menuType = "action";
    component.links = List<AnyMenuItem>([
      MenuLink({
        label: "label",
        icon: ["fas", "home"],
        tooltip: () => "tooltip",
        uri: "http://brokenlink/"
      })
    ]);
    fixture.detectChanges();

    const externalLinkFixture = TestBed.createComponent(
      MenuExternalLinkComponent
    );
    const externalLinkComponent = externalLinkFixture.componentInstance;
    externalLinkComponent.id = "action-tooltip-0";
    externalLinkComponent.link = MenuLink({
      label: "label",
      icon: ["fas", "home"],
      tooltip: () => "tooltip",
      uri: "http://brokenlink/"
    });
    externalLinkComponent.placement = "left";
    externalLinkComponent.tooltip = "tooltip";
    externalLinkFixture.detectChanges();

    const links = fixture.debugElement.nativeElement.querySelectorAll(
      "app-menu-external-link"
    );
    expect(links.length).toBe(1, "Should contain one external link");

    const link = links[0];
    const externalLink = externalLinkFixture.debugElement.nativeElement;
    expect(link.innerHTML).toEqual(
      externalLink.innerHTML,
      "External link HTML should match"
    );
  });

  it("should create external link with user dependant tooltip", () => {
    const api: BawApiService = TestBed.get(BawApiService);
    spyOn(api, "getSessionUser").and.callFake(
      () =>
        new SessionUser({ userName: "username", authToken: "xxxxxxxxxxxxxxx" })
    );
    component.menuType = "action";
    component.links = List<AnyMenuItem>([
      MenuLink({
        label: "label",
        icon: ["fas", "home"],
        tooltip: user => `${user.userName} tooltip`,
        uri: "http://brokenlink/"
      })
    ]);
    fixture.detectChanges();

    const externalLinkFixture = TestBed.createComponent(
      MenuExternalLinkComponent
    );
    const externalLinkComponent = externalLinkFixture.componentInstance;
    externalLinkComponent.id = "action-tooltip-0";
    externalLinkComponent.link = MenuLink({
      label: "label",
      icon: ["fas", "home"],
      tooltip: user => `${user.userName} tooltip`,
      uri: "http://brokenlink/"
    });
    externalLinkComponent.placement = "left";
    externalLinkComponent.tooltip = "username tooltip";
    externalLinkFixture.detectChanges();

    const link = fixture.debugElement.nativeElement.querySelectorAll(
      "app-menu-external-link"
    )[0];
    const externalLink = externalLinkFixture.debugElement.nativeElement;
    expect(link.innerHTML).toEqual(
      externalLink.innerHTML,
      "External link HTML should match"
    );
  });

  it("should create multiple external links", () => {
    const externalLink1Obj = MenuLink({
      label: "label a",
      icon: ["fas", "home"],
      tooltip: () => "tooltip",
      uri: "http://brokenlink/",
      order: 1
    });
    const externalLink2Obj = MenuLink({
      label: "label b",
      icon: ["fas", "home"],
      tooltip: () => "tooltip",
      uri: "http://brokenlink/",
      order: 2
    });

    component.menuType = "action";
    component.links = List<AnyMenuItem>([externalLink1Obj, externalLink2Obj]);
    fixture.detectChanges();

    const externalLinkFixture1 = TestBed.createComponent(
      MenuExternalLinkComponent
    );
    const externalLinkComponent1 = externalLinkFixture1.componentInstance;
    externalLinkComponent1.id = "action-tooltip-0";
    externalLinkComponent1.link = externalLink1Obj;
    externalLinkComponent1.placement = "left";
    externalLinkComponent1.tooltip = "tooltip";
    externalLinkFixture1.detectChanges();

    const externalLinkFixture2 = TestBed.createComponent(
      MenuExternalLinkComponent
    );
    const externalLinkComponent2 = externalLinkFixture2.componentInstance;
    externalLinkComponent2.id = "action-tooltip-1";
    externalLinkComponent2.link = externalLink2Obj;
    externalLinkComponent2.placement = "left";
    externalLinkComponent2.tooltip = "tooltip";
    externalLinkFixture2.detectChanges();

    const links = fixture.debugElement.nativeElement.querySelectorAll(
      "app-menu-external-link"
    );
    expect(links.length).toBe(2, "Should be two external links");

    const externalLink1 = externalLinkFixture1.debugElement.nativeElement;
    const externalLink2 = externalLinkFixture2.debugElement.nativeElement;
    expect(links[0].innerHTML).toEqual(
      externalLink1.innerHTML,
      "First external link HTML should match"
    );
    expect(links[1].innerHTML).toEqual(
      externalLink2.innerHTML,
      "Second external link HTML should match"
    );
  });

  it("should create action button", () => {
    component.menuType = "action";
    component.links = List<AnyMenuItem>([
      MenuAction({
        label: "label",
        icon: ["fas", "home"],
        tooltip: () => "tooltip",
        action: () => {}
      })
    ]);
    fixture.detectChanges();

    const buttonFixture = TestBed.createComponent(MenuButtonComponent);
    const buttonComponent = buttonFixture.componentInstance;
    buttonComponent.id = "action-tooltip-0";
    buttonComponent.link = MenuAction({
      label: "label",
      icon: ["fas", "home"],
      tooltip: () => "tooltip",
      action: () => {}
    });
    buttonComponent.placement = "left";
    buttonComponent.tooltip = "tooltip";
    buttonFixture.detectChanges();

    const links = fixture.debugElement.nativeElement.querySelectorAll(
      "app-menu-button"
    );
    expect(links.length).toBe(1, "Should only create one button");

    const link = links[0];
    const button = buttonFixture.debugElement.nativeElement;
    expect(link.innerHTML).toEqual(
      button.innerHTML,
      "Button HTML should match"
    );
  });

  it("should create action button with user dependant tooltip", () => {
    const api: BawApiService = TestBed.get(BawApiService);
    spyOn(api, "getSessionUser").and.callFake(
      () =>
        new SessionUser({ userName: "username", authToken: "xxxxxxxxxxxxxxx" })
    );
    component.menuType = "action";
    component.links = List<AnyMenuItem>([
      MenuAction({
        label: "label",
        icon: ["fas", "home"],
        tooltip: user => `${user.userName} tooltip`,
        action: () => {}
      })
    ]);
    fixture.detectChanges();

    const buttonFixture = TestBed.createComponent(MenuButtonComponent);
    const buttonComponent = buttonFixture.componentInstance;
    buttonComponent.id = "action-tooltip-0";
    buttonComponent.link = MenuAction({
      label: "label",
      icon: ["fas", "home"],
      tooltip: user => `${user.userName} tooltip`,
      action: () => {}
    });
    buttonComponent.placement = "left";
    buttonComponent.tooltip = "username tooltip";
    buttonFixture.detectChanges();

    const link = fixture.debugElement.nativeElement.querySelectorAll(
      "app-menu-button"
    )[0];
    const button = buttonFixture.debugElement.nativeElement;
    expect(link.innerHTML).toEqual(
      button.innerHTML,
      "Button HTML should match"
    );
  });

  it("should create multiple action buttons", () => {
    const button1Obj = MenuAction({
      label: "label a",
      icon: ["fas", "home"],
      tooltip: () => "tooltip",
      action: () => {},
      order: 1
    });
    const button2Obj = MenuAction({
      label: "label b",
      icon: ["fas", "home"],
      tooltip: () => "tooltip",
      action: () => {},
      order: 2
    });

    component.menuType = "action";
    component.links = List<AnyMenuItem>([button1Obj, button2Obj]);
    fixture.detectChanges();

    const buttonFixture1 = TestBed.createComponent(MenuButtonComponent);
    const buttonComponent1 = buttonFixture1.componentInstance;
    buttonComponent1.id = "action-tooltip-0";
    buttonComponent1.link = button1Obj;
    buttonComponent1.placement = "left";
    buttonComponent1.tooltip = "tooltip";
    buttonFixture1.detectChanges();

    const buttonFixture2 = TestBed.createComponent(MenuButtonComponent);
    const buttonComponent2 = buttonFixture2.componentInstance;
    buttonComponent2.id = "action-tooltip-1";
    buttonComponent2.link = button2Obj;
    buttonComponent2.placement = "left";
    buttonComponent2.tooltip = "tooltip";
    buttonFixture2.detectChanges();

    const links = fixture.debugElement.nativeElement.querySelectorAll(
      "app-menu-button"
    );
    expect(links.length).toBe(2, "Should create two buttons");

    const button1 = buttonFixture1.debugElement.nativeElement;
    const button2 = buttonFixture2.debugElement.nativeElement;
    expect(links[0].innerHTML).toEqual(
      button1.innerHTML,
      "First button HTML should match"
    );
    expect(links[1].innerHTML).toEqual(
      button2.innerHTML,
      "Second button HTML should match"
    );
  });

  it("should create mixed links", () => {
    const buttonObj = MenuAction({
      label: "label a",
      icon: ["fas", "home"],
      tooltip: () => "tooltip",
      action: () => {},
      order: 1
    });
    const externalLinkObj = MenuLink({
      label: "label b",
      icon: ["fas", "home"],
      tooltip: () => "tooltip",
      uri: "http://brokenlink/",
      order: 2,
      indentation: 0
    });
    const internalLinkObj = MenuRoute({
      label: "label c",
      icon: ["fas", "home"],
      tooltip: () => "tooltip",
      route: StrongRoute.Base.add("house"),
      order: 3
    });

    component.menuType = "action";
    component.links = List<AnyMenuItem>([
      buttonObj,
      externalLinkObj,
      internalLinkObj
    ]);
    fixture.detectChanges();

    // Create test button
    const buttonFixture = TestBed.createComponent(MenuButtonComponent);
    const buttonComponent = buttonFixture.componentInstance;
    buttonComponent.id = "action-tooltip-0";
    buttonComponent.link = buttonObj;
    buttonComponent.placement = "left";
    buttonComponent.tooltip = "tooltip";
    buttonFixture.detectChanges();

    // Create test external link
    const externalLinkFixture = TestBed.createComponent(
      MenuExternalLinkComponent
    );
    const externalLinkComponent = externalLinkFixture.componentInstance;
    externalLinkComponent.id = "action-tooltip-1";
    externalLinkComponent.link = externalLinkObj;
    externalLinkComponent.placement = "left";
    externalLinkComponent.tooltip = "tooltip";
    externalLinkFixture.detectChanges();

    // Create test internal link
    const internalLinkFixture = TestBed.createComponent(
      MenuInternalLinkComponent
    );
    const internalLinkComponent = internalLinkFixture.componentInstance;
    internalLinkComponent.id = "action-tooltip-2";
    internalLinkComponent.link = internalLinkObj;
    internalLinkComponent.placement = "left";
    internalLinkComponent.tooltip = "tooltip";
    internalLinkFixture.detectChanges();

    // Retrieve links
    const buttons = fixture.debugElement.nativeElement.querySelectorAll(
      "app-menu-button"
    );
    expect(buttons.length).toBe(1, "Should only contain one button");
    const externalLinks = fixture.debugElement.nativeElement.querySelectorAll(
      "app-menu-external-link"
    );
    expect(externalLinks.length).toBe(
      1,
      "Should only contain one external link"
    );
    const internalLinks = fixture.debugElement.nativeElement.querySelectorAll(
      "app-menu-internal-link"
    );
    expect(internalLinks.length).toBe(
      1,
      "Should only contain one internal link"
    );

    // Retrieve test links
    const button = buttonFixture.debugElement.nativeElement;
    const externalLink = externalLinkFixture.debugElement.nativeElement;
    const internalLink = internalLinkFixture.debugElement.nativeElement;

    expect(buttons[0].innerHTML).toEqual(
      button.innerHTML,
      "Button link HTML should match"
    );
    expect(externalLinks[0].innerHTML).toEqual(
      externalLink.innerHTML,
      "External link HTML should match"
    );
    expect(internalLinks[0].innerHTML).toEqual(
      internalLink.innerHTML,
      "Internal link HTML should match"
    );
  });

  it("should create internal link with no router parameters", () => {
    const base = StrongRoute.Base.add("home");
    const route = base.add("brokenlink");

    component.menuType = "action";
    component.links = List<AnyMenuItem>([
      MenuRoute({
        label: "label",
        icon: ["fas", "home"],
        tooltip: () => "tooltip",
        route
      })
    ]);
    fixture.detectChanges();

    const internalLinkFixture = TestBed.createComponent(
      MenuInternalLinkComponent
    );
    const internalLinkComponent = internalLinkFixture.componentInstance;
    internalLinkComponent.id = "action-tooltip-0";
    internalLinkComponent.link = MenuRoute({
      label: "label",
      icon: ["fas", "home"],
      tooltip: () => "tooltip",
      route
    });
    internalLinkComponent.placement = "left";
    internalLinkComponent.tooltip = "tooltip";
    internalLinkFixture.detectChanges();

    const links = fixture.debugElement.nativeElement.querySelectorAll(
      "app-menu-internal-link"
    );
    expect(links.length).toBe(1, "Should be one internal link");

    const link = links[0];
    const internalLink = internalLinkFixture.debugElement.nativeElement;
    expect(link.innerHTML).toEqual(
      internalLink.innerHTML,
      "Internal link HTML should match"
    );
  });

  it("should create internal link with router parameters", fakeAsync(() => {
    const base = StrongRoute.Base.add("home");
    const route = base.add(":attribute");
    const testRoute = StrongRoute.Base.add("home").add("10");

    const internalLinkFixture = TestBed.createComponent(
      MenuInternalLinkComponent
    );
    const internalLinkComponent = internalLinkFixture.componentInstance;
    internalLinkComponent.id = "action-tooltip-0";
    internalLinkComponent.link = MenuRoute({
      label: "label",
      icon: ["fas", "home"],
      tooltip: () => "tooltip",
      route: testRoute
    });
    internalLinkComponent.placement = "left";
    internalLinkComponent.tooltip = "tooltip";
    internalLinkFixture.detectChanges();

    component.menuType = "action";
    component.links = List<AnyMenuItem>([
      MenuRoute({
        label: "label",
        icon: ["fas", "home"],
        tooltip: () => "tooltip",
        route
      })
    ]);
    fixture.detectChanges();

    const links = fixture.debugElement.nativeElement.querySelectorAll(
      "app-menu-internal-link"
    );
    expect(links.length).toBe(1, "Should be one internal link");

    const link = links[0];
    const internalLink = internalLinkFixture.debugElement.nativeElement;
    expect(link.innerHTML).toEqual(
      internalLink.innerHTML,
      "Internal link HTML should match"
    );
  }));

  it("should order links by priority on secondary menu", () => {
    const internalLink1Obj = MenuRoute({
      label: "label a",
      icon: ["fas", "home"],
      tooltip: () => "tooltip",
      route: StrongRoute.Base.add("home"),
      order: 2
    });
    const internalLink2Obj = MenuRoute({
      label: "label b",
      icon: ["fas", "home"],
      tooltip: () => "tooltip",
      route: StrongRoute.Base.add("house"),
      order: 1
    });

    component.menuType = "secondary";
    component.links = List<AnyMenuItem>([internalLink1Obj, internalLink2Obj]);
    fixture.detectChanges();

    const internalLinkFixture1 = TestBed.createComponent(
      MenuInternalLinkComponent
    );
    const internalLinkComponent1 = internalLinkFixture1.componentInstance;
    internalLinkComponent1.id = "secondary-tooltip-1";
    internalLinkComponent1.link = internalLink1Obj;
    internalLinkComponent1.placement = "right";
    internalLinkComponent1.tooltip = "tooltip";
    internalLinkFixture1.detectChanges();

    const internalLinkFixture2 = TestBed.createComponent(
      MenuInternalLinkComponent
    );
    const internalLinkComponent2 = internalLinkFixture2.componentInstance;
    internalLinkComponent2.id = "secondary-tooltip-0";
    internalLinkComponent2.link = internalLink2Obj;
    internalLinkComponent2.placement = "right";
    internalLinkComponent2.tooltip = "tooltip";
    internalLinkFixture2.detectChanges();

    const links = fixture.debugElement.nativeElement.querySelectorAll(
      "app-menu-internal-link"
    );
    expect(links.length).toBe(2, "Should be two internal links");

    const internalLink1 = internalLinkFixture1.debugElement.nativeElement;
    const internalLink2 = internalLinkFixture2.debugElement.nativeElement;

    expect(links[0].innerHTML).toEqual(
      internalLink2.innerHTML,
      "First internal link HTML should match"
    );
    expect(links[1].innerHTML).toEqual(
      internalLink1.innerHTML,
      "Second internal link HTML should match"
    );
  });

  it("should order links by priority on action menu", () => {
    const internalLink1Obj = MenuRoute({
      label: "label a",
      icon: ["fas", "home"],
      tooltip: () => "tooltip",
      route: StrongRoute.Base.add("home"),
      order: 2
    });
    const internalLink2Obj = MenuRoute({
      label: "label b",
      icon: ["fas", "home"],
      tooltip: () => "tooltip",
      route: StrongRoute.Base.add("house"),
      order: 1
    });

    component.menuType = "action";
    component.links = List<AnyMenuItem>([internalLink1Obj, internalLink2Obj]);
    fixture.detectChanges();

    const internalLinkFixture1 = TestBed.createComponent(
      MenuInternalLinkComponent
    );
    const internalLinkComponent1 = internalLinkFixture1.componentInstance;
    internalLinkComponent1.id = "action-tooltip-0";
    internalLinkComponent1.link = internalLink1Obj;
    internalLinkComponent1.placement = "left";
    internalLinkComponent1.tooltip = "tooltip";
    internalLinkFixture1.detectChanges();

    const internalLinkFixture2 = TestBed.createComponent(
      MenuInternalLinkComponent
    );
    const internalLinkComponent2 = internalLinkFixture2.componentInstance;
    internalLinkComponent2.id = "action-tooltip-1";
    internalLinkComponent2.link = internalLink2Obj;
    internalLinkComponent2.placement = "left";
    internalLinkComponent2.tooltip = "tooltip";
    internalLinkFixture2.detectChanges();

    const links = fixture.debugElement.nativeElement.querySelectorAll(
      "app-menu-internal-link"
    );
    expect(links.length).toBe(2, "Should be two internal links");

    const internalLink1 = internalLinkFixture1.debugElement.nativeElement;
    const internalLink2 = internalLinkFixture2.debugElement.nativeElement;

    expect(links[0].innerHTML).toEqual(
      internalLink1.innerHTML,
      "First internal link HTML should match"
    );
    expect(links[1].innerHTML).toEqual(
      internalLink2.innerHTML,
      "Second internal link HTML should match"
    );
  });

  it("should order links by alphabetical order on secondary menu", () => {
    const internalLink1Obj = MenuRoute({
      label: "label b",
      icon: ["fas", "home"],
      tooltip: () => "tooltip",
      route: StrongRoute.Base.add("home")
    });
    const internalLink2Obj = MenuRoute({
      label: "label a",
      icon: ["fas", "home"],
      tooltip: () => "tooltip",
      route: StrongRoute.Base.add("house")
    });

    component.menuType = "secondary";
    component.links = List<AnyMenuItem>([internalLink1Obj, internalLink2Obj]);
    fixture.detectChanges();

    const internalLinkFixture1 = TestBed.createComponent(
      MenuInternalLinkComponent
    );
    const internalLinkComponent1 = internalLinkFixture1.componentInstance;
    internalLinkComponent1.id = "secondary-tooltip-1";
    internalLinkComponent1.link = internalLink1Obj;
    internalLinkComponent1.placement = "right";
    internalLinkComponent1.tooltip = "tooltip";
    internalLinkFixture1.detectChanges();

    const internalLinkFixture2 = TestBed.createComponent(
      MenuInternalLinkComponent
    );
    const internalLinkComponent2 = internalLinkFixture2.componentInstance;
    internalLinkComponent2.id = "secondary-tooltip-0";
    internalLinkComponent2.link = internalLink2Obj;
    internalLinkComponent2.placement = "right";
    internalLinkComponent2.tooltip = "tooltip";
    internalLinkFixture2.detectChanges();

    const links = fixture.debugElement.nativeElement.querySelectorAll(
      "app-menu-internal-link"
    );
    expect(links.length).toBe(2, "Should be two internal links");

    const internalLink1 = internalLinkFixture1.debugElement.nativeElement;
    const internalLink2 = internalLinkFixture2.debugElement.nativeElement;

    expect(links[0].innerHTML).toEqual(
      internalLink2.innerHTML,
      "First internal link HTML should match"
    );
    expect(links[1].innerHTML).toEqual(
      internalLink1.innerHTML,
      "Second internal link HTML should match"
    );
  });

  it("should not order links by alphabetical order on action menu", () => {
    const internalLink1Obj = MenuRoute({
      label: "label b",
      icon: ["fas", "home"],
      tooltip: () => "tooltip",
      route: StrongRoute.Base.add("home")
    });
    const internalLink2Obj = MenuRoute({
      label: "label a",
      icon: ["fas", "home"],
      tooltip: () => "tooltip",
      route: StrongRoute.Base.add("house")
    });

    component.menuType = "action";
    component.links = List<AnyMenuItem>([internalLink1Obj, internalLink2Obj]);
    fixture.detectChanges();

    const internalLinkFixture1 = TestBed.createComponent(
      MenuInternalLinkComponent
    );
    const internalLinkComponent1 = internalLinkFixture1.componentInstance;
    internalLinkComponent1.id = "action-tooltip-0";
    internalLinkComponent1.link = internalLink1Obj;
    internalLinkComponent1.placement = "left";
    internalLinkComponent1.tooltip = "tooltip";
    internalLinkFixture1.detectChanges();

    const internalLinkFixture2 = TestBed.createComponent(
      MenuInternalLinkComponent
    );
    const internalLinkComponent2 = internalLinkFixture2.componentInstance;
    internalLinkComponent2.id = "action-tooltip-1";
    internalLinkComponent2.link = internalLink2Obj;
    internalLinkComponent2.placement = "left";
    internalLinkComponent2.tooltip = "tooltip";
    internalLinkFixture2.detectChanges();

    const links = fixture.debugElement.nativeElement.querySelectorAll(
      "app-menu-internal-link"
    );
    expect(links.length).toBe(2, "Should be two internal links");

    const internalLink1 = internalLinkFixture1.debugElement.nativeElement;
    const internalLink2 = internalLinkFixture2.debugElement.nativeElement;

    expect(links[0].innerHTML).toEqual(
      internalLink1.innerHTML,
      "First internal link HTML should match"
    );
    expect(links[1].innerHTML).toEqual(
      internalLink2.innerHTML,
      "Second internal link HTML should match"
    );
  });

  it("should order links with ordered link first on secondary menu", () => {
    const internalLink1Obj = MenuRoute({
      label: "label b",
      icon: ["fas", "home"],
      tooltip: () => "tooltip",
      route: StrongRoute.Base.add("home")
    });
    const internalLink2Obj = MenuRoute({
      label: "label a",
      icon: ["fas", "home"],
      tooltip: () => "tooltip",
      route: StrongRoute.Base.add("house"),
      order: 2
    });

    component.menuType = "secondary";
    component.links = List<AnyMenuItem>([internalLink1Obj, internalLink2Obj]);
    fixture.detectChanges();

    const internalLinkFixture1 = TestBed.createComponent(
      MenuInternalLinkComponent
    );
    const internalLinkComponent1 = internalLinkFixture1.componentInstance;
    internalLinkComponent1.id = "secondary-tooltip-1";
    internalLinkComponent1.link = internalLink1Obj;
    internalLinkComponent1.placement = "right";
    internalLinkComponent1.tooltip = "tooltip";
    internalLinkFixture1.detectChanges();

    const internalLinkFixture2 = TestBed.createComponent(
      MenuInternalLinkComponent
    );
    const internalLinkComponent2 = internalLinkFixture2.componentInstance;
    internalLinkComponent2.id = "secondary-tooltip-0";
    internalLinkComponent2.link = internalLink2Obj;
    internalLinkComponent2.placement = "right";
    internalLinkComponent2.tooltip = "tooltip";
    internalLinkFixture2.detectChanges();

    const links = fixture.debugElement.nativeElement.querySelectorAll(
      "app-menu-internal-link"
    );
    expect(links.length).toBe(2, "Should be two internal links");

    const internalLink1 = internalLinkFixture1.debugElement.nativeElement;
    const internalLink2 = internalLinkFixture2.debugElement.nativeElement;

    expect(links[0].innerHTML).toEqual(
      internalLink2.innerHTML,
      "First internal link HTML should match"
    );
    expect(links[1].innerHTML).toEqual(
      internalLink1.innerHTML,
      "Second internal link HTML should match"
    );
  });

  it("should not order links with ordered link first on action menu", () => {
    const internalLink1Obj = MenuRoute({
      label: "label b",
      icon: ["fas", "home"],
      tooltip: () => "tooltip",
      route: StrongRoute.Base.add("home")
    });
    const internalLink2Obj = MenuRoute({
      label: "label a",
      icon: ["fas", "home"],
      tooltip: () => "tooltip",
      route: StrongRoute.Base.add("house"),
      order: 2
    });

    component.menuType = "action";
    component.links = List<AnyMenuItem>([internalLink1Obj, internalLink2Obj]);
    fixture.detectChanges();

    const internalLinkFixture1 = TestBed.createComponent(
      MenuInternalLinkComponent
    );
    const internalLinkComponent1 = internalLinkFixture1.componentInstance;
    internalLinkComponent1.id = "action-tooltip-0";
    internalLinkComponent1.link = internalLink1Obj;
    internalLinkComponent1.placement = "left";
    internalLinkComponent1.tooltip = "tooltip";
    internalLinkFixture1.detectChanges();

    const internalLinkFixture2 = TestBed.createComponent(
      MenuInternalLinkComponent
    );
    const internalLinkComponent2 = internalLinkFixture2.componentInstance;
    internalLinkComponent2.id = "action-tooltip-1";
    internalLinkComponent2.link = internalLink2Obj;
    internalLinkComponent2.placement = "left";
    internalLinkComponent2.tooltip = "tooltip";
    internalLinkFixture2.detectChanges();

    const links = fixture.debugElement.nativeElement.querySelectorAll(
      "app-menu-internal-link"
    );
    expect(links.length).toBe(2, "Should be two internal links");

    const internalLink1 = internalLinkFixture1.debugElement.nativeElement;
    const internalLink2 = internalLinkFixture2.debugElement.nativeElement;

    expect(links[0].innerHTML).toEqual(
      internalLink1.innerHTML,
      "First internal link HTML should match"
    );
    expect(links[1].innerHTML).toEqual(
      internalLink2.innerHTML,
      "Second internal link HTML should match"
    );
  });

  it("should not order links with duplicate priority alphabetically on action menu", () => {
    const internalLink1Obj = MenuRoute({
      label: "label b",
      icon: ["fas", "home"],
      tooltip: () => "tooltip",
      route: StrongRoute.Base.add("home"),
      order: 1
    });
    const internalLink2Obj = MenuRoute({
      label: "label a",
      icon: ["fas", "home"],
      tooltip: () => "tooltip",
      route: StrongRoute.Base.add("house"),
      order: 1
    });

    component.menuType = "action";
    component.links = List<AnyMenuItem>([internalLink1Obj, internalLink2Obj]);
    fixture.detectChanges();

    const internalLinkFixture1 = TestBed.createComponent(
      MenuInternalLinkComponent
    );
    const internalLinkComponent1 = internalLinkFixture1.componentInstance;
    internalLinkComponent1.id = "action-tooltip-0";
    internalLinkComponent1.link = internalLink1Obj;
    internalLinkComponent1.placement = "left";
    internalLinkComponent1.tooltip = "tooltip";
    internalLinkFixture1.detectChanges();

    const internalLinkFixture2 = TestBed.createComponent(
      MenuInternalLinkComponent
    );
    const internalLinkComponent2 = internalLinkFixture2.componentInstance;
    internalLinkComponent2.id = "action-tooltip-1";
    internalLinkComponent2.link = internalLink2Obj;
    internalLinkComponent2.placement = "left";
    internalLinkComponent2.tooltip = "tooltip";
    internalLinkFixture2.detectChanges();

    const links = fixture.debugElement.nativeElement.querySelectorAll(
      "app-menu-internal-link"
    );
    expect(links.length).toBe(2, "Should be two internal links");

    const internalLink1 = internalLinkFixture1.debugElement.nativeElement;
    const internalLink2 = internalLinkFixture2.debugElement.nativeElement;

    expect(links[0].innerHTML).toEqual(
      internalLink1.innerHTML,
      "First internal link HTML should match"
    );
    expect(links[1].innerHTML).toEqual(
      internalLink2.innerHTML,
      "Second internal link HTML should match"
    );
  });

  it("should order links with duplicate priority alphabetically on secondary menu", () => {
    const internalLink1Obj = MenuRoute({
      label: "label b",
      icon: ["fas", "home"],
      tooltip: () => "tooltip",
      route: StrongRoute.Base.add("home"),
      order: 1
    });
    const internalLink2Obj = MenuRoute({
      label: "label a",
      icon: ["fas", "home"],
      tooltip: () => "tooltip",
      route: StrongRoute.Base.add("house"),
      order: 1
    });

    component.menuType = "secondary";
    component.links = List<AnyMenuItem>([internalLink1Obj, internalLink2Obj]);
    fixture.detectChanges();

    const internalLinkFixture1 = TestBed.createComponent(
      MenuInternalLinkComponent
    );
    const internalLinkComponent1 = internalLinkFixture1.componentInstance;
    internalLinkComponent1.id = "secondary-tooltip-1";
    internalLinkComponent1.link = internalLink1Obj;
    internalLinkComponent1.placement = "right";
    internalLinkComponent1.tooltip = "tooltip";
    internalLinkFixture1.detectChanges();

    const internalLinkFixture2 = TestBed.createComponent(
      MenuInternalLinkComponent
    );
    const internalLinkComponent2 = internalLinkFixture2.componentInstance;
    internalLinkComponent2.id = "secondary-tooltip-0";
    internalLinkComponent2.link = internalLink2Obj;
    internalLinkComponent2.placement = "right";
    internalLinkComponent2.tooltip = "tooltip";
    internalLinkFixture2.detectChanges();

    const links = fixture.debugElement.nativeElement.querySelectorAll(
      "app-menu-internal-link"
    );
    expect(links.length).toBe(2, "Should be two internal links");

    const internalLink1 = internalLinkFixture1.debugElement.nativeElement;
    const internalLink2 = internalLinkFixture2.debugElement.nativeElement;

    expect(links[0].innerHTML).toEqual(
      internalLink2.innerHTML,
      "First internal link HTML should match"
    );
    expect(links[1].innerHTML).toEqual(
      internalLink1.innerHTML,
      "Second internal link HTML should match"
    );
  });

  it("should order sub-links on secondary menu", () => {
    const internalLink2Obj = MenuRoute({
      label: "label b",
      icon: ["fas", "home"],
      tooltip: () => "tooltip",
      route: StrongRoute.Base.add("house"),
      order: 1
    });
    const internalLink1Obj = MenuRoute({
      label: "label a",
      icon: ["fas", "home"],
      tooltip: () => "tooltip",
      route: StrongRoute.Base.add("home"),
      parent: internalLink2Obj,
      order: 1
    });

    component.menuType = "secondary";
    component.links = List<AnyMenuItem>([internalLink1Obj, internalLink2Obj]);
    fixture.detectChanges();

    const internalLinkFixture1 = TestBed.createComponent(
      MenuInternalLinkComponent
    );
    const internalLinkComponent1 = internalLinkFixture1.componentInstance;
    internalLinkComponent1.id = "secondary-tooltip-1";
    internalLinkComponent1.link = internalLink1Obj;
    internalLinkComponent1.placement = "right";
    internalLinkComponent1.tooltip = "tooltip";
    internalLinkFixture1.detectChanges();

    const internalLinkFixture2 = TestBed.createComponent(
      MenuInternalLinkComponent
    );
    const internalLinkComponent2 = internalLinkFixture2.componentInstance;
    internalLinkComponent2.id = "secondary-tooltip-0";
    internalLinkComponent2.link = internalLink2Obj;
    internalLinkComponent2.placement = "right";
    internalLinkComponent2.tooltip = "tooltip";
    internalLinkFixture2.detectChanges();

    const links = fixture.debugElement.nativeElement.querySelectorAll(
      "app-menu-internal-link"
    );
    expect(links.length).toBe(2, "Should be two internal links");

    const internalLink1 = internalLinkFixture1.debugElement.nativeElement;
    const internalLink2 = internalLinkFixture2.debugElement.nativeElement;

    expect(links[0].innerHTML).toEqual(
      internalLink2.innerHTML,
      "First internal link HTML should match"
    );
    expect(links[1].innerHTML).toEqual(
      internalLink1.innerHTML,
      "Second internal link HTML should match"
    );
  });

  it("should filter duplicate link labels on action menu", () => {
    component.menuType = "action";
    component.links = List<AnyMenuItem>([
      MenuRoute({
        label: "label a",
        icon: ["fas", "home"],
        tooltip: () => "tooltip",
        route: StrongRoute.Base.add("home"),
        order: 1
      }),
      MenuRoute({
        label: "label a",
        icon: ["fas", "home"],
        tooltip: () => "tooltip",
        route: StrongRoute.Base.add("house"),
        order: 2
      })
    ]);
    fixture.detectChanges();

    const internalLinkFixture1 = TestBed.createComponent(
      MenuInternalLinkComponent
    );
    const internalLinkComponent1 = internalLinkFixture1.componentInstance;
    internalLinkComponent1.id = "action-tooltip-0";
    internalLinkComponent1.link = MenuRoute({
      label: "label a",
      icon: ["fas", "home"],
      tooltip: () => "tooltip",
      route: StrongRoute.Base.add("home"),
      order: 1
    });
    internalLinkComponent1.placement = "left";
    internalLinkComponent1.tooltip = "tooltip";
    internalLinkFixture1.detectChanges();

    const links = fixture.debugElement.nativeElement.querySelectorAll(
      "app-menu-internal-link"
    );
    expect(links.length).toBe(1, "Should be only one internal links");

    const internalLink1 = internalLinkFixture1.debugElement.nativeElement;
    expect(links[0].innerHTML).toEqual(
      internalLink1.innerHTML,
      "First internal link HTML should match"
    );
  });

  it("should filter duplicate link labels on secondary menu", () => {
    component.menuType = "secondary";
    component.links = List<AnyMenuItem>([
      MenuRoute({
        label: "label a",
        icon: ["fas", "home"],
        tooltip: () => "tooltip",
        route: StrongRoute.Base.add("home"),
        order: 1
      }),
      MenuRoute({
        label: "label a",
        icon: ["fas", "home"],
        tooltip: () => "tooltip",
        route: StrongRoute.Base.add("house"),
        order: 2
      })
    ]);
    fixture.detectChanges();

    const internalLinkFixture1 = TestBed.createComponent(
      MenuInternalLinkComponent
    );
    const internalLinkComponent1 = internalLinkFixture1.componentInstance;
    internalLinkComponent1.id = "secondary-tooltip-0";
    internalLinkComponent1.link = MenuRoute({
      label: "label a",
      icon: ["fas", "home"],
      tooltip: () => "tooltip",
      route: StrongRoute.Base.add("home"),
      order: 1
    });
    internalLinkComponent1.placement = "right";
    internalLinkComponent1.tooltip = "tooltip";
    internalLinkFixture1.detectChanges();

    const links = fixture.debugElement.nativeElement.querySelectorAll(
      "app-menu-internal-link"
    );
    expect(links.length).toBe(1, "Should be only one internal links");

    const internalLink1 = internalLinkFixture1.debugElement.nativeElement;
    expect(links[0].innerHTML).toEqual(
      internalLink1.innerHTML,
      "First internal link HTML should match"
    );
  });

  it("should filter links with failing predicate on action menu", () => {
    component.menuType = "action";
    component.links = List<AnyMenuItem>([
      MenuRoute({
        label: "label a",
        icon: ["fas", "home"],
        tooltip: () => "tooltip",
        route: StrongRoute.Base.add("home"),
        order: 1
      }),
      MenuRoute({
        label: "label b",
        icon: ["fas", "home"],
        tooltip: () => "tooltip",
        route: StrongRoute.Base.add("house"),
        order: 2,
        predicate: () => false
      })
    ]);
    fixture.detectChanges();

    const internalLinkFixture1 = TestBed.createComponent(
      MenuInternalLinkComponent
    );
    const internalLinkComponent1 = internalLinkFixture1.componentInstance;
    internalLinkComponent1.id = "action-tooltip-0";
    internalLinkComponent1.link = MenuRoute({
      label: "label a",
      icon: ["fas", "home"],
      tooltip: () => "tooltip",
      route: StrongRoute.Base.add("home"),
      order: 1
    });
    internalLinkComponent1.placement = "left";
    internalLinkComponent1.tooltip = "tooltip";
    internalLinkFixture1.detectChanges();

    const links = fixture.debugElement.nativeElement.querySelectorAll(
      "app-menu-internal-link"
    );
    expect(links.length).toBe(1, "Should be only one internal links");

    const internalLink1 = internalLinkFixture1.debugElement.nativeElement;
    expect(links[0].innerHTML).toEqual(
      internalLink1.innerHTML,
      "First internal link HTML should match"
    );
  });

  it("should filter links with failing predicate on secondary menu", () => {
    component.menuType = "secondary";
    component.links = List<AnyMenuItem>([
      MenuRoute({
        label: "label a",
        icon: ["fas", "home"],
        tooltip: () => "tooltip",
        route: StrongRoute.Base.add("home"),
        order: 1
      }),
      MenuRoute({
        label: "label b",
        icon: ["fas", "home"],
        tooltip: () => "tooltip",
        route: StrongRoute.Base.add("house"),
        order: 2,
        predicate: () => false
      })
    ]);
    fixture.detectChanges();

    const internalLinkFixture1 = TestBed.createComponent(
      MenuInternalLinkComponent
    );
    const internalLinkComponent1 = internalLinkFixture1.componentInstance;
    internalLinkComponent1.id = "secondary-tooltip-0";
    internalLinkComponent1.link = MenuRoute({
      label: "label a",
      icon: ["fas", "home"],
      tooltip: () => "tooltip",
      route: StrongRoute.Base.add("home"),
      order: 1
    });
    internalLinkComponent1.placement = "right";
    internalLinkComponent1.tooltip = "tooltip";
    internalLinkFixture1.detectChanges();

    const links = fixture.debugElement.nativeElement.querySelectorAll(
      "app-menu-internal-link"
    );
    expect(links.length).toBe(1, "Should be only one internal links");

    const internalLink1 = internalLinkFixture1.debugElement.nativeElement;
    expect(links[0].innerHTML).toEqual(
      internalLink1.innerHTML,
      "First internal link HTML should match"
    );
  });

  it("filter should not provide user details on action menu", () => {
    const api: BawApiService = TestBed.get(BawApiService);
    spyOn(api, "getSessionUser").and.callFake(() => null);

    component.menuType = "action";
    component.links = List<AnyMenuItem>([
      MenuRoute({
        label: "label a",
        icon: ["fas", "home"],
        tooltip: () => "tooltip",
        route: StrongRoute.Base.add("home"),
        order: 1
      }),
      MenuRoute({
        label: "label b",
        icon: ["fas", "home"],
        tooltip: () => "tooltip",
        route: StrongRoute.Base.add("house"),
        order: 2,
        predicate: user => {
          expect(user).toBeFalsy();
          return !user;
        }
      })
    ]);
    fixture.detectChanges();

    const links = fixture.debugElement.nativeElement.querySelectorAll(
      "app-menu-internal-link"
    );
    expect(links.length).toBe(2, "Should be two internal links");
  });

  it("filter should not provide user details on secondary menu", () => {
    const api: BawApiService = TestBed.get(BawApiService);
    spyOn(api, "getSessionUser").and.callFake(() => null);

    component.menuType = "secondary";
    component.links = List<AnyMenuItem>([
      MenuRoute({
        label: "label a",
        icon: ["fas", "home"],
        tooltip: () => "tooltip",
        route: StrongRoute.Base.add("home"),
        order: 1
      }),
      MenuRoute({
        label: "label b",
        icon: ["fas", "home"],
        tooltip: () => "tooltip",
        route: StrongRoute.Base.add("house"),
        order: 2,
        predicate: user => {
          expect(user).toBeFalsy();
          return !user;
        }
      })
    ]);
    fixture.detectChanges();

    const links = fixture.debugElement.nativeElement.querySelectorAll(
      "app-menu-internal-link"
    );
    expect(links.length).toBe(2, "Should be two internal links");
  });

  it("filter should provide user details when logged in", () => {
    const api: BawApiService = TestBed.get(BawApiService);
    spyOn(api, "getSessionUser").and.callFake(
      () =>
        new SessionUser({
          authToken: "xxxxxxxxxxxxxxxxxxxx",
          userName: "username"
        })
    );

    component.menuType = "action";
    component.links = List<AnyMenuItem>([
      MenuRoute({
        label: "label a",
        icon: ["fas", "home"],
        tooltip: () => "tooltip",
        route: StrongRoute.Base.add("home"),
        order: 1
      }),
      MenuRoute({
        label: "label b",
        icon: ["fas", "home"],
        tooltip: () => "tooltip",
        route: StrongRoute.Base.add("house"),
        order: 2,
        predicate: user => {
          expect(user).toBeTruthy();
          expect(user.authToken).toBe("xxxxxxxxxxxxxxxxxxxx");
          expect(user.userName).toBe("username");
          return (
            user.authToken === "xxxxxxxxxxxxxxxxxxxx" &&
            user.userName === "username"
          );
        }
      })
    ]);
    fixture.detectChanges();

    const links = fixture.debugElement.nativeElement.querySelectorAll(
      "app-menu-internal-link"
    );
    expect(links.length).toBe(2, "Should be two internal links");
  });

  it("should handle internal link action menu", () => {
    component.menuType = "action";
    component.links = List<AnyMenuItem>([
      MenuRoute({
        label: "label",
        icon: ["fas", "home"],
        tooltip: () => "tooltip",
        route: StrongRoute.Base.add("home")
      })
    ]);
    fixture.detectChanges();

    const internalLinkFixture = TestBed.createComponent(
      MenuInternalLinkComponent
    );
    const internalLinkComponent = internalLinkFixture.componentInstance;
    internalLinkComponent.id = "action-tooltip-0";
    internalLinkComponent.link = MenuRoute({
      label: "label",
      icon: ["fas", "home"],
      tooltip: () => "tooltip",
      route: StrongRoute.Base.add("home")
    });
    internalLinkComponent.placement = "left";
    internalLinkComponent.tooltip = "tooltip";
    internalLinkFixture.detectChanges();

    const link = fixture.debugElement.nativeElement.querySelectorAll(
      "app-menu-internal-link"
    )[0];
    const internalLink = internalLinkFixture.debugElement.nativeElement;
    expect(link.innerHTML).toEqual(
      internalLink.innerHTML,
      "Internal link HTML should match"
    );
  });

  it("should handle internal link secondary menu", () => {
    component.menuType = "secondary";
    component.links = List<AnyMenuItem>([
      MenuRoute({
        label: "label",
        icon: ["fas", "home"],
        tooltip: () => "tooltip",
        route: StrongRoute.Base.add("home")
      })
    ]);
    fixture.detectChanges();

    const internalLinkFixture = TestBed.createComponent(
      MenuInternalLinkComponent
    );
    const internalLinkComponent = internalLinkFixture.componentInstance;
    internalLinkComponent.id = "secondary-tooltip-0";
    internalLinkComponent.link = MenuRoute({
      label: "label",
      icon: ["fas", "home"],
      tooltip: () => "tooltip",
      route: StrongRoute.Base.add("home")
    });
    internalLinkComponent.placement = "right";
    internalLinkComponent.tooltip = "tooltip";
    internalLinkFixture.detectChanges();

    const link = fixture.debugElement.nativeElement.querySelectorAll(
      "app-menu-internal-link"
    )[0];
    const internalLink = internalLinkFixture.debugElement.nativeElement;

    expect(link.innerHTML).toEqual(
      internalLink.innerHTML,
      "Internal link HTML should match"
    );
  });

  it("should handle external link action menu", () => {
    component.menuType = "action";
    component.links = List<AnyMenuItem>([
      MenuLink({
        label: "label",
        icon: ["fas", "home"],
        tooltip: () => "tooltip",
        uri: "http://brokenlink/"
      })
    ]);
    fixture.detectChanges();

    const externalLinkFixture = TestBed.createComponent(
      MenuExternalLinkComponent
    );
    const externalLinkComponent = externalLinkFixture.componentInstance;
    externalLinkComponent.id = "action-tooltip-0";
    externalLinkComponent.link = MenuLink({
      label: "label",
      icon: ["fas", "home"],
      tooltip: () => "tooltip",
      uri: "http://brokenlink/"
    });
    externalLinkComponent.placement = "left";
    externalLinkComponent.tooltip = "tooltip";
    externalLinkFixture.detectChanges();

    const link = fixture.debugElement.nativeElement.querySelectorAll(
      "app-menu-external-link"
    )[0];
    const internalLink = externalLinkFixture.debugElement.nativeElement;
    expect(link.innerHTML).toEqual(
      internalLink.innerHTML,
      "Internal link HTML should match"
    );
  });

  it("should handle external link secondary menu", () => {
    component.menuType = "secondary";
    component.links = List<AnyMenuItem>([
      MenuLink({
        label: "label",
        icon: ["fas", "home"],
        tooltip: () => "tooltip",
        uri: "http://brokenlink/"
      })
    ]);
    fixture.detectChanges();

    const externalLinkFixture = TestBed.createComponent(
      MenuExternalLinkComponent
    );
    const externalLinkComponent = externalLinkFixture.componentInstance;
    externalLinkComponent.id = "secondary-tooltip-0";
    externalLinkComponent.link = MenuLink({
      label: "label",
      icon: ["fas", "home"],
      tooltip: () => "tooltip",
      uri: "http://brokenlink/"
    });
    externalLinkComponent.placement = "right";
    externalLinkComponent.tooltip = "tooltip";
    externalLinkFixture.detectChanges();

    const link = fixture.debugElement.nativeElement.querySelectorAll(
      "app-menu-external-link"
    )[0];
    const internalLink = externalLinkFixture.debugElement.nativeElement;
    expect(link.innerHTML).toEqual(
      internalLink.innerHTML,
      "Internal link HTML should match"
    );
  });

  it("should create action button action menu", () => {
    component.menuType = "action";
    component.links = List<AnyMenuItem>([
      MenuAction({
        label: "label",
        icon: ["fas", "home"],
        tooltip: () => "tooltip",
        action: () => {}
      })
    ]);
    fixture.detectChanges();

    const buttonFixture = TestBed.createComponent(MenuButtonComponent);
    const buttonComponent = buttonFixture.componentInstance;
    buttonComponent.id = "action-tooltip-0";
    buttonComponent.link = MenuAction({
      label: "label",
      icon: ["fas", "home"],
      tooltip: () => "tooltip",
      action: () => {}
    });
    buttonComponent.placement = "left";
    buttonComponent.tooltip = "tooltip";
    buttonFixture.detectChanges();

    const link = fixture.debugElement.nativeElement.querySelectorAll(
      "app-menu-button"
    )[0];
    const button = buttonFixture.debugElement.nativeElement;
    expect(link.innerHTML).toEqual(
      button.innerHTML,
      "Button HTML should match"
    );
  });

  it("should create action button secondary menu", () => {
    component.menuType = "secondary";
    component.links = List<AnyMenuItem>([
      MenuAction({
        label: "label",
        icon: ["fas", "home"],
        tooltip: () => "tooltip",
        action: () => {}
      })
    ]);
    fixture.detectChanges();

    const buttonFixture = TestBed.createComponent(MenuButtonComponent);
    const buttonComponent = buttonFixture.componentInstance;
    buttonComponent.id = "secondary-tooltip-0";
    buttonComponent.link = MenuAction({
      label: "label",
      icon: ["fas", "home"],
      tooltip: () => "tooltip",
      action: () => {}
    });
    buttonComponent.placement = "right";
    buttonComponent.tooltip = "tooltip";
    buttonFixture.detectChanges();

    const link = fixture.debugElement.nativeElement.querySelectorAll(
      "app-menu-button"
    )[0];
    const button = buttonFixture.debugElement.nativeElement;
    expect(link.innerHTML).toEqual(
      button.innerHTML,
      "Button HTML should match"
    );
  });

  xit("should not create widget when none provided", () => {});
  xit("should create widget when provided", () => {});
});

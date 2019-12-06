import { HttpClientModule } from "@angular/common/http";
import { ComponentFixture, fakeAsync, TestBed } from "@angular/core/testing";
import { Params, Router } from "@angular/router";
import { RouterTestingModule } from "@angular/router/testing";
import { List } from "immutable";
import { Observable } from "rxjs";
import {
  AnyMenuItem,
  MenuAction,
  MenuLink,
  MenuRoute
} from "src/app/interfaces/menusInterfaces";
import { StrongRoute } from "src/app/interfaces/strongRoute";
import { SharedModule } from "../shared.module";
import { MenuButtonComponent } from "./button/button.component";
import { MenuExternalLinkComponent } from "./external-link/external-link.component";
import { MenuInternalLinkComponent } from "./internal-link/internal-link.component";
import { MenuComponent } from "./menu.component";

describe("MenuComponent", () => {
  let router: Router;
  let component: MenuComponent;
  let fixture: ComponentFixture<MenuComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        SharedModule,
        HttpClientModule,
        RouterTestingModule.withRoutes([
          { path: "", component: MenuComponent, pathMatch: "full" },
          {
            path: "home",
            component: MenuComponent,
            children: [{ path: ":attribute", component: MenuComponent }]
          }
        ])
      ],
      declarations: [
        MenuComponent,
        MenuButtonComponent,
        MenuExternalLinkComponent,
        MenuInternalLinkComponent
      ],
      providers: []
    }).compileComponents();

    router = TestBed.get(Router);
    fixture = TestBed.createComponent(MenuComponent);
    component = fixture.componentInstance;
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

  xit("should create no links", () => {
    component.links = List<AnyMenuItem>([]);
    fixture.detectChanges();

    // TODO Check that menu looks normal
  });

  it("should create internal link", () => {
    component.menuType = "action";
    component.links = List<AnyMenuItem>([
      {
        kind: "MenuRoute",
        label: "label",
        icon: ["fas", "home"],
        tooltip: () => "tooltip",
        route: StrongRoute.Base.add("home")
      } as MenuRoute
    ]);
    fixture.detectChanges();

    const internalLinkFixture = TestBed.createComponent(
      MenuInternalLinkComponent
    );
    const internalLinkComponent = internalLinkFixture.componentInstance;
    internalLinkComponent.id = "action-tooltip-0";
    internalLinkComponent.link = {
      kind: "MenuRoute",
      label: "label",
      icon: ["fas", "home"],
      tooltip: () => "tooltip",
      route: StrongRoute.Base.add("home")
    } as MenuRoute;
    internalLinkComponent.placement = "left";
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

  it("should create multiple internal links", () => {
    const internalLink1Obj = {
      kind: "MenuRoute",
      label: "label 1",
      icon: ["fas", "home"],
      tooltip: () => "tooltip",
      route: StrongRoute.Base.add("home")
    } as MenuRoute;
    const internalLink2Obj = {
      kind: "MenuRoute",
      label: "label 2",
      icon: ["fas", "home"],
      tooltip: () => "tooltip",
      route: StrongRoute.Base.add("house")
    } as MenuRoute;

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
    internalLinkFixture1.detectChanges();

    const internalLinkFixture2 = TestBed.createComponent(
      MenuInternalLinkComponent
    );
    const internalLinkComponent2 = internalLinkFixture2.componentInstance;
    internalLinkComponent2.id = "action-tooltip-1";
    internalLinkComponent2.link = internalLink2Obj;
    internalLinkComponent2.placement = "left";
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
      {
        kind: "MenuLink",
        label: "label",
        icon: ["fas", "home"],
        tooltip: () => "tooltip",
        uri: "http://brokenlink/"
      } as MenuLink
    ]);
    fixture.detectChanges();

    const externalLinkFixture = TestBed.createComponent(
      MenuExternalLinkComponent
    );
    const externalLinkComponent = externalLinkFixture.componentInstance;
    externalLinkComponent.id = "action-tooltip-0";
    externalLinkComponent.link = {
      kind: "MenuLink",
      label: "label",
      icon: ["fas", "home"],
      tooltip: () => "tooltip",
      uri: "http://brokenlink/"
    } as MenuLink;
    externalLinkComponent.placement = "left";
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

  it("should create multiple external links", () => {
    const externalLink1Obj = {
      kind: "MenuLink",
      label: "label 1",
      icon: ["fas", "home"],
      tooltip: () => "tooltip",
      uri: "http://brokenlink/"
    } as MenuLink;
    const externalLink2Obj = {
      kind: "MenuLink",
      label: "label 2",
      icon: ["fas", "home"],
      tooltip: () => "tooltip",
      uri: "http://brokenlink/"
    } as MenuLink;

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
    externalLinkFixture1.detectChanges();

    const externalLinkFixture2 = TestBed.createComponent(
      MenuExternalLinkComponent
    );
    const externalLinkComponent2 = externalLinkFixture2.componentInstance;
    externalLinkComponent2.id = "action-tooltip-1";
    externalLinkComponent2.link = externalLink2Obj;
    externalLinkComponent2.placement = "left";
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
      {
        kind: "MenuAction",
        label: "label",
        icon: ["fas", "home"],
        tooltip: () => "tooltip",
        action: () => {}
      } as MenuAction
    ]);
    fixture.detectChanges();

    const buttonFixture = TestBed.createComponent(MenuButtonComponent);
    const buttonComponent = buttonFixture.componentInstance;
    buttonComponent.id = "action-tooltip-0";
    buttonComponent.link = {
      kind: "MenuAction",
      label: "label",
      icon: ["fas", "home"],
      tooltip: () => "tooltip",
      action: () => {}
    } as MenuAction;
    buttonComponent.placement = "left";
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

  it("should create multiple action buttons", () => {
    const button1Obj = {
      kind: "MenuAction",
      label: "label 1",
      icon: ["fas", "home"],
      tooltip: () => "tooltip",
      action: () => {}
    } as MenuAction;
    const button2Obj = {
      kind: "MenuAction",
      label: "label 2",
      icon: ["fas", "home"],
      tooltip: () => "tooltip",
      action: () => {}
    } as MenuAction;

    component.menuType = "action";
    component.links = List<AnyMenuItem>([button1Obj, button2Obj]);
    fixture.detectChanges();

    const buttonFixture1 = TestBed.createComponent(MenuButtonComponent);
    const buttonComponent1 = buttonFixture1.componentInstance;
    buttonComponent1.id = "action-tooltip-0";
    buttonComponent1.link = button1Obj;
    buttonComponent1.placement = "left";
    buttonFixture1.detectChanges();

    const buttonFixture2 = TestBed.createComponent(MenuButtonComponent);
    const buttonComponent2 = buttonFixture2.componentInstance;
    buttonComponent2.id = "action-tooltip-1";
    buttonComponent2.link = button2Obj;
    buttonComponent2.placement = "left";
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
    const buttonObj = {
      kind: "MenuAction",
      label: "label 1",
      icon: ["fas", "home"],
      tooltip: () => "tooltip",
      action: () => {}
    } as MenuAction;
    const externalLinkObj = {
      kind: "MenuLink",
      label: "label 2",
      icon: ["fas", "home"],
      tooltip: () => "tooltip",
      uri: "http://brokenlink/"
    } as MenuLink;
    const internalLinkObj = {
      kind: "MenuRoute",
      label: "label 3",
      icon: ["fas", "home"],
      tooltip: () => "tooltip",
      route: StrongRoute.Base.add("house")
    } as MenuRoute;

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
    buttonFixture.detectChanges();

    // Create test external link
    const externalLinkFixture = TestBed.createComponent(
      MenuExternalLinkComponent
    );
    const externalLinkComponent = externalLinkFixture.componentInstance;
    externalLinkComponent.id = "action-tooltip-1";
    externalLinkComponent.link = externalLinkObj;
    externalLinkComponent.placement = "left";
    externalLinkFixture.detectChanges();

    // Create test internal link
    const internalLinkFixture = TestBed.createComponent(
      MenuInternalLinkComponent
    );
    const internalLinkComponent = internalLinkFixture.componentInstance;
    internalLinkComponent.id = "action-tooltip-2";
    internalLinkComponent.link = internalLinkObj;
    internalLinkComponent.placement = "left";
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
      {
        kind: "MenuRoute",
        label: "label",
        icon: ["fas", "home"],
        tooltip: () => "tooltip",
        route
      } as MenuRoute
    ]);
    fixture.detectChanges();

    const internalLinkFixture = TestBed.createComponent(
      MenuInternalLinkComponent
    );
    const internalLinkComponent = internalLinkFixture.componentInstance;
    internalLinkComponent.id = "action-tooltip-0";
    internalLinkComponent.link = {
      kind: "MenuRoute",
      label: "label",
      icon: ["fas", "home"],
      tooltip: () => "tooltip",
      route
    } as MenuRoute;
    internalLinkComponent.placement = "left";
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

  // TODO Figure out how to trick router.params() function
  xit("should create internal link with router parameters", fakeAsync(() => {
    const base = StrongRoute.Base.add("home");
    const route = base.add(":attribute");
    const testRoute = StrongRoute.Base.add("home").add("10");

    const internalLinkFixture = TestBed.createComponent(
      MenuInternalLinkComponent
    );
    const internalLinkComponent = internalLinkFixture.componentInstance;
    internalLinkComponent.id = "action-tooltip-0";
    internalLinkComponent.link = {
      kind: "MenuRoute",
      label: "label",
      icon: ["fas", "home"],
      tooltip: () => "tooltip",
      route: testRoute
    } as MenuRoute;
    internalLinkComponent.placement = "left";
    internalLinkFixture.detectChanges();

    router.navigate(["home", "10"]).then(() => {
      component.menuType = "action";
      component.links = List<AnyMenuItem>([
        {
          kind: "MenuRoute",
          label: "label",
          icon: ["fas", "home"],
          tooltip: () => "tooltip",
          route
        } as MenuRoute
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
    });
  }));

  xit("should not create widget when none provided", () => {});
  xit("should create widget when provided", () => {});
  xit("should order links", () => {});
  xit("should order links with duplicate priority", () => {});
  xit("should order sub-links", () => {});
  xit("should filter duplicate links", () => {});
  xit("should filter links not matching authToken", () => {});
  xit("should filter links not matching username", () => {});
  xit("should handle setting tooltip for action menu", () => {});
  xit("should handle setting tooltip for secondary menu", () => {});
});

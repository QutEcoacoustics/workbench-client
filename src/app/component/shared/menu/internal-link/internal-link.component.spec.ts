import { ComponentFixture, TestBed } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";
import {
  assertIcon,
  assertRoute,
  assertTooltip
} from "src/app/helpers/tests/helpers";
import { MenuRoute } from "src/app/interfaces/menusInterfaces";
import { StrongRoute } from "src/app/interfaces/strongRoute";
import { SharedModule } from "../../shared.module";
import { MenuInternalLinkComponent } from "./internal-link.component";

describe("MenuInternalLinkComponent", () => {
  let component: MenuInternalLinkComponent;
  let fixture: ComponentFixture<MenuInternalLinkComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SharedModule, RouterTestingModule],
      declarations: [MenuInternalLinkComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(MenuInternalLinkComponent);
    component = fixture.componentInstance;
  });

  it("should create", () => {
    component.id = "id";
    component.link = MenuRoute({
      icon: ["fas", "home"],
      label: "home",
      route: StrongRoute.Base.add("home"),
      tooltip: () => "tooltip"
    });
    component.tooltip = "custom tooltip";
    component.route = "/home";
    component.placement = "left";
    fixture.detectChanges();

    expect(component).toBeTruthy();
  });

  it("should have icon", () => {
    component.id = "id";
    component.link = MenuRoute({
      icon: ["fas", "home"],
      label: "home",
      route: StrongRoute.Base.add("home"),
      tooltip: () => "tooltip"
    });
    component.tooltip = "custom tooltip";
    component.route = "/home";
    component.placement = "left";
    fixture.detectChanges();

    assertIcon(fixture.nativeElement, "fas,home");
  });

  it("should have label", () => {
    component.id = "id";
    component.link = MenuRoute({
      icon: ["fas", "home"],
      label: "custom label",
      route: StrongRoute.Base.add("home"),
      tooltip: () => "tooltip"
    });
    component.tooltip = "custom tooltip";
    component.route = "/home";
    component.placement = "left";
    fixture.detectChanges();

    // Expects label to be above disabled user tooltip
    const label = fixture.nativeElement.querySelector("#label");
    expect(label).toBeTruthy("Label element should contain id='label'");
    expect(label.innerText).toBe("custom label");
  });

  it("should have tooltip", () => {
    component.id = "id";
    component.link = MenuRoute({
      icon: ["fas", "home"],
      label: "home",
      route: StrongRoute.Base.add("home"),
      tooltip: () => "custom tooltip"
    });
    component.tooltip = "custom tooltip";
    component.route = "/home";
    component.placement = "left";
    fixture.detectChanges();

    const link = fixture.nativeElement.querySelector("a");
    assertTooltip(link, "custom tooltip");
  });

  it("should not use link tooltip", () => {
    component.id = "id";
    component.link = MenuRoute({
      icon: ["fas", "home"],
      label: "home",
      route: StrongRoute.Base.add("home"),
      tooltip: () => "tooltip"
    });
    component.tooltip = "custom tooltip";
    component.route = "/home";
    component.placement = "left";
    fixture.detectChanges();

    const link = fixture.nativeElement.querySelector("a");
    assertTooltip(link, "custom tooltip");
  });

  it("should handle left placement of tooltip", () => {
    component.id = "id";
    component.link = MenuRoute({
      icon: ["fas", "home"],
      label: "home",
      route: StrongRoute.Base.add("home"),
      tooltip: () => "tooltip"
    });
    component.tooltip = "custom tooltip";
    component.route = "/home";
    component.placement = "left";
    fixture.detectChanges();

    const link = fixture.nativeElement.querySelector("a");
    expect(link.attributes.getNamedItem("ng-reflect-placement")).toBeTruthy(
      "Anchor should have [placement] directive"
    );
    expect(link.attributes.getNamedItem("ng-reflect-placement").value).toBe(
      "left"
    );
  });

  it("should handle right placement of tooltip", () => {
    component.id = "id";
    component.link = MenuRoute({
      icon: ["fas", "home"],
      label: "home",
      route: StrongRoute.Base.add("home"),
      tooltip: () => "tooltip"
    });
    component.tooltip = "custom tooltip";
    component.route = "/home";
    component.placement = "right";
    fixture.detectChanges();

    const link = fixture.nativeElement.querySelector("a");
    expect(link.attributes.getNamedItem("ng-reflect-placement")).toBeTruthy(
      "Anchor should have [placement] directive"
    );
    expect(link.attributes.getNamedItem("ng-reflect-placement").value).toBe(
      "right"
    );
  });

  it("should create routerLink", () => {
    component.id = "id";
    component.link = MenuRoute({
      icon: ["fas", "home"],
      label: "home",
      route: StrongRoute.Base.add("brokenlink"),
      tooltip: () => "tooltip"
    });
    component.tooltip = "custom tooltip";
    component.route = "/brokenlink";
    component.placement = "right";
    fixture.detectChanges();

    const link = fixture.nativeElement.querySelector("a");
    assertRoute(link, "/brokenlink");
  });

  it("should not use link route", () => {
    component.id = "id";
    component.link = MenuRoute({
      icon: ["fas", "home"],
      label: "home",
      route: StrongRoute.Base.add("home"),
      tooltip: () => "tooltip"
    });
    component.tooltip = "custom tooltip";
    component.route = "/house";
    component.placement = "left";
    fixture.detectChanges();

    const link = fixture.nativeElement.querySelector("a");
    assertRoute(link, "/house");
  });

  it("should not highlight link when not active", () => {
    component.id = "id";
    component.link = MenuRoute({
      icon: ["fas", "home"],
      label: "home",
      route: StrongRoute.Base.add("brokenlink"),
      tooltip: () => "tooltip"
    });
    component.tooltip = "custom tooltip";
    component.route = "/brokenlink";
    component.placement = "right";
    fixture.detectChanges();

    const link = fixture.nativeElement.querySelector("a.active");
    expect(link).toBeFalsy();
  });

  it("should highlight link when active", () => {
    component.id = "id";
    component.link = MenuRoute({
      icon: ["fas", "home"],
      label: "home",
      route: StrongRoute.Base.add("context.html"), // This is the window.location.pathname of unit tests
      tooltip: () => "tooltip"
    });
    component.tooltip = "custom tooltip";
    component.route = "/context.html";
    component.placement = "right";
    fixture.detectChanges();

    const link = fixture.nativeElement.querySelector("a.active");
    expect(link).toBeTruthy();
  });
});

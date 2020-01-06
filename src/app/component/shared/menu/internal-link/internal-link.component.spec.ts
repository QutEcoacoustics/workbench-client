import { ComponentFixture, TestBed } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";
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
    component.linkParams = {};
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
    component.linkParams = {};
    component.placement = "left";
    fixture.detectChanges();

    const icon = fixture.debugElement.nativeElement.querySelector("fa-icon");

    expect(icon).toBeTruthy("Should contain <fa-icon> element");
    expect(icon.attributes.getNamedItem("ng-reflect-icon-prop")).toBeTruthy();
    expect(icon.attributes.getNamedItem("ng-reflect-icon-prop").value).toBe(
      "fas,home"
    );
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
    component.linkParams = {};
    component.placement = "left";
    fixture.detectChanges();

    // Expects label to be above disabled user tooltip
    const label = fixture.debugElement.nativeElement.querySelector("#label");
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
    component.linkParams = {};
    component.placement = "left";
    fixture.detectChanges();

    const link = fixture.debugElement.nativeElement.querySelector("a");

    expect(link).toBeTruthy("Anchor should have [ngbTooltip] directive");
    expect(link.attributes.getNamedItem("ng-reflect-ngb-tooltip")).toBeTruthy();
    expect(link.attributes.getNamedItem("ng-reflect-ngb-tooltip").value).toBe(
      "custom tooltip"
    );
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
    component.linkParams = {};
    component.placement = "left";
    fixture.detectChanges();

    const link = fixture.debugElement.nativeElement.querySelector("a");

    expect(link).toBeTruthy("Anchor should have [ngbTooltip] directive");
    expect(link.attributes.getNamedItem("ng-reflect-ngb-tooltip")).toBeTruthy();
    expect(link.attributes.getNamedItem("ng-reflect-ngb-tooltip").value).toBe(
      "custom tooltip"
    );
  });

  it("should have id for disabled access tooltip", () => {
    component.id = "id1000";
    component.link = MenuRoute({
      icon: ["fas", "home"],
      label: "home",
      route: StrongRoute.Base.add("home"),
      tooltip: () => "tooltip"
    });
    component.tooltip = "custom tooltip";
    component.linkParams = {};
    component.placement = "left";
    fixture.detectChanges();

    const tooltip = fixture.debugElement.nativeElement.querySelector(
      "span.d-none"
    );
    expect(tooltip).toBeTruthy("Tooltip should exist");
    expect(tooltip.id).toBe("id1000");
  });

  it("should have disabled access tooltip", () => {
    component.id = "id";
    component.link = MenuRoute({
      icon: ["fas", "home"],
      label: "home",
      route: StrongRoute.Base.add("home"),
      tooltip: () => "custom tooltip"
    });
    component.tooltip = "custom tooltip";
    component.linkParams = {};
    component.placement = "left";
    fixture.detectChanges();

    const tooltip = fixture.debugElement.nativeElement.querySelector(
      "span.d-none"
    );

    expect(tooltip).toBeTruthy("Tooltip should exist");
    expect(tooltip.innerText.trim()).toBe("custom tooltip");
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
    component.linkParams = {};
    component.placement = "left";
    fixture.detectChanges();

    const link = fixture.debugElement.nativeElement.querySelector("a");
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
    component.linkParams = {};
    component.placement = "right";
    fixture.detectChanges();

    const link = fixture.debugElement.nativeElement.querySelector("a");
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
    component.linkParams = {};
    component.placement = "right";
    fixture.detectChanges();

    const link = fixture.debugElement.nativeElement.querySelector("a");
    expect(link.attributes.getNamedItem("ng-reflect-router-link")).toBeTruthy();
    expect(link.attributes.getNamedItem("ng-reflect-router-link").value).toBe(
      "/brokenlink"
    );
  });

  it("should create routerLink with attributes", () => {
    const baseRoute = StrongRoute.Base.add("brokenlink");

    component.id = "id";
    component.link = MenuRoute({
      icon: ["fas", "home"],
      label: "home",
      route: baseRoute.add(":attribute"),
      tooltip: () => "tooltip"
    });
    component.tooltip = "custom tooltip";
    component.linkParams = { attribute: "10" };
    component.placement = "right";
    fixture.detectChanges();

    const link = fixture.debugElement.nativeElement.querySelector("a");
    expect(link.attributes.getNamedItem("ng-reflect-router-link")).toBeTruthy();
    expect(link.attributes.getNamedItem("ng-reflect-router-link").value).toBe(
      "/brokenlink/10"
    );
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
    component.linkParams = {};
    component.placement = "right";
    fixture.detectChanges();

    const link = fixture.debugElement.nativeElement.querySelector("a.active");
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
    component.linkParams = {};
    component.placement = "right";
    fixture.detectChanges();

    const link = fixture.debugElement.nativeElement.querySelector("a.active");
    expect(link).toBeTruthy();
  });
});

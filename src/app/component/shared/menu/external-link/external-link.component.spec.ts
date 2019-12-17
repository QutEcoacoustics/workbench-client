import { ComponentFixture, TestBed } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { testAppInitializer } from "src/app/app.helper";
import { SharedModule } from "../../shared.module";
import { MenuExternalLinkComponent } from "./external-link.component";

describe("MenuExternalLinkComponent", () => {
  let component: MenuExternalLinkComponent;
  let fixture: ComponentFixture<MenuExternalLinkComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, SharedModule],
      declarations: [MenuExternalLinkComponent],
      providers: [...testAppInitializer]
    }).compileComponents();

    fixture = TestBed.createComponent(MenuExternalLinkComponent);
    component = fixture.componentInstance;
  });

  it("should create", () => {
    component.id = "id";
    component.link = {
      kind: "MenuLink",
      icon: ["fas", "home"],
      label: "home",
      uri: "http://link/",
      tooltip: () => "custom tooltip"
    };
    component.tooltip = "custom tooltip";
    component.placement = "left";
    fixture.detectChanges();

    expect(component).toBeTruthy();
  });

  it("should have icon", () => {
    component.id = "id";
    component.link = {
      kind: "MenuLink",
      icon: ["fas", "home"],
      label: "home",
      uri: "http://link/",
      tooltip: () => "custom tooltip"
    };
    component.tooltip = "custom tooltip";
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
    component.link = {
      kind: "MenuLink",
      icon: ["fas", "home"],
      label: "custom label",
      uri: "http://link/",
      tooltip: () => "custom tooltip"
    };
    component.tooltip = "custom tooltip";
    component.placement = "left";
    fixture.detectChanges();

    // Expects label to be above disabled user tooltip
    const label = fixture.debugElement.nativeElement.querySelector("#label");
    expect(label).toBeTruthy("Label element should contain id='label'");
    expect(label.innerText).toBe("custom label");
  });

  it("should have tooltip", () => {
    component.id = "id";
    component.link = {
      kind: "MenuLink",
      icon: ["fas", "home"],
      label: "home",
      uri: "http://link/",
      tooltip: () => "custom tooltip"
    };
    component.tooltip = "custom tooltip";
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
    component.link = {
      kind: "MenuLink",
      icon: ["fas", "home"],
      label: "home",
      uri: "http://link/",
      tooltip: () => "tooltip"
    };
    component.tooltip = "custom tooltip";
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
    component.link = {
      kind: "MenuLink",
      icon: ["fas", "home"],
      label: "home",
      uri: "http://link/",
      tooltip: () => "tooltip"
    };
    component.tooltip = "custom tooltip";
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
    component.link = {
      kind: "MenuLink",
      icon: ["fas", "home"],
      label: "home",
      uri: "http://link/",
      tooltip: () => "tooltip"
    };
    component.tooltip = "custom tooltip";
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
    component.link = {
      kind: "MenuLink",
      icon: ["fas", "home"],
      label: "home",
      uri: "http://link/",
      tooltip: () => "custom tooltip"
    };
    component.tooltip = "custom tooltip";
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
    component.link = {
      kind: "MenuLink",
      icon: ["fas", "home"],
      label: "home",
      uri: "http://link/",
      tooltip: () => "custom tooltip"
    };
    component.tooltip = "custom tooltip";
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

  it("should link to external website", () => {
    component.id = "id";
    component.link = {
      kind: "MenuLink",
      icon: ["fas", "home"],
      label: "home",
      uri: "http://brokenlink/",
      tooltip: () => "custom tooltip"
    };
    component.tooltip = "custom tooltip";
    component.placement = "left";
    fixture.detectChanges();

    const link = fixture.debugElement.nativeElement.querySelector("a");
    expect(link).toBeTruthy();
    expect(link.href).toBe("http://brokenlink/");
  });

  it("should convert links to AngularJS server", () => {
    component.id = "id";
    component.link = {
      kind: "MenuLink",
      icon: ["fas", "home"],
      label: "home",
      uri: "/brokenlink/",
      tooltip: () => "custom tooltip"
    };
    component.tooltip = "custom tooltip";
    component.placement = "left";
    fixture.detectChanges();

    const link = fixture.debugElement.nativeElement.querySelector("a");
    expect(link).toBeTruthy();
    expect(link.href).toBe("http://apiroot/brokenlink/");
  });
});

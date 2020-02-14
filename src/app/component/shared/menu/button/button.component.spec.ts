import { ComponentFixture, TestBed } from "@angular/core/testing";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { MenuAction } from "src/app/interfaces/menusInterfaces";
import { SharedModule } from "../../shared.module";
import { MenuButtonComponent } from "./button.component";

describe("MenuButtonComponent", () => {
  let component: MenuButtonComponent;
  let fixture: ComponentFixture<MenuButtonComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SharedModule, NgbModule],
      declarations: [MenuButtonComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(MenuButtonComponent);
    component = fixture.componentInstance;
  });

  it("should create", () => {
    component.id = "id";
    component.link = MenuAction({
      action: () => console.log("action"),
      label: "home",
      icon: ["fas", "home"],
      tooltip: () => "custom tooltip"
    });
    component.tooltip = "custom tooltip";
    component.placement = "left";
    fixture.detectChanges();

    expect(component).toBeTruthy();
  });

  it("should have icon", () => {
    component.id = "id";
    component.link = MenuAction({
      action: () => console.log("action"),
      label: "home",
      icon: ["fas", "home"],
      tooltip: () => "custom tooltip"
    });
    component.tooltip = "custom tooltip";
    component.placement = "left";
    fixture.detectChanges();

    const icon = fixture.nativeElement.querySelector("fa-icon");

    expect(icon).toBeTruthy("Should contain <fa-icon> element");
    expect(icon.attributes.getNamedItem("ng-reflect-icon")).toBeTruthy();
    expect(icon.attributes.getNamedItem("ng-reflect-icon").value).toBe(
      "fas,home"
    );
  });

  it("should have label", () => {
    component.id = "id";
    component.link = MenuAction({
      action: () => console.log("action"),
      label: "custom label",
      icon: ["fas", "home"],
      tooltip: () => "custom tooltip"
    });
    component.tooltip = "custom tooltip";
    component.placement = "left";
    fixture.detectChanges();

    // Expects label to be above disabled user tooltip
    const label = fixture.nativeElement.querySelector("#label");
    expect(label).toBeTruthy("Label element should contain id='label'");
    expect(label.innerText).toBe("custom label");
  });

  it("should have tooltip", () => {
    component.id = "id";
    component.link = MenuAction({
      action: () => console.log("action"),
      label: "home",
      icon: ["fas", "home"],
      tooltip: () => "custom tooltip"
    });
    component.tooltip = "custom tooltip";
    component.placement = "left";
    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector("button");

    expect(button).toBeTruthy("Button should have [ngbTooltip] directive");
    expect(
      button.attributes.getNamedItem("ng-reflect-ngb-tooltip")
    ).toBeTruthy();
    expect(button.attributes.getNamedItem("ng-reflect-ngb-tooltip").value).toBe(
      "custom tooltip"
    );
  });

  it("should not use link tooltip", () => {
    component.id = "id";
    component.link = MenuAction({
      action: () => console.log("action"),
      label: "home",
      icon: ["fas", "home"],
      tooltip: () => "tooltip"
    });
    component.tooltip = "custom tooltip";
    component.placement = "left";
    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector("button");

    expect(button).toBeTruthy("Button should have [ngbTooltip] directive");
    expect(
      button.attributes.getNamedItem("ng-reflect-ngb-tooltip")
    ).toBeTruthy();
    expect(button.attributes.getNamedItem("ng-reflect-ngb-tooltip").value).toBe(
      "custom tooltip"
    );
  });

  it("should have id for disabled access tooltip", () => {
    component.id = "id1000";
    component.link = MenuAction({
      action: () => console.log("action"),
      label: "home",
      icon: ["fas", "home"],
      tooltip: () => "tooltip"
    });
    component.tooltip = "custom tooltip";
    component.placement = "left";
    fixture.detectChanges();

    const tooltip = fixture.nativeElement.querySelector("span.d-none");
    expect(tooltip).toBeTruthy("Tooltip should exist");
    expect(tooltip.id).toBe("id1000");
  });

  it("should have disabled access tooltip", () => {
    component.id = "id";
    component.link = MenuAction({
      action: () => console.log("action"),
      label: "home",
      icon: ["fas", "home"],
      tooltip: () => "tooltip"
    });
    component.tooltip = "custom tooltip";
    component.placement = "left";
    fixture.detectChanges();

    const tooltip = fixture.nativeElement.querySelector("span.d-none");

    expect(tooltip).toBeTruthy("Tooltip should exist");
    expect(tooltip.innerText.trim()).toBe("custom tooltip");
  });

  it("should handle left placement of tooltip", () => {
    component.id = "id";
    component.link = MenuAction({
      action: () => console.log("action"),
      label: "home",
      icon: ["fas", "home"],
      tooltip: () => "custom tooltip"
    });
    component.tooltip = "custom tooltip";
    component.placement = "left";
    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector("button");
    expect(button.attributes.getNamedItem("ng-reflect-placement")).toBeTruthy(
      "Button should have [placement] directive"
    );
    expect(button.attributes.getNamedItem("ng-reflect-placement").value).toBe(
      "left"
    );
  });

  it("should handle right placement of tooltip", () => {
    component.id = "id";
    component.link = MenuAction({
      action: () => console.log("action"),
      label: "home",
      icon: ["fas", "home"],
      tooltip: () => "custom tooltip"
    });
    component.tooltip = "custom tooltip";
    component.placement = "right";
    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector("button");
    expect(button.attributes.getNamedItem("ng-reflect-placement")).toBeTruthy(
      "Button should have [placement] directive"
    );
    expect(button.attributes.getNamedItem("ng-reflect-placement").value).toBe(
      "right"
    );
  });

  it("should execute action", () => {
    component.id = "id";
    component.link = MenuAction({
      action: jasmine.createSpy(),
      label: "home",
      icon: ["fas", "home"],
      tooltip: () => "custom tooltip"
    });
    component.tooltip = "custom tooltip";
    component.placement = "right";
    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector("button");
    button.click();
    expect(component.link.action).toHaveBeenCalled();
  });

  it("should not execute action without button press", () => {
    component.id = "id";
    component.link = MenuAction({
      action: jasmine.createSpy(),
      label: "home",
      icon: ["fas", "home"],
      tooltip: () => "custom tooltip"
    });
    component.tooltip = "custom tooltip";
    component.placement = "right";
    fixture.detectChanges();

    expect(component.link.action).not.toHaveBeenCalled();
  });
});

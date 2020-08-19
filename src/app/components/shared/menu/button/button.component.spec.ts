import { ComponentFixture, TestBed } from "@angular/core/testing";
import { MenuAction } from "@interfaces/menusInterfaces";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { assertAttribute, assertIcon, assertTooltip } from "@test/helpers/html";
import { SharedModule } from "../../shared.module";
import { MenuButtonComponent } from "./button.component";

describe("MenuButtonComponent", () => {
  let component: MenuButtonComponent;
  let fixture: ComponentFixture<MenuButtonComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SharedModule, NgbModule],
      declarations: [MenuButtonComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MenuButtonComponent);
    component = fixture.componentInstance;
  });

  function createButton() {
    component.id = "id";
    component.link = MenuAction({
      action: () => {},
      label: "home",
      icon: ["fas", "home"],
      tooltip: () => "tooltip",
    });
    component.tooltip = "tooltip";
    component.placement = "left";
  }

  function retrieveButton() {
    return fixture.nativeElement.querySelector("button");
  }

  it("should create", () => {
    createButton();
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it("should have icon", () => {
    createButton();
    component.link.icon = ["fas", "exclamation-triangle"];
    fixture.detectChanges();
    assertIcon(fixture.nativeElement, "fas,exclamation-triangle");
  });

  it("should have label", () => {
    createButton();
    component.link.label = "custom label";
    fixture.detectChanges();

    // Expects label to be declared before disabled user tooltip
    const label = fixture.nativeElement.querySelector("#label");
    expect(label).toBeTruthy("Label element should contain id='label'");
    expect(label.innerText).toBe("custom label");
  });

  it("should have tooltip", () => {
    createButton();
    component.link.tooltip = () => "custom tooltip";
    component.tooltip = "custom tooltip";
    fixture.detectChanges();

    assertTooltip(retrieveButton(), "custom tooltip");
  });

  it("should not use link tooltip", () => {
    createButton();
    component.link.tooltip = () => "wrong tooltip";
    component.tooltip = "custom tooltip";
    fixture.detectChanges();

    assertTooltip(retrieveButton(), "custom tooltip");
  });

  it("should handle left placement of tooltip", () => {
    createButton();
    component.placement = "left";
    fixture.detectChanges();

    assertAttribute(retrieveButton(), "placement", "left");
  });

  it("should handle right placement of tooltip", () => {
    createButton();
    component.placement = "right";
    fixture.detectChanges();

    assertAttribute(retrieveButton(), "placement", "right");
  });

  it("should execute action", () => {
    createButton();
    component.link.action = jasmine.createSpy();
    fixture.detectChanges();

    retrieveButton().click();
    expect(component.link.action).toHaveBeenCalled();
  });

  it("should not execute action without button press", () => {
    createButton();
    component.link.action = jasmine.createSpy();
    fixture.detectChanges();

    expect(component.link.action).not.toHaveBeenCalled();
  });
});

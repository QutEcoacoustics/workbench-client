import { Location } from "@angular/common";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { MenuRoute } from "@interfaces/menusInterfaces";
import { StrongRoute } from "@interfaces/strongRoute";
import {
  assertAttribute,
  assertIcon,
  assertRoute,
  assertTooltip,
} from "@test/helpers/html";
import { SharedModule } from "../../shared.module";
import { MenuInternalLinkComponent } from "./internal-link.component";

describe("MenuInternalLinkComponent", () => {
  let component: MenuInternalLinkComponent;
  let fixture: ComponentFixture<MenuInternalLinkComponent>;
  let location: Location;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SharedModule, RouterTestingModule],
      declarations: [MenuInternalLinkComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MenuInternalLinkComponent);
    location = TestBed.inject(Location);
    component = fixture.componentInstance;
  });

  function createLink() {
    component.id = "id";
    component.tooltip = "tooltip";
    component.route = "/home";
    component.placement = "left";
    component.link = MenuRoute({
      icon: ["fas", "home"],
      label: "home",
      route: StrongRoute.Base.add("home"),
      tooltip: () => "tooltip",
    });
  }

  function retrieveLink() {
    return fixture.nativeElement.querySelector("a");
  }

  it("should create", () => {
    createLink();
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it("should have icon", () => {
    createLink();
    component.link.icon = ["fas", "exclamation-triangle"];
    fixture.detectChanges();
    assertIcon(fixture.nativeElement, "fas,exclamation-triangle");
  });

  it("should have label", () => {
    createLink();
    component.link.label = "custom label";
    fixture.detectChanges();

    // Expects label to be above disabled user tooltip
    const label = fixture.nativeElement.querySelector("#label");
    expect(label).toBeTruthy("Label element should contain id='label'");
    expect(label.innerText).toBe("custom label");
  });

  it("should have tooltip", () => {
    createLink();
    component.link.tooltip = () => "custom tooltip";
    component.tooltip = "custom tooltip";
    fixture.detectChanges();

    assertTooltip(retrieveLink(), "custom tooltip");
  });

  it("should not use link tooltip", () => {
    createLink();
    component.link.tooltip = () => "wrong tooltip";
    component.tooltip = "custom tooltip";
    fixture.detectChanges();

    assertTooltip(retrieveLink(), "custom tooltip");
  });

  it("should handle left placement of tooltip", () => {
    createLink();
    component.placement = "left";
    fixture.detectChanges();

    assertAttribute(retrieveLink(), "placement", "left");
  });

  it("should handle right placement of tooltip", () => {
    createLink();
    component.placement = "right";
    fixture.detectChanges();

    assertAttribute(retrieveLink(), "placement", "right");
  });

  it("should create routerLink", () => {
    createLink();
    component.link.route = StrongRoute.Base.add("brokenlink");
    component.route = "/brokenlink";
    fixture.detectChanges();

    assertRoute(retrieveLink(), "/brokenlink");
  });

  it("should not use link route", () => {
    createLink();
    component.link.route = StrongRoute.Base.add("wronglink");
    component.route = "/brokenlink";
    fixture.detectChanges();

    assertRoute(retrieveLink(), "/brokenlink");
  });

  it("should not highlight link when not active", () => {
    spyOn(location, "path").and.callFake(() => "/customRoute");

    createLink();
    component.route = "/brokenlink";
    fixture.detectChanges();

    const link = fixture.nativeElement.querySelector("a.active");
    expect(link).toBeFalsy();
  });

  it("should highlight link when active", () => {
    spyOn(location, "path").and.callFake(() => "/customRoute");

    createLink();
    component.route = "/customRoute";
    fixture.detectChanges();

    const link = fixture.nativeElement.querySelector("a.active");
    expect(link).toBeTruthy();
  });
});

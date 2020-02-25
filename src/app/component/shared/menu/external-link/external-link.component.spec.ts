import { ComponentFixture, TestBed } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { assertIcon, assertTooltip } from "src/app/helpers/tests/helpers";
import { MenuLink } from "src/app/interfaces/menusInterfaces";
import { testAppInitializer } from "src/app/test.helper";
import { environment } from "src/environments/environment";
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
    component.link = MenuLink({
      icon: ["fas", "home"],
      label: "home",
      uri: () => "http://link/",
      tooltip: () => "custom tooltip"
    });
    component.tooltip = "custom tooltip";
    component.uri = "http://link/";
    component.placement = "left";
    fixture.detectChanges();

    expect(component).toBeTruthy();
  });

  it("should have icon", () => {
    component.id = "id";
    component.link = MenuLink({
      icon: ["fas", "home"],
      label: "home",
      uri: () => "http://link/",
      tooltip: () => "custom tooltip"
    });
    component.tooltip = "custom tooltip";
    component.uri = "http://link/";
    component.placement = "left";
    fixture.detectChanges();

    assertIcon(fixture.nativeElement, "fas,home");
  });

  it("should have label", () => {
    component.id = "id";
    component.link = MenuLink({
      icon: ["fas", "home"],
      label: "custom label",
      uri: () => "http://link/",
      tooltip: () => "custom tooltip"
    });
    component.tooltip = "custom tooltip";
    component.uri = "http://link/";
    component.placement = "left";
    fixture.detectChanges();

    // Expects label to be above disabled user tooltip
    const label = fixture.nativeElement.querySelector("#label");
    expect(label).toBeTruthy("Label element should contain id='label'");
    expect(label.innerText).toBe("custom label");
  });

  it("should have tooltip", () => {
    component.id = "id";
    component.link = MenuLink({
      icon: ["fas", "home"],
      label: "home",
      uri: () => "http://link/",
      tooltip: () => "custom tooltip"
    });
    component.tooltip = "custom tooltip";
    component.uri = "http://link/";
    component.placement = "left";
    fixture.detectChanges();

    const link = fixture.nativeElement.querySelector("a");
    assertTooltip(link, "custom tooltip");
  });

  it("should not use link tooltip", () => {
    component.id = "id";
    component.link = MenuLink({
      icon: ["fas", "home"],
      label: "home",
      uri: () => "http://link/",
      tooltip: () => "tooltip"
    });
    component.tooltip = "custom tooltip";
    component.uri = "http://link/";
    component.placement = "left";
    fixture.detectChanges();

    const link = fixture.nativeElement.querySelector("a");
    assertTooltip(link, "custom tooltip");
  });

  it("should handle left placement of tooltip", () => {
    component.id = "id";
    component.link = MenuLink({
      icon: ["fas", "home"],
      label: "home",
      uri: () => "http://link/",
      tooltip: () => "custom tooltip"
    });
    component.tooltip = "custom tooltip";
    component.uri = "http://link/";
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
    component.link = MenuLink({
      icon: ["fas", "home"],
      label: "home",
      uri: () => "http://link/",
      tooltip: () => "custom tooltip"
    });
    component.tooltip = "custom tooltip";
    component.uri = "http://link/";
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

  it("should not use link uri", () => {
    component.id = "id";
    component.link = MenuLink({
      icon: ["fas", "home"],
      label: "home",
      uri: () => "http://brokenlink/",
      tooltip: () => "custom tooltip"
    });
    component.tooltip = "custom tooltip";
    component.uri = "http://differentlink/";
    component.placement = "left";
    fixture.detectChanges();

    const link = fixture.nativeElement.querySelector("a");
    expect(link).toBeTruthy();
    expect(link.href).toBe("http://differentlink/");
  });

  it("should link to external website", () => {
    component.id = "id";
    component.link = MenuLink({
      icon: ["fas", "home"],
      label: "home",
      uri: () => "http://brokenlink/",
      tooltip: () => "custom tooltip"
    });
    component.tooltip = "custom tooltip";
    component.uri = "http://brokenlink/";
    component.placement = "left";
    fixture.detectChanges();

    const link = fixture.nativeElement.querySelector("a");
    expect(link).toBeTruthy();
    expect(link.href).toBe("http://brokenlink/");
  });

  it("should convert links to AngularJS server", () => {
    component.id = "id";
    component.link = MenuLink({
      icon: ["fas", "home"],
      label: "home",
      uri: () => "/brokenlink/",
      tooltip: () => "custom tooltip"
    });
    component.tooltip = "custom tooltip";
    component.uri = "/brokenlink/";
    component.placement = "left";
    fixture.detectChanges();

    const link = fixture.nativeElement.querySelector("a");
    expect(link).toBeTruthy();
    expect(link.href).toBe(environment.environment.apiRoot + "/brokenlink/");
  });
});

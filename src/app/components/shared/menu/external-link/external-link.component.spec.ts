import { ComponentFixture, TestBed } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { MenuLink } from "@interfaces/menusInterfaces";
import { AppConfigService } from "@services/app-config/app-config.service";
import { MockAppConfigModule } from "@services/app-config/app-configMock.module";
import {
  assertAttribute,
  assertHref,
  assertIcon,
  assertTooltip,
} from "@test/helpers/html";
import { SharedModule } from "../../shared.module";
import { MenuExternalLinkComponent } from "./external-link.component";

describe("MenuExternalLinkComponent", () => {
  let env: AppConfigService;
  let component: MenuExternalLinkComponent;
  let fixture: ComponentFixture<MenuExternalLinkComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, SharedModule, MockAppConfigModule],
      declarations: [MenuExternalLinkComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MenuExternalLinkComponent);
    env = TestBed.inject(AppConfigService);
    component = fixture.componentInstance;
  });

  function createLink() {
    component.id = "id";
    component.link = MenuLink({
      icon: ["fas", "home"],
      label: "home",
      uri: () => "http://link/",
      tooltip: () => "tooltip",
    });
    component.tooltip = "tooltip";
    component.uri = "http://link/";
    component.placement = "left";
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

  it("should not use link uri", () => {
    createLink();
    component.link.uri = () => "http://wronglink/";
    component.uri = "http://brokenlink/";
    fixture.detectChanges();

    assertHref(retrieveLink(), "http://brokenlink/");
  });

  it("should link to external website", () => {
    createLink();
    component.link.uri = () => "http://brokenlink/";
    component.uri = "http://brokenlink/";
    fixture.detectChanges();

    assertHref(retrieveLink(), "http://brokenlink/");
  });

  it("should convert links to AngularJS server", () => {
    createLink();
    component.link.uri = () => "/brokenlink/";
    component.uri = "/brokenlink/";
    fixture.detectChanges();

    assertHref(retrieveLink(), env.environment.apiRoot + "/brokenlink/");
  });
});

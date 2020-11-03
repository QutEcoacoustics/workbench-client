import { Location } from "@angular/common";
import { RouterTestingModule } from "@angular/router/testing";
import { MenuLink } from "@interfaces/menusInterfaces";
import { createHostFactory, SpectatorHost } from "@ngneat/spectator";
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
  let defaultLink: MenuLink;
  let spec: SpectatorHost<MenuExternalLinkComponent>;
  let component: MenuExternalLinkComponent;
  const createHost = createHostFactory({
    component: MenuExternalLinkComponent,
    imports: [SharedModule, RouterTestingModule, MockAppConfigModule],
  });

  function retrieveLink() {
    return spec.query<HTMLAnchorElement>("a");
  }

  function setup(inputs: Partial<MenuExternalLinkComponent> = {}) {
    spec = createHost(
      `
      <baw-menu-external-link
        [id]="id"
        [link]="link"
        [placement]="placement"
        [tooltip]="tooltip"
        [uri]="uri"
      ></baw-menu-external-link>
    `,
      {
        detectChanges: false,
        hostProps: {
          id: "id",
          link: defaultLink,
          placement: "left",
          tooltip: "tooltip",
          uri: "http://link/",
          ...inputs,
        },
      }
    );
    component = spec.component;
    env = spec.inject(AppConfigService);
  }

  beforeEach(() => {
    defaultLink = MenuLink({
      icon: ["fas", "home"],
      label: "home",
      uri: () => "http://link/",
      tooltip: () => "tooltip",
    });
  });

  it("should create", () => {
    setup();
    spec.detectChanges();
    expect(component).toBeTruthy();
  });

  it("should have icon", () => {
    setup({
      link: MenuLink({
        ...defaultLink,
        icon: ["fas", "exclamation-triangle"],
      }),
    });
    spec.detectChanges();
    assertIcon(spec.element, "fas,exclamation-triangle");
  });

  it("should have label", () => {
    setup({ link: MenuLink({ ...defaultLink, label: "custom label" }) });
    spec.detectChanges();

    // Expects label to be above disabled user tooltip
    const label = spec.query<HTMLElement>("#label");
    expect(label).toBeTruthy("Label element should contain id='label'");
    expect(label.innerText).toBe("custom label");
  });

  describe("tooltip", () => {
    it("should have tooltip", () => {
      setup({
        tooltip: "custom tooltip",
        link: MenuLink({ ...defaultLink, tooltip: () => "custom tooltip" }),
      });
      spec.detectChanges();
      assertTooltip(retrieveLink(), "custom tooltip");
    });

    it("should not use link tooltip", () => {
      setup({
        tooltip: "custom tooltip",
        link: MenuLink({ ...defaultLink, tooltip: () => "wrong tooltip" }),
      });
      spec.detectChanges();
      assertTooltip(retrieveLink(), "custom tooltip");
    });

    it("should handle left placement of tooltip", () => {
      setup({ placement: "left" });
      spec.detectChanges();
      assertAttribute(retrieveLink(), "placement", "left");
    });

    it("should handle right placement of tooltip", () => {
      setup({ placement: "right" });
      spec.detectChanges();
      assertAttribute(retrieveLink(), "placement", "right");
    });
  });

  describe("link", () => {
    it("should not use link uri", () => {
      setup({
        uri: "http://brokenlink/",
        link: MenuLink({ ...defaultLink, uri: () => "http://wronglink/" }),
      });
      console.log(spec.component);
      spec.detectChanges();
      assertHref(retrieveLink(), "http://brokenlink/");
    });

    it("should link to external website", () => {
      setup({
        uri: "http://brokenlink/",
        link: MenuLink({ ...defaultLink, uri: () => "http://brokenlink/" }),
      });
      spec.detectChanges();
      assertHref(retrieveLink(), "http://brokenlink/");
    });

    it("should convert links to AngularJS server", () => {
      setup({
        uri: "/brokenlink/",
        link: MenuLink({ ...defaultLink, uri: () => "/brokenlink/" }),
      });
      spec.detectChanges();
      assertHref(retrieveLink(), env.environment.apiRoot + "/brokenlink/");
    });
  });

  describe("disabled", () => {
    function assertDisabled(isDisabled: boolean) {
      if (isDisabled) {
        expect(spec.query("a.disabled")).toBeTruthy();
      } else {
        expect(spec.query("a.disabled")).toBeFalsy();
      }
    }

    it("should default as enabled if disabled is undefined", () => {
      setup({ link: MenuLink({ ...defaultLink, disabled: undefined }) });
      spec.detectChanges();
      assertDisabled(false);
    });

    it("should be enabled if disabled is false", () => {
      setup({ link: MenuLink({ ...defaultLink, disabled: false }) });
      spec.detectChanges();
      assertDisabled(false);
    });

    it("should be disabled if disabled is true", () => {
      setup({ link: MenuLink({ ...defaultLink, disabled: true }) });
      spec.detectChanges();
      assertDisabled(true);
    });
  });
});

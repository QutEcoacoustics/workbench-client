import { Location } from "@angular/common";
import { RouterTestingModule } from "@angular/router/testing";
import { MenuRoute } from "@interfaces/menusInterfaces";
import { StrongRoute } from "@interfaces/strongRoute";
import { createHostFactory, SpectatorHost } from "@ngneat/spectator";
import {
  assertAttribute,
  assertIcon,
  assertRoute,
  assertTooltip,
} from "@test/helpers/html";
import { SharedModule } from "../../shared.module";
import { MenuInternalLinkComponent } from "./internal-link.component";

describe("MenuInternalLinkComponent", () => {
  let defaultLink: MenuRoute;
  let location: Location;
  let spec: SpectatorHost<MenuInternalLinkComponent>;
  let component: MenuInternalLinkComponent;
  const createHost = createHostFactory({
    component: MenuInternalLinkComponent,
    imports: [SharedModule, RouterTestingModule],
  });

  function retrieveLink() {
    return spec.query<HTMLAnchorElement>("a");
  }

  function assertActive(isActive: boolean) {
    if (isActive) {
      expect(spec.query("a.active")).toBeTruthy();
    } else {
      expect(spec.query("a.active")).toBeFalsy();
    }
  }

  function setup(inputs: Partial<MenuInternalLinkComponent> = {}) {
    spec = createHost(
      `
      <baw-menu-internal-link
        [id]="id"
        [link]="link"
        [placement]="placement"
        [tooltip]="tooltip"
        [route]="route"
      ></baw-menu-internal-link>
    `,
      {
        detectChanges: false,
        hostProps: {
          id: "id",
          link: defaultLink,
          placement: "left",
          tooltip: "tooltip",
          route: "/home",
          ...inputs,
        },
      }
    );
    component = spec.component;
    location = spec.inject(Location);
  }

  beforeEach(() => {
    defaultLink = MenuRoute({
      icon: ["fas", "home"],
      label: "home",
      route: StrongRoute.Base.add("home"),
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
      link: MenuRoute({
        ...defaultLink,
        icon: ["fas", "exclamation-triangle"],
      }),
    });
    spec.detectChanges();
    assertIcon(spec.element, "fas,exclamation-triangle");
  });

  it("should have label", () => {
    setup({ link: MenuRoute({ ...defaultLink, label: "custom label" }) });
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
        link: MenuRoute({ ...defaultLink, tooltip: () => "custom tooltip" }),
      });
      spec.detectChanges();
      assertTooltip(retrieveLink(), "custom tooltip");
    });

    it("should not use link tooltip", () => {
      setup({
        tooltip: "custom tooltip",
        link: MenuRoute({ ...defaultLink, tooltip: () => "wrong tooltip" }),
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
    it("should create routerLink", () => {
      setup({
        route: "/brokenlink",
        link: MenuRoute({
          ...defaultLink,
          route: StrongRoute.Base.add("brokenlink"),
        }),
      });
      spec.detectChanges();
      assertRoute(retrieveLink(), "/brokenlink");
    });

    it("should not use link route", () => {
      setup({
        route: "/brokenlink",
        link: MenuRoute({
          ...defaultLink,
          route: StrongRoute.Base.add("wronglink"),
        }),
      });
      spec.detectChanges();
      assertRoute(retrieveLink(), "/brokenlink");
    });

    it("should not highlight link when not active", () => {
      setup({ route: "/brokenlink" });
      spyOn(location, "path").and.callFake(() => "/customRoute");
      spec.detectChanges();
      assertActive(false);
    });

    it("should highlight link when active", () => {
      setup({ route: "/customRoute" });
      spyOn(location, "path").and.callFake(() => "/customRoute");
      spec.detectChanges();
      assertActive(true);
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
      setup({ link: MenuRoute({ ...defaultLink, disabled: undefined }) });
      spec.detectChanges();
      assertDisabled(false);
    });

    it("should be enabled if disabled is false", () => {
      setup({ link: MenuRoute({ ...defaultLink, disabled: false }) });
      spec.detectChanges();
      assertDisabled(false);
    });

    it("should be disabled if disabled is true", () => {
      setup({ link: MenuRoute({ ...defaultLink, disabled: true }) });
      spec.detectChanges();
      assertDisabled(true);
    });

    it("should be active is disabled is true", () => {
      setup({ link: MenuRoute({ ...defaultLink, disabled: true }) });
      spec.detectChanges();
      assertActive(true);
    });
  });
});

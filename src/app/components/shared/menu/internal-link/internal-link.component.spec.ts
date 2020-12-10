import { Location } from "@angular/common";
import { RouterLink, RouterLinkWithHref } from "@angular/router";
import { RouterTestingModule } from "@angular/router/testing";
import { MenuRoute, menuRoute } from "@interfaces/menusInterfaces";
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

  function retrieveWrapper() {
    return spec.query<HTMLElement>("span");
  }

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
        [qsp]="qsp"
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
          qsp: {},
          ...inputs,
        },
      }
    );
    component = spec.component;
    location = spec.inject(Location);
  }

  beforeEach(() => {
    defaultLink = menuRoute({
      icon: ["fas", "home"],
      label: "home",
      route: StrongRoute.newRoot().add("home"),
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
      link: menuRoute({
        ...defaultLink,
        icon: ["fas", "exclamation-triangle"],
      }),
    });
    spec.detectChanges();
    assertIcon(spec.element, "fas,exclamation-triangle");
  });

  it("should have label", () => {
    setup({ link: menuRoute({ ...defaultLink, label: "custom label" }) });
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
        link: menuRoute({ ...defaultLink, tooltip: () => "custom tooltip" }),
      });
      spec.detectChanges();
      assertTooltip(retrieveWrapper(), "custom tooltip");
    });

    it("should not use link tooltip", () => {
      setup({
        tooltip: "custom tooltip",
        link: menuRoute({ ...defaultLink, tooltip: () => "wrong tooltip" }),
      });
      spec.detectChanges();
      assertTooltip(retrieveWrapper(), "custom tooltip");
    });

    it("should handle left placement of tooltip", () => {
      setup({ placement: "left" });
      spec.detectChanges();
      assertAttribute(retrieveWrapper(), "placement", "left");
    });

    it("should handle right placement of tooltip", () => {
      setup({ placement: "right" });
      spec.detectChanges();
      assertAttribute(retrieveWrapper(), "placement", "right");
    });
  });

  describe("link", () => {
    it("should create routerLink", () => {
      setup({
        route: "/brokenlink",
        link: menuRoute({
          ...defaultLink,
          route: StrongRoute.newRoot().add("brokenlink"),
        }),
      });
      spec.detectChanges();
      assertRoute(retrieveLink(), "/brokenlink");
    });

    it("should not use link route", () => {
      setup({
        route: "/brokenlink",
        link: menuRoute({
          ...defaultLink,
          route: StrongRoute.newRoot().add("wronglink"),
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

    it("should handle empty qsp object", () => {
      setup({ qsp: {} });
      spec.detectChanges();
      expect(spec.query(RouterLinkWithHref).queryParams).toEqual({});
    });

    it("should handle qsp object", () => {
      setup({ qsp: { test: "value" } });
      spec.detectChanges();
      expect(spec.query(RouterLinkWithHref).queryParams).toEqual({
        test: "value",
      });
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
      setup({ link: menuRoute({ ...defaultLink, disabled: undefined }) });
      spec.detectChanges();
      assertDisabled(false);
    });

    it("should be enabled if disabled is false", () => {
      setup({ link: menuRoute({ ...defaultLink, disabled: false }) });
      spec.detectChanges();
      assertDisabled(false);
    });

    it("should be disabled if disabled is true", () => {
      setup({ link: menuRoute({ ...defaultLink, disabled: true }) });
      spec.detectChanges();
      assertDisabled(true);
    });

    it("should be active is disabled is true", () => {
      setup({ link: menuRoute({ ...defaultLink, disabled: true }) });
      spec.detectChanges();
      assertActive(true);
    });
  });
});

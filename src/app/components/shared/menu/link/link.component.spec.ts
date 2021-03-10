import { Location } from "@angular/common";
import { ActivatedRoute, Params } from "@angular/router";
import { RouterTestingModule } from "@angular/router/testing";
import { StrongRouteDirective } from "@directives/strongRoute/strong-route.directive";
import {
  menuLink,
  MenuLink,
  MenuRoute,
  menuRoute,
} from "@interfaces/menusInterfaces";
import { StrongRoute } from "@interfaces/strongRoute";
import {
  ActivatedRouteStub,
  createHostFactory,
  SpectatorHost,
} from "@ngneat/spectator";
import { ConfigService } from "@services/config/config.service";
import { MockAppConfigModule } from "@services/config/configMock.module";
import { assertAttribute, assertIcon, assertTooltip } from "@test/helpers/html";
import { SharedModule } from "../../shared.module";
import { MenuLinkComponent } from "./link.component";

describe("MenuLinkComponent", () => {
  let defaultRoute: MenuRoute;
  let defaultLink: MenuLink;
  let config: ConfigService;
  let spec: SpectatorHost<MenuLinkComponent>;
  let component: MenuLinkComponent;
  const createHost = createHostFactory({
    component: MenuLinkComponent,
    imports: [MockAppConfigModule, SharedModule, RouterTestingModule],
  });

  function getWrapper(): HTMLSpanElement {
    return spec.query("span");
  }

  function getLink(): HTMLAnchorElement {
    return spec.query("a");
  }

  function setRouteParams(params: Params) {
    const activatedRoute = spec.inject(ActivatedRoute);
    const routeStub = new ActivatedRouteStub({ params });
    activatedRoute.snapshot.params = routeStub.snapshot.params;
    activatedRoute.params = routeStub.params;
  }

  function setLocationPath(path: string) {
    const location: Location = spec.inject(Location);
    spyOn(location, "path").and.callFake(() => path);
  }

  function setup(inputs: Partial<MenuLinkComponent> = {}) {
    spec = createHost(
      `
      <baw-menu-link
        [id]="id"
        [link]="link"
        [placement]="placement"
        [tooltip]="tooltip"
      ></baw-menu-link>
    `,
      {
        detectChanges: false,
        hostProps: {
          id: "id",
          link: defaultRoute,
          placement: "left",
          tooltip: "tooltip",
          ...inputs,
        },
      }
    );
    component = spec.component;
    config = spec.inject(ConfigService);
  }

  beforeEach(() => {
    defaultRoute = menuRoute({
      icon: ["fas", "home"],
      label: "home",
      route: StrongRoute.newRoot().add("home"),
      tooltip: () => "tooltip",
    });
    defaultLink = menuLink({
      icon: ["fas", "home"],
      label: "home",
      uri: () => "https://broken_link/",
      tooltip: () => "tooltip",
    });
  });

  it("should create", () => {
    setup();
    spec.detectChanges();
    expect(component).toBeInstanceOf(MenuLinkComponent);
  });

  [
    {
      label: "internal link",
      link: (data: Partial<MenuRoute>) =>
        menuRoute({ ...defaultRoute, ...data }),
    },
    {
      label: "external link",
      link: (data: Partial<MenuLink>) => menuLink({ ...defaultLink, ...data }),
    },
  ].forEach(({ label, link }) => {
    describe(label, () => {
      it("should have icon", () => {
        setup({ link: link({ icon: ["fas", "ad"] }) });
        spec.detectChanges();
        assertIcon(spec.element, "fas,ad");
      });

      it("should have label", () => {
        setup({ link: link({ label: "custom label" }) });
        spec.detectChanges();
        // Expects label to be above disabled user tooltip
        expect(spec.query("#label")).toHaveText("custom label");
      });

      describe("tooltip", () => {
        it("should have tooltip", () => {
          setup({
            tooltip: "custom tooltip",
            link: link({ tooltip: () => "custom tooltip" }),
          });
          spec.detectChanges();
          assertTooltip(getWrapper(), "custom tooltip");
        });

        it("should not use link tooltip", () => {
          setup({
            tooltip: "custom tooltip",
            link: link({ tooltip: () => "wrong tooltip" }),
          });
          spec.detectChanges();
          assertTooltip(getWrapper(), "custom tooltip");
        });

        it("should handle left placement of tooltip", () => {
          setup({ placement: "left" });
          spec.detectChanges();
          assertAttribute(getWrapper(), "placement", "left");
        });

        it("should handle right placement of tooltip", () => {
          setup({ placement: "right" });
          spec.detectChanges();
          assertAttribute(getWrapper(), "placement", "right");
        });
      });

      describe("disabled", () => {
        function assertDisabled(isDisabled: boolean) {
          if (isDisabled) {
            expect(getLink()).toHaveClass("disabled");
          } else {
            expect(getLink()).not.toHaveClass("disabled");
          }
        }

        it("should set disabled class on wrapper", () => {
          setup({ link: link({ disabled: true }) });
          spec.detectChanges();
          expect(getWrapper()).toHaveClass("disabled");
        });

        it("should default as enabled if disabled is undefined", () => {
          setup({ link: link({ disabled: undefined }) });
          spec.detectChanges();
          assertDisabled(false);
        });

        it("should be enabled if disabled is false", () => {
          setup({ link: link({ disabled: false }) });
          spec.detectChanges();
          assertDisabled(false);
        });

        it("should be disabled if disabled is true", () => {
          setup({ link: link({ disabled: true }) });
          spec.detectChanges();
          assertDisabled(true);
        });
      });
    });
  });

  describe("internal link", () => {
    function assertActive(isActive: boolean) {
      if (isActive) {
        expect(getLink()).toHaveClass("active");
      } else {
        expect(getLink()).not.toHaveClass("active");
      }
    }

    it("should create router link", () => {
      const route = StrongRoute.newRoot().add("brokenlink");
      setup({ link: menuRoute({ ...defaultRoute, route }) });
      spec.detectChanges();
      expect(spec.query(StrongRouteDirective).strongRoute).toEqual(route);
    });

    it("should not be highlighted by default", () => {
      const route = StrongRoute.newRoot().add("brokenlink");
      setup({ link: menuRoute({ ...defaultRoute, route }) });
      setLocationPath("/customRoute");
      spec.detectChanges();
      assertActive(false);
    });

    it("should highlight link when location path matches route", () => {
      const route = StrongRoute.newRoot().add("customRoute");
      setup({ link: menuRoute({ ...defaultRoute, route }) });
      setLocationPath("/customRoute");
      spec.detectChanges();
      assertActive(true);
    });

    it("should highlight link when location path matches route with route parameters", () => {
      const route = StrongRoute.newRoot().add("customRoute").add(":id");
      setup({ link: menuRoute({ ...defaultRoute, route }) });
      setRouteParams({ id: 10 });
      setLocationPath("/customRoute/10");
      spec.detectChanges();
      assertActive(true);
    });

    it("should highlight link when location path matches route with query parameters", () => {
      const route = StrongRoute.newRoot().add("customRoute");
      setup({ link: menuRoute({ ...defaultRoute, route }) });
      setLocationPath("/customRoute?page=2");
      spec.detectChanges();
      assertActive(true);
    });

    it("should highlight link when active property set", () => {
      defaultRoute.active = true;
      setup({ link: defaultRoute });
      spec.detectChanges();
      assertActive(true);
    });

    it("should highlight link when highlight property set", () => {
      setup({ link: menuRoute({ ...defaultRoute, highlight: true }) });
      spec.detectChanges();
      assertActive(true);
    });
  });

  describe("external link", () => {
    it("should link to external website", () => {
      setup({
        link: menuLink({ ...defaultLink, uri: () => "https://broken_link/" }),
      });
      spec.detectChanges();
      expect(getLink()).toHaveAttribute({ href: "https://broken_link/" });
    });

    it("should link to same-domain website", () => {
      setup({ link: menuLink({ ...defaultLink, uri: () => "/brokenlink/" }) });
      spec.detectChanges();
      expect(getLink()).toHaveAttribute({
        href: config.environment.apiRoot + "/brokenlink/",
      });
    });

    it("should provide route parameters to uri", () => {
      setup({
        link: menuLink({
          ...defaultLink,
          uri: ({ id }) => `https://broken_link/${id}`,
        }),
      });
      setRouteParams({ id: 10 });
      spec.detectChanges();
      expect(getLink()).toHaveAttribute({ href: "https://broken_link/10" });
    });
  });
});

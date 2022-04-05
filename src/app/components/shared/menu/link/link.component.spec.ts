import { ActivatedRouteSnapshot, Params } from "@angular/router";
import { RouterTestingModule } from "@angular/router/testing";
import { MockDirectivesModule } from "@directives/directives.mock.module";
import { StrongRouteDirective } from "@directives/strongRoute/strong-route.directive";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import {
  menuLink,
  MenuLink,
  MenuRoute,
  menuRoute,
} from "@interfaces/menusInterfaces";
import { StrongRoute } from "@interfaces/strongRoute";
import { NgbTooltip, NgbTooltipModule } from "@ng-bootstrap/ng-bootstrap";
import { createHostFactory, SpectatorHost } from "@ngneat/spectator";
import { ConfigService } from "@services/config/config.service";
import { MockAppConfigModule } from "@services/config/configMock.module";
import { SharedActivatedRouteService } from "@services/shared-activated-route/shared-activated-route.service";
import { IconsModule } from "@shared/icons/icons.module";
import { assertIcon, assertStrongRouteActive } from "@test/helpers/html";
import { MockProvider } from "ng-mocks";
import { of } from "rxjs";
import { MenuLinkComponent } from "./link.component";

describe("MenuLinkComponent", () => {
  let defaultRoute: MenuRoute;
  let defaultLink: MenuLink;
  let config: ConfigService;
  let spec: SpectatorHost<MenuLinkComponent>;
  let component: MenuLinkComponent;
  const createHost = createHostFactory({
    component: MenuLinkComponent,
    imports: [
      MockAppConfigModule,
      RouterTestingModule,
      MockDirectivesModule,
      NgbTooltipModule,
      IconsModule,
    ],
  });

  function getWrapper(): HTMLSpanElement {
    return spec.query("span");
  }

  function getLink(): HTMLAnchorElement {
    return spec.query("a");
  }

  function getTooltip() {
    return spec.query(NgbTooltip);
  }

  function assertTooltip(text: string) {
    const tooltip = getTooltip();
    tooltip.open();
    spec.detectChanges();
    expect(spec.query(".tooltip-inner")).toHaveText(text);
  }

  function setup(
    inputs: Partial<MenuLinkComponent> = {},
    routeParams: Params = {},
    queryParams: Params = {}
  ) {
    spec = createHost(
      `
      <baw-menu-link
        [link]="link"
        [tooltip]="tooltip"
      ></baw-menu-link>
    `,
      {
        detectChanges: true,
        hostProps: {
          link: defaultRoute,
          tooltip: "tooltip",
          ...inputs,
        },
        providers: [
          MockProvider(SharedActivatedRouteService, {
            snapshot: of({
              queryParams,
              params: routeParams,
            } as Partial<ActivatedRouteSnapshot> as ActivatedRouteSnapshot),
            queryParams: of(queryParams),
            params: of(routeParams),
          }),
        ],
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
        const icon: IconProp = ["fas", "ad"];
        setup({ link: link({ icon }) });
        spec.detectChanges();
        assertIcon(spec.element, { icon });
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
          assertTooltip("custom tooltip");
        });

        it("should not use link tooltip", () => {
          setup({
            tooltip: "custom tooltip",
            link: link({ tooltip: () => "wrong tooltip" }),
          });
          spec.detectChanges();
          assertTooltip("custom tooltip");
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

        it("should display disabled message in tooltip", () => {
          setup({
            tooltip: "custom tooltip",
            link: link({ disabled: "custom disabled message" }),
          });
          spec.detectChanges();
          assertTooltip("custom disabled message");
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

    it("should set strong route active property", () => {
      const route = StrongRoute.newRoot().add("brokenlink");
      setup({ link: menuRoute({ ...defaultRoute, route }) });
      spec.detectChanges();
      assertStrongRouteActive(getLink());
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
        href: config.endpoints.apiRoot + "/brokenlink/",
      });
    });

    it("should provide route parameters to uri", () => {
      setup(
        {
          link: menuLink({
            ...defaultLink,
            uri: (params) => `https://broken_link/${params?.id}`,
          }),
        },
        { id: 10 }
      );
      spec.detectChanges();
      expect(getLink()).toHaveAttribute({ href: "https://broken_link/10" });
    });
  });
});

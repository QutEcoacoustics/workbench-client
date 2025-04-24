import {
  contactUsMenuItem,
  creditsMenuItem,
  dataSharingPolicyMenuItem,
  disclaimersMenuItem,
  ethicsMenuItem,
} from "@components/about/about.menus";
import { statisticsMenuItem } from "@components/statistics/statistics.menus";
import { createRoutingFactory, Spectator } from "@ngneat/spectator";
import { ConfigService } from "@services/config/config.service";
import { provideMockConfig } from "@services/config/provide-configMock";
import { websiteStatusMenuItem } from "@components/website-status/website-status.menu";
import { StrongRouteActiveDirective } from "@directives/strongRoute/strong-route-active.directive";
import { MockDirective } from "ng-mocks";
import { FooterComponent } from "./footer.component";

describe("FooterComponent", () => {
  let configService: ConfigService;
  let spec: Spectator<FooterComponent>;

  const createComponent = createRoutingFactory({
    component: FooterComponent,
    imports :[MockDirective(StrongRouteActiveDirective)],
    providers: [provideMockConfig()],
  });

  beforeEach(() => {
    spec = createComponent();
    configService = spec.inject(ConfigService);
  });

  it("should create", () => {
    expect(spec.component).toBeTruthy();
  });

  it("should set copyright", () => {
    const year = new Date().getFullYear();
    expect(spec.query("#copyright")).toContainText(`QUT ${year}`);
  });

  it("should show build version", () => {
    const version = configService.environment.version;
    expect(spec.query("#version")).toContainText(version);
  });

  describe("links", () => {
    [
      statisticsMenuItem,
      websiteStatusMenuItem,
      disclaimersMenuItem,
      creditsMenuItem,
      ethicsMenuItem,
      dataSharingPolicyMenuItem,
      contactUsMenuItem,
    ].forEach((link, index) => {
      function getId() {
        // First two links are copyright and website version
        const offset = 3;
        return `li:nth-child(${index + offset}) a`;
      }

      function getLink() {
        return spec.query<HTMLAnchorElement>(getId());
      }

      describe(link.label, () => {
        it("should set label", () => {
          expect(getLink()).toContainText(link.label);
        });

        it("should set link", () => {
          expect(getLink()).toHaveStrongRoute(link.route);
        });

        it("should highlight link on active page", () => {
          expect(getLink()).toHaveStrongRouteActive("active");
        });
      });
    });
  });
});

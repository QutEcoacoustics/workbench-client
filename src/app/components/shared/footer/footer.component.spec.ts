import { RouterTestingModule } from "@angular/router/testing";
import {
  contactUsMenuItem,
  creditsMenuItem,
  dataSharingPolicyMenuItem,
  disclaimersMenuItem,
  ethicsMenuItem,
} from "@components/about/about.menus";
import { statisticsMenuItem } from "@components/statistics/statistics.menus";
import { MockDirectivesModule } from "@directives/directives.mock.module";
import { createComponentFactory, Spectator } from "@ngneat/spectator";
import { ConfigService } from "@services/config/config.service";
import { MockConfigModule } from "@services/config/configMock.module";
import { websiteStatusMenuItem } from "@components/website-status/website-status.menu";
import { FooterComponent } from "./footer.component";

describe("FooterComponent", () => {
  let configService: ConfigService;
  let spec: Spectator<FooterComponent>;
  const createComponent = createComponentFactory({
    component: FooterComponent,
    imports: [RouterTestingModule, MockDirectivesModule, MockConfigModule],
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

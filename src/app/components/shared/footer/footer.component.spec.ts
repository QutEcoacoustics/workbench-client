import { RouterTestingModule } from "@angular/router/testing";
import {
  contactUsMenuItem,
  creditsMenuItem,
  disclaimersMenuItem,
  ethicsMenuItem,
} from "@components/about/about.menus";
import { statisticsMenuItem } from "@components/statistics/statistics.menus";
import { MockDirectivesModule } from "@directives/directives.mock.module";
import { createComponentFactory, Spectator } from "@ngneat/spectator";
import { ConfigService } from "@services/config/config.service";
import { MockAppConfigModule } from "@services/config/configMock.module";
import { assertStrongRouteActive } from "@test/helpers/html";
import { FooterComponent } from "./footer.component";

describe("FooterComponent", () => {
  let configService: ConfigService;
  let spec: Spectator<FooterComponent>;
  const createComponent = createComponentFactory({
    component: FooterComponent,
    imports: [RouterTestingModule, MockDirectivesModule, MockAppConfigModule],
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
    const version = configService.config.version;
    expect(spec.query("#version")).toContainText(version);
  });

  describe("links", () => {
    [
      statisticsMenuItem,
      disclaimersMenuItem,
      creditsMenuItem,
      ethicsMenuItem,
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
          assertStrongRouteActive(getLink());
        });
      });
    });
  });
});

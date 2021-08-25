import { RouterTestingModule } from "@angular/router/testing";
import {
  contactUsMenuItem,
  creditsMenuItem,
  disclaimersMenuItem,
  ethicsMenuItem,
} from "@components/about/about.menus";
import { statisticsMenuItem } from "@components/statistics/statistics.menus";
import { DirectivesModule } from "@directives/directives.module";
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
    imports: [RouterTestingModule, DirectivesModule, MockAppConfigModule],
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
      function getLink() {
        return spec.queryAll<HTMLAnchorElement>("a")[index];
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

import { Title } from "@angular/platform-browser";
import { RouterTestingModule } from "@angular/router/testing";
import {
  createRoutingFactory,
  mockProvider,
  SpectatorRouting,
} from "@ngneat/spectator";
import { LoadingBarComponent, LoadingBarService } from "@ngx-loading-bar/core";
import { ConfigService } from "@services/config/config.service";
import { MockAppConfigModule } from "@services/config/configMock.module";
import { FooterComponent } from "@shared/footer/footer.component";
import { HeaderComponent } from "@shared/header/header.component";
import { MockComponent } from "ng-mocks";
import { Subject } from "rxjs";
import { AppComponent } from "./app.component";

describe("AppComponent", () => {
  let spec: SpectatorRouting<AppComponent>;
  const createComponent = createRoutingFactory({
    component: AppComponent,
    declarations: [
      MockComponent(HeaderComponent),
      MockComponent(FooterComponent),
      MockComponent(LoadingBarComponent),
    ],
    providers: [mockProvider(LoadingBarService, { value$: new Subject() })],
    imports: [RouterTestingModule, MockAppConfigModule],
  });

  beforeEach(() => {
    spec = createComponent({ detectChanges: true });
  });

  it("should create the app", () => {
    spec.detectChanges();
    expect(spec.component).toBeTruthy();
  });

  it("should create header", () => {
    spec.detectChanges();
    expect(spec.query("baw-header")).toBeTruthy();
  });

  it("should create footer", () => {
    spec.detectChanges();
    expect(spec.query("baw-footer")).toBeTruthy();
  });

  it("should create loading bar", () => {
    spec.detectChanges();
    expect(spec.query("ngx-loading-bar")).toBeTruthy();
  });

  it("should change the title to match the environment title", () => {
    const title = spec.inject(Title);
    const config = spec.inject(ConfigService);
    spec.detectChanges();
    expect(title.getTitle()).toBe(config.settings.brand.short);
  });

  describe("updatePageLayout", () => {
    function updatePageLayout(
      fullscreen: boolean,
      initialFullscreenValue?: boolean
    ) {
      if (initialFullscreenValue) {
        // Set the fullscreen value to a value other than the expected
        // to ensure it is overridden properly
        spec.component.fullscreen = initialFullscreenValue;
      }

      spec.component["updatePageLayout"]({
        constructor: { pageInfo: { fullscreen } },
      });
      spec.detectChanges();
    }

    function assertLayout(isFullscreen: boolean) {
      const routerOutlets = spec.queryAll("router-outlet");
      const secondaryMenu = routerOutlets[0].parentElement;
      const actionMenu = routerOutlets[3].parentElement;

      expect(routerOutlets.length).toBe(4, "Wrong number of router-outlets");

      if (isFullscreen) {
        expect(secondaryMenu).toHaveStyle({ display: "none" });
        expect(actionMenu).toHaveStyle({ display: "none" });
      } else {
        expect(secondaryMenu).not.toHaveStyle({ display: "none" });
        expect(actionMenu).not.toHaveStyle({ display: "none" });
      }
    }

    it("should default to fullscreen", () => {
      spec.detectChanges();
      assertLayout(true);
    });

    it("should set menu layout if fullscreen is undefined", () => {
      updatePageLayout(undefined);
      spec.detectChanges();
      assertLayout(false);
    });

    it("should detect fullscreen component", () => {
      updatePageLayout(true, false);
      assertLayout(true);
    });

    it("should detect menu layout component", () => {
      updatePageLayout(false, true);
      assertLayout(false);
    });
  });

  // TODO Add tests for progress bar
});

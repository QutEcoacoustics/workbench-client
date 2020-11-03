import { Title } from "@angular/platform-browser";
import { RouterTestingModule } from "@angular/router/testing";
import {
  ActivatedRouteStub,
  createRoutingFactory,
  mockProvider,
  SpectatorRouting,
} from "@ngneat/spectator";
import { LoadingBarComponent, LoadingBarService } from "@ngx-loading-bar/core";
import { AppConfigService } from "@services/app-config/app-config.service";
import { MockAppConfigModule } from "@services/app-config/app-configMock.module";
import { FooterComponent } from "@shared/footer/footer.component";
import { HeaderComponent } from "@shared/header/header.component";
import { MockComponent } from "ng-mocks";
import { Subject } from "rxjs";
import { AppComponent } from "./app.component";

describe("AppComponent", () => {
  let spec: SpectatorRouting<AppComponent>;
  const createComponent = createRoutingFactory({
    component: AppComponent,
    stubsEnabled: true,
    declarations: [
      MockComponent(HeaderComponent),
      MockComponent(FooterComponent),
      MockComponent(LoadingBarComponent),
    ],
    providers: [mockProvider(LoadingBarService, { value$: new Subject() })],
    imports: [RouterTestingModule, MockAppConfigModule],
  });

  function setup(firstChild?: ActivatedRouteStub) {
    spec = createComponent({
      detectChanges: true,
      data: { testing: true },
      firstChild,
    });
  }

  it("should create the app", () => {
    setup();
    spec.detectChanges();
    expect(spec.component).toBeTruthy();
  });

  it("should create header", () => {
    setup();
    spec.detectChanges();
    expect(spec.query("baw-header")).toBeTruthy();
  });

  it("should create footer", () => {
    setup();
    spec.detectChanges();
    expect(spec.query("baw-footer")).toBeTruthy();
  });

  it("should create loading bar", () => {
    setup();
    spec.detectChanges();
    expect(spec.query("ngx-loading-bar")).toBeTruthy();
  });

  it("should change the title to match the environment title", () => {
    setup();
    const title = spec.inject(Title);
    const env = spec.inject(AppConfigService);
    spec.detectChanges();
    expect(title.getTitle()).toBe(env.values.brand.name);
  });

  describe("updatePageLayout", () => {
    function createFirstChild(depth: number, component: any) {
      let activatedRouteStub = new ActivatedRouteStub({
        firstChild: { component } as any,
      });

      for (let i = 0; i < depth - 1; i++) {
        activatedRouteStub = new ActivatedRouteStub({
          firstChild: activatedRouteStub,
        });
      }

      return activatedRouteStub;
    }

    function createPageComponent(fullscreen: boolean) {
      return { pageInfo: { fullscreen } };
    }

    function updatePageLayout(initialFullscreenValue: boolean) {
      // Set the fullscreen value to a value other than the expected
      // to ensure it is overridden properly
      spec.component.fullscreen = initialFullscreenValue;
      spec.component["updatePageLayout"]();
      spec.detectChanges();
    }

    function assertFullscreen() {
      // Should have all 4 router-outlets
      expect(spec.queryAll("router-outlet").length).toBe(4);
      // Secondary and action outlets are hidden
      expect(spec.queryAll(".hidden router-outlet").length).toBe(2);
    }

    function assertMenuLayout() {
      // Should have all 4 router-outlets
      expect(spec.queryAll("router-outlet").length).toBe(4);
      expect(spec.queryAll(".hidden router-outlet").length).toBe(0);
    }

    it("should default to fullscreen", () => {
      setup();
      spec.detectChanges();
      assertFullscreen();
    });

    it("should set menu layout if fullscreen is undefined", () => {
      setup(createFirstChild(1, { pageInfo: { fullscreen: undefined } }));
      spec.detectChanges();
      assertFullscreen();
    });

    it("should detect fullscreen component", () => {
      setup(createFirstChild(1, createPageComponent(true)));
      updatePageLayout(false);
      assertFullscreen();
    });

    it("should detect menu layout component", () => {
      setup(createFirstChild(1, createPageComponent(false)));
      updatePageLayout(true);
      assertMenuLayout();
    });

    it("should detect nested fullscreen component", () => {
      setup(createFirstChild(5, createPageComponent(true)));
      updatePageLayout(false);
      assertFullscreen();
    });

    it("should detect nested menu layout component", () => {
      setup(createFirstChild(5, createPageComponent(false)));
      updatePageLayout(true);
      assertMenuLayout();
    });

    it("should default to fullscreen if no page component found", () => {
      setup(createFirstChild(1, {}));
      updatePageLayout(false);
      assertFullscreen();
    });

    it("should default to fullscreen if no component found", () => {
      setup(createFirstChild(1, undefined));
      updatePageLayout(false);
      assertFullscreen();
    });

    it("should default to fullscreen after depth of 50 components reached", () => {
      setup(createFirstChild(51, createPageComponent(false)));
      updatePageLayout(false);
      assertFullscreen();
    });
  });

  // TODO Add tests for router events
  // TODO Add tests for progress bar
});

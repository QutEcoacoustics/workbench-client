import { RouterTestingModule } from "@angular/router/testing";
import { MockBawApiModule } from "@baw-api/baw-apiMock.module";
import { MockDirectivesModule } from "@directives/directives.mock.module";
import { MenuToggleComponent } from "@menu/menu-toggle/menu-toggle.component";
import { PrimaryMenuComponent } from "@menu/primary-menu/primary-menu.component";
import { createComponentFactory, Spectator } from "@ngneat/spectator";
import { ConfigService } from "@services/config/config.service";
import { MenuService } from "@services/menu/menu.service";
import { viewports } from "@test/helpers/general";
import { MockComponent, MockProvider } from "ng-mocks";
import { ToastrService } from "ngx-toastr";
import { HeaderComponent } from "./header.component";

describe("HeaderComponent", () => {
  let config: ConfigService;
  let menu: MenuService;
  let spec: Spectator<HeaderComponent>;
  const createComponent = createComponentFactory({
    component: HeaderComponent,
    providers: [
      MockProvider(ToastrService),
      MockProvider(MenuService, { isFullscreen: false }),
    ],
    declarations: [
      MockComponent(MenuToggleComponent),
      MockComponent(PrimaryMenuComponent),
    ],
    imports: [RouterTestingModule, MockBawApiModule, MockDirectivesModule],
  });

  beforeEach(() => {
    spec = createComponent();
    menu = spec.inject(MenuService);
    config = spec.inject(ConfigService);
  });

  afterEach(() => {
    viewport.reset();
  });

  describe("menu toggle", () => {
    function getMenuToggle() {
      return spec.query("baw-menu-toggle");
    }

    function setFullscreen() {
      (menu as any).isFullscreen = true;
      spec.detectChanges();
    }
    it("should show on fullscreen layout", () => {
      setFullscreen();
      expect(getMenuToggle()).toHaveComputedStyle({ display: "block" });
    });

    it("should show on menu layouts", () => {
      expect(getMenuToggle()).toHaveComputedStyle({ display: "block" });
    });
  });

  describe("config", () => {
    it("should read brand name from config", () => {
      expect(spec.query(".navbar-brand")).toHaveText(
        config.settings.brand.short
      );
    });
  });

  describe("primary menu", () => {
    function getPrimaryMenu() {
      return spec.query("baw-primary-menu");
    }

    it("should fill remaining room in header", () => {
      viewport.set(viewports.large);
      expect(getPrimaryMenu()).toHaveComputedStyle({
        flexGrow: "1",
      });
    });
  });
});

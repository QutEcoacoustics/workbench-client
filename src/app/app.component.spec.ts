import { Title } from "@angular/platform-browser";
import { RouterTestingModule } from "@angular/router/testing";
import { MockBawApiModule } from "@baw-api/baw-apiMock.module";
import { DEFAULT_MENU } from "@helpers/page/defaultMenus";
import { mockDefaultMenu } from "@helpers/page/defaultMenus.spec";
import { IPageInfo } from "@helpers/page/pageInfo";
import { ActionMenuComponent } from "@menu/action-menu/action-menu.component";
import { PrimaryMenuComponent } from "@menu/primary-menu/primary-menu.component";
import { SecondaryMenuComponent } from "@menu/secondary-menu/secondary-menu.component";
import { SideNavComponent } from "@menu/side-nav/side-nav.component";
import { MockModel } from "@models/AbstractModel.spec";
import {
  createRoutingFactory,
  mockProvider,
  SpectatorRouting,
} from "@ngneat/spectator";
import { LoadingBarComponent, LoadingBarService } from "@ngx-loading-bar/core";
import { ConfigService } from "@services/config/config.service";
import { MenuService } from "@services/menu/menu.service";
import { SharedActivatedRouteService } from "@services/shared-activated-route/shared-activated-route.service";
import { FooterComponent } from "@shared/footer/footer.component";
import { HeaderComponent } from "@shared/menu/header/header.component";
import { generateBawApiError } from "@test/fakes/BawApiError";
import { generatePageInfo } from "@test/fakes/PageInfo";
import { generatePageInfoResolvers } from "@test/helpers/general";
import { MockComponent } from "ng-mocks";
import { Subject } from "rxjs";
import { AppComponent } from "./app.component";

describe("AppComponent", () => {
  const eventSubject = new Subject();
  let spec: SpectatorRouting<AppComponent>;
  const createComponent = createRoutingFactory({
    component: AppComponent,
    declarations: [
      MockComponent(HeaderComponent),
      MockComponent(FooterComponent),
      MockComponent(LoadingBarComponent),
      MockComponent(SideNavComponent),
      MockComponent(PrimaryMenuComponent),
      MockComponent(SecondaryMenuComponent),
      MockComponent(ActionMenuComponent),
    ],
    providers: [
      { provide: DEFAULT_MENU, useValue: mockDefaultMenu },
      MenuService,
      mockProvider(LoadingBarService, { value$: new Subject() }),
    ],
    imports: [RouterTestingModule, MockBawApiModule],
  });

  function setPageInfo(pageInfo: IPageInfo) {
    eventSubject.next(pageInfo);
    spec.detectChanges();
  }

  beforeEach(() => {
    spec = createComponent({
      detectChanges: true,
      providers: [
        mockProvider(SharedActivatedRouteService, { pageInfo: eventSubject }),
      ],
    });
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

  describe("side nav", () => {
    [true, false].forEach((isFullscreen) => {
      describe(`${isFullscreen ? "fullscreen" : "menu layout"}`, () => {
        function assertIsSideNav(el: Element) {
          expect(el).toHaveAttribute("ng-reflect-is-side-nav");
        }

        beforeEach(() => {
          setPageInfo(generatePageInfo({ fullscreen: isFullscreen }));
        });

        it("should have side nav", () => {
          expect(spec.query("baw-side-nav")).toBeTruthy();
        });

        it("should include primary menu", () => {
          const primaryMenu = spec.query("baw-side-nav baw-primary-menu");
          expect(primaryMenu).toBeTruthy();
          assertIsSideNav(primaryMenu);
        });

        it(`should ${
          isFullscreen ? "include" : "not include"
        } secondary menu`, () => {
          const secondaryMenu = spec.query("baw-side-nav baw-secondary-menu");

          if (isFullscreen) {
            expect(secondaryMenu).toBeTruthy();
            assertIsSideNav(secondaryMenu);
          } else {
            expect(secondaryMenu).toBeFalsy();
          }
        });

        it(`should ${
          isFullscreen ? "include" : "not include"
        } action menu`, () => {
          const actionMenu = spec.query("baw-side-nav baw-action-menu");

          if (isFullscreen) {
            expect(actionMenu).toBeTruthy();
            assertIsSideNav(actionMenu);
          } else {
            expect(actionMenu).toBeFalsy();
          }
        });
      });
    });
  });

  describe("monitoring page info updates", () => {
    function assertPageComponent(exists: boolean) {
      const errorOutlet = spec.query("#page #error");
      const pageOutlet = spec.query("#page #primary");

      if (exists) {
        expect(errorOutlet).toBeFalsy("Error outlet should not exist");
        expect(pageOutlet).toBeTruthy("Page outlet should exist");
      } else {
        expect(errorOutlet).toBeTruthy("Error outlet should exist");
        expect(pageOutlet).toBeFalsy("Page outlet should not exist");
      }
    }

    function assertLayout(isFullscreen: boolean) {
      const container = spec.query("#container");
      expect(container).toHaveClass(
        isFullscreen ? "fullscreen" : "menu-layout"
      );

      const secondaryMenu = spec.query("#container baw-secondary-menu");
      const actionMenu = spec.query("#container baw-action-menu");
      if (isFullscreen) {
        expect(secondaryMenu).toBeFalsy("Secondary menu should not exist");
        expect(actionMenu).toBeFalsy("Action menu should not exist");
      } else {
        expect(secondaryMenu).toBeTruthy("Secondary menu should exist");
        expect(actionMenu).toBeTruthy("Action menu should exist");
      }
    }

    it("should set menu layout if fullscreen is undefined", () => {
      setPageInfo(generatePageInfo({ fullscreen: undefined }));
      assertLayout(false);
    });

    it("should detect fullscreen component", () => {
      setPageInfo(generatePageInfo({ fullscreen: true }));
      assertLayout(true);
    });

    it("should detect menu layout component", () => {
      setPageInfo(generatePageInfo({ fullscreen: false }));
      assertLayout(false);
    });

    it("should set page component when resolvers are undefined", () => {
      setPageInfo(generatePageInfo({ resolvers: undefined }));
      assertPageComponent(true);
    });

    it("should set primary outlet when resolvers are successful", () => {
      setPageInfo(
        generatePageInfo(
          generatePageInfoResolvers({
            model: new MockModel({ id: 1 }),
          })
        )
      );
      assertPageComponent(true);
    });

    it("should set error outlet when resolvers are unsuccessful", () => {
      setPageInfo(
        generatePageInfo({
          resolvers: generatePageInfoResolvers({
            error: generateBawApiError(),
          }),
        })
      );
      assertPageComponent(false);
    });
  });

  // TODO Add tests for progress bar
});

import { RouterTestingModule } from "@angular/router/testing";
import { MockBawApiModule } from "@baw-api/baw-apiMock.module";
import { Writeable } from "@helpers/advancedTypes";
import { DEFAULT_MENU } from "@helpers/page/defaultMenus";
import { mockDefaultMenu } from "@helpers/page/defaultMenus.spec";
import { IPageInfo } from "@helpers/page/pageInfo";
import { ActionMenuComponent } from "@menu/action-menu/action-menu.component";
import { PrimaryMenuComponent } from "@menu/primary-menu/primary-menu.component";
import { SecondaryMenuComponent } from "@menu/secondary-menu/secondary-menu.component";
import { SideNavComponent } from "@menu/side-nav/side-nav.component";
import { MockModel } from "@models/AbstractModel.spec";
import { createRoutingFactory, mockProvider, SpectatorRouting } from "@ngneat/spectator";
import { LoadingBarComponent, LoadingBarService } from "@ngx-loading-bar/core";
import { Title } from "@angular/platform-browser";
import { MenuService } from "@services/menu/menu.service";
import { BreadcrumbComponent } from "@shared/breadcrumb/breadcrumb.component";
import { SharedActivatedRouteService } from "@services/shared-activated-route/shared-activated-route.service";
import { FooterComponent } from "@shared/footer/footer.component";
import { HeaderComponent } from "@shared/menu/header/header.component";
import { generateBawApiError } from "@test/fakes/BawApiError";
import { generatePageInfo } from "@test/fakes/PageInfo";
import { generatePageInfoResolvers } from "@test/helpers/general";
import { MockComponent } from "ng-mocks";
import { Subject } from "rxjs";
import { ConfigService } from "@services/config/config.service";
import { RouterStateSnapshot } from "@angular/router";
import { modelData } from "@test/helpers/faker";
import { generateMenuRoute } from "@test/fakes/MenuItem";
import { MenuRoute } from "@interfaces/menusInterfaces";
import { AppComponent, PageTitleStrategy } from "./app.component";
import { CommonRouteTitles } from "./stringConstants";

describe("AppComponent", () => {
  const eventSubject = new Subject<IPageInfo>();
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
      MockComponent(BreadcrumbComponent),
    ],
    providers: [
      { provide: DEFAULT_MENU, useValue: mockDefaultMenu },
      mockProvider(LoadingBarService, { value$: new Subject() }),
      Title,
      PageTitleStrategy,
    ],
    imports: [RouterTestingModule, MockBawApiModule],
  });

  function setPageInfo(pageInfo: IPageInfo) {
    const menuService = spec.inject(MenuService);
    (menuService as Writeable<MenuService>).isFullscreen = pageInfo.fullscreen;
    eventSubject.next(pageInfo);
    spec.detectChanges();
  }

  beforeEach(() => {
    spec = createComponent({
      detectChanges: true,
      providers: [
        mockProvider(MenuService, { isFullscreen: true }),
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

        it("should include secondary menu", () => {
          const secondaryMenu = spec.query("baw-side-nav baw-secondary-menu");
          expect(secondaryMenu).toBeTruthy();
          assertIsSideNav(secondaryMenu);
        });

        it(`should ${isFullscreen ? "include" : "not include"} action menu`, () => {
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
      expect(container).toHaveClass(isFullscreen ? "fullscreen" : "menu-layout");

      const actionMenu = spec.query("#container baw-action-menu");
      if (isFullscreen) {
        expect(actionMenu).toBeFalsy("Action menu should not exist");
      } else {
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
          }),
        ),
      );
      assertPageComponent(true);
    });

    it("should set error outlet when resolvers are unsuccessful", () => {
      setPageInfo(
        generatePageInfo({
          resolvers: generatePageInfoResolvers({
            error: generateBawApiError(),
          }),
        }),
      );
      assertPageComponent(false);
    });
  });

  describe("PageTitleStrategy", () => {
    let titleStrategyInjectable: PageTitleStrategy;
    let titleService: Title;
    let configService: ConfigService;

    function constructRouteState(data = {}): Required<RouterStateSnapshot> {
      return {
        root: {
          firstChild: {
            data,
          },
        },
      } as RouterStateSnapshot;
    }

    function assertRouteTitle(route: MenuRoute, expectedTitle: string): void {
      const mockPageInfo = generatePageInfo({ pageRoute: route });
      const mockRouteState = constructRouteState({ pageRoute: route });
      setPageInfo(mockPageInfo);

      titleStrategyInjectable.updateTitle(mockRouteState);
      const observedTitle = titleService.getTitle();

      expect(observedTitle).toEqual(expectedTitle);
    }

    beforeEach(() => {
      titleStrategyInjectable = spec.fixture.debugElement.injector.get(PageTitleStrategy);
      titleService = spec.fixture.debugElement.injector.get(Title);
      configService = spec.inject(ConfigService);
    });

    it("should have an injected page title strategy", () => {
      expect(titleStrategyInjectable).toBeInstanceOf(PageTitleStrategy);
    });

    // a route without a hierarchy is a route with no `parent` property
    // e.g. <<BrandName>> | Projects
    it("should construct the correct title for a route without a hierarchy", () => {
      const routeTitle = modelData.word.noun();
      const expectedTitle = `${configService.settings.brand.short} | ${routeTitle}`;

      const mockMenuRoute = generateMenuRoute({
        title: () => routeTitle,
      });

      assertRouteTitle(mockMenuRoute, expectedTitle);
    });

    it("should use the menu route label if no title is specified in the menuRoute", () => {
      const mockCategory = "Projects";
      const expectedPageTitle = `${configService.settings.brand.short} | ${mockCategory}`;

      const mockMenuRoute = generateMenuRoute({
        title: undefined,
        label: mockCategory,
      });

      assertRouteTitle(mockMenuRoute, expectedPageTitle);
    });

    it("should prefer to use menuRoute titles over menuRoute labels", () => {
      const mockCategory = modelData.word.noun();
      const mockTitle = modelData.word.noun();
      const expectedPageTitle = `${configService.settings.brand.short} | ${mockTitle}`;

      const mockMenuRoute = generateMenuRoute({
        title: () => mockTitle,
        label: mockCategory,
      });

      assertRouteTitle(mockMenuRoute, expectedPageTitle);
    });

    // this test asserts that multiple routes can be combined correctly to create a title
    // Example: <<BrandName>> | Projects | Cooloola | Edit
    it("should construct the correct title for a nested sub route", () => {
      const projectsTitle = "Projects";
      const projectName = modelData.word.noun();
      const editTitle = CommonRouteTitles.routeEditTitle;
      const expectedTitle = `${configService.settings.brand.short} | ${projectsTitle} | ${projectName} | ${editTitle}`;

      const mockMenuRoute = generateMenuRoute({
        title: () => editTitle,
        parent: generateMenuRoute({
          title: () => projectName,
          parent: generateMenuRoute({
            title: () => projectsTitle,
          }),
        }),
      });

      assertRouteTitle(mockMenuRoute, expectedTitle);
    });

    it("should construct the correct title for a nested sub route with no title specified in menuRoute", () => {
      const projectsListCategory = "Projects";
      const projectName = modelData.word.noun();
      const editCategory = CommonRouteTitles.routeEditTitle;
      const expectedTitle = `${configService.settings.brand.short} | ${projectsListCategory} | ${projectName} | ${editCategory}`;

      const mockMenuRoute = generateMenuRoute({
        title: undefined,
        label: editCategory,
        parent: generateMenuRoute({
          title: () => projectName,
          label: "Project",
          parent: generateMenuRoute({
            title: undefined,
            label: projectsListCategory,
          }),
        }),
      });

      assertRouteTitle(mockMenuRoute, expectedTitle);
    });
  });

  // TODO Add tests for progress bar
});

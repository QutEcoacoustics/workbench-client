import { Title } from "@angular/platform-browser";
import { ConfigService } from "@services/config/config.service";
import { RouterStateSnapshot } from "@angular/router";
import { MenuRoute } from "@interfaces/menusInterfaces";
import { generatePageInfo } from "@test/fakes/PageInfo";
import { IPageInfo } from "@helpers/page/pageInfo";
import { modelData } from "@test/helpers/faker";
import { generateMenuRoute } from "@test/fakes/MenuItem";
import { CommonRouteTitles } from "src/app/stringConstants";
import { createRoutingFactory, mockProvider, SpectatorRouting } from "@ngneat/spectator";
import { AppComponent } from "src/app/app.component";
import { LoadingBarComponent, LoadingBarService } from "@ngx-loading-bar/core";
import { DEFAULT_MENU } from "@helpers/page/defaultMenus";
import { mockDefaultMenu } from "@helpers/page/defaultMenus.spec";
import { Subject } from "rxjs";
import { MockBawApiModule } from "@baw-api/baw-apiMock.module";
import { HeaderComponent } from "@menu/header/header.component";
import { MockComponents } from "ng-mocks";
import { FooterComponent } from "@shared/footer/footer.component";
import { SideNavComponent } from "@menu/side-nav/side-nav.component";
import { PrimaryMenuComponent } from "@menu/primary-menu/primary-menu.component";
import { SecondaryMenuComponent } from "@menu/secondary-menu/secondary-menu.component";
import { BreadcrumbComponent } from "@shared/breadcrumb/breadcrumb.component";
import { ActionMenuComponent } from "@menu/action-menu/action-menu.component";
import { MenuButtonComponent } from "@menu/button/button.component";
import { MenuService } from "@services/menu/menu.service";
import { SharedActivatedRouteService } from "@services/shared-activated-route/shared-activated-route.service";
import { Writeable } from "@helpers/advancedTypes";
import { PageTitleStrategy } from "./page-title-strategy.service";

describe("PageTitleStrategy", () => {
  let titleStrategyInjectable: PageTitleStrategy;
  let titleService: Title;
  let configService: ConfigService;
  const eventSubject = new Subject<IPageInfo>();

  let spec: SpectatorRouting<AppComponent>;

  const createComponent = createRoutingFactory({
    component: AppComponent,
    componentMocks: [LoadingBarComponent],
    providers: [
      { provide: DEFAULT_MENU, useValue: mockDefaultMenu },
      mockProvider(LoadingBarService, { value$: new Subject() }),
      Title,
      PageTitleStrategy,
    ],
    imports: [
      MockBawApiModule,

      ...MockComponents(
        HeaderComponent,
        FooterComponent,
        SideNavComponent,
        PrimaryMenuComponent,
        SecondaryMenuComponent,
        ActionMenuComponent,
        BreadcrumbComponent,
        MenuButtonComponent
      ),
    ],
  });

  beforeEach(() => {
    spec = createComponent({
      detectChanges: true,
      providers: [
        mockProvider(MenuService, { isFullscreen: true }),
        mockProvider(SharedActivatedRouteService, { pageInfo: eventSubject }),
      ],
    });
  });

  function setPageInfo(pageInfo: IPageInfo) {
    const menuService = spec.inject(MenuService);
    (menuService as Writeable<MenuService>).isFullscreen = pageInfo.fullscreen;
    eventSubject.next(pageInfo);
    spec.detectChanges();
  }

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
    titleStrategyInjectable =
      spec.fixture.debugElement.injector.get(PageTitleStrategy);
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

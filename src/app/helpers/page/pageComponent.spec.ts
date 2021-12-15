import { homeCategory } from "@components/home/home.menus";
import { MenuRoute, menuRoute } from "@interfaces/menusInterfaces";
import { generateMenuRoute } from "@test/fakes/MenuItem";
import { PageComponent } from "./pageComponent";
import { IPageInfo, PageInfo } from "./pageInfo";

describe("PageComponents", () => {
  let ngZone: NgZone;
  let spec: SpectatorRouting<AppComponent>;
  let createComponent: SpectatorRoutingFactory<AppComponent>;

  function createHostComponent(component: any, menuItem: MenuRoute) {
    const routes = menuItem.route.compileRoutes(getRouteConfigForPage);

    const overrideComponent = (_comp: any): MetadataOverride<any> => {
      const mock = MockComponent(_comp);
      return {
        remove: { declarations: [_comp], exports: [_comp] },
        add: { declarations: [mock], exports: [mock] },
      };
    };

    return createRoutingFactory({
      component: AppComponent,
      declarations: [component],
      imports: [
        ...appLibraryImports,
        SharedModule,
        RouterTestingModule.withRoutes(routes),
        MockBawApiModule,
      ],
      overrideModules: [
        [HeaderModule, overrideComponent(HeaderComponent)],
        [SharedModule, overrideComponent(FooterComponent)],
      ],
      stubsEnabled: false,
    });
  }

  function assertMenusAreVisible(isVisible: boolean = true) {
    const secondaryMenu = spec.query("#secondary");
    const actionMenu = spec.query("#action");

    if (isVisible) {
      expect(getComputedStyle(secondaryMenu).display).not.toBe("none");
      expect(getComputedStyle(actionMenu).display).not.toBe("none");
    } else {
      expect(getComputedStyle(secondaryMenu).display).toBe("none");
      expect(getComputedStyle(actionMenu).display).toBe("none");
    }
  }

  function getActionMenu() {
    return spec.query(ActionMenuComponent);
  }

  function getSecondaryMenu() {
    return spec.query(SecondaryMenuComponent);
  }

  async function navigate(url: string) {
    ngZone = spec.inject(NgZone);
    await ngZone.run(async () => await spec.router.navigateByUrl(url));
  }

  describe("linkToRouterWith", () => {
    let defaultMenuItem: MenuRoute;

    beforeEach(() => {
      defaultMenuItem = generateMenuRoute();
    });

    it("should write page info to component", () => {
      const iPageInfo: IPageInfo = {
        category: homeCategory,
        pageRoute: defaultMenuItem,
      };

      class DummyComponent extends PageComponent {}
      DummyComponent.linkToRoute(iPageInfo);

      const pageInfo: PageInfo = new PageInfo(iPageInfo);
      pageInfo.setComponent(DummyComponent);

      expect(DummyComponent.pageInfos[0]).toEqual(pageInfo);
    });

    it("should write multiple page info values to component", () => {
      const pages: IPageInfo[] = [
        {
          category: homeCategory,
          pageRoute: menuRoute({ ...defaultMenuItem, label: "Page One" }),
          fullscreen: false,
        },
        {
          category: homeCategory,
          pageRoute: menuRoute({ ...defaultMenuItem, label: "Page One" }),
          fullscreen: true,
        },
      ];

      class DummyComponent extends PageComponent {}
      DummyComponent.linkToRoute(pages[0]).linkToRoute(pages[1]);

      pages.forEach((page) => {
        const pageInfo = new PageInfo(page);
        pageInfo.setComponent(DummyComponent);
        expect(DummyComponent.pageInfos).toContain(pageInfo);
      });
    });

    it("should not interfere with other components", () => {
      class DummyComponentA extends PageComponent {}
      class DummyComponentB extends PageComponent {}
      const menuItemA = menuRoute({ ...defaultMenuItem, label: "Page One" });
      const menuItemB = menuRoute({ ...defaultMenuItem, label: "Page Two" });
      const iPageInfoA = { category: homeCategory, pageRoute: menuItemA };
      const iPageInfoB = { category: homeCategory, pageRoute: menuItemB };

      DummyComponentA.linkToRoute(iPageInfoA);
      DummyComponentB.linkToRoute(iPageInfoB);

      const pageInfoA = new PageInfo(iPageInfoA);
      pageInfoA.setComponent(DummyComponentA);
      const pageInfoB = new PageInfo(iPageInfoB);
      pageInfoB.setComponent(DummyComponentB);

      expect(DummyComponentA.pageInfos).toEqual([pageInfoA]);
      expect(DummyComponentB.pageInfos).toEqual([pageInfoB]);
    });

    it("should return DummyComponent", () => {
      class DummyComponent extends PageComponent {}

      expect(
        DummyComponent.linkToRoute({
          category: homeCategory,
          pageRoute: defaultMenuItem,
        })
      ).toEqual(DummyComponent);
    });

    it("should write menu route to page info", () => {
      class DummyComponent extends PageComponent {}
      DummyComponent.linkToRoute({
        category: homeCategory,
        pageRoute: defaultMenuItem,
      });

      const pageInfo = DummyComponent.pageInfos[0];
      expect(pageInfo.pageRoute).toEqual(defaultMenuItem);
      expect(pageInfo.route).toEqual(defaultMenuItem.route);
    });

    it("should write component to page info", () => {
      class DummyComponent extends PageComponent {}
      DummyComponent.linkToRoute({
        category: homeCategory,
        pageRoute: defaultMenuItem,
      });

      const pageInfo = DummyComponent.pageInfos[0];
      expect(pageInfo.component).toEqual(DummyComponent);
      expect(pageInfo.route.pageComponent).toEqual(DummyComponent);
    });

    it("should return DummyComponent", () => {
      class DummyComponent extends PageComponent {}
      expect(
        DummyComponent.linkToRoute({
          category: homeCategory,
          pageRoute: defaultMenuItem,
        })
      ).toEqual(DummyComponent);
    });
  });
});

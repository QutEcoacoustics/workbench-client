import { Component, NgZone } from "@angular/core";
import { MetadataOverride } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { MockBawApiModule } from "@baw-api/baw-apiMock.module";
import { homeCategory } from "@components/home/home.menus";
import { MenuRoute, menuRoute } from "@interfaces/menusInterfaces";
import { StrongRoute } from "@interfaces/strongRoute";
import {
  createRoutingFactory,
  SpectatorRouting,
  SpectatorRoutingFactory,
} from "@ngneat/spectator";
import { ActionMenuComponent } from "@shared/action-menu/action-menu.component";
import { FooterComponent } from "@shared/footer/footer.component";
import { HeaderComponent } from "@shared/header/header.component";
import { HeaderModule } from "@shared/header/header.module";
import { SecondaryMenuComponent } from "@shared/secondary-menu/secondary-menu.component";
import { SharedModule } from "@shared/shared.module";
import { modelData } from "@test/helpers/faker";
import { List } from "immutable";
import { MockComponent } from "ng-mocks";
import { AppComponent } from "src/app/app.component";
import { appLibraryImports } from "src/app/app.module";
import { PageComponent } from "./pageComponent";
import { IPageInfo, PageInfo } from "./pageInfo";
import { getRouteConfigForPage } from "./pageRouting";

function createMenuItem(id: number) {
  return menuRoute({
    label: "Menu Item #" + id,
    icon: ["fas", "angry"],
    route: StrongRoute.newRoot().addFeatureModule(modelData.random.word()),
    tooltip: () => "Custom Tooltip #" + id,
  });
}

const menuCompRoute = StrongRoute.newRoot().addFeatureModule("");
const menuCompMenuItem = menuRoute({
  icon: ["fas", "ad"],
  label: "Menu Item",
  route: menuCompRoute,
  tooltip: () => "tooltip",
});
const customSecondaryLinks = List([createMenuItem(1), createMenuItem(2)]);
const customActionLinks = List([createMenuItem(3), createMenuItem(4)]);

@Component({
  selector: "baw-test",
  template: "",
})
class MenuComponent extends PageComponent {}
MenuComponent.linkToRoute({
  category: homeCategory,
  pageRoute: menuCompMenuItem,
  fullscreen: false,
  menus: { links: customSecondaryLinks, actions: customActionLinks },
});

const fullscreenCompRoute = StrongRoute.newRoot().addFeatureModule("");
const fullscreenCompMenuItem = menuRoute({
  ...menuCompMenuItem,
  route: fullscreenCompRoute,
});

@Component({
  selector: "baw-test",
  template: "",
})
class FullscreenComponent extends PageComponent {}
FullscreenComponent.linkToRoute({
  category: homeCategory,
  pageRoute: fullscreenCompMenuItem,
  fullscreen: true,
});

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
    let defaultRoute: StrongRoute;
    let defaultMenuItem: MenuRoute;

    beforeEach(() => {
      defaultRoute = StrongRoute.newRoot();
      defaultMenuItem = menuRoute({
        icon: ["fas", "home"],
        label: "Menu Item",
        route: defaultRoute,
        tooltip: () => "tooltip",
      });
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
      expect(pageInfo.route).toEqual(defaultRoute);
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

  describe("Menu Layout", () => {
    createComponent = createHostComponent(MenuComponent, menuCompMenuItem);

    beforeEach(() => (spec = createComponent()));

    it("should create menus", async () => {
      await navigate(menuCompRoute.toRouterLink());
      spec.detectChanges();
      assertMenusAreVisible();
    });

    it("should insert page component self links in secondary menu", async () => {
      await navigate(menuCompRoute.toRouterLink());
      spec.detectChanges();
      expect(getSecondaryMenu().links).toContain(menuCompMenuItem);
    });

    it("should insert page component custom links in secondary menu", async () => {
      await navigate(menuCompRoute.toRouterLink());
      spec.detectChanges();
      const menuLabels = getSecondaryMenu().links.map((link) => link.label);
      customSecondaryLinks.forEach((link) =>
        expect(menuLabels).toContain(link.label)
      );
    });

    it("should insert page component custom actions in action menu", async () => {
      await navigate(menuCompRoute.toRouterLink());
      spec.detectChanges();
      const menuLabels = getActionMenu().links.map((link) => link.label);
      customActionLinks.forEach((link) =>
        expect(menuLabels).toContain(link.label)
      );
    });
  });

  describe("Fullscreen Layout", () => {
    createComponent = createHostComponent(
      FullscreenComponent,
      fullscreenCompMenuItem
    );

    beforeEach(() => (spec = createComponent()));

    it("should not create menus", async () => {
      await navigate(fullscreenCompRoute.toRouterLink());
      spec.detectChanges();
      assertMenusAreVisible(false);
    });
  });
});

import { RouterTestingModule } from "@angular/router/testing";
import { IPageInfo } from "@helpers/page/pageInfo";
import {
  Category,
  MenuLink,
  menuLink,
  MenuRoute,
  menuRoute,
  NavigableMenuItem,
} from "@interfaces/menusInterfaces";
import { StrongRoute } from "@interfaces/strongRoute";
import { MenuComponent } from "@menu/menu.component";
import { MockWidgetComponent } from "@menu/menu.component.spec";
import { WidgetMenuItem } from "@menu/widgetItem";
import { createRoutingFactory, SpectatorRouting } from "@ngneat/spectator";
import { List } from "immutable";
import { MockComponent } from "ng-mocks";
import { SecondaryMenuComponent } from "./secondary-menu.component";

const mockMenu = MockComponent(MenuComponent);

//TODO Validate widgets are sent to menu component
describe("SecondaryMenuComponent", () => {
  let defaultRoute: StrongRoute;
  let defaultPageRoute: MenuRoute;
  let defaultWidget: WidgetMenuItem;
  let defaultMenuRoute: MenuRoute;
  let defaultMenuLink: MenuLink;
  let spec: SpectatorRouting<SecondaryMenuComponent>;
  const createComponent = createRoutingFactory({
    component: SecondaryMenuComponent,
    imports: [RouterTestingModule],
    declarations: [mockMenu],
  });

  function setup(data: IPageInfo) {
    spec = createComponent({ data, detectChanges: false });
    setDefaultLinks(List());
  }

  function setDefaultLinks(links: List<NavigableMenuItem>) {
    spec.component["defaultLinks"] = links;
  }

  function getMenu() {
    return spec.query(mockMenu);
  }

  beforeEach(() => {
    defaultRoute = StrongRoute.newRoot().add("");
    defaultWidget = new WidgetMenuItem(MockWidgetComponent);
    defaultMenuRoute = menuRoute({
      label: "Menu Route",
      icon: ["fas", "ad"],
      tooltip: () => "Tooltip",
      route: defaultRoute,
    });
    defaultMenuLink = menuLink({
      label: "Menu Link",
      icon: ["fas", "ad"],
      tooltip: () => "Tooltip",
      uri: () => "https://broken_link/",
    });
    defaultPageRoute = menuRoute({ ...defaultMenuRoute, order: 999 });
  });

  it("should create menu component", () => {
    setup({ pageRoute: defaultPageRoute });
    spec.detectChanges();
    expect(getMenu()).toBeInstanceOf(MenuComponent);
  });

  it("should set menu to secondary menu", () => {
    setup({ pageRoute: defaultPageRoute });
    spec.detectChanges();
    expect(getMenu().menuType).toBe("secondary");
  });

  describe("category", () => {
    it("should display secondary title", () => {
      setup({ pageRoute: defaultPageRoute });
      spec.detectChanges();
      expect(getMenu().title).toBe(undefined);
    });

    it("should not display custom category title", () => {
      const category: Category = {
        label: "Custom Category",
        icon: ["fas", "home"],
        route: defaultRoute,
      };
      setup({ pageRoute: defaultPageRoute, category });
      spec.detectChanges();
      expect(getMenu().title).toBe(undefined);
    });
  });

  describe("links", () => {
    it("should handle undefined links", () => {
      setup({ pageRoute: defaultPageRoute, menus: { links: undefined } });
      spec.detectChanges();
      expect(getMenu().links.toArray()).toEqual([defaultPageRoute]);
    });

    it("should handle mixed links", () => {
      setup({
        pageRoute: defaultPageRoute,
        menus: {
          links: List([defaultMenuRoute, defaultMenuLink]),
        },
      });
      spec.detectChanges();
      expect(getMenu().links.toArray()).toEqual([
        defaultMenuRoute,
        defaultMenuLink,
        defaultPageRoute,
      ]);
    });

    it("should create self link", () => {
      setup({ pageRoute: defaultPageRoute, menus: { links: List([]) } });
      spec.detectChanges();
      expect(getMenu().links.toArray()).toEqual([defaultPageRoute]);
    });

    it("should create default links", () => {
      const defaultLinks = [
        menuRoute({ ...defaultMenuRoute, label: "Custom Label A" }),
        menuRoute({ ...defaultMenuRoute, label: "Custom Label B" }),
        menuRoute({ ...defaultMenuRoute, label: "Custom Label C" }),
      ];

      setup({ pageRoute: defaultPageRoute, menus: { links: List([]) } });
      setDefaultLinks(List(defaultLinks));
      spec.detectChanges();
      expect(getMenu().links.toArray()).toEqual([
        ...defaultLinks,
        defaultPageRoute,
      ]);
    });

    describe("self link", () => {
      let grandParentMenuItem: MenuRoute;
      let parentMenuItem: MenuRoute;
      let childMenuItem: MenuRoute;

      beforeEach(() => {
        const grandParentRoute = StrongRoute.newRoot().add("home");
        const parentRoute = grandParentRoute.add("house");
        const childRoute = parentRoute.add("door");

        grandParentMenuItem = menuRoute({
          ...defaultMenuLink,
          label: "GrandParent Label",
          route: grandParentRoute,
        });
        parentMenuItem = menuRoute({
          ...defaultMenuLink,
          label: "Parent Label",
          parent: grandParentMenuItem,
          route: parentRoute,
        });
        childMenuItem = menuRoute({
          ...defaultPageRoute,
          label: "Child Label",
          parent: parentMenuItem,
          route: childRoute,
        });
      });

      it("should append full lineage of self link to menu", () => {
        setup({ pageRoute: childMenuItem });
        spec.detectChanges();
        expect(getMenu().links.toArray()).toEqual([
          grandParentMenuItem,
          parentMenuItem,
          childMenuItem,
        ]);
      });

      it("should set self link menu item to active", () => {
        setup({ pageRoute: defaultPageRoute });
        spec.detectChanges();
        expect(getMenu().links.toArray()[0].active).toBeTrue();
      });

      it("should set all parent menu items to active", () => {
        setup({ pageRoute: childMenuItem });
        spec.detectChanges();
        getMenu()
          .links.toArray()
          .forEach((link) => expect(link.active).toBeTrue());
      });
    });
  });

  describe("internal links", () => {
    it("should handle single link", () => {
      setup({
        pageRoute: defaultPageRoute,
        menus: { links: List([defaultMenuRoute]) },
      });
      spec.detectChanges();
      expect(getMenu().links.toArray()).toEqual([
        defaultMenuRoute,
        defaultPageRoute,
      ]);
    });

    it("should handle multiple links", () => {
      const links = [
        menuRoute({ ...defaultMenuRoute, label: "Custom Link 1" }),
        menuRoute({ ...defaultMenuRoute, label: "Custom Link 2" }),
      ];
      setup({ pageRoute: defaultPageRoute, menus: { links: List(links) } });
      spec.detectChanges();
      expect(getMenu().links.toArray()).toEqual([...links, defaultPageRoute]);
    });
  });

  describe("external links", () => {
    it("should handle single link", () => {
      setup({
        pageRoute: defaultPageRoute,
        menus: { links: List([defaultMenuLink]) },
      });
      spec.detectChanges();
      expect(getMenu().links.toArray()).toEqual([
        defaultMenuLink,
        defaultPageRoute,
      ]);
    });

    it("should handle multiple links", () => {
      const links = [
        menuLink({ ...defaultMenuLink, label: "Custom Link 1" }),
        menuLink({ ...defaultMenuLink, label: "Custom Link 2" }),
      ];
      setup({ pageRoute: defaultPageRoute, menus: { links: List(links) } });
      spec.detectChanges();
      expect(getMenu().links.toArray()).toEqual([...links, defaultPageRoute]);
    });
  });

  describe("widgets", () => {
    it("should handle single widget", () => {
      setup({
        pageRoute: defaultPageRoute,
        menus: { links: List(), linkWidgets: List([defaultWidget]) },
      });
      spec.detectChanges();
      expect(getMenu().widgets.toArray()).toEqual([defaultWidget]);
    });

    it("should handle multiple widgets", () => {
      const widgets = [
        new WidgetMenuItem(MockWidgetComponent),
        new WidgetMenuItem(MockWidgetComponent),
      ];
      setup({
        pageRoute: defaultPageRoute,
        menus: { links: List(), linkWidgets: List(widgets) },
      });
      spec.detectChanges();
      expect(getMenu().widgets.toArray()).toEqual(widgets);
    });
  });
});

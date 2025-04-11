import { menuLink, MenuLink, menuRoute, MenuRoute, NavigableMenuItem } from "@interfaces/menusInterfaces";
import { StrongRoute } from "@interfaces/strongRoute";
import { MenuComponent } from "@menu/menu/menu.component";
import { MockWidgetComponent } from "@menu/menu/menu.component.spec";
import { WidgetMenuItem } from "@menu/widgetItem";
import { createRoutingFactory, SpectatorRouting } from "@ngneat/spectator";
import { ActionMenuData, MenuService, MenuServiceData } from "@services/menu/menu.service";
import { OrderedSet } from "immutable";
import { MockComponent, MockProvider } from "ng-mocks";
import { of } from "rxjs";
import { ActionMenuComponent } from "./action-menu.component";

describe("ActionMenuComponent", () => {
  let defaultRoute: StrongRoute;
  let defaultWidget: WidgetMenuItem;
  let defaultMenuRoute: MenuRoute;
  let defaultMenuLink: MenuLink;
  let spec: SpectatorRouting<ActionMenuComponent>;
  const createComponent = createRoutingFactory({
    component: ActionMenuComponent,
    declarations: [MockComponent(MenuComponent)],
  });

  function getMenu() {
    return spec.query(MenuComponent);
  }

  function setup(actionMenu?: Partial<ActionMenuData>) {
    spec = createComponent({
      providers: [
        MockProvider(MenuService, {
          menuUpdate: of({
            actionMenu: {
              links: actionMenu?.links ?? OrderedSet(),
              widgets: actionMenu?.widgets ?? OrderedSet(),
            },
          } as Partial<MenuServiceData> as MenuServiceData),
        }),
      ],
    });
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
  });

  it("should create menu component", () => {
    setup();
    spec.detectChanges();
    expect(getMenu()).toBeInstanceOf(MenuComponent);
  });

  it("should set menu to action menu", () => {
    setup();
    spec.detectChanges();
    expect(getMenu().menuType).toBe("action");
  });

  it("should display menu title", () => {
    setup();
    spec.detectChanges();
    // Menu component will set title to MENU if title undefined
    expect(getMenu().title).toBe(undefined);
  });

  describe("links", () => {
    function assertLinks(links: OrderedSet<NavigableMenuItem>) {
      const menu = getMenu();
      expect(menu.links).toEqual(links);
    }

    it("should handle empty set of links", () => {
      setup({ links: OrderedSet() });
      spec.detectChanges();
      assertLinks(OrderedSet());
    });

    it("should handle single internal link", () => {
      const links = OrderedSet([defaultMenuRoute]);
      setup({ links });
      spec.detectChanges();
      assertLinks(links);
    });

    it("should handle single external link", () => {
      const links = OrderedSet([defaultMenuLink]);
      setup({ links });
      spec.detectChanges();
      assertLinks(links);
    });

    it("should handle multiple links", () => {
      const links = OrderedSet([defaultMenuLink, defaultMenuRoute]);
      setup({ links });
      spec.detectChanges();
      assertLinks(links);
    });
  });

  describe("widgets", () => {
    function assertWidgets(widgets: OrderedSet<WidgetMenuItem>) {
      const menu = getMenu();
      expect(menu.widgets).toEqual(widgets);
    }

    it("should handle single widget", () => {
      const widgets = OrderedSet([defaultWidget]);
      setup({ widgets });
      spec.detectChanges();
      assertWidgets(widgets);
    });

    it("should handle multiple widgets", () => {
      const widgets = OrderedSet([new WidgetMenuItem(MockWidgetComponent), new WidgetMenuItem(MockWidgetComponent)]);
      setup({ widgets });
      spec.detectChanges();
      assertWidgets(widgets);
    });
  });
});

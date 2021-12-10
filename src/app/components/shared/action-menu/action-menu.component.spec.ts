import { RouterTestingModule } from "@angular/router/testing";
import { defaultMenu } from "@helpers/page/defaultMenus";
import { IPageInfo } from "@helpers/page/pageInfo";
import {
  Category,
  MenuAction,
  menuAction,
  MenuLink,
  menuLink,
  MenuRoute,
  menuRoute,
} from "@interfaces/menusInterfaces";
import { StrongRoute } from "@interfaces/strongRoute";
import { MenuComponent } from "@menu/menu.component";
import {
  MockModalComponent,
  MockWidgetComponent,
} from "@menu/menu.component.spec";
import {
  menuModal,
  MenuModalWithoutAction,
  WidgetMenuItem,
} from "@menu/widgetItem";
import { createRoutingFactory, SpectatorRouting } from "@ngneat/spectator";
import { List } from "immutable";
import { MockComponent } from "ng-mocks";
import { ActionMenuComponent } from "./action-menu.component";

const mockMenu = MockComponent(MenuComponent);

describe("ActionMenuComponent", () => {
  let defaultRoute: StrongRoute;
  let defaultCategory: Category;
  let defaultPageRoute: MenuRoute;
  let defaultMenuModal: MenuModalWithoutAction;
  let defaultWidget: WidgetMenuItem;
  let defaultMenuRoute: MenuRoute;
  let defaultMenuLink: MenuLink;
  let defaultMenuAction: MenuAction;
  let spec: SpectatorRouting<ActionMenuComponent>;
  const createComponent = createRoutingFactory({
    component: ActionMenuComponent,
    imports: [RouterTestingModule],
    declarations: [mockMenu],
  });

  function setup(data: IPageInfo) {
    spec = createComponent({ data });
  }

  function getMenu() {
    return spec.query(mockMenu);
  }

  beforeEach(() => {
    defaultRoute = StrongRoute.newRoot().add("");
    defaultCategory = {
      label: "Category",
      icon: ["fas", "home"],
      route: defaultRoute,
    };
    defaultWidget = new WidgetMenuItem(MockWidgetComponent);
    defaultMenuModal = menuModal({
      icon: ["fas", "home"],
      label: "label",
      tooltip: () => "tooltip",
      component: MockModalComponent,
      pageData: {},
      modalOpts: {},
    });
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
    defaultMenuAction = menuAction({
      label: "Menu Action",
      icon: ["fas", "ad"],
      tooltip: () => "Tooltip",
      action: () => {},
    });
    defaultPageRoute = menuRoute({ ...defaultMenuRoute, order: 999 });
  });

  it("should create menu component", () => {
    setup({ pageRoute: defaultPageRoute });
    spec.detectChanges();
    expect(getMenu()).toBeInstanceOf(MenuComponent);
  });

  it("should set menu to action menu", () => {
    setup({ pageRoute: defaultPageRoute });
    spec.detectChanges();
    expect(getMenu().menuType).toBe("action");
  });

  describe("category", () => {
    it("should display default category", () => {
      setup({ pageRoute: defaultPageRoute });
      spec.detectChanges();
      expect(getMenu().title).toEqual(defaultMenu.defaultCategory);
    });

    it("should display custom category", () => {
      const category: Category = {
        ...defaultCategory,
        label: "Custom Category",
      };
      setup({ pageRoute: defaultPageRoute, category });
      spec.detectChanges();
      expect(getMenu().title).toEqual(category);
    });
  });

  describe("links", () => {
    it("should handle undefined links", () => {
      setup({
        pageRoute: defaultPageRoute,
        menus: { actions: undefined },
      });
      spec.detectChanges();
      expect(getMenu().links.toArray()).toEqual([]);
    });

    it("should handle no links", () => {
      setup({
        pageRoute: defaultPageRoute,
        menus: { actions: List([]) },
      });
      spec.detectChanges();
      expect(getMenu().links.toArray()).toEqual([]);
    });

    it("should handle mixed links", () => {
      const actions = [
        defaultMenuRoute,
        defaultMenuLink,
        defaultMenuAction,
        defaultMenuModal,
      ];

      setup({ pageRoute: defaultPageRoute, menus: { actions: List(actions) } });
      spec.detectChanges();
      expect(getMenu().links.toArray()).toEqual(actions);
    });
  });

  describe("internal links", () => {
    it("should handle single link", () => {
      setup({
        pageRoute: defaultPageRoute,
        menus: { actions: List([defaultMenuRoute]) },
      });
      spec.detectChanges();
      expect(getMenu().links.toArray()).toEqual([defaultMenuRoute]);
    });

    it("should handle multiple links", () => {
      const actions = [
        menuRoute({ ...defaultMenuRoute, label: "Custom Link 1" }),
        menuRoute({ ...defaultMenuRoute, label: "Custom Link 2" }),
      ];
      setup({ pageRoute: defaultPageRoute, menus: { actions: List(actions) } });
      spec.detectChanges();
      expect(getMenu().links.toArray()).toEqual(actions);
    });
  });

  describe("external links", () => {
    it("should handle single link", () => {
      setup({
        pageRoute: defaultPageRoute,
        menus: { actions: List([defaultMenuLink]) },
      });
      spec.detectChanges();
      expect(getMenu().links.toArray()).toEqual([defaultMenuLink]);
    });

    it("should handle multiple links", () => {
      const actions = [
        menuLink({ ...defaultMenuLink, label: "Custom Link 1" }),
        menuLink({ ...defaultMenuLink, label: "Custom Link 2" }),
      ];
      setup({ pageRoute: defaultPageRoute, menus: { actions: List(actions) } });
      spec.detectChanges();
      expect(getMenu().links.toArray()).toEqual(actions);
    });
  });

  describe("action buttons", () => {
    it("should handle single link", () => {
      setup({
        pageRoute: defaultPageRoute,
        menus: { actions: List([defaultMenuAction]) },
      });
      spec.detectChanges();
      expect(getMenu().links.toArray()).toEqual([defaultMenuAction]);
    });

    it("should handle multiple links", () => {
      const actions = [
        menuAction({ ...defaultMenuAction, label: "Custom Link 1" }),
        menuAction({ ...defaultMenuAction, label: "Custom Link 2" }),
      ];
      setup({ pageRoute: defaultPageRoute, menus: { actions: List(actions) } });
      spec.detectChanges();
      expect(getMenu().links.toArray()).toEqual(actions);
    });
  });

  describe("modals", () => {
    it("should handle single modal", () => {
      setup({
        pageRoute: defaultPageRoute,
        menus: { actions: List([defaultMenuModal]) },
      });
      spec.detectChanges();
      expect(getMenu().links.toArray()).toEqual([defaultMenuModal]);
    });

    it("should handle multiple modals", () => {
      const actions = [
        menuModal({ ...defaultMenuModal, label: "Custom Link 1" }),
        menuModal({ ...defaultMenuModal, label: "Custom Link 2" }),
      ];
      setup({ pageRoute: defaultPageRoute, menus: { actions: List(actions) } });
      spec.detectChanges();
      expect(getMenu().links.toArray()).toEqual(actions);
    });
  });

  describe("widgets", () => {
    it("should handle single widget", () => {
      setup({
        pageRoute: defaultPageRoute,
        menus: { actions: List(), actionWidgets: List([defaultWidget]) },
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
        menus: { actions: List(), actionWidgets: List(widgets) },
      });
      spec.detectChanges();
      expect(getMenu().widgets.toArray()).toEqual(widgets);
    });
  });
});

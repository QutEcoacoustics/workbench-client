import {
  shouldNotComplete,
  shouldNotFail,
} from "@baw-api/baw-api.service.spec";
import { SecurityService } from "@baw-api/security/security.service";
import { homeCategory, homeMenuItem } from "@components/home/home.menus";
import { DEFAULT_MENU, IDefaultMenu } from "@helpers/page/defaultMenus";
import { mockDefaultMenu } from "@helpers/page/defaultMenus.spec";
import { IPageInfo, isIPageInfo } from "@helpers/page/pageInfo";
import {
  AnyMenuItem,
  Category,
  MenuAction,
  MenuItem,
  MenuLink,
  MenuRoute,
  Menus,
  NavigableMenuItem,
} from "@interfaces/menusInterfaces";
import { StrongRoute } from "@interfaces/strongRoute";
import { MockWidgetComponent } from "@menu/menu/menu.component.spec";
import { PermissionsShieldComponent } from "@menu/permissions-shield.component";
import { MenuModalWithoutAction, WidgetMenuItem } from "@menu/widgetItem";
import { Session } from "@models/User";
import {
  createServiceFactory,
  mockProvider,
  SpectatorService,
} from "@ngneat/spectator";
import { ConfigService } from "@services/config/config.service";
import { SharedActivatedRouteService } from "@services/shared-activated-route/shared-activated-route.service";
import {
  generateCategory,
  generateMenuAction,
  generateMenuLink,
  generateMenuModalWithoutAction,
  generateMenuRoute,
} from "@test/fakes/MenuItem";
import { generateSessionUser } from "@test/fakes/User";
import { List, OrderedSet } from "immutable";
import { BehaviorSubject, Subject } from "rxjs";
import { MenuService, MenuServiceData } from "./menu.service";

describe("MenuService", () => {
  let localUser: Session;
  let authTrigger: Subject<void>;
  let pageInfo: BehaviorSubject<IPageInfo>;
  let spec: SpectatorService<MenuService>;
  const createService = createServiceFactory(MenuService);

  function setup(inputs: {
    fullscreen?: boolean;
    pageRoute?: MenuRoute;
    menuData?: Partial<Menus>;
    defaultMenu?: IDefaultMenu;
    hideProjects?: boolean;
    category?: Category;
  }) {
    const data: IPageInfo = {
      fullscreen: inputs.fullscreen ?? true,
      pageRoute: inputs.pageRoute ?? homeMenuItem,
      category: inputs.category,
      menus: {
        actions: List(),
        actionWidgets: List(),
        links: List(),
        linkWidgets: List(),
        ...inputs.menuData,
      },
    };
    pageInfo = new BehaviorSubject(data);
    authTrigger = new Subject();

    spec = createService({
      providers: [
        mockProvider(ConfigService, {
          settings: { hideProjects: inputs.hideProjects ?? false },
        }),
        mockProvider(SecurityService, {
          getAuthTrigger: () => authTrigger,
          getLocalUser: () => localUser,
        }),
        mockProvider(SharedActivatedRouteService, { pageInfo }),
        {
          provide: DEFAULT_MENU,
          useValue: inputs.defaultMenu ?? mockDefaultMenu,
        },
      ],
    });
  }

  function setLocalUser(user: Session) {
    localUser = user;
    authTrigger.next();
  }

  function setPageInfo(
    fullscreen: boolean,
    menus: Partial<Menus> = {},
    pageRoute: MenuRoute = homeMenuItem
  ) {
    const _pageInfo: IPageInfo = {
      fullscreen,
      pageRoute,
      menus: {
        actions: List(),
        actionWidgets: List(),
        links: List(),
        linkWidgets: List(),
        ...menus,
      },
    };
    pageInfo.next(_pageInfo);
    return _pageInfo;
  }

  function validateState(
    actualState: MenuServiceData,
    expectedState: Partial<MenuServiceData>
  ) {
    expectedState = {
      hasActions: false,
      isFullscreen: false,
      isMenuOpen: false,
      ...expectedState,
    };

    Object.entries(expectedState).forEach((entry) => {
      const key = entry[0];
      const expected = entry[1];
      const actual = actualState[key];
      expect(actual).toEqual(expected);
    });
  }

  function validateStateForEachUpdate(
    done: DoneFn,
    ...states: Partial<MenuServiceData>[]
  ) {
    let counter = 0;
    spec.service.menuUpdate.subscribe({
      next: (state) => {
        validateState(state, states[counter]);
        if (counter === states.length - 1) {
          done();
        }
        counter++;
      },
      error: shouldNotFail,
      complete: shouldNotComplete,
    });
  }

  describe("initial state", () => {
    it("should set defaults when fullscreen is false", () => {
      setup({ fullscreen: false });
      validateState(spec.service, {});
    });

    it("should set defaults when fullscreen is true", () => {
      setup({ fullscreen: true });
      validateState(spec.service, { isFullscreen: true });
    });

    it("should set defaults when action menu has links", () => {
      setup({
        fullscreen: true,
        menuData: { actions: List([homeMenuItem]) },
      });
      validateState(spec.service, { isFullscreen: true, hasActions: true });
    });

    it("should set menu update initial value", (done) => {
      setup({ fullscreen: true });
      spec.service.menuUpdate.subscribe({
        next: (state) => {
          validateState(state, { isFullscreen: true });
          done();
        },
        error: shouldNotFail,
        complete: shouldNotComplete,
      });
    });
  });

  describe("pageInfo", () => {
    it("should update state on page info update", (done) => {
      setup({ fullscreen: true });
      validateStateForEachUpdate(
        done,
        { isFullscreen: true, hasActions: false },
        { isFullscreen: false, hasActions: true }
      );
      setPageInfo(false, { actions: List([homeMenuItem]) });
    });

    it("should close menus on page info update", (done) => {
      setup({ fullscreen: true });
      validateStateForEachUpdate(
        done,
        { isFullscreen: true, isMenuOpen: false },
        { isFullscreen: true, isMenuOpen: true },
        { isFullscreen: false, isMenuOpen: false }
      );
      spec.service.openMenu();
      setPageInfo(false);
    });

    it("should update pageInfo on page info update", (done) => {
      setup({ fullscreen: false });
      const initialPageInfo = setPageInfo(true);
      validateStateForEachUpdate(
        done,
        { isFullscreen: true, pageInfo: initialPageInfo },
        {
          isFullscreen: false,
          pageInfo: { ...initialPageInfo, fullscreen: false },
        },
        {
          isFullscreen: true,
          pageInfo: { ...initialPageInfo, fullscreen: true },
        }
      );
      setPageInfo(false);
      setPageInfo(true);
    });
  });

  describe("hasActions", () => {
    function validateHasActions(hasActions: boolean): void {
      expect(spec.service.hasActions).toBe(hasActions);
    }

    it("should return false when actions menu has no actions or widgets", () => {
      setup({ menuData: { actions: List() } });
      validateHasActions(false);
    });

    it("should return true when actions menu has actions", () => {
      setup({ menuData: { actions: List([homeMenuItem]) } });
      validateHasActions(true);
    });

    it("should return true when actions menu has widgets", () => {
      const widget = new WidgetMenuItem(PermissionsShieldComponent);
      setup({ menuData: { actionWidgets: List([widget]) } });
      validateHasActions(true);
    });

    it("should return true when actions menu has actions and widgets", () => {
      const widget = new WidgetMenuItem(PermissionsShieldComponent);
      setup({
        menuData: {
          actions: List([homeMenuItem]),
          actionWidgets: List([widget]),
        },
      });
      validateHasActions(true);
    });
  });

  describe("isFullscreen", () => {
    function validateIsFullscreen(fullscreen: boolean): void {
      expect(spec.service.isFullscreen).toBe(fullscreen);
    }

    it("should return false when menu layout is detected", () => {
      setup({ fullscreen: false });
      validateIsFullscreen(false);
    });

    it("should return true when fullscreen layout is detected", () => {
      setup({ fullscreen: true });
      validateIsFullscreen(true);
    });
  });

  describe("toggleMenu", () => {
    it("should toggle menus", () => {
      setup({ fullscreen: false });
      expect(spec.service.isMenuOpen).toBe(false);
      spec.service.toggleMenu();
      expect(spec.service.isMenuOpen).toBe(true);
      spec.service.toggleMenu();
      expect(spec.service.isMenuOpen).toBe(false);
    });

    it("should trigger state change after toggleMenu called", (done) => {
      setup({ fullscreen: false });
      validateStateForEachUpdate(
        done,
        { isMenuOpen: false },
        { isMenuOpen: true },
        { isMenuOpen: false }
      );
      spec.service.toggleMenu();
      spec.service.toggleMenu();
    });
  });

  describe("openMenu", () => {
    it("should open menus", () => {
      setup({ fullscreen: false });
      expect(spec.service.isMenuOpen).toBe(false);
      spec.service.openMenu();
      expect(spec.service.isMenuOpen).toBe(true);
      spec.service.openMenu();
      expect(spec.service.isMenuOpen).toBe(true);
    });

    it("should trigger state change after openMenu called", (done) => {
      setup({ fullscreen: false });
      validateStateForEachUpdate(
        done,
        { isMenuOpen: false },
        { isMenuOpen: true },
        { isMenuOpen: true }
      );
      spec.service.openMenu();
      spec.service.openMenu();
    });
  });

  describe("closeMenu", () => {
    it("should close menus", () => {
      setup({ fullscreen: false });
      spec.service.openMenu();
      expect(spec.service.isMenuOpen).toBe(true);
      spec.service.closeMenu();
      expect(spec.service.isMenuOpen).toBe(false);
      spec.service.closeMenu();
      expect(spec.service.isMenuOpen).toBe(false);
    });

    it("should trigger state change after openMenu called", (done) => {
      setup({ fullscreen: false });
      validateStateForEachUpdate(
        done,
        { isMenuOpen: false },
        { isMenuOpen: true },
        { isMenuOpen: false },
        { isMenuOpen: false }
      );
      spec.service.openMenu();
      spec.service.closeMenu();
      spec.service.closeMenu();
    });
  });

  describe("actionMenu", () => {
    describe("category", () => {
      it("should handle default category", () => {
        const category = generateCategory();
        setup({
          defaultMenu: {
            contextLinks: OrderedSet(),
            defaultCategory: category,
          },
        });
        expect(spec.service.actionMenu.title).toEqual(category);
      });

      it("should handle custom category", () => {
        const category = generateCategory();
        setup({ category });
        expect(spec.service.actionMenu.title).toEqual(category);
      });
    });

    describe("links", () => {
      validateLinks(
        (links, fullscreen) =>
          setup({ fullscreen, menuData: { actions: links } }),
        () => spec.service.actionMenu.links,
        [
          { type: "menu link", createLink: generateMenuLink },
          { type: "menu route", createLink: generateMenuRoute },
          { type: "menu action", createLink: generateMenuAction },
          { type: "menu modal", createLink: generateMenuModalWithoutAction },
        ]
      );
    });

    describe("widgets", () => {
      validateWidgets(
        (widgets) => setup({ menuData: { actionWidgets: widgets } }),
        () => spec.service.actionMenu.widgets
      );
    });

    describe("item ordering", () => {
      let linkA: MenuRoute;
      let linkB: MenuLink;
      let linkC: MenuAction;
      let linkD: MenuModalWithoutAction;
      const noOrder = undefined;

      function arrange(a: number, b: number, c: number, d: number) {
        // Labels are set so that lexicographical order can be determined
        linkA = generateMenuRoute({ label: "b", order: a });
        linkB = generateMenuLink({ label: "a", order: b });
        linkC = generateMenuAction({ label: "z", order: c });
        linkD = generateMenuModalWithoutAction({ label: "y", order: d });
        return [linkA, linkB, linkC, linkD];
      }

      function setLinks(links: (AnyMenuItem | MenuModalWithoutAction)[]) {
        setup({ menuData: { actions: List(links) } });
      }

      function assertLinks(links: (AnyMenuItem | MenuModalWithoutAction)[]) {
        expect(spec.service.actionMenu.links).toEqual(OrderedSet(links));
      }

      it("should order links", () => {
        setLinks(arrange(4, 3, 2, 1));
        assertLinks([linkD, linkC, linkB, linkA]);
      });

      it("ensures order is stable if not specified", () => {
        setLinks(arrange(noOrder, noOrder, noOrder, noOrder));
        assertLinks([linkA, linkB, linkC, linkD]);
      });

      it("should sort lexicographically only if order is equal", () => {
        setLinks(arrange(3, 3, 3, 3));
        assertLinks([linkB, linkA, linkD, linkC]);
      });

      it("should order links with ordered link first", () => {
        setLinks(arrange(noOrder, noOrder, noOrder, -3));
        assertLinks([linkD, linkA, linkB, linkC]);
      });

      it("should order sub-links", () => {
        const parent = generateMenuRoute({ order: 1 });
        const child = generateMenuRoute({ parent, order: 1 });
        setLinks([child, parent]);
        assertLinks([parent, child]);
      });

      it("should order sub-links inside a parent", () => {
        const parent = generateMenuRoute({ order: 1 });
        const child1 = generateMenuRoute({ parent, label: "b", order: 1 });
        const child2 = generateMenuRoute({ parent, label: "a", order: 1 });
        setLinks([child2, child1, parent]);
        assertLinks([parent, child2, child1]);
      });
    });

    it("should handle links and widgets", () => {
      const link = generateMenuRoute();
      const widget = new WidgetMenuItem(MockWidgetComponent);
      setup({
        menuData: { actions: List([link]), actionWidgets: List([widget]) },
      });
      expect(spec.service.actionMenu.links).toEqual(OrderedSet([link]));
      expect(spec.service.actionMenu.widgets).toEqual(OrderedSet([widget]));
    });
  });

  describe("secondaryMenu", () => {
    describe("links", () => {
      validateLinks(
        (links, fullscreen) =>
          setup({
            fullscreen,
            menuData: { links },
            pageRoute: homeMenuItem,
            defaultMenu: {
              contextLinks: OrderedSet(),
              defaultCategory: homeCategory,
            },
          }),
        () => spec.service.secondaryMenu.links,
        [
          { type: "menu link", createLink: generateMenuLink },
          { type: "menu route", createLink: generateMenuRoute },
          { type: "menu modal", createLink: generateMenuModalWithoutAction },
        ],
        // Home Menu Item is the pageRoute
        [homeMenuItem]
      );
    });

    describe("widgets", () => {
      validateWidgets(
        (widgets) => setup({ menuData: { linkWidgets: widgets } }),
        () => spec.service.secondaryMenu.widgets
      );
    });

    describe("self link", () => {
      let grandParentMenuItem: MenuRoute;
      let parentMenuItem: MenuRoute;
      let childMenuItem: MenuRoute;

      beforeEach(() => {
        const grandParentRoute = StrongRoute.newRoot().add("home");
        const parentRoute = grandParentRoute.add("house");
        const childRoute = parentRoute.add("door");

        grandParentMenuItem = generateMenuRoute({
          label: "GrandParent Label",
          route: grandParentRoute,
          order: 999,
        });
        parentMenuItem = generateMenuRoute({
          label: "Parent Label",
          parent: grandParentMenuItem,
          route: parentRoute,
        });
        childMenuItem = generateMenuRoute({
          label: "Child Label",
          parent: parentMenuItem,
          route: childRoute,
        });
      });

      it("should append full lineage of self link to menu", () => {
        setup({
          pageRoute: childMenuItem,
          defaultMenu: {
            contextLinks: OrderedSet([homeMenuItem]),
            defaultCategory: homeCategory,
          },
        });
        expect(spec.service.secondaryMenu.links).toEqual(
          OrderedSet([
            homeMenuItem,
            grandParentMenuItem,
            parentMenuItem,
            childMenuItem,
          ])
        );
      });

      it("should ignore predicate of page route", () => {
        childMenuItem = generateMenuRoute({
          ...childMenuItem,
          predicate: () => false,
        });

        setup({
          pageRoute: childMenuItem,
          defaultMenu: {
            contextLinks: OrderedSet([homeMenuItem]),
            defaultCategory: homeCategory,
          },
        });
        expect(spec.service.secondaryMenu.links).toEqual(
          OrderedSet([
            homeMenuItem,
            grandParentMenuItem,
            parentMenuItem,
            childMenuItem,
          ])
        );
      });
    });

    describe("item ordering", () => {
      let linkA: MenuRoute;
      let linkB: MenuLink;
      let linkC: MenuModalWithoutAction;
      let pageRoute: MenuRoute;
      const noOrder = undefined;

      function arrange(a: number, b: number, c: number) {
        // Labels are set so that lexicographical order can be determined
        linkA = generateMenuRoute({ label: "b", order: a });
        linkB = generateMenuLink({ label: "a", order: b });
        linkC = generateMenuModalWithoutAction({ label: "z", order: c });
        return [linkA, linkB, linkC];
      }

      function setLinks(links: (NavigableMenuItem | MenuModalWithoutAction)[]) {
        // Make this item always first
        pageRoute = generateMenuRoute({ order: -999 });
        setup({ pageRoute, menuData: { links: List(links) } });
      }

      function assertLinks(links: (AnyMenuItem | MenuModalWithoutAction)[]) {
        expect(spec.service.secondaryMenu.links).toEqual(
          OrderedSet([pageRoute, ...links])
        );
      }

      it("should order links", () => {
        setLinks(arrange(3, 2, 1));
        assertLinks([linkC, linkB, linkA]);
      });

      it("ensures order is stable if not specified", () => {
        setLinks(arrange(noOrder, noOrder, noOrder));
        assertLinks([linkA, linkB, linkC]);
      });

      it("should sort lexicographically only if order is equal", () => {
        setLinks(arrange(3, 3, 3));
        assertLinks([linkB, linkA, linkC]);
      });

      it("should order links with ordered link first", () => {
        setLinks(arrange(noOrder, noOrder, -3));
        assertLinks([linkC, linkA, linkB]);
      });

      it("should order sub-links", () => {
        const parent = generateMenuRoute({ order: 1 });
        const child = generateMenuRoute({ parent, order: 1 });
        setLinks([child, parent]);
        assertLinks([parent, child]);
      });

      it("should order sub-links inside a parent", () => {
        const parent = generateMenuRoute({ order: 1 });
        const child1 = generateMenuRoute({ parent, label: "b", order: 1 });
        const child2 = generateMenuRoute({ parent, label: "a", order: 1 });
        setLinks([child2, child1, parent]);
        assertLinks([parent, child2, child1]);
      });
    });

    it("should handle links and widgets", () => {
      const link = generateMenuRoute();
      const widget = new WidgetMenuItem(MockWidgetComponent);
      setup({
        pageRoute: homeMenuItem,
        menuData: { links: List([link]), linkWidgets: List([widget]) },
      });
      const secondaryMenu = spec.service.secondaryMenu;
      expect(secondaryMenu.links).toEqual(OrderedSet([homeMenuItem, link]));
      expect(secondaryMenu.widgets).toEqual(OrderedSet([widget]));
    });
  });

  function validateLinks<T>(
    linkSetup: (links: List<T>, fullscreen: boolean) => void,
    getLinks: () => OrderedSet<T>,
    linkTypes: { type: string; createLink: (data?: Partial<MenuItem>) => T }[],
    defaultLinks: T[] = []
  ) {
    function assertLinks(links: T[]) {
      expect(getLinks()).toEqual(OrderedSet([...defaultLinks, ...links]));
    }

    it("should handle undefined links", () => {
      linkSetup(undefined, false);
      assertLinks([]);
    });

    it("should handle no links", () => {
      linkSetup(List(), false);
      assertLinks([]);
    });
    it("should handle undefined links", () => {
      linkSetup(List(undefined), false);
      assertLinks([]);
    });

    it("should handle multiple types of links", () => {
      const links = linkTypes.map(({ createLink }) => createLink());
      linkSetup(List(links), false);
      assertLinks(links);
    });

    linkTypes.forEach(({ type, createLink }) => {
      it(`should handle ${type}`, () => {
        const link = createLink();
        linkSetup(List([link]), false);
        assertLinks([link]);
      });

      describe(`${type} predicates`, () => {
        it("should not filter with no predicate", () => {
          const link = createLink();
          linkSetup(List([link]), false);
          assertLinks([link]);
        });

        it("should not filter with passing predicate", () => {
          const link = createLink({ predicate: () => true });
          linkSetup(List([link]), false);
          assertLinks([link]);
        });

        it("should filter with failing predicate", () => {
          const link = createLink({ predicate: () => false });
          linkSetup(List([link]), false);
          assertLinks([]);
        });

        it("should only filter on failing predicates", () => {
          const linkA = createLink({ predicate: () => true });
          const linkB = createLink({ predicate: () => false });
          const linkC = createLink(undefined);
          linkSetup(List([linkA, linkB, linkC]), false);
          assertLinks([linkA, linkC]);
        });

        it("should pass guest data to predicate", (done) => {
          const link = createLink({
            predicate: jasmine.createSpy().and.callFake((user) => {
              expect(user).toBeUndefined();
              done();
              return true;
            }),
          });
          linkSetup(List([link]), false);
        });

        it("should pass user data to predicate", (done) => {
          let isInitialLoad = true;
          const user = new Session(generateSessionUser());
          const link = createLink({
            predicate: jasmine.createSpy().and.callFake((_user) => {
              if (isInitialLoad) {
                isInitialLoad = false;
                return true;
              }
              expect(_user).toEqual(user);
              done();
              return true;
            }),
          });
          linkSetup(List([link]), false);
          setLocalUser(user);
        });

        it("should pass page date to predicate", (done) => {
          let isInitialLoad = true;
          const link = createLink({
            predicate: jasmine.createSpy().and.callFake((_, data) => {
              expect(isIPageInfo(data)).toBeTrue();
              if (isInitialLoad) {
                isInitialLoad = false;
                expect(data.fullscreen).toBe(true);
              } else {
                expect(data.fullscreen).toBe(false);
                done();
              }
              return true;
            }),
          });
          linkSetup(List([link]), true);
          setPageInfo(false, spec.service.pageInfo.menus);
        });
      });
    });
  }

  function validateWidgets(
    widgetSetup: (widgets: List<WidgetMenuItem>) => void,
    getWidgets: () => OrderedSet<WidgetMenuItem>
  ) {
    it("should handle undefined widgets", () => {
      widgetSetup(undefined);
      expect(getWidgets()).toEqual(OrderedSet());
    });

    it("should handle no widgets", () => {
      widgetSetup(List());
      expect(getWidgets()).toEqual(OrderedSet());
    });

    it("should handle undefined widgets", () => {
      widgetSetup(List(undefined));
      expect(getWidgets()).toEqual(OrderedSet());
    });

    it("should handle single widget", () => {
      const widget = new WidgetMenuItem(MockWidgetComponent);
      widgetSetup(List([widget]));
      expect(getWidgets()).toEqual(OrderedSet([widget]));
    });

    it("should handle multiple widgets", () => {
      const widgetA = new WidgetMenuItem(MockWidgetComponent);
      const widgetB = new WidgetMenuItem(MockWidgetComponent);
      const widgetC = new WidgetMenuItem(MockWidgetComponent);
      widgetSetup(List([widgetA, widgetB, widgetC]));
      expect(getWidgets()).toEqual(OrderedSet([widgetA, widgetB, widgetC]));
    });
  }
});

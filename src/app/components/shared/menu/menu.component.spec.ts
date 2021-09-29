import { Component } from "@angular/core";
import { Data, Params } from "@angular/router";
import { RouterTestingModule } from "@angular/router/testing";
import { MockBawApiModule } from "@baw-api/baw-apiMock.module";
import { SecurityService } from "@baw-api/security/security.service";
import { PageInfo } from "@helpers/page/pageInfo";
import {
  AnyMenuItem,
  isExternalLink,
  isInternalRoute,
  MenuAction,
  menuAction,
  MenuLink,
  menuLink,
  MenuRoute,
  menuRoute,
} from "@interfaces/menusInterfaces";
import { StrongRoute } from "@interfaces/strongRoute";
import { ModalComponent, WidgetComponent } from "@menu/widget.component";
import { WidgetDirective } from "@menu/widget.directive";
import {
  MenuModal,
  menuModal,
  MenuModalWithoutAction,
  WidgetMenuItem,
} from "@menu/widgetItem";
import { SessionUser } from "@models/User";
import {
  NgbModal,
  NgbModalModule,
  NgbTooltipModule,
} from "@ng-bootstrap/ng-bootstrap";
import { createRoutingFactory, SpectatorRouting } from "@ngneat/spectator";
import { IconsModule } from "@shared/icons/icons.module";
import { generateSessionUser } from "@test/fakes/User";
import { assertIcon } from "@test/helpers/html";
import { List } from "immutable";
import { MockComponent, MockedComponent } from "ng-mocks";
import { MenuButtonComponent } from "./button/button.component";
import { MenuLinkComponent } from "./link/link.component";
import { MenuComponent } from "./menu.component";

const mock = {
  action: MockComponent(MenuButtonComponent),
  link: MockComponent(MenuLinkComponent),
};

@Component({
  selector: "baw-test-widget",
  template: "<div>Widget working</div>",
})
export class MockWidgetComponent implements WidgetComponent {
  public pageData!: any;
}

@Component({
  selector: "baw-test-modal",
  template: '<div class="modal-body">Modal working</div>',
})
export class MockModalComponent implements ModalComponent {
  public pageData!: any;
  public routeData!: PageInfo;
  public closeModal!: (result: any) => void;
  public dismissModal!: (reason: any) => void;
}

describe("MenuComponent", () => {
  let api: SecurityService;
  let modal: NgbModal;
  let defaultUser: SessionUser;
  let defaultMenuModal: MenuModalWithoutAction;
  let defaultWidget: WidgetMenuItem;
  let defaultMenuAction: MenuAction;
  let defaultMenuLink: MenuLink;
  let defaultMenuRoute: MenuRoute;
  let spec: SpectatorRouting<MenuComponent>;
  const createComponent = createRoutingFactory({
    component: MenuComponent,
    declarations: [
      mock.action,
      mock.link,
      WidgetDirective,
      MockWidgetComponent,
      MockModalComponent,
    ],
    imports: [
      IconsModule,
      RouterTestingModule,
      MockBawApiModule,
      NgbModalModule,
      NgbTooltipModule,
    ],
  });
  const menuTypes: ("action" | "secondary")[] = ["action", "secondary"];

  function getMenuActions(): MockedComponent<MenuButtonComponent>[] {
    return spec.queryAll(".action", { read: mock.action });
  }

  function getMenuModals(): MockedComponent<MenuButtonComponent>[] {
    return spec.queryAll(".button", { read: mock.action });
  }

  function getMenuLinks(): MockedComponent<MenuLinkComponent>[] {
    return spec.queryAll(mock.link).filter((item) => isExternalLink(item.link));
  }

  function getMenuRoutes(): MockedComponent<MenuLinkComponent>[] {
    return spec
      .queryAll(mock.link)
      .filter((item) => isInternalRoute(item.link));
  }

  function setLoggedInState(user: SessionUser) {
    spyOn(api, "isLoggedIn").and.callFake(() => !!user);
    spyOn(api, "getLocalUser").and.callFake(() => user);
  }

  function setup(
    props?: Partial<MenuComponent>,
    data: Data = {},
    params: Params = {}
  ) {
    spec = createComponent({
      detectChanges: false,
      props,
      params,
      data,
    });
    api = spec.inject(SecurityService);
    modal = spec.inject(NgbModal);
  }

  beforeEach(() => {
    defaultUser = new SessionUser(generateSessionUser());
    defaultWidget = new WidgetMenuItem(MockWidgetComponent);
    defaultMenuModal = menuModal({
      icon: ["fas", "home"],
      label: "label",
      tooltip: () => "tooltip",
      component: MockModalComponent,
      pageData: {},
      modalOpts: {},
    });
    defaultMenuAction = menuAction({
      label: "label",
      icon: ["fas", "home"],
      tooltip: () => "tooltip",
      action: () => {},
    });
    defaultMenuLink = menuLink({
      label: "label",
      icon: ["fas", "home"],
      tooltip: () => "tooltip",
      uri: () => "http://brokenlink/",
    });
    defaultMenuRoute = menuRoute({
      label: "label",
      icon: ["fas", "home"],
      tooltip: () => "tooltip",
      route: StrongRoute.newRoot().add("home"),
    });
  });

  describe("menu", () => {
    function getTitle(): HTMLHeadingElement {
      return spec.query("h6");
    }

    function getWidget() {
      return spec.query("#widget");
    }

    function assertTitle(title: string) {
      expect(getTitle()).toHaveText(title);
    }

    it("should create default title when none provided", () => {
      setup({ links: List([]) });
      setLoggedInState(undefined);
      spec.detectChanges();
      assertTitle("MENU");
    });

    it("should create title when provided", () => {
      setup({
        links: List([]),
        title: { label: "SECONDARY", icon: ["fas", "home"] },
      });
      setLoggedInState(undefined);
      spec.detectChanges();
      assertTitle("SECONDARY");
    });

    it("should create title icon when provided", () => {
      setup({
        links: List([]),
        title: { label: "SECONDARY", icon: ["fas", "home"] },
      });
      setLoggedInState(undefined);
      spec.detectChanges();
      assertIcon(getTitle(), "fas,home");
    });

    it("should create capitalized title", () => {
      setup({
        links: List([]),
        title: { label: "secondary", icon: ["fas", "home"] },
      });
      setLoggedInState(undefined);
      spec.detectChanges();
      assertTitle("SECONDARY");
    });

    menuTypes.forEach((menuType) => {
      it(`should create no links on ${menuType} menu`, () => {
        setup({ menuType, links: List([]) });
        setLoggedInState(undefined);
        spec.detectChanges();
        expect(getMenuActions().length).toBe(0);
        expect(getMenuLinks().length).toBe(0);
        expect(getMenuRoutes().length).toBe(0);
      });

      it(`should create mixed links on ${menuType} menu`, () => {
        setup({
          menuType,
          links: List([
            defaultMenuAction,
            defaultMenuLink,
            defaultMenuRoute,
            defaultMenuModal,
          ]),
        });
        setLoggedInState(undefined);
        spec.detectChanges();
        expect(getMenuActions().length).toBe(1);
        expect(getMenuLinks().length).toBe(1);
        expect(getMenuRoutes().length).toBe(1);
        expect(getMenuModals().length).toBe(1);
      });
    });

    describe("widgets", () => {
      function validateNumWidgets(numWidgets: number) {
        expect(getWidget().childElementCount).toBe(numWidgets);
      }

      it("should not create widget when none provided", () => {
        setup({ links: List([]) });
        setLoggedInState(undefined);
        spec.detectChanges();
        validateNumWidgets(0);
      });

      it("should create widget when provided", () => {
        setup({
          links: List([]),
          widgets: List([defaultWidget]),
        });
        setLoggedInState(undefined);
        spec.detectChanges();
        validateNumWidgets(1);
        expect(spec.query(MockWidgetComponent)).toBeTruthy();
      });

      it("should create multiple widgets when provided", () => {
        setup({
          links: List([]),
          widgets: List([
            new WidgetMenuItem(MockWidgetComponent),
            new WidgetMenuItem(MockWidgetComponent),
            new WidgetMenuItem(MockWidgetComponent),
          ]),
        });
        setLoggedInState(undefined);
        spec.detectChanges();
        validateNumWidgets(3);
      });
    });

    describe("modals", () => {
      let dismissSpy: jasmine.Spy;
      let closeSpy: jasmine.Spy;
      let mockComponentInstance: ModalComponent;

      function spyOnModal() {
        spyOn(modal, "open").and.callFake(
          () =>
            ({
              componentInstance: mockComponentInstance,
              dismiss: dismissSpy,
              close: closeSpy,
            } as any)
        );
      }

      function assertModalOpen(menuItem: MenuModal) {
        expect(modal.open).toHaveBeenCalledWith(
          menuItem.component,
          menuItem.modalOpts
        );
      }

      beforeEach(() => {
        mockComponentInstance = {} as any;
        dismissSpy = jasmine.createSpy("dismiss modal");
        closeSpy = jasmine.createSpy("close modal");
      });

      it("should open modal on click", () => {
        setup({ links: List([defaultMenuModal]) });
        setLoggedInState(undefined);
        spyOnModal();
        spec.detectChanges();
        getMenuModals()[0].link.action();
        assertModalOpen(spec.component.filteredLinks.first() as MenuModal);
      });

      it("should assign route data to modal component", () => {
        const routeData = { example: "values" };
        setup({ links: List([defaultMenuModal]) }, routeData);
        setLoggedInState(undefined);
        spyOnModal();
        spec.detectChanges();
        const link = getMenuModals()[0].link as MenuModal;
        link.action();
        expect<any>(mockComponentInstance.routeData).toEqual(routeData);
      });

      it("should assign page data to modal component", () => {
        const modalItem = menuModal({
          ...defaultMenuModal,
          pageData: { example: "values" },
        });
        setup({ links: List([modalItem]) });
        setLoggedInState(undefined);
        spyOnModal();
        spec.detectChanges();
        const link = getMenuModals()[0].link as MenuModal;
        link.action();
        expect(mockComponentInstance.pageData).toEqual(modalItem.pageData);
      });

      it("should assign dismissModal function to modal component", () => {
        setup({ links: List([defaultMenuModal]) });
        setLoggedInState(undefined);
        spyOnModal();
        spec.detectChanges();
        const link = getMenuModals()[0].link as MenuModal;
        link.action();

        mockComponentInstance.dismissModal("test dismissal");
        expect(dismissSpy).toHaveBeenCalledWith("test dismissal");
      });

      it("should assign closeModal function to modal component", () => {
        setup({ links: List([defaultMenuModal]) });
        setLoggedInState(undefined);
        spyOnModal();
        spec.detectChanges();
        const link = getMenuModals()[0].link as MenuModal;
        link.action();

        mockComponentInstance.closeModal("test close");
        expect(closeSpy).toHaveBeenCalledWith("test close");
      });
    });
  });

  [
    {
      title: "Menu Action",
      baseLink: () => defaultMenuAction,
      create: (data) => menuAction(data),
      getLink: () => getMenuActions(),
      action: true,
    },
    {
      title: "Menu External Link",
      baseLink: () => defaultMenuLink,
      create: (data) => menuLink(data),
      getLink: () => getMenuLinks(),
      link: true,
    },
    {
      title: "Menu Internal Link",
      baseLink: () => defaultMenuRoute,
      create: (data) => menuRoute(data),
      getLink: () => getMenuRoutes(),
      route: true,
    },
    {
      title: "Menu Modal",
      baseLink: () => defaultMenuModal,
      create: (data) => menuModal(data),
      getLink: () => getMenuModals(),
      modal: true,
    },
  ].forEach((test) => {
    function createLink(args: any = {}) {
      return test.create({ ...test.baseLink(), ...args });
    }

    function assertLinks(length: number) {
      expect(getMenuModals().length).toBe(test.modal ? length : 0);
      expect(getMenuActions().length).toBe(test.action ? length : 0);
      expect(getMenuLinks().length).toBe(test.link ? length : 0);
      expect(getMenuRoutes().length).toBe(test.route ? length : 0);
    }

    describe(test.title, () => {
      menuTypes.forEach((menuType) => {
        it(`should create single link for ${menuType} menu`, () => {
          setup({ menuType, links: List([createLink()]) });
          setLoggedInState(undefined);
          spec.detectChanges();
          assertLinks(1);
        });

        it(`should create multiple links for ${menuType} menu`, () => {
          setup({ menuType, links: List([createLink(), createLink()]) });
          setLoggedInState(undefined);
          spec.detectChanges();
          assertLinks(2);
        });

        it(`should set link placement for ${menuType} menu`, () => {
          setup({ menuType, links: List([createLink()]) });
          setLoggedInState(undefined);
          spec.detectChanges();
          expect(test.getLink()[0].placement).toBe(
            menuType === "action" ? "left" : "right"
          );
        });
      });

      it("should set link tooltip", () => {
        const link = createLink();
        setup({ menuType: "action", links: List([link]) });
        setLoggedInState(undefined);
        spec.detectChanges();
        expect(test.getLink()[0].tooltip).toBe(link.tooltip());
      });

      it("should set link tooltip with username", () => {
        const link = createLink({
          tooltip: (user: SessionUser) => `Custom tooltip for ${user.userName}`,
        });
        setup({ menuType: "action", links: List([link]) });
        setLoggedInState(defaultUser);
        spec.detectChanges();
        expect(test.getLink()[0].tooltip).toBe(
          `Custom tooltip for ${defaultUser.userName}`
        );
      });

      it("should set link menu item", () => {
        const link = createLink();
        setup({ menuType: "action", links: List([link]) });
        setLoggedInState(undefined);
        spec.detectChanges();

        const testLink = test.getLink()[0].link;
        if (test.modal) {
          // Modal links are modified by the menu component and direct
          // comparison cannot be made
          expect(testLink).toHaveProperty("kind", link.kind);
          expect(testLink).toHaveProperty("label", link.label);
          expect(testLink).toHaveProperty("action");
        } else {
          expect(testLink).toEqual(link as MenuAction | MenuLink | MenuRoute);
        }
      });

      describe("predicate", () => {
        it("should filter links without passing predicate", () => {
          setup({
            menuType: "action",
            links: List([
              createLink({ predicate: undefined }),
              createLink({ predicate: () => false }),
              createLink({ predicate: () => true }),
            ]),
          });
          setLoggedInState(undefined);
          spec.detectChanges();
          assertLinks(2);
        });

        it("should filter duplicate links (by object identity)", () => {
          const link = createLink();
          setup({ menuType: "action", links: List([link, link, link]) });
          setLoggedInState(undefined);
          spec.detectChanges();
          assertLinks(1);
        });

        it("should not provide user to predicate function when unauthenticated", (done) => {
          const link = createLink({
            predicate: (_user) => {
              expect(_user).toBe(undefined);
              done();
            },
          });
          setup({ menuType: "action", links: List([link]) });
          setLoggedInState(undefined);
          spec.detectChanges();
        });

        it("should provide user to predicate function when authenticated", (done) => {
          const user = new SessionUser(generateSessionUser());
          const link = createLink({
            predicate: (_user) => {
              expect(_user).toEqual(user);
              done();
            },
          });
          setup({ menuType: "action", links: List([link]) });
          setLoggedInState(user);
          spec.detectChanges();
        });

        it("should provide page data to predicate function", (done) => {
          const data = { value: 42 };
          const link = createLink({
            predicate: (_, _data) => {
              expect(_data).toEqual(data);
              done();
            },
          });
          setup({ menuType: "action", links: List([link]) }, data);
          setLoggedInState(undefined);
          spec.detectChanges();
        });
      });
    });
  });

  describe("Links", () => {
    it("should set menu link", () => {
      setup({ menuType: "action", links: List([defaultMenuLink]) });
      setLoggedInState(undefined);
      spec.detectChanges();
      expect(getMenuLinks()[0].link).toEqual(defaultMenuLink);
    });

    it("should set menu route", () => {
      setup({ menuType: "action", links: List([defaultMenuRoute]) });
      setLoggedInState(undefined);
      spec.detectChanges();
      expect(getMenuRoutes()[0].link).toBe(defaultMenuRoute);
    });
  });

  describe("item ordering", () => {
    let linkA: MenuRoute;
    let linkB: MenuLink;
    let linkC: MenuAction;
    let linkD: MenuModalWithoutAction;

    function arrange(a: number, b: number, c: number, d: number) {
      // Labels are set so that lexicographical order can be determined
      linkA = menuRoute({ ...defaultMenuRoute, label: "b", order: a });
      linkB = menuLink({ ...defaultMenuLink, label: "a", order: b });
      linkC = menuAction({ ...defaultMenuAction, label: "z", order: c });
      linkD = menuModal({ ...defaultMenuModal, label: "y", order: d });
      return List([linkA, linkB, linkC, linkD]);
    }

    function assertLinks(menuLinks: AnyMenuItem[]) {
      const filteredLinks = Array.from(spec.component.filteredLinks);
      expect(filteredLinks.map((link) => link.label)).toEqual(
        menuLinks.map((link) => link.label)
      );
    }

    menuTypes.forEach((menuType) => {
      describe(menuType, () => {
        const noOrder = undefined;

        it("should order links", () => {
          setup({ menuType, links: arrange(4, 3, 2, 1) });
          setLoggedInState(undefined);
          spec.detectChanges();
          assertLinks([linkD, linkC, linkB, linkA]);
        });

        it("ensures order is stable if not specified", () => {
          setup({
            menuType,
            links: arrange(noOrder, noOrder, noOrder, noOrder),
          });
          setLoggedInState(undefined);
          spec.detectChanges();
          assertLinks([linkA, linkB, linkC, linkD]);
        });

        it("should sort lexicographically only if order is equal", () => {
          setup({ menuType, links: arrange(3, 3, 3, 3) });
          setLoggedInState(undefined);
          spec.detectChanges();
          assertLinks([linkB, linkA, linkD, linkC]);
        });

        it("should order links with order link first", () => {
          const menuLinks = arrange(noOrder, noOrder, noOrder, -3);
          setup({ menuType, links: menuLinks });
          setLoggedInState(undefined);
          spec.detectChanges();
          assertLinks([linkD, linkA, linkB, linkC]);
        });

        it("should order sub-links", () => {
          const parent = menuRoute({ ...defaultMenuRoute, order: 1 });
          const child = menuRoute({ ...defaultMenuRoute, parent, order: 1 });
          setup({ menuType, links: List([child, parent]) });
          setLoggedInState(undefined);
          spec.detectChanges();
          assertLinks([parent, child]);
        });

        it("should order sub-links inside a parent", () => {
          const parent = menuRoute({ ...defaultMenuRoute, order: 1 });
          const child1 = menuRoute({
            ...defaultMenuRoute,
            parent,
            label: "b",
            order: 1,
          });
          const child2 = menuRoute({
            ...defaultMenuRoute,
            parent,
            label: "a",
            order: 1,
          });

          setup({ menuType, links: List([child2, child1, parent]) });
          setLoggedInState(undefined);
          spec.detectChanges();
          assertLinks([parent, child2, child1]);
        });
      });
    });
  });
});

import { Component, SimpleChange } from "@angular/core";
import { Data, Params } from "@angular/router";
import { RouterTestingModule } from "@angular/router/testing";
import { MockBawApiModule } from "@baw-api/baw-apiMock.module";
import { BawSessionService } from "@baw-api/baw-session.service";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { MenuType } from "@helpers/generalTypes";
import { PageInfo } from "@helpers/page/pageInfo";
import {
  isExternalLink,
  isInternalRoute,
  MenuAction,
  menuAction,
  MenuLink,
  menuLink,
  MenuRoute,
  menuRoute,
} from "@interfaces/menusInterfaces";
import { ModalComponent, WidgetComponent } from "@menu/widget.component";
import { WidgetDirective } from "@menu/widget.directive";
import {
  MenuModal,
  menuModal,
  MenuModalWithoutAction,
  WidgetMenuItem,
} from "@menu/widgetItem";
import { Session, User } from "@models/User";
import {
  NgbModal,
  NgbModalModule,
  NgbTooltipModule,
} from "@ng-bootstrap/ng-bootstrap";
import { createRoutingFactory, SpectatorRouting } from "@ngneat/spectator";
import { MenuService } from "@services/menu/menu.service";
import { IconsModule } from "@shared/icons/icons.module";
import {
  generateMenuAction,
  generateMenuLink,
  generateMenuModalWithoutAction,
  generateMenuRoute,
} from "@test/fakes/MenuItem";
import { generateUser } from "@test/fakes/User";
import { OrderedSet } from "immutable";
import { MockProvider } from "ng-mocks";
import { MenuButtonComponent } from "../button/button.component";
import { MenuLinkComponent } from "../link/link.component";
import { MenuComponent } from "./menu.component";

@Component({
  selector: "baw-test-widget",
  template: "<div>Widget working</div>",
})
export class MockWidgetComponent implements WidgetComponent {
  public pageData!: any;

  // you should be able to change this property using the options object
  // eg. options = { testProperty: "test" }
  public testProperty?: any;
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
  let modal: NgbModal;
  let defaultUser: User;
  let defaultMenuModal: MenuModalWithoutAction;
  let defaultWidget: WidgetMenuItem;
  let defaultMenuAction: MenuAction;
  let defaultMenuLink: MenuLink;
  let defaultMenuRoute: MenuRoute;
  let spec: SpectatorRouting<MenuComponent>;

  const createComponent = createRoutingFactory({
    component: MenuComponent,
    imports: [
      IconsModule,
      RouterTestingModule,
      MockBawApiModule,
      NgbModalModule,
      NgbTooltipModule,
      MenuButtonComponent,
      MenuLinkComponent,

      WidgetDirective,
      MockWidgetComponent,
      MockModalComponent,
    ],
  });
  const menuTypes: MenuType[] = ["action", "secondary"];

  function getMenuActions(): MenuButtonComponent[] {
    return spec.queryAll(".action", { read: MenuButtonComponent });
  }

  function getMenuModals(): MenuButtonComponent[] {
    return spec.queryAll(".button", { read: MenuButtonComponent });
  }

  function getMenuLinks(): MenuLinkComponent[] {
    return spec
      .queryAll(MenuLinkComponent)
      .filter((item) => isExternalLink(item.link));
  }

  function getMenuRoutes(): MenuLinkComponent[] {
    return spec
      .queryAll(MenuLinkComponent)
      .filter((item) => isInternalRoute(item.link));
  }

  function setup(
    props?: Partial<MenuComponent>,
    data: Data = {},
    params: Params = {},
    opts?: { isFullscreen?: boolean; localUser?: User }
  ) {
    spec = createComponent({
      detectChanges: false,
      props,
      params,
      data,
      providers: [
        MockProvider(MenuService, {
          pageInfo: data,
          isFullscreen: opts?.isFullscreen ?? false,
        }),
        MockProvider(BawSessionService, {
          loggedInUser: opts?.localUser ?? null,
        }),
      ],
    });
    modal = spec.inject(NgbModal);
  }

  beforeEach(() => {
    defaultUser = new User(generateUser());
    defaultWidget = new WidgetMenuItem(MockWidgetComponent);
    defaultMenuModal = generateMenuModalWithoutAction();
    defaultMenuAction = generateMenuAction();
    defaultMenuLink = generateMenuLink();
    defaultMenuRoute = generateMenuRoute();
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
      setup({ links: OrderedSet([defaultMenuRoute]) });
      spec.detectChanges();
      assertTitle("MENU");
    });

    it("should create title when provided", () => {
      setup({
        links: OrderedSet([defaultMenuRoute]),
        title: { label: "SECONDARY", icon: ["fas", "home"] },
      });
      spec.detectChanges();
      assertTitle("SECONDARY");
    });

    it("should create title icon when provided", () => {
      const icon: IconProp = ["fas", "home"];
      setup({
        links: OrderedSet([defaultMenuRoute]),
        title: { label: "SECONDARY", icon },
      });
      spec.detectChanges();
      expect(getTitle()).toHaveIcon(icon);
    });

    it("should create capitalized title", () => {
      setup({
        links: OrderedSet([defaultMenuRoute]),
        title: { label: "secondary", icon: ["fas", "home"] },
      });
      spec.detectChanges();
      assertTitle("SECONDARY");
    });

    menuTypes.forEach((menuType) => {
      it(`should create mixed links on ${menuType} menu`, () => {
        setup({
          menuType,
          links: OrderedSet([
            defaultMenuAction,
            defaultMenuLink,
            defaultMenuRoute,
            defaultMenuModal,
          ]),
        });
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
        setup({ links: OrderedSet([defaultMenuRoute]) });
        spec.detectChanges();
        validateNumWidgets(0);
      });

      it("should create widget when provided", () => {
        setup({ widgets: OrderedSet([defaultWidget]) });
        spec.detectChanges();
        validateNumWidgets(1);
        expect(spec.query(MockWidgetComponent)).toBeTruthy();
      });

      it("should create multiple widgets when provided", () => {
        setup({
          widgets: OrderedSet([
            new WidgetMenuItem(MockWidgetComponent),
            new WidgetMenuItem(MockWidgetComponent),
            new WidgetMenuItem(MockWidgetComponent),
          ]),
        });
        spec.detectChanges();
        validateNumWidgets(3);
      });

      it("should create widget after update", () => {
        setup({ links: OrderedSet([defaultMenuRoute]) });
        spec.detectChanges();
        validateNumWidgets(0);
        spec.setInput("widgets", OrderedSet([defaultWidget]));
        spec.detectChanges();
        validateNumWidgets(1);
        expect(spec.query(MockWidgetComponent)).toBeTruthy();
      });

      it("should clear widget after update", () => {
        setup({
          links: OrderedSet([defaultMenuRoute]),
          widgets: OrderedSet([defaultWidget]),
        });
        spec.detectChanges();
        validateNumWidgets(1);
        spec.setInput("widgets", undefined);
        // TODO We should instead wrap the component in a host instead of
        // manually calling ngOnChanges
        spec.component.ngOnChanges({
          widgets: new SimpleChange(
            OrderedSet([defaultWidget]),
            undefined,
            false
          ),
        });
        spec.detectChanges();
        validateNumWidgets(0);
      });

      it("should set the widget data using the options provided", () => {
        setup({
          widgets: OrderedSet([
            new WidgetMenuItem(MockWidgetComponent, undefined, {
              testProperty: "test",
            }),
          ]),
        });
        spec.detectChanges();

        const widget = spec.query(MockWidgetComponent);
        expect(widget.testProperty).toBe("test");
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
        setup({ links: OrderedSet([defaultMenuModal]) });
        spyOnModal();
        spec.detectChanges();
        getMenuModals()[0].link.action();
        assertModalOpen(spec.component.formattedLinks.first() as MenuModal);
      });

      it("should assign dismissModal function to modal component", () => {
        setup({ links: OrderedSet([defaultMenuModal]) });
        spyOnModal();
        spec.detectChanges();
        const link = getMenuModals()[0].link as MenuModal;
        link.action();

        mockComponentInstance.dismissModal("test dismissal");
        expect(dismissSpy).toHaveBeenCalledWith("test dismissal");
      });

      it("should assign closeModal function to modal component", () => {
        setup({ links: OrderedSet([defaultMenuModal]) });
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
          setup({ menuType, links: OrderedSet([createLink()]) });
          spec.detectChanges();
          assertLinks(1);
        });

        it(`should create multiple links for ${menuType} menu`, () => {
          setup({ menuType, links: OrderedSet([createLink(), createLink()]) });
          spec.detectChanges();
          assertLinks(2);
        });
      });

      it("should set link tooltip", () => {
        const link = createLink();
        setup({ menuType: "action", links: OrderedSet([link]) });
        spec.detectChanges();
        expect(test.getLink()[0].tooltip).toBe(link.tooltip());
      });

      it("should set link tooltip with username", () => {
        const link = createLink({
          tooltip: (user: Session) => `Custom tooltip for ${user?.userName}`,
        });
        setup(
          { menuType: "action", links: OrderedSet([link]) },
          undefined,
          undefined,
          { localUser: defaultUser }
        );
        spec.detectChanges();

        expect(test.getLink()[0].tooltip).toBe(
          `Custom tooltip for ${defaultUser.userName}`
        );
      });

      it("should set link menu item", () => {
        const link = createLink();
        setup({ menuType: "action", links: OrderedSet([link]) });
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
    });
  });

  describe("links", () => {
    it("should set menu link", () => {
      setup({ menuType: "action", links: OrderedSet([defaultMenuLink]) });
      spec.detectChanges();
      expect(getMenuLinks()[0].link).toEqual(defaultMenuLink);
    });

    it("should set menu route", () => {
      setup({ menuType: "action", links: OrderedSet([defaultMenuRoute]) });
      spec.detectChanges();
      expect(getMenuRoutes()[0].link).toBe(defaultMenuRoute);
    });
  });

  describe("indentation", () => {
    function getListItems() {
      return spec.queryAll("li.menu-link");
    }

    function assertIndentation(item: Element, indentation: number) {
      expect(item).toHaveStyle({ paddingLeft: `${indentation}em` });
    }

    it("should set default indentation to 0", () => {
      setup({
        menuType: "secondary",
        links: OrderedSet([
          defaultMenuLink,
          defaultMenuRoute,
          defaultMenuAction,
        ]),
      });
      spec.detectChanges();
      expect(getListItems()).toHaveLength(3);
      getListItems().forEach((item) => assertIndentation(item, 0));
    });

    it("should set indentation on child links", () => {
      const parent = generateMenuRoute({ order: 1 });
      const child = generateMenuRoute({ parent, order: 1 });
      setup({
        menuType: "secondary",
        links: OrderedSet([parent, child]),
      });
      spec.detectChanges();
      const items = getListItems();
      assertIndentation(items[0], 0);
      assertIndentation(items[1], 1);
    });

    it("should set indentation on grand children links", () => {
      const grandParent = generateMenuRoute({ order: 1 });
      const parent = generateMenuRoute({ parent: grandParent });
      const child = generateMenuRoute({ parent });
      setup({
        menuType: "secondary",
        links: OrderedSet([grandParent, parent, child]),
      });
      spec.detectChanges();
      const items = getListItems();
      assertIndentation(items[0], 0);
      assertIndentation(items[1], 1);
      assertIndentation(items[2], 2);
    });
  });
});

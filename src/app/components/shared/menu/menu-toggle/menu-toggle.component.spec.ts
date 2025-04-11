import { shouldNotComplete, shouldNotFail } from "@baw-api/baw-api.service.spec";
import { MockBawApiModule } from "@baw-api/baw-apiMock.module";
import { FaIconComponent } from "@fortawesome/angular-fontawesome";
import { BootstrapColorTypes } from "@helpers/bootstrapTypes";
import { createComponentFactory, mockProvider, Spectator } from "@ngneat/spectator";
import { MenuService } from "@services/menu/menu.service";
import { IconsModule } from "@shared/icons/icons.module";
import { MenuState, MenuToggleComponent } from "./menu-toggle.component";

describe("MenuToggleComponent", () => {
  let spec: Spectator<MenuToggleComponent>;
  const createComponent = createComponentFactory({
    component: MenuToggleComponent,
    imports: [IconsModule, MockBawApiModule],
  });

  function setup(props: Partial<MenuToggleComponent>, isFullscreen = true, isMenuOpen = false): void {
    spec = createComponent({
      props,
      providers: [
        mockProvider(MenuService, {
          isFullscreen,
          isMenuOpen,
          toggleMenu: jasmine.createSpy("toggleMenu"),
        }),
      ],
    });
  }

  function validateIcon(state: MenuState) {
    if (state === MenuState.opened) {
      expect(spec.query(FaIconComponent).icon).toEqual(["fas", "times"]);
    } else {
      expect(spec.query(FaIconComponent).icon).toEqual(["fas", "bars"]);
    }
  }

  describe("menuType", () => {
    it("should have hidden description for action menu", () => {
      setup({ menuType: "action" });
      expect(spec.query(".visually-hidden")).toHaveText("Toggle action Menu");
    });
    it("should have hidden description for secondary menu", () => {
      setup({ menuType: "secondary" });
      expect(spec.query(".visually-hidden")).toHaveText("Toggle secondary Menu");
    });
  });

  describe("color", () => {
    (
      ["danger", "dark", "info", "light", "primary", "secondary", "success", "warning"] as BootstrapColorTypes[]
    ).forEach((color) => {
      it(`should set bootstrap text property to text-${color}`, () => {
        setup({ menuType: "secondary", color });
        expect(spec.query(`.text-${color}`)).toBeInstanceOf(HTMLButtonElement);
      });
    });
  });

  describe("alignment", () => {
    it("should left align button", () => {
      setup({ menuType: "secondary", alignment: "left" });
      expect(spec.query("button")).not.toHaveComputedStyle({
        justifyContent: "end",
      });
    });

    it("should right align button", () => {
      setup({ menuType: "secondary", alignment: "right" });
      expect(spec.query("button")).toHaveComputedStyle({
        justifyContent: "end",
      });
    });
  });

  describe("icon", () => {
    it("should have close icon when any menu is open", () => {
      setup({ menuType: "secondary" }, true, true);
      validateIcon(MenuState.opened);
    });

    it("should have open icon when all menus are closed", () => {
      setup({ menuType: "secondary" }, true, false);
      validateIcon(MenuState.closed);
    });
  });

  describe("toggle menu", () => {
    function clickButton() {
      spec.query<HTMLButtonElement>("button").click();
      spec.detectChanges();
    }

    function setMenuState(isFullscreen: boolean, isMenuOpen: boolean) {
      (spec.component.menu as any).isFullscreen = isFullscreen;
      (spec.component.menu as any).isMenuOpen = isMenuOpen;
    }

    function getToggleMenuSpy() {
      return spec.component.menu.toggleMenu;
    }

    function menuToggleEvents(done: DoneFn, ...events: ((state: MenuState) => void)[]) {
      let counter = 0;
      spec.component.menuToggle.subscribe({
        next: (state) => {
          events[counter](state);
          counter++;
          if (events.length === counter) {
            done();
          }
        },
        error: shouldNotFail,
        complete: shouldNotComplete,
      });
    }

    it("should call menu service toggleMenu function", (done) => {
      setup({ menuType: "secondary" }, true, false);
      menuToggleEvents(
        done,
        () => expect(getToggleMenuSpy()).not.toHaveBeenCalled(),
        () => expect(getToggleMenuSpy()).toHaveBeenCalled(),
      );
      clickButton();
    });

    it("should update icon", (done) => {
      setup({ menuType: "secondary" }, true, true);
      menuToggleEvents(
        done,
        (state) => validateIcon(state),
        (state) => validateIcon(state),
      );
      setMenuState(true, true);
      clickButton();
    });

    it("should trigger output in menuToggle", (done) => {
      setup({ menuType: "secondary" }, true, false);
      menuToggleEvents(
        done,
        (state) => expect(state).toBe(MenuState.closed),
        (state) => expect(state).toBe(MenuState.opened),
      );
      setMenuState(true, true);
      clickButton();
    });
  });

  describe("menuToggle", () => {
    it("should output initial state", (done) => {
      setup({ menuType: "secondary" }, true, false);
      spec.component.menuToggle.subscribe({
        next: (state) => {
          expect(state).toBe(MenuState.closed);
          done();
        },
        error: shouldNotFail,
        complete: shouldNotComplete,
      });
    });
  });
});

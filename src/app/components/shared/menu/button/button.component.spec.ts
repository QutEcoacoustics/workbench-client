import { ComponentFixture, TestBed } from "@angular/core/testing";
import { MenuAction } from "@interfaces/menusInterfaces";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { createHostFactory, SpectatorHost } from "@ngneat/spectator";
import { assertAttribute, assertIcon, assertTooltip } from "@test/helpers/html";
import { SharedModule } from "../../shared.module";
import { MenuButtonComponent } from "./button.component";

describe("MenuButtonComponent", () => {
  let defaultLink: MenuAction;
  let spec: SpectatorHost<MenuButtonComponent>;
  let component: MenuButtonComponent;
  const createHost = createHostFactory({
    component: MenuButtonComponent,
    imports: [SharedModule],
  });

  function retrieveButton() {
    return spec.query<HTMLButtonElement>("button");
  }

  function setup(inputs: Partial<MenuButtonComponent> = {}) {
    spec = createHost(
      `
      <baw-menu-button
        [id]="id"
        [link]="link"
        [placement]="placement"
        [tooltip]="tooltip"
      ></baw-menu-button>
    `,
      {
        detectChanges: false,
        hostProps: {
          id: "id",
          link: defaultLink,
          placement: "left",
          tooltip: "tooltip",
          ...inputs,
        },
      }
    );
    component = spec.component;
  }

  beforeEach(() => {
    defaultLink = MenuAction({
      action: () => {},
      label: "home",
      icon: ["fas", "home"],
      tooltip: () => "tooltip",
    });
  });

  it("should create", () => {
    setup();
    spec.detectChanges();
    expect(component).toBeTruthy();
  });

  it("should have icon", () => {
    setup({
      link: MenuAction({
        ...defaultLink,
        icon: ["fas", "exclamation-triangle"],
      }),
    });
    spec.detectChanges();
    assertIcon(spec.element, "fas,exclamation-triangle");
  });

  it("should have label", () => {
    setup({ link: MenuAction({ ...defaultLink, label: "custom label" }) });
    spec.detectChanges();

    // Expects label to be above disabled user tooltip
    const label = spec.query<HTMLElement>("#label");
    expect(label).toBeTruthy("Label element should contain id='label'");
    expect(label.innerText).toBe("custom label");
  });

  describe("tooltip", () => {
    it("should have tooltip", () => {
      setup({
        tooltip: "custom tooltip",
        link: MenuAction({ ...defaultLink, tooltip: () => "custom tooltip" }),
      });
      spec.detectChanges();
      assertTooltip(retrieveButton(), "custom tooltip");
    });

    it("should not use link tooltip", () => {
      setup({
        tooltip: "custom tooltip",
        link: MenuAction({ ...defaultLink, tooltip: () => "wrong tooltip" }),
      });
      spec.detectChanges();
      assertTooltip(retrieveButton(), "custom tooltip");
    });

    it("should handle left placement of tooltip", () => {
      setup({ placement: "left" });
      spec.detectChanges();
      assertAttribute(retrieveButton(), "placement", "left");
    });

    it("should handle right placement of tooltip", () => {
      setup({ placement: "right" });
      spec.detectChanges();
      assertAttribute(retrieveButton(), "placement", "right");
    });
  });

  describe("action", () => {
    it("should execute action", () => {
      const spy = jasmine.createSpy("button action");
      setup({ link: MenuAction({ ...defaultLink, action: spy }) });
      spec.detectChanges();
      retrieveButton().click();
      expect(spy).toHaveBeenCalled();
    });

    it("should not execute action without button press", () => {
      const spy = jasmine.createSpy("button action");
      setup({ link: MenuAction({ ...defaultLink, action: spy }) });
      spec.detectChanges();
      expect(spy).not.toHaveBeenCalled();
    });
  });

  describe("disabled", () => {
    function assertDisabled(isDisabled: boolean) {
      if (isDisabled) {
        expect(spec.query("btn:disabled")).toBeTruthy();
      } else {
        expect(spec.query("btn:disabled")).toBeFalsy();
      }
    }

    it("should default as enabled if disabled is undefined", () => {
      setup({ link: MenuAction({ ...defaultLink, disabled: undefined }) });
      spec.detectChanges();
      assertDisabled(false);
    });

    it("should be enabled if disabled is false", () => {
      setup({ link: MenuAction({ ...defaultLink, disabled: false }) });
      spec.detectChanges();
      assertDisabled(false);
    });

    it("should be disabled if disabled is true", () => {
      setup({ link: MenuAction({ ...defaultLink, disabled: true }) });
      spec.detectChanges();
      assertDisabled(true);
    });
  });
});

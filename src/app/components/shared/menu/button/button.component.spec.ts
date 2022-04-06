import { TemplateRef } from "@angular/core";
import { MenuAction, menuAction } from "@interfaces/menusInterfaces";
import { NgbTooltip } from "@ng-bootstrap/ng-bootstrap";
import { createHostFactory, SpectatorHost } from "@ngneat/spectator";
import { generateMenuAction } from "@test/fakes/MenuItem";
import { assertIcon, assertTooltip } from "@test/helpers/html";
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

  function getTooltip() {
    return spec.query(NgbTooltip);
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
    defaultLink = menuAction(generateMenuAction());
  });

  it("should create", () => {
    setup();
    spec.detectChanges();
    expect(component).toBeTruthy();
  });

  it("should have icon", () => {
    setup({ link: defaultLink });
    spec.detectChanges();
    assertIcon(spec.element, { icon: defaultLink.icon });
  });

  it("should have label", () => {
    setup({ link: defaultLink });
    spec.detectChanges();

    // Expects label to be above disabled user tooltip
    const label = spec.query<HTMLElement>("#label");
    expect(label).toBeTruthy("Label element should contain id='label'");
    expect(label.innerText).toBe(defaultLink.label);
  });

  describe("tooltip", () => {
    // TODO Figure out how to implement
    xit("should have tooltip", () => {
      setup({
        tooltip: "custom tooltip",
        link: menuAction({ ...defaultLink, tooltip: () => "custom tooltip" }),
      });
      spec.detectChanges();
      assertTooltip(retrieveButton(), "custom tooltip");
    });

    // TODO Figure out how to implement
    xit("should not use link tooltip", () => {
      setup({
        tooltip: "custom tooltip",
        link: menuAction({ ...defaultLink, tooltip: () => "wrong tooltip" }),
      });
      spec.detectChanges();
      assertTooltip(retrieveButton(), "custom tooltip");
    });
  });

  describe("action", () => {
    it("should execute action", () => {
      const spy = jasmine.createSpy("button action");
      setup({ link: menuAction({ ...defaultLink, action: spy }) });
      spec.detectChanges();
      retrieveButton().click();
      expect(spy).toHaveBeenCalled();
    });

    it("should not execute action without button press", () => {
      const spy = jasmine.createSpy("button action");
      setup({ link: menuAction({ ...defaultLink, action: spy }) });
      spec.detectChanges();
      expect(spy).not.toHaveBeenCalled();
    });
  });

  describe("disabled", () => {
    function assertDisabled(isDisabled: boolean) {
      if (isDisabled) {
        expect(spec.query("button:disabled")).toBeTruthy();
      } else {
        expect(spec.query("button:disabled")).toBeFalsy();
      }
    }

    it("should default as enabled if disabled is undefined", () => {
      setup({ link: menuAction({ ...defaultLink, disabled: undefined }) });
      spec.detectChanges();
      assertDisabled(false);
    });

    it("should be enabled if disabled is false", () => {
      setup({ link: menuAction({ ...defaultLink, disabled: false }) });
      spec.detectChanges();
      assertDisabled(false);
    });

    it("should be disabled if disabled is true", () => {
      setup({ link: menuAction({ ...defaultLink, disabled: true }) });
      spec.detectChanges();
      assertDisabled(true);
    });

    xit("should display disabled message in tooltip", () => {
      setup({
        link: menuAction({
          ...defaultLink,
          disabled: "custom disabled message",
        }),
      });
      spec.detectChanges();
      const tooltip = getTooltip();
      tooltip.open();
      spec.detectChanges();
      const tooltipEl = (tooltip.ngbTooltip as TemplateRef<any>).elementRef
        .nativeElement;
      expect(tooltipEl).toContainText("custom disabled message");
    });
  });
});

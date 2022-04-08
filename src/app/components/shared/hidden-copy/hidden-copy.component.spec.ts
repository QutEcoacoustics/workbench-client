import { BootstrapColorTypes } from "@helpers/bootstrapTypes";
import { NgbTooltipModule } from "@ng-bootstrap/ng-bootstrap";
import { createHostFactory, SpectatorHost } from "@ngneat/spectator";
import { IconsModule } from "@shared/icons/icons.module";
import { modelData } from "@test/helpers/faker";
import { assertIcon, assertTooltip } from "@test/helpers/html";
import { ClipboardModule } from "ngx-clipboard";
import { HiddenCopyComponent } from "./hidden-copy.component";

describe("HiddenCopyComponent", () => {
  let spec: SpectatorHost<HiddenCopyComponent>;
  const createHost = createHostFactory({
    component: HiddenCopyComponent,
    imports: [IconsModule, NgbTooltipModule, ClipboardModule],
  });

  function setup(props: Partial<HiddenCopyComponent>) {
    props.value ??= "value";
    props.content ??= "content";
    props.tooltip ??= "tooltip";

    spec = createHost("<baw-hidden-copy></baw-hidden-copy>", {
      props,
    });
  }

  function getVisibilityButton() {
    return spec.query<HTMLButtonElement>("#visibility-btn");
  }

  function getCopyButton() {
    return spec.query<HTMLButtonElement>("#copy-btn");
  }

  it("should create", () => {
    setup({});
    expect(spec.component).toBeTruthy();
  });

  describe("visibility button", () => {
    it("should have icon", () => {
      setup({});
      assertIcon(getVisibilityButton(), { icon: ["fas", "eye"] });
    });

    it("should have tooltip", () => {
      const tooltip = modelData.random.words();
      setup({ tooltip });
      // Container is body so that we dont have issues with the tooltip
      // breaking css and clipping
      assertTooltip(getVisibilityButton(), tooltip, { container: "body" });
    });

    it("should not be disabled", () => {
      setup({ disabled: undefined });
      expect(getVisibilityButton()).not.toHaveAttribute("disabled");
    });

    it("should toggle visibility on click", () => {
      setup({});
      getVisibilityButton().click();
      expect(spec.component.visible).toBe(true);
      getVisibilityButton().click();
      expect(spec.component.visible).toBe(false);
    });
  });

  describe("copy button", () => {
    it("should have icon", () => {
      setup({});
      assertIcon(getCopyButton(), { icon: ["fas", "copy"] });
    });

    it("should have tooltip", () => {
      const tooltip = modelData.random.words();
      setup({ tooltip });
      // Container is body so that we dont have issues with the tooltip
      // breaking css and clipping
      // Tooltip should only show on click
      assertTooltip(getCopyButton(), "Copied!", {
        triggers: "manual",
        container: "body",
      });
    });

    it("should not be disabled", () => {
      setup({ disabled: undefined });
      expect(getCopyButton()).not.toHaveAttribute("disabled");
    });
  });

  describe("content", () => {
    it("should display ... when not visible", () => {
      setup({});
      expect(spec.query("pre")).toHaveText("...");
    });

    it("should display content when visible", () => {
      const content = modelData.random.words();
      setup({ content });
      getVisibilityButton().click();
      spec.detectChanges();
      expect(spec.query("pre")).toHaveText(content);
    });

    it("should display ng-content when visible", () => {
      const content = modelData.random.words();
      spec = createHost(
        `<baw-hidden-copy><span>${content}</span></baw-hidden-copy>`,
        { props: { value: "value" } }
      );
      getVisibilityButton().click();
      spec.detectChanges();
      expect(spec.query("pre")).toHaveText(content);
    });
  });

  describe("disabled", () => {
    it("should disable visibility button", () => {
      const disabled = modelData.random.words();
      setup({ disabled });
      expect(getVisibilityButton()).toHaveAttribute("disabled");
    });

    it("should show disabled tooltip on visibility button", () => {
      const tooltip = modelData.random.words();
      const disabled = modelData.random.words();
      setup({ tooltip, disabled });
      assertTooltip(getVisibilityButton(), disabled);
    });

    it("should disable copy button", () => {
      const disabled = modelData.random.words();
      setup({ disabled });
      expect(getCopyButton()).toHaveAttribute("disabled");
    });
  });

  describe("color", () => {
    let color: BootstrapColorTypes;

    beforeEach(() => {
      color = modelData.random.arrayElement<BootstrapColorTypes>([
        "primary",
        "secondary",
        "success",
        "danger",
      ]);
      setup({ color });
    });

    it("should change color of visibility button", () => {
      const btn = getVisibilityButton();
      expect(btn).toHaveClass("btn");
      expect(btn).toHaveClass(`btn-outline-${color}`);
    });

    it("should change color of copy button", () => {
      const btn = getCopyButton();
      expect(btn).toHaveClass("btn");
      expect(btn).toHaveClass(`btn-outline-${color}`);
    });
  });
});

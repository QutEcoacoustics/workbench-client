import { BootstrapColorTypes } from "@helpers/bootstrapTypes";
import { NgbTooltipModule } from "@ng-bootstrap/ng-bootstrap";
import { createHostFactory, SpectatorHost, SpyObject } from "@ngneat/spectator";
import { IconsModule } from "@shared/icons/icons.module";
import { modelData } from "@test/helpers/faker";
import { ClipboardModule, ClipboardService } from "ngx-clipboard";
import { HiddenCopyComponent } from "./hidden-copy.component";

describe("HiddenCopyComponent", () => {
  let spec: SpectatorHost<HiddenCopyComponent>;
  let clipboardService: SpyObject<ClipboardService>;

  const createHost = createHostFactory({
    component: HiddenCopyComponent,
    imports: [IconsModule, NgbTooltipModule, ClipboardModule],
  });

  function setup(props: Partial<HiddenCopyComponent> = {}) {
    props.value ??= "value";
    props.content ??= "content";
    props.tooltip ??= "tooltip";

    spec = createHost(`
      <baw-hidden-copy
        [value]="value"
        [content]="content"
        [tooltip]="tooltip"
        [color]="color"
        [disabled]="disabled"
      ></baw-hidden-copy>
  `, {
      hostProps: props,
    });

    clipboardService = spec.inject(ClipboardService);
    clipboardService.copyFromContent = jasmine.createSpy("copyFromContent") as any;
  }

  function getVisibilityButton() {
    return spec.query<HTMLButtonElement>("#visibility-btn");
  }

  function getCopyButton() {
    return spec.query<HTMLButtonElement>("#copy-btn");
  }

  function getCopyIcon() {
    return spec.query("#copy-icon");
  }

  function getCopiedTooltip() {
    return spec.query<HTMLSpanElement>("[ngbTooltip='Coped!']");
  }

  it("should create", () => {
    setup({});
    expect(spec.component).toBeTruthy();
  });

  describe("visibility button", () => {
    it("should have icon", () => {
      setup({});
      expect(getVisibilityButton()).toHaveIcon(["fas", "eye"]);
    });

    it("should have tooltip", () => {
      const tooltip = modelData.random.words();
      setup({ tooltip });
      // Container is body so that we don't have issues with the tooltip
      // breaking css and clipping
      expect(getVisibilityButton()).toHaveTooltip(tooltip, {
        container: "body",
      });
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
      expect(getCopyButton()).toHaveIcon(["fas", "copy"]);
    });

    it("should have tooltip", () => {
      const tooltip = modelData.random.words();
      setup({ tooltip });
      // Container is body so that we don't have issues with the tooltip
      // breaking css and clipping

      // if we hover over the "Copied!" tooltip element, it should not show
      spec.focus(getCopyButton());

      // Tooltip should only show on click
      expect(getCopiedTooltip()).not.toBeVisible();

      // after the button is clicked, we expect that the tooltip will be visible
      spec.click(getCopyButton());
      expect(getCopiedTooltip()).not.toBeVisible();
    });

    it("should not be disabled", () => {
      setup({ disabled: undefined });
      expect(getCopyButton()).not.toHaveAttribute("disabled");
    });

    // these tests were not always present which resulted in bugs such as the
    // copy button not copying the text
    // see: https://github.com/QutEcoacoustics/workbench-client/issues/2146
    it("should copy if the copy icon is clicked", () => {
      setup({ content: modelData.authToken() });
      spec.click(getCopyIcon());
      expect(clipboardService.copyFromContent).toHaveBeenCalledTimes(1);
    });

    it("should copy if the copy button is clicked", () => {
      setup({ content: modelData.authToken() });
      spec.click(getCopyButton());
      expect(clipboardService.copyFromContent).toHaveBeenCalledTimes(1);
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
        { hostProps: { value: "value" } }
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
      expect(getVisibilityButton()).toHaveTooltip(disabled);
    });

    it("should disable copy button", () => {
      const disabled = modelData.random.words();
      setup({ disabled });
      expect(getCopyButton()).toHaveAttribute("disabled");
    });

    it("should not copy if disabled and the copy button is clicked", () => {
      setup({ content: modelData.authToken(), disabled: "true" });
      spec.click(getCopyButton());
      expect(clipboardService.copyFromContent).not.toHaveBeenCalled();
    });
  });

  describe("color", () => {
    let color: BootstrapColorTypes;

    beforeEach(() => {
      color = modelData.helpers.arrayElement<BootstrapColorTypes>([
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

import { createComponentFactory, Spectator } from "@ngneat/spectator";
import { IconsModule } from "@shared/icons/icons.module";
import {
  ISelectableItem,
  SelectableItemsComponent,
} from "./selectable-items.component";

describe("SelectableItemsComponent", () => {
  let spec: Spectator<SelectableItemsComponent<string>>;
  let selectionChangeSpy: jasmine.Spy;

  const testOptions: ISelectableItem<string>[] = [
    { label: "Option 1", value: "value1" },
    { label: "Option 2", value: "value2" },
    { label: "Option 3", value: "value3" },
  ];

  const createComponent = createComponentFactory({
    component: SelectableItemsComponent<string>,
    imports: [IconsModule],
  });

  function getButtons(): HTMLButtonElement[] {
    return spec.queryAll<HTMLButtonElement>("button");
  }

  beforeEach(() => {
    spec = createComponent({ detectChanges: false });
    selectionChangeSpy = spyOn(spec.component.selectionChange, "emit");
  });

  it("should create", () => {
    spec.detectChanges();
    expect(spec.component).toBeTruthy();
  });

  describe("selectionChange event", () => {
    it("should emit selectionChange when a non-selected item is clicked", () => {
      spec.setInput("options", testOptions);
      spec.setInput("selection", "value1");
      spec.detectChanges();

      const buttons = getButtons();
      // Click on the second button (value2)
      buttons[1].click();
      spec.detectChanges();

      expect(selectionChangeSpy).toHaveBeenCalledOnceWith("value2");
    });

    it("should not emit selectionChange when an already selected item is clicked", () => {
      spec.setInput("options", testOptions);
      spec.setInput("selection", "value1");
      spec.detectChanges();

      const buttons = getButtons();
      // Click on the first button (value1) which is already selected
      buttons[0].click();
      spec.detectChanges();

      expect(selectionChangeSpy).not.toHaveBeenCalled();
    });

    it("should not emit selectionChange when clicking the same item multiple times", () => {
      spec.setInput("options", testOptions);
      spec.setInput("selection", "value2");
      spec.detectChanges();

      const buttons = getButtons();
      // Click on the second button (value2) which is already selected multiple times
      buttons[1].click();
      buttons[1].click();
      buttons[1].click();
      spec.detectChanges();

      expect(selectionChangeSpy).not.toHaveBeenCalled();
    });

    it("should emit selectionChange when selection is undefined and an item is clicked", () => {
      spec.setInput("options", testOptions);
      spec.detectChanges();

      const buttons = getButtons();
      buttons[0].click();
      spec.detectChanges();

      expect(selectionChangeSpy).toHaveBeenCalledOnceWith("value1");
    });
  });

  describe("inline mode", () => {
    it("should emit selectionChange when a non-selected item is clicked in inline mode", () => {
      spec.setInput("options", testOptions);
      spec.setInput("selection", "value1");
      spec.setInput("inline", true);
      spec.detectChanges();

      const buttons = getButtons();
      // Click on the second button (value2)
      buttons[1].click();
      spec.detectChanges();

      expect(selectionChangeSpy).toHaveBeenCalledOnceWith("value2");
    });

    it("should not emit selectionChange when an already selected item is clicked in inline mode", () => {
      spec.setInput("options", testOptions);
      spec.setInput("selection", "value1");
      spec.setInput("inline", true);
      spec.detectChanges();

      const buttons = getButtons();
      // Click on the first button (value1) which is already selected
      buttons[0].click();
      spec.detectChanges();

      expect(selectionChangeSpy).not.toHaveBeenCalled();
    });
  });
});

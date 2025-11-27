import { createComponentFactory, Spectator } from "@ngneat/spectator";
import { IconsModule } from "@shared/icons/icons.module";
import { clickButton } from "@test/helpers/html";
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
    spec.detectChanges();
  });

  it("should create", () => {
    expect(spec.component).toBeInstanceOf(SelectableItemsComponent);
  });

  describe("selectionChange event", () => {
    it("should emit selectionChange when a non-selected item is clicked", () => {
      spec.setInput({
        options: testOptions,
        selection: "value1",
      });

      // Click on the second button (value2)
      clickButton(spec, getButtons()[1]);

      expect(selectionChangeSpy).toHaveBeenCalledOnceWith("value2");
    });

    it("should not emit selectionChange when an already selected item is clicked", () => {
      spec.setInput({
        options: testOptions,
        selection: "value1",
      });

      // Click on the first button (value1) which is already selected
      clickButton(spec, getButtons()[0]);

      expect(selectionChangeSpy).not.toHaveBeenCalled();
    });

    it("should not emit selectionChange when clicking the same item multiple times", () => {
      spec.setInput({
        options: testOptions,
        selection: "value2",
      });

      // Click on the second button (value2) which is already selected multiple times
      clickButton(spec, getButtons()[1]);
      clickButton(spec, getButtons()[1]);
      clickButton(spec, getButtons()[1]);

      expect(selectionChangeSpy).not.toHaveBeenCalled();
    });

    it("should emit selectionChange when selection is undefined and an item is clicked", () => {
      spec.setInput({ options: testOptions });

      clickButton(spec, getButtons()[0]);

      expect(selectionChangeSpy).toHaveBeenCalledOnceWith("value1");
    });
  });

  describe("inline mode", () => {
    it("should emit selectionChange when a non-selected item is clicked in inline mode", () => {
      spec.setInput({
        options: testOptions,
        selection: "value1",
        inline: true,
      });

      // Click on the second button (value2)
      clickButton(spec, getButtons()[1]);

      expect(selectionChangeSpy).toHaveBeenCalledOnceWith("value2");
    });

    it("should not emit selectionChange when an already selected item is clicked in inline mode", () => {
      spec.setInput({
        options: testOptions,
        selection: "value1",
        inline: true,
      });

      // Click on the first button (value1) which is already selected
      clickButton(spec, getButtons()[0]);

      expect(selectionChangeSpy).not.toHaveBeenCalled();
    });
  });
});

import { createComponentFactory, Spectator } from "@ngneat/spectator";
import { IconsModule } from "@shared/icons/icons.module";
import { clickButton } from "@test/helpers/html";
import {
  ISelectableItem,
  SelectableItemsComponent,
} from "./selectable-items.component";

type SelectableItem = "value1" | "value2" | "value3";

describe("SelectableItemsComponent", () => {
  let spec: Spectator<SelectableItemsComponent<SelectableItem>>;
  let selectionChangeSpy: jasmine.Spy;

  const testOptions: ISelectableItem<SelectableItem>[] = [
    { label: "Option 1", value: "value1" },
    { label: "Option 2", value: "value2" },
    { label: "Option 3", value: "value3" },
  ];

  const createComponent = createComponentFactory({
    component: SelectableItemsComponent<SelectableItem>,
    imports: [IconsModule],
  });

  function clickOption(value: SelectableItem) {
    const indexMap = new Map<string, number>([
      ["value1", 0],
      ["value2", 1],
      ["value3", 2],
    ]);

    const buttons = spec.queryAll<HTMLButtonElement>("button");
    const buttonToClick = buttons[indexMap.get(value)];

    clickButton(spec, buttonToClick);
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

      clickOption("value2");

      expect(selectionChangeSpy).toHaveBeenCalledOnceWith("value2");
    });

    it("should not emit selectionChange when an already selected item is clicked", () => {
      spec.setInput({
        options: testOptions,
        selection: "value1",
      });

      clickOption("value1");

      expect(selectionChangeSpy).not.toHaveBeenCalled();
    });

    it("should emit selectionChange when selection is undefined and an item is clicked", () => {
      spec.setInput({ options: testOptions });
      clickOption("value1");
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

      clickOption("value2");

      expect(selectionChangeSpy).toHaveBeenCalledOnceWith("value2");
    });

    it("should not emit selectionChange when an already selected item is clicked in inline mode", () => {
      spec.setInput({
        options: testOptions,
        selection: "value1",
        inline: true,
      });

      clickOption("value1");

      expect(selectionChangeSpy).not.toHaveBeenCalled();
    });
  });
});

import { RouterTestingModule } from "@angular/router/testing";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { createComponentFactory, Spectator } from "@ngneat/spectator";
import { List } from "immutable";
import { MockComponent } from "ng-mocks";
import { SharedModule } from "../../shared.module";
import { IItem, ItemComponent } from "../item/item.component";
import { ItemsComponent } from "./items.component";

describe("ItemsComponent", () => {
  let defaultIcon: IconProp;
  let spec: Spectator<ItemsComponent>;
  const createComponent = createComponentFactory({
    component: ItemsComponent,
    imports: [SharedModule, RouterTestingModule],
    declarations: [MockComponent(ItemComponent)],
  });

  function getItems(): ItemComponent[] {
    return spec.queryAll(ItemComponent);
  }

  function getLeftColumn(): NodeListOf<HTMLElement> {
    return spec
      .queryAll("ul.list-group")[0]
      .querySelectorAll<HTMLElement>("baw-items-item");
  }

  function getRightColumn(): NodeListOf<HTMLElement> {
    return spec
      .queryAll("ul.list-group")[1]
      .querySelectorAll<HTMLElement>("baw-items-item");
  }

  function assertItem(item: ItemComponent, data: IItem) {
    expect(item.icon).toBe(data.icon);
    expect(item.name).toBe(data.name);
    expect(item.tooltip).toEqual(data.tooltip);
    expect(item.value).toBe(data.value);
  }

  beforeEach(() => {
    spec = createComponent();
    defaultIcon = ["fas", "home"];
  });

  it("should create", () => {
    spec.detectChanges();
    expect(spec.component).toBeTruthy();
  });

  it("should create single item", () => {
    const itemData: IItem = { icon: defaultIcon, name: "test", value: 0 };
    spec.setInput({ items: List([itemData]) });
    spec.detectChanges();

    const items = getItems();
    expect(items.length).toBe(1);
    assertItem(items[0], itemData);
  });

  it("should create single item with tooltip", () => {
    const itemData: IItem = {
      icon: defaultIcon,
      name: "test",
      value: 0,
      tooltip: () => "custom tooltip",
    };
    spec.setInput({ items: List([itemData]) });
    spec.detectChanges();

    const items = getItems();
    expect(items.length).toBe(1);
    assertItem(items[0], itemData);
  });

  it("should create multiple items", () => {
    const itemData: List<IItem> = List([
      { icon: defaultIcon, name: "test 1", value: 0 },
      { icon: defaultIcon, name: "test 2", value: 42 },
      { icon: defaultIcon, name: "test 3", value: 256 },
    ]);
    spec.setInput({ items: itemData });
    spec.detectChanges();

    const items = getItems();
    expect(items.length).toBe(itemData.count());
    itemData.forEach((item, index) => assertItem(items[index], item));
  });

  it("should create multiple items with tooltips", () => {
    const itemData: List<IItem> = List([
      {
        icon: defaultIcon,
        name: "test 1",
        value: 0,
        tooltip: () => "custom tooltip 1",
      },
      {
        icon: defaultIcon,
        name: "test 2",
        value: 42,
        tooltip: () => "custom tooltip 2",
      },
      {
        icon: defaultIcon,
        name: "test 3",
        value: 256,
        tooltip: () => "custom tooltip 3",
      },
    ]);
    spec.setInput({ items: itemData });
    spec.detectChanges();

    const items = getItems();
    expect(items.length).toBe(itemData.count());
    itemData.forEach((item, index) => assertItem(items[index], item));
  });

  it("should split items between columns", () => {
    const itemData: List<IItem> = List([
      { icon: defaultIcon, name: "test 1", value: 0 },
      { icon: defaultIcon, name: "test 2", value: 42 },
      { icon: defaultIcon, name: "test 3", value: 256 },
      { icon: defaultIcon, name: "test 4", value: 1024 },
    ]);
    spec.setInput({ items: itemData });
    spec.detectChanges();

    expect(getItems().length).toBe(4);
    expect(getLeftColumn().length).toBe(2);
    expect(getRightColumn().length).toBe(2);
  });

  // TODO Add check that columns inline on small devices
});

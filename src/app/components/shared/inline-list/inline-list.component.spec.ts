import { SpectatorHost, createHostFactory } from "@ngneat/spectator";
import { SharedModule } from "@shared/shared.module";
import { MockBawApiModule } from "@baw-api/baw-apiMock.module";
import { modelData } from "@test/helpers/faker";
import { InlineListComponent } from "./inline-list.component";

describe("InlineListComponent", () => {
  let spectator: SpectatorHost<InlineListComponent>;
  let defaultTestItems: any[];

  const createComponent = createHostFactory({
    imports: [SharedModule, MockBawApiModule],
    component: InlineListComponent,
  });

  function setup(initialItems: any[], itemKey?: string): void {
    const testBedTemplate = `
      <ng-template #emptyTemplate>
        <span id="template-span">Empty</span>
      </ng-template>

      <baw-inline-list [items]="items" [itemKey]="itemKey" [emptyTemplate]="emptyTemplate"></baw-inline-list>
    `;

    spectator = createComponent(testBedTemplate, { detectChanges: false });

    spectator.detectChanges();

    spectator.component.items = initialItems;
    spectator.component.itemKey = itemKey;

    spectator.detectChanges();
  }

  beforeEach(() => {
    defaultTestItems = modelData.randomArray(5, 10, () => modelData.name.firstName());

    // by not specifying an item key, the component will default to using the stringified value of the item
    // in the case of a string, this is the same as the item itself
    setup(defaultTestItems);
  });

  const inlineListElements = (): HTMLSpanElement[] =>
    spectator.queryAll<HTMLSpanElement>("span");

  function getElementByInnerText<T extends HTMLElement>(text: string): T {
    return spectator.debugElement.query(
      (el) => el.nativeElement.innerText === text
    ).nativeElement;
  }

  it("should create", () => {
    expect(spectator.component).toBeInstanceOf(InlineListComponent);
  });

  it("should add commas between each item", () => {
    const itemElements: HTMLSpanElement[] = inlineListElements();

    itemElements.forEach((itemElement: HTMLSpanElement, index: number) => {
      // because we are testing that the last element does not have a comma
      // this test will fail if there is a trailing comma after the last item
      const expectedText =
        index === itemElements.length - 1
          ? defaultTestItems[index]
          : `${defaultTestItems[index]}, `;

      expect(itemElement).toHaveExactText(expectedText);
    });
  });

  it("should navigate to the item's view page when an item is clicked", () => {
    const itemViewUrl = "https://example.com/";
    const name = "test";

    const item = { name, viewUrl: itemViewUrl } as any;

    spectator.component.items = [item];
    spectator.component.itemKey = "name";

    spectator.detectChanges();

    const itemElement: HTMLSpanElement =
      getElementByInnerText<HTMLSpanElement>("test");
    const itemLink: HTMLAnchorElement = itemElement.querySelector("a");

    expect(itemLink.href).toEqual(itemViewUrl);
  });

  it("should use the item's itemKey for the items display text", () => {
    const item = { itemKey: "item key", toString: () => "test" } as any;

    spectator.component.items = [item];
    spectator.component.itemKey = "itemKey";

    spectator.detectChanges();

    const itemElement = getElementByInnerText("item key");
    expect(itemElement).toExist();
  });

  it("should use the item's toString method if no itemKey is provided", () => {
    const item = { toString: () => "items tostring" } as any;

    spectator.component.items = [item];
    spectator.component.itemKey = undefined;

    spectator.detectChanges();

    const itemElement = getElementByInnerText("items tostring");
    expect(itemElement).toExist();
  });

  it("should use the empty template if no items are provided", () => {
    spectator.component.items = [];
    spectator.detectChanges();

    const emptyTemplateItem: HTMLSpanElement =
      spectator.query("#template-span");
    expect(emptyTemplateItem).toExist();
  });

  it("should dynamically the list if an items value changes", () => {
    // since we track each object by the "itemKey", we should assert that if the value of an item key changes, the list updates
    // this test would not work if you tracked each item by object reference
    const initialItems = [
      { name: "test1" },
      { name: "test2" },
      { name: "test3" },
    ] as any;

    const updatedItems = [
      { name: "test1" },
      { name: "changed item key" },
      { name: "test3" },
    ] as any;

    spectator.component.items = initialItems;
    spectator.component.itemKey = "name";

    spectator.detectChanges();

    const itemElements = inlineListElements();
    expect(itemElements).toHaveLength(initialItems.length);

    itemElements.forEach((itemElement, index) => {
      expect(itemElement).toHaveText(initialItems[index].name);
    });

    spectator.component.items = updatedItems;
    spectator.detectChanges();

    const updatedItemElements = inlineListElements();
    expect(updatedItemElements).toHaveLength(updatedItems.length);

    updatedItemElements.forEach((itemElement, index) => {
      expect(itemElement).toHaveText(updatedItems[index].name);
    });
  });

  it("should dynamically update the list if an item is added", () => {
    const initialItemLength = spectator.component.items.length;

    const updatedItems = [...spectator.component.items, "new item"] as any;

    const itemElements = inlineListElements();
    expect(itemElements).toHaveLength(initialItemLength);

    spectator.component.items = updatedItems;
    spectator.detectChanges();

    const updatedItemElements = inlineListElements();

    expect(updatedItemElements).toHaveLength(updatedItems.length);
  });
});

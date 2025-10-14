import { SpectatorHost, createHostFactory } from "@ngneat/spectator";
import { provideMockBawApi } from "@baw-api/provide-baw-ApiMock";
import { modelData } from "@test/helpers/faker";
import { provideRouter } from "@angular/router";
import { listenRecordingMenuItem } from "@components/listen/listen.menus";
import { getElementByTextContent } from "@test/helpers/html";
import { InlineListComponent } from "./inline-list.component";

describe("InlineListComponent", () => {
  let spec: SpectatorHost<InlineListComponent>;
  let defaultTestItems: any[];

  const createComponent = createHostFactory({
    component: InlineListComponent,
    providers: [provideMockBawApi(), provideRouter([])],
  });

  function setup(initialItems: any[], itemKey?: string): void {
    const testBedTemplate = `
      <ng-template #emptyTemplate>
        <span id="template-span">Empty</span>
      </ng-template>

      <baw-inline-list [items]="items" [itemKey]="itemKey" [emptyTemplate]="emptyTemplate"></baw-inline-list>
    `;

    spec = createComponent(testBedTemplate, {
      hostProps: {
        items: initialItems,
        itemKey,
      },
    });
  }

  beforeEach(() => {
    defaultTestItems = modelData.randomArray(5, 10, () =>
      modelData.name.firstName(),
    );

    // by not specifying an item key, the component will default to using the stringified value of the item
    // in the case of a string, this is the same as the item itself
    setup(defaultTestItems);
  });

  const inlineListElements = (): HTMLSpanElement[] =>
    spec.queryAll<HTMLSpanElement>("span");

  it("should create", () => {
    expect(spec.component).toBeInstanceOf(InlineListComponent);
  });

  it("should add commas between each item", () => {
    const itemElements = inlineListElements();

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
    const audioRecordingId = modelData.id();

    const name = "test";
    const itemViewUrl = listenRecordingMenuItem.route.toRouterLink({
      audioRecordingId,
    });

    const item = { name, viewUrl: itemViewUrl } as any;

    spec.setHostInput("items", [item]);
    spec.setHostInput("itemKey", "name");

    const itemElement: HTMLSpanElement =
      getElementByTextContent<HTMLSpanElement>(spec, "test");
    const itemLink: HTMLAnchorElement = itemElement.querySelector("a");

    const expectedUrl = new URL(itemViewUrl, window.location.origin);
    expect(itemLink.href).toEqual(expectedUrl.href);
  });

  it("should use the item's itemKey for the items display text", () => {
    const item = { itemKey: "item key", toString: () => "test" } as any;

    spec.setHostInput("items", [item]);
    spec.setHostInput("itemKey", "itemKey");

    const itemElement = getElementByTextContent(spec, "item key");
    expect(itemElement).toExist();
  });

  it("should use the item's toString method if no itemKey is provided", () => {
    const item = { toString: () => "items tostring" } as any;

    spec.setHostInput("items", [item]);
    spec.setHostInput("itemKey", undefined);

    const itemElement = getElementByTextContent(spec, "items tostring");
    expect(itemElement).toExist();
  });

  it("should use the empty template if no items are provided", () => {
    spec.setHostInput("items", []);

    const emptyTemplateItem: HTMLSpanElement = spec.query("#template-span");
    expect(emptyTemplateItem).toExist();
  });

  it("should dynamically the list if an items value changes", () => {
    // since we track each object by the "itemKey", we should assert that if the value of an item key changes, the list updates
    // this test would not work if you tracked each item by object reference
    //
    // TODO: remove this type cast by instantiating this object with the
    // AbstractModel constructor
    const initialItems = [
      { name: "test1" },
      { name: "test2" },
      { name: "test3" },
    ];

    const updatedItems = [
      { name: "test1" },
      { name: "changed item key" },
      { name: "test3" },
    ];

    spec.setHostInput("items", initialItems);
    spec.setHostInput("itemKey", "name");

    const itemElements = inlineListElements();
    expect(itemElements).toHaveLength(initialItems.length);

    itemElements.forEach((itemElement, index) => {
      expect(itemElement).toHaveText(initialItems[index].name);
    });

    spec.setHostInput("items", updatedItems);

    const updatedItemElements = inlineListElements();
    expect(updatedItemElements).toHaveLength(updatedItems.length);

    updatedItemElements.forEach((itemElement, index) => {
      expect(itemElement).toHaveText(updatedItems[index].name);
    });
  });

  it("should dynamically update the list if an item is added", () => {
    const initialItemLength = spec.component.items().length;

    const updatedItems = [...spec.component.items(), "new item"];

    const itemElements = inlineListElements();
    expect(itemElements).toHaveLength(initialItemLength);

    spec.setHostInput("items", updatedItems);

    const updatedItemElements = inlineListElements();
    expect(updatedItemElements).toHaveLength(updatedItems.length);
  });
});

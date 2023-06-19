import { MockBawApiModule } from "@baw-api/baw-apiMock.module";
import { SHALLOW_SITE } from "@baw-api/ServiceTokens";
import { ShallowSitesService } from "@baw-api/site/sites.service";
import { Site } from "@models/Site";
import { createRoutingFactory, SpectatorRouting, SpyObject } from "@ngneat/spectator";
import { SharedModule } from "@shared/shared.module";
import { generateSite } from "@test/fakes/Site";
import { modelData } from "@test/helpers/faker";
import { ToastrService } from "ngx-toastr";
import { Observable, of } from "rxjs";
import { TypeaheadInputComponent } from "./typeahead-input.component";

describe("TypeaheadInputComponent", () => {
  let spectator: SpectatorRouting<TypeaheadInputComponent>;
  let sitesService: SpyObject<ShallowSitesService>;

  const createComponent = createRoutingFactory({
    component: TypeaheadInputComponent,
    imports: [MockBawApiModule, SharedModule],
    mocks: [ToastrService],
  });

  function setup(): void {
    spectator = createComponent({ detectChanges: false });

    sitesService = spectator.inject(SHALLOW_SITE.token);
    sitesService.list.and.callFake(mockApi);

    const sitesFormatter = (site: Site) => site.name;

    spectator.component.optionsCallback = sitesService.list;
    spectator.component.formatter = sitesFormatter;

    spectator.detectChanges();
  }

  // the mock API will mokc the sites list API
  function mockApi(data?: Site[]): Observable<Site[]> {
    if (!data) {
      data = Array(modelData.datatype.number({ min: 3, max: 10 })).map(
        () => new Site(generateSite())
      );
    }

    return of(data);
  }

  const inputBox = (): HTMLInputElement => spectator.query<HTMLInputElement>("input");
  const itemPills = (): HTMLSpanElement[] => spectator.queryAll("span");

  function typeInInput(text: string): void {
    const inputElement: HTMLInputElement = inputBox();
    spectator.typeInElement(text, inputElement);
    inputElement.dispatchEvent(new Event("input"));
    spectator.detectChanges();
  }

  function selectItemFromInputBox(text: string): void {
    typeInInput(text);
    inputBox().dispatchEvent(new KeyboardEvent("keydown", { key: "Enter" }));
    spectator.detectChanges();
  }

  beforeEach(() => setup());

  it("should create", () => {
    expect(spectator.component).toBeInstanceOf(TypeaheadInputComponent);
  });

  it("should call the options callback when the user types in the input box", () => {
    const testInput = modelData.param();
    typeInInput(testInput);
    expect(sitesService.list).toHaveBeenCalled();
  });

  it("should include text above the input box for the label attribute", () => {
    const testLabelContent = modelData.lorem.words();

    spectator.component.label = testLabelContent;
    spectator.detectChanges();

    const label = spectator.query<HTMLLabelElement>("label");
    expect(label.innerText).toEqual(testLabelContent);
  });

  it("should hide the label if there is no label attribute", () => {
    const label = spectator.query<HTMLLabelElement>("label");
    expect(label).not.toExist();
  });

  it("should not create object pills if multiple inputs is disabled", () => {
    spectator.component.multipleInputs = false;

    const testInputs: Site[] = [
      new Site({ name: "testing" }),
      new Site({ name: "test123" }),
      new Site({ name: "multi word" }),
    ];

    spectator.component.activeItems = testInputs;
    spectator.detectChanges();

    const pillElements: HTMLSpanElement[] = itemPills();
    expect(pillElements).toBeEmpty();
  });

  it("should create object pills if multiple inputs is enabled", () => {
    const testInputs: Site[] = [
      new Site({ name: "testing" }),
      new Site({ name: "test123" }),
      new Site({ name: "multi word" }),
    ];

    spectator.component.multipleInputs = true;
    spectator.component.activeItems = testInputs;

    spectator.detectChanges();

    const pillElements: HTMLSpanElement[] = itemPills();

    expect(pillElements.length).toEqual(testInputs.length);
    pillElements.forEach((pill: HTMLSpanElement, i: number) => {
      expect(pill.innerText).toEqual(testInputs[i].name);
    });
  });

  it("should create multiple pills if the user adds multiple through the input box", () => {
    spectator.component.multipleInputs = true;
    const testInputs: string[] = [
      "foo",
      "hello world!",
      "bar"
    ];

    testInputs.forEach((input: string) => selectItemFromInputBox(input));

    const pillElements: HTMLSpanElement[] = itemPills();

    expect(pillElements.length).toEqual(testInputs.length);
    pillElements.forEach((pill: HTMLSpanElement, i: number) => {
      expect(pill.innerText).toEqual(testInputs[i]);
    });
  });

  it("should clear the input if the user adds an item and multiple inputs are enabled", () => {
    const testInput = modelData.param();
    spectator.component.multipleInputs = true;

    // the typeInInput box doesn't add the item to the active items, therefore, we need to send a separate event to add the item
    selectItemFromInputBox(testInput);
    expect(inputBox().value).toBeEmpty();
  });

  it("should not clear the input if the selects an items from an input that doesn't have multiple inputs", () => {
    const testInput = modelData.param();
    spectator.component.multipleInputs = false;
    selectItemFromInputBox(testInput);

    // this following detect changes isn't strictly needed
    // however, if the component was to clear, it would most likely clear on the next change detection cycle
    spectator.detectChanges();
    expect(inputBox().value).toEqual(testInput);
  });

  it("should remove an item if a user clicks backspace on a pill", () => {
    const mockSites: Site[] = Array( modelData.datatype.number({ min: 3, max: 10 })).map(
      () => new Site(generateSite())
    );

    // the last element should be removed from the active items array when the backspace key is pressed
    const expectedSites: Site[] = mockSites.slice(0, -1);

    spectator.component.multipleInputs = true;
    spectator.component.activeItems = mockSites;

    const inputBoxElement: HTMLInputElement = inputBox();
    inputBoxElement.dispatchEvent(new KeyboardEvent("keydown", { key: "Backspace" }));
    spectator.detectChanges();

    expect(spectator.component.activeItems).toEqual(expectedSites);
  });
});

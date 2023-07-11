import { MockBawApiModule } from "@baw-api/baw-apiMock.module";
import { SHALLOW_SITE } from "@baw-api/ServiceTokens";
import { ShallowSitesService } from "@baw-api/site/sites.service";
import { Site } from "@models/Site";
import {
  createRoutingFactory,
  SpectatorRouting,
  SpyObject,
} from "@ngneat/spectator";
import { SharedModule } from "@shared/shared.module";
import { generateSite } from "@test/fakes/Site";
import { modelData } from "@test/helpers/faker";
import { ToastrService } from "ngx-toastr";
import { of } from "rxjs";
import {
  discardPeriodicTasks,
  fakeAsync,
  flush,
  tick,
} from "@angular/core/testing";
import { defaultDebounceTime } from "src/app/app.helper";
import { TypeaheadInputComponent } from "./typeahead-input.component";

describe("TypeaheadInputComponent", () => {
  let spectator: SpectatorRouting<TypeaheadInputComponent>;
  let mockSitesService: SpyObject<ShallowSitesService>;
  let defaultFakeSites: Site[];

  const createComponent = createRoutingFactory({
    component: TypeaheadInputComponent,
    imports: [MockBawApiModule, SharedModule],
    mocks: [ToastrService],
  });

  function setup(): void {
    spectator = createComponent({ detectChanges: false });

    defaultFakeSites = Array.from(
      { length: modelData.datatype.number({ min: 3, max: 10 }) },
      () => new Site(generateSite())
    );

    mockSitesService = spectator.inject(SHALLOW_SITE.token);
    mockSitesService.filter.and.returnValue(of(defaultFakeSites));

    spectator.component.searchCallback = mockSitesService.filter;

    spectator.detectChanges();
  }


  const inputBox = (): HTMLInputElement =>
    spectator.query<HTMLInputElement>("input");
  const itemPills = (): HTMLSpanElement[] =>
    spectator.queryAll<HTMLSpanElement>("span");
  const dropdownOptions = (): HTMLButtonElement[] =>
    spectator.queryAll<HTMLButtonElement>(".dropdown-item");
  const selectedDropdownOption = (): HTMLButtonElement =>
    spectator.query<HTMLButtonElement>("button.dropdown-item.active");

  function typeInInput(text: string): void {
    const inputElement: HTMLInputElement = inputBox();
    spectator.typeInElement(text, inputElement);
    spectator.detectChanges();
  }

  beforeEach(() => setup());

  it("should create", () => {
    expect(spectator.component).toBeInstanceOf(TypeaheadInputComponent);
  });

  // if this test is failing, the options callback is most likely being called on initialization or the when the test bed assigns callbacks
  it("should not call the options callback when the user hasn't typed in the input box", () => {
    expect(mockSitesService.filter).not.toHaveBeenCalled();
  });

  it("should call the options callback when the user types in the input box", fakeAsync(() => {
    const testInput = modelData.param();

    typeInInput(testInput);
    tick(defaultDebounceTime);

    expect(mockSitesService.filter).toHaveBeenCalled();

    flush();
    discardPeriodicTasks();
  }));

  it("should include a label above the input if a input label has been specified", () => {
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
    const numberOfActiveItems = 1;

    spectator.component.activeItems = defaultFakeSites.slice(0, defaultFakeSites.length - numberOfActiveItems);
    spectator.detectChanges();

    const pillElements: HTMLSpanElement[] = itemPills();
    expect(pillElements).toHaveLength(0);
  });

  it("should create object pills if multiple inputs is enabled", () => {
    spectator.component.multipleInputs = true;
    const numberOfActiveItems = 2;

    spectator.component.activeItems = defaultFakeSites.slice(0, defaultFakeSites.length - numberOfActiveItems);

    spectator.detectChanges();

    const pillElements: HTMLSpanElement[] = itemPills();

    expect(pillElements.length).toEqual(spectator.component.activeItems.length);
    pillElements.forEach((pill: HTMLSpanElement, i: number) => {
      expect(pill.innerText).toEqual(
        // since the type of the active items is a TypeScript unknown, the as Site is acceptable as it adds type safety
        (spectator.component.activeItems[i] as Site).name
      );
    });
  });

  it("should create multiple pills if the user adds multiple through the input box", fakeAsync(() => {
    spectator.component.multipleInputs = true;
    const testInput: string = defaultFakeSites[0].name;

    typeInInput(testInput);
    tick(defaultDebounceTime);
    selectedDropdownOption().click();

    const pillElements: HTMLSpanElement[] = itemPills();

    expect(pillElements).toHaveLength(1);
    expect(pillElements[0].innerText).toEqual(testInput);

    flush();
    discardPeriodicTasks();
  }));

  it("should clear the input if the user selects an item and multiple inputs are enabled", fakeAsync(() => {
    const testInput: string = defaultFakeSites[0].name;
    spectator.component.multipleInputs = true;

    typeInInput(testInput);
    tick(defaultDebounceTime);
    spectator.detectChanges();
    selectedDropdownOption().click();
    spectator.detectChanges();

    expect(inputBox().value).toEqual("");

    flush();
    discardPeriodicTasks();
  }));

  it("should not clear the input if the user selects an item and the input only emits a singular value", fakeAsync(() => {
    const testInput = defaultFakeSites[0].name;
    spectator.component.multipleInputs = false;

    typeInInput(testInput);
    tick(defaultDebounceTime);

    selectedDropdownOption().click();

    expect(inputBox().value).not.toEqual("");

    flush();
    discardPeriodicTasks();
  }));

  it("should not emit multiple items if the user selects items in the options dropdown when multiple inputs are disabled", fakeAsync(() => {
    spectator.component.multipleInputs = false;
    const sitesToSelect = defaultFakeSites.slice(0, 2);

    spectator.component.modelChange.next = jasmine.createSpy("modelChange");

    sitesToSelect.forEach((site: Site) => {
      typeInInput(site.name);
      tick(defaultDebounceTime);
      selectedDropdownOption().click();
      spectator.detectChanges();
    });

    expect(spectator.component.activeItems).toHaveLength(0);
    expect(spectator.component.modelChange.next).toHaveBeenCalledWith([sitesToSelect[1]]);

    flush();
    discardPeriodicTasks();
  }));

  it("should remove an item if a user clicks backspace on a pill", fakeAsync(() => {
    // the last element should be removed from the active items array when the backspace key is pressed
    const expectedSites: Site[] = defaultFakeSites.slice(
      0,
      defaultFakeSites.length - 1
    );

    spectator.component.multipleInputs = true;
    spectator.component.activeItems = defaultFakeSites;

    const inputBoxElement: HTMLInputElement = inputBox();
    inputBoxElement.dispatchEvent(
      new KeyboardEvent("keydown", { key: "Backspace" })
    );
    spectator.detectChanges();
    tick(defaultDebounceTime);
    spectator.detectChanges();

    expect(spectator.component.activeItems).toEqual(expectedSites);

    flush();
    discardPeriodicTasks();
  }));

  // if the following test is broken, it may be because the search callback is not being called, or the test mock api is faulty
  it("should create a dropdown of possible items when the user starts typing", fakeAsync(() => {
    const testInput = defaultFakeSites[0].name;
    typeInInput(testInput);
    tick(defaultDebounceTime);

    const dropdownItems: HTMLButtonElement[] = dropdownOptions();
    expect(dropdownItems).not.toHaveLength(0);

    flush();
    discardPeriodicTasks();
  }));

  it("should not display an item in the dropdown if it is already selected and the input allows multiple inputs", fakeAsync(() => {
    spectator.component.multipleInputs = true;
    // the items in the activeItems property should not be displayed in the dropdown
    spectator.component.activeItems = defaultFakeSites.slice(0, 3);
    spectator.detectChanges();

    const activeItemsText: string[] = spectator.component.activeItems.map(
      (item: Site) => item.name
    );

    const dropdownItems: HTMLButtonElement[] = dropdownOptions();
    activeItemsText.forEach((siteName: string) => {
      typeInInput(siteName);
      tick(defaultDebounceTime);
      dropdownItems.push(...dropdownOptions());
    });

    const dropdownItemsText: string[] = dropdownItems.map(
      (item: HTMLButtonElement) => item.innerText
    );

    // the intersection of the dropdown items and the active items should be empty
    const intersection: string[] = dropdownItemsText.filter((item: string) =>
      activeItemsText.includes(item)
    );

    expect(intersection).toHaveLength(0);

    flush();
    discardPeriodicTasks();
  }));

  it("should allow duplicate items in the dropdown if multiple inputs are disabled", fakeAsync(() => {
    spectator.component.multipleInputs = false;

    const testInput: string = defaultFakeSites[0].name;
    typeInInput(testInput);
    tick(defaultDebounceTime);
    selectedDropdownOption().click();

    typeInInput(testInput);
    tick(defaultDebounceTime);
    expect(
      dropdownOptions().map((item: HTMLButtonElement) => item.innerText)
    ).toContain(testInput);

    flush();
    discardPeriodicTasks();
  }));

  it("should use the formatter callback for the dropdown items", fakeAsync(() => {
    const testInput: string = defaultFakeSites[0].name;
    typeInInput(testInput);
    tick(defaultDebounceTime);

    expect(selectedDropdownOption().innerText).toEqual(testInput);

    flush();
    discardPeriodicTasks();
  }));

  it("should use the formatter callback for the active pill items", fakeAsync(() => {
    spectator.component.multipleInputs = true;
    const activeSite: Site = defaultFakeSites[0];
    const expectedPillText = activeSite.name;

    spectator.component.activeItems = [activeSite];
    spectator.detectChanges();

    expect(itemPills()[0].innerText).toEqual(expectedPillText);

    flush();
    discardPeriodicTasks();
  }));
});

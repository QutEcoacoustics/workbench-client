import { MockBawApiModule } from "@baw-api/baw-apiMock.module";
import { SHALLOW_SITE } from "@baw-api/ServiceTokens";
import { ShallowSitesService } from "@baw-api/site/sites.service";
import { Site } from "@models/Site";
import { createHostFactory, SpectatorHost, SpyObject } from "@ngneat/spectator";
import { SharedModule } from "@shared/shared.module";
import { generateSite } from "@test/fakes/Site";
import { modelData } from "@test/helpers/faker";
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
  let spectator: SpectatorHost<TypeaheadInputComponent>;
  let mockSitesService: SpyObject<ShallowSitesService>;
  let defaultFakeSites: Site[];

  const createComponent = createHostFactory({
    component: TypeaheadInputComponent,
    imports: [SharedModule, MockBawApiModule],
  });

  function setup(): void {
    const testBedTemplate = `
      <ng-template #siteTypeaheadTemplate let-result="result" let-searchTerm="term">
        <ngb-highlight [result]="result.name" [term]="searchTerm"></ngb-highlight>
      </ng-template>

      <baw-typeahead-input [resultTemplate]="siteTypeaheadTemplate"></baw-typeahead-input>
    `;

    spectator = createComponent(testBedTemplate);
    spectator.detectChanges();

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

    spectator.component.model = defaultFakeSites.slice(
      0,
      defaultFakeSites.length - numberOfActiveItems
    );
    spectator.detectChanges();

    const pillElements: HTMLSpanElement[] = itemPills();
    expect(pillElements).toHaveLength(0);
  });

  it("should create object pills if multiple inputs is enabled", () => {
    spectator.component.multipleInputs = true;
    const numberOfActiveItems = 2;

    spectator.component.model = defaultFakeSites.slice(
      0,
      defaultFakeSites.length - numberOfActiveItems
    );

    spectator.detectChanges();

    const pillElements: HTMLSpanElement[] = itemPills();

    expect(pillElements.length).toEqual(spectator.component.model.length);
    pillElements.forEach((pill: HTMLSpanElement, i: number) => {
      expect(pill.innerText).toEqual(
        // since the type of the active items is a TypeScript unknown, the as Site is acceptable as it adds type safety
        (spectator.component.model[i] as Site).name
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
    flush();
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
    const siteToSelect = defaultFakeSites[0];

    spectator.component.modelChange.emit = jasmine.createSpy("modelChange");

    // since we are not using multiple inputs, the second call should remove the first item typed into the typeahead input
    typeInInput(siteToSelect.name);
    tick(defaultDebounceTime);
    selectedDropdownOption().click();

    // assert that the component only emitted the second site, and that the first site was removed
    expect(spectator.component.model).toHaveLength(0);
    expect(spectator.component.modelChange.emit).toHaveBeenCalledWith([
      siteToSelect,
    ]);

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
    spectator.component.model = defaultFakeSites;

    const inputBoxElement: HTMLInputElement = inputBox();
    inputBoxElement.dispatchEvent(
      new KeyboardEvent("keydown", { key: "Backspace" })
    );
    spectator.detectChanges();
    tick(defaultDebounceTime);
    spectator.detectChanges();

    expect(spectator.component.model).toEqual(expectedSites);

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

  it("should use the formatter template for the dropdown items", fakeAsync(() => {
    const testInput: string = defaultFakeSites[0].name;
    typeInInput(testInput);
    tick(defaultDebounceTime);

    expect(selectedDropdownOption().innerText).toEqual(testInput);

    flush();
    discardPeriodicTasks();
  }));

  it("should use the formatter template for the active pill items", fakeAsync(() => {
    spectator.component.multipleInputs = true;

    const activeSite: Site = defaultFakeSites[0];
    const expectedPillText = activeSite.name;

    spectator.component.model = [activeSite];
    spectator.detectChanges();

    expect(itemPills()[0].innerText).toEqual(expectedPillText);

    flush();
    discardPeriodicTasks();
  }));
});

import { SHALLOW_SITE } from "@baw-api/ServiceTokens";
import { ShallowSitesService } from "@baw-api/site/sites.service";
import { Site } from "@models/Site";
import { createHostFactory, SpectatorHost, SpyObject } from "@ngneat/spectator";
import { generateSite } from "@test/fakes/Site";
import { modelData } from "@test/helpers/faker";
import { of } from "rxjs";
import { discardPeriodicTasks, fakeAsync, flush, tick } from "@angular/core/testing";
import { defaultDebounceTime } from "src/app/app.helper";
import { IconsModule } from "@shared/icons/icons.module";
import { NgbHighlight } from "@ng-bootstrap/ng-bootstrap";
import { provideMockBawApi } from "@baw-api/provide-baw-ApiMock";
import { TypeaheadInputComponent } from "./typeahead-input.component";

describe("TypeaheadInputComponent", () => {
  let spec: SpectatorHost<TypeaheadInputComponent>;
  let mockSitesService: SpyObject<ShallowSitesService>;
  let defaultFakeSites: Site[];

  const createComponent = createHostFactory({
    component: TypeaheadInputComponent,
    imports: [IconsModule, NgbHighlight],
    providers: [provideMockBawApi()],
  });

  function setup(): void {
    const testBedTemplate = `
      <ng-template #siteTypeaheadTemplate let-result="result" let-searchTerm="term">
        <ngb-highlight [result]="result.name" [term]="searchTerm"></ngb-highlight>
      </ng-template>

      <baw-typeahead-input [resultTemplate]="siteTypeaheadTemplate"></baw-typeahead-input>
    `;

    spec = createComponent(testBedTemplate, { detectChanges: false });

    defaultFakeSites = Array.from(
      { length: modelData.datatype.number({ min: 3, max: 10 }) },
      () => new Site(generateSite())
    );

    mockSitesService = spec.inject(SHALLOW_SITE.token);
    mockSitesService.filter.and.callFake(() => of(defaultFakeSites));

    spec.component.searchCallback = mockSitesService.filter;

    spec.detectChanges();
  }

  const inputLabel = () => spec.query<HTMLLabelElement>("label");
  const inputBox = () => spec.query<HTMLInputElement>("input");
  const itemPills = () => spec.queryAll<HTMLSpanElement>("span");
  const dropdownOptions = () =>
    spec.queryAll<HTMLButtonElement>(".dropdown-item");
  const selectedDropdownOption = () =>
    spec.query<HTMLButtonElement>("button.dropdown-item.active");

  function typeInInput(text: string): void {
    spec.typeInElement(text, inputBox());
    spec.detectChanges();
  }

  beforeEach(() => {
    setup();
  });

  it("should create", () => {
    expect(spec.component).toBeInstanceOf(TypeaheadInputComponent);
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
  }));

  it("should include a label above the input if a input label has been specified", () => {
    const testLabelContent = modelData.lorem.words();

    spec.component.label = testLabelContent;
    spec.detectChanges();

    expect(inputLabel()).toHaveExactTrimmedText(testLabelContent);
  });

  it("should not create object pills if multiple inputs is disabled", () => {
    spec.component.multipleInputs = false;
    const numberOfActiveItems = 1;

    spec.component.value = defaultFakeSites.slice(
      0,
      defaultFakeSites.length - numberOfActiveItems
    );
    spec.detectChanges();

    const pillElements = itemPills();
    expect(pillElements).toHaveLength(0);
  });

  it("should create object pills if multiple inputs is enabled", () => {
    spec.component.multipleInputs = true;
    const numberOfActiveItems = 2;

    spec.component.value = defaultFakeSites.slice(
      0,
      defaultFakeSites.length - numberOfActiveItems
    );

    spec.detectChanges();

    const pillElements = itemPills();

    expect(pillElements.length).toEqual(spec.component.value.length);
    pillElements.forEach((pill: HTMLSpanElement, i: number) => {
      expect(pill.innerText).toEqual(
        // since the type of the active items is a TypeScript unknown, the as Site is acceptable as it adds type safety
        (spec.component.value[i] as Site).name
      );
    });
  });

  it("should create multiple pills if the user adds multiple through the input box", fakeAsync(() => {
    spec.component.multipleInputs = true;
    const testInput = defaultFakeSites[0].name;

    typeInInput(testInput);
    tick(defaultDebounceTime);
    selectedDropdownOption().click();

    const pillElements: HTMLSpanElement[] = itemPills();

    expect(pillElements).toHaveLength(1);
    expect(pillElements[0].innerText).toEqual(testInput);
  }));

  it("should clear the input if the user selects an item and multiple inputs are enabled", fakeAsync(() => {
    const testInput = defaultFakeSites[0].name;
    spec.component.multipleInputs = true;

    typeInInput(testInput);
    tick(defaultDebounceTime);
    spec.detectChanges();
    selectedDropdownOption().click();
    spec.detectChanges();
    flush();
    expect(inputBox().value).toEqual("");
  }));

  it("should complete in the input box if the typeahead emits a singular value", fakeAsync(() => {
    const testInput = defaultFakeSites[0].name;
    spec.component.multipleInputs = false;

    typeInInput(testInput);
    tick(defaultDebounceTime);

    selectedDropdownOption().click();

    expect(inputBox().value).toEqual(testInput);

    flush();
    discardPeriodicTasks();
  }));

  it("should not emit multiple items if the user selects items in the options dropdown when multiple inputs are disabled", fakeAsync(() => {
    spec.component.multipleInputs = false;
    const siteToSelect = defaultFakeSites[0];

    spec.component.modelChange.emit = jasmine.createSpy("modelChange");

    // since we are not using multiple inputs, the second call should remove the first item typed into the typeahead input
    typeInInput(siteToSelect.name);
    tick(defaultDebounceTime);
    selectedDropdownOption().click();

    // assert that the component only emitted the second site, and that the first site was removed
    expect(spec.component.value).toHaveLength(0);
    expect(spec.component.modelChange.emit).toHaveBeenCalledWith([
      siteToSelect,
    ]);
  }));

  it("should remove an item if a user clicks backspace on a pill", fakeAsync(() => {
    // the last element should be removed from the active items array when the backspace key is pressed
    const expectedSites: Site[] = defaultFakeSites.slice(
      0,
      defaultFakeSites.length - 1
    );

    spec.component.multipleInputs = true;
    spec.component.value = defaultFakeSites;

    const inputBoxElement = inputBox();
    inputBoxElement.dispatchEvent(
      new KeyboardEvent("keydown", { key: "Backspace" })
    );
    spec.detectChanges();
    tick(defaultDebounceTime);
    spec.detectChanges();

    expect(spec.component.value).toEqual(expectedSites);

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
  }));

  it("should use the formatter template for the dropdown items", fakeAsync(() => {
    const testInput = defaultFakeSites[0].name;
    typeInInput(testInput);
    tick(defaultDebounceTime);

    expect(selectedDropdownOption().innerText).toEqual(testInput);
  }));

  it("should use the formatter template for the active pill items", fakeAsync(() => {
    spec.component.multipleInputs = true;

    const activeSite = defaultFakeSites[0];
    const expectedPillText = activeSite.name;

    spec.component.value = [activeSite];
    spec.detectChanges();

    expect(itemPills()[0].innerText).toEqual(expectedPillText);
  }));

  it("should return no items if the search callback is not set", fakeAsync(() => {
    spec.component.searchCallback = undefined;
    spec.detectChanges();

    typeInInput(modelData.param());
    tick(defaultDebounceTime);
    flush();

    const dropdownItems = dropdownOptions();
    expect(dropdownItems).toHaveLength(0);
  }));

  it("should not show a dropdown if the search callback returns no items", fakeAsync(() => {
    spec.component.searchCallback = () => of([]);
    spec.detectChanges();

    typeInInput(modelData.param());
    tick(defaultDebounceTime);
    flush();

    const dropdownItems = dropdownOptions();
    expect(dropdownItems).toHaveLength(0);
  }));

  describe("default query", () => {
    it("should show a list of default options when focused and the defaultQuery is true", fakeAsync(() => {
      spec.component.queryOnFocus = true;
      spec.detectChanges();

      // assert that options are not shown until the input is focused
      const initialDropdownItems = dropdownOptions();
      expect(initialDropdownItems).toHaveLength(0);

      spec.focus(inputBox());
      tick(defaultDebounceTime);
      flush();
      spec.detectChanges();

      const dropdownItems = dropdownOptions();

      expect(dropdownItems).toHaveLength(defaultFakeSites.length);
      defaultFakeSites.forEach((site: Site, i: number) => {
        expect(dropdownItems[i]).toHaveExactTrimmedText(site.name);
      });
    }));

    it("should not show a list of default options if defaultQuery is not set", fakeAsync(() => {
      spec.component.queryOnFocus = false;
      spec.detectChanges();

      const initialDropdownItems = dropdownOptions();
      expect(initialDropdownItems).toHaveLength(0);

      spec.focus(inputBox());

      spec.detectChanges();
      tick(defaultDebounceTime);
      flush();
      spec.detectChanges();

      const dropdownItems = dropdownOptions();
      expect(dropdownItems).toHaveLength(0);
    }));
  });
});

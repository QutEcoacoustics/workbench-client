import {
  discardPeriodicTasks,
  fakeAsync,
  flush,
  tick,
} from "@angular/core/testing";
import { provideMockBawApi } from "@baw-api/provide-baw-ApiMock";
import { SHALLOW_SITE } from "@baw-api/ServiceTokens";
import { ShallowSitesService } from "@baw-api/site/sites.service";
import { Site } from "@models/Site";
import { NgbHighlight } from "@ng-bootstrap/ng-bootstrap";
import { createHostFactory, SpectatorHost, SpyObject } from "@ngneat/spectator";
import { IconsModule } from "@shared/icons/icons.module";
import { generateSite } from "@test/fakes/Site";
import { modelData } from "@test/helpers/faker";
import { of } from "rxjs";
import { defaultDebounceTime } from "src/app/app.helper";
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
    const testBedTemplate = `
      <ng-template #siteTypeaheadTemplate let-result="result" let-searchTerm="term">
        <ngb-highlight [result]="result.name" [term]="searchTerm"></ngb-highlight>
      </ng-template>

      <baw-typeahead-input
        [resultTemplate]="siteTypeaheadTemplate"
        [searchCallback]="searchCallback"
        [multipleInputs]="multipleInputs ?? false"
        [label]="label ?? ''"
        [value]="value ?? []"
        [queryOnFocus]="queryOnFocus ?? true"
      ></baw-typeahead-input>
    `;

    spec = createComponent(testBedTemplate, { detectChanges: false });

    defaultFakeSites = Array.from(
      { length: modelData.datatype.number({ min: 3, max: 10 }) },
      () => new Site(generateSite()),
    );

    mockSitesService = spec.inject(SHALLOW_SITE.token);
    mockSitesService.filter.and.callFake(() => of(defaultFakeSites));

    // setHostInput will trigger a change detection cycle
    spec.setHostInput("searchCallback", mockSitesService.filter);
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

    spec.setHostInput("label", testLabelContent);

    expect(inputLabel()).toHaveExactTrimmedText(testLabelContent);
  });

  it("should not create object pills if multiple inputs is disabled", () => {
    const numberOfActiveItems = 1;
    const startingValue = defaultFakeSites.slice(
      0,
      defaultFakeSites.length - numberOfActiveItems,
    );

    spec.setHostInput({
      multipleInputs: false,
      value: startingValue,
    });

    expect(itemPills()).toHaveLength(0);
  });

  it("should create object pills if multiple inputs is enabled", () => {
    const numberOfActiveItems = 2;
    const startingValue = defaultFakeSites.slice(
      0,
      defaultFakeSites.length - numberOfActiveItems,
    );

    spec.setHostInput({
      multipleInputs: true,
      value: startingValue,
    });

    const pillElements = itemPills();

    expect(pillElements).toHaveLength(spec.component.value().length);
    pillElements.forEach((pill: HTMLSpanElement, i: number) => {
      expect(pill.innerText).toEqual(
        // since the type of the active items is a TypeScript unknown, the as Site is acceptable as it adds type safety
        (spec.component.value()[i] as Site).name,
      );
    });
  });

  it("should create multiple pills if the user adds multiple through the input box", fakeAsync(() => {
    spec.setHostInput("multipleInputs", true);
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
    spec.setHostInput("multipleInputs", true);

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
    spec.setHostInput("multipleInputs", false);

    typeInInput(testInput);
    tick(defaultDebounceTime);

    selectedDropdownOption().click();

    expect(inputBox().value).toEqual(testInput);

    flush();
    discardPeriodicTasks();
  }));

  it("should not emit multiple items if the user selects items in the options dropdown when multiple inputs are disabled", fakeAsync(() => {
    spec.setHostInput("multipleInputs", false);
    const siteToSelect = defaultFakeSites[0];

    spec.component.modelChange.emit = jasmine.createSpy("modelChange");

    // since we are not using multiple inputs, the second call should remove the first item typed into the typeahead input
    typeInInput(siteToSelect.name);
    tick(defaultDebounceTime);
    selectedDropdownOption().click();

    expect(spec.component.modelChange.emit).toHaveBeenCalledWith([
      siteToSelect,
    ]);
  }));

  it("should remove an item if a user clicks backspace on a pill", fakeAsync(() => {
    // the last element should be removed from the active items array when the backspace key is pressed
    const expectedSites: Site[] = defaultFakeSites.slice(
      0,
      defaultFakeSites.length - 1,
    );

    spec.setHostInput({
      multipleInputs: true,
      value: defaultFakeSites,
    });

    spec.dispatchKeyboardEvent(inputBox(), "keydown", "Backspace");
    spec.detectChanges();
    tick(defaultDebounceTime);
    spec.detectChanges();

    expect(spec.component.value()).toEqual(expectedSites);

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
    spec.setHostInput("multipleInputs", true);

    const activeSite = defaultFakeSites[0];
    const expectedPillText = activeSite.name;

    spec.setHostInput("value", [activeSite]);

    expect(itemPills()[0].innerText).toEqual(expectedPillText);
  }));

  it("should return no items if the search callback is not set", fakeAsync(() => {
    spec.setHostInput("searchCallback", undefined);

    typeInInput(modelData.param());
    tick(defaultDebounceTime);
    flush();

    const dropdownItems = dropdownOptions();
    expect(dropdownItems).toHaveLength(0);
  }));

  it("should not show a dropdown if the search callback returns no items", fakeAsync(() => {
    spec.setHostInput("searchCallback", () => of([]));

    typeInInput(modelData.param());
    tick(defaultDebounceTime);
    flush();

    const dropdownItems = dropdownOptions();
    expect(dropdownItems).toHaveLength(0);
  }));

  it("should not debounce on the initial focus event", fakeAsync(() => {
    spec.setHostInput("searchCallback", () => of(defaultFakeSites));

    // Note that we don't tick or flush the async queue here because we should
    // see that the focus events results are immediate and not debounced.
    spec.focus(inputBox());

    const dropdownItems = dropdownOptions();
    expect(dropdownItems).toHaveLength(defaultFakeSites.length);
  }));

  describe("single input mode", () => {
    beforeEach(() => {
      spec.setHostInput("multipleInputs", false);
    });

    it("should emit an empty value if the user inputs an invalid value in single input mode", fakeAsync(() => {
      spec.component.modelChange.emit = jasmine.createSpy("modelChange");

      typeInInput("this is not a valid site name");
      tick(defaultDebounceTime);

      expect(spec.component.value()).toEqual([]);
      expect(spec.component.modelChange.emit).not.toHaveBeenCalled();
    }));

    it("should emit an empty value if the user clears the input in single input mode", fakeAsync(() => {
      const testInput = defaultFakeSites[0].name;
      typeInInput(testInput);
      tick(defaultDebounceTime);
      selectedDropdownOption().click();

      spec.component.modelChange.emit = jasmine.createSpy("modelChange");
      typeInInput("");
      tick(defaultDebounceTime);

      expect(spec.component.value()).toEqual([]);
      expect(spec.component.modelChange.emit).toHaveBeenCalledOnceWith([]);
    }));
  });

  describe("default query", () => {
    it("should show a list of default options when focused and the defaultQuery is true", fakeAsync(() => {
      spec.setHostInput("queryOnFocus", true);

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
      spec.setHostInput("queryOnFocus", false);

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

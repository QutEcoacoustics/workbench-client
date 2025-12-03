import { fakeAsync, tick } from "@angular/core/testing";
import { ShallowAudioEventImportFileService } from "@baw-api/audio-event-import-file/audio-event-import-file.service";
import { AudioEventImportService } from "@baw-api/audio-event-import/audio-event-import.service";
import { AudioRecordingsService } from "@baw-api/audio-recording/audio-recordings.service";
import { provideMockBawApi } from "@baw-api/provide-baw-ApiMock";
import { ShallowSitesService } from "@baw-api/site/sites.service";
import { TagsService } from "@baw-api/tag/tags.service";
import { Id } from "@interfaces/apiInterfaces";
import { AudioEventImport } from "@models/AudioEventImport";
import { AudioEventImportFile } from "@models/AudioEventImportFile";
import { AudioRecording } from "@models/AudioRecording";
import { Project } from "@models/Project";
import { Site } from "@models/Site";
import { Tag } from "@models/Tag";
import { User } from "@models/User";
import {
  createComponentFactory,
  mockProvider,
  Spectator,
} from "@ngneat/spectator";
import { ASSOCIATION_INJECTOR } from "@services/association-injector/association-injector.tokens";
import { IconsModule } from "@shared/icons/icons.module";
import { generateAudioEventImport } from "@test/fakes/AudioEventImport";
import { generateAudioRecording } from "@test/fakes/AudioRecording";
import { generateProject } from "@test/fakes/Project";
import { generateSite } from "@test/fakes/Site";
import { generateTag } from "@test/fakes/Tag";
import { generateUser } from "@test/fakes/User";
import { modelData } from "@test/helpers/faker";
import {
  interceptFilterApiRequest,
  interceptMappedApiRequests,
  interceptShowApiRequest,
} from "@test/helpers/general";
import {
  getElementByTextContent,
  selectFromTypeahead,
  toggleDropdown,
  waitForDropdown,
} from "@test/helpers/html";
import { DateTime } from "luxon";
import { of } from "rxjs";
import { defaultDebounceTime } from "src/app/app.helper";
import { AnnotationSearchFormComponent } from "./annotation-search-form.component";
import {
  AnnotationSearchParameters,
  IAnnotationSearchParameters,
  SortingKey,
} from "./annotationSearchParameters";

describe("AnnotationSearchFormComponent", () => {
  let spec: Spectator<AnnotationSearchFormComponent>;

  let modelChangeSpy: jasmine.Spy;

  let mockTagsResponse: Tag[];
  let mockSitesResponse: Site[];
  let mockProject: Project;
  let mockRecording: AudioRecording;
  let mockUser: User;
  let mockAudioEventImport: AudioEventImport;
  let mockAudioEventImportFiles: AudioEventImportFile[];

  const createComponent = createComponentFactory({
    component: AnnotationSearchFormComponent,
    imports: [IconsModule],
    providers: [
      provideMockBawApi(),
      mockProvider(ShallowAudioEventImportFileService, {
        filter: () => of(mockAudioEventImportFiles),
      }),
      mockProvider(AudioEventImportService, {
        show: () => of(mockAudioEventImport),
        filter: () => of([mockAudioEventImport]),
      }),
    ],
  });

  const sitesTypeahead = () => spec.query("#sites-input");

  const tagsTypeahead = () => spec.query("#tags-input");
  const tagPills = () =>
    tagsTypeahead().querySelectorAll<HTMLSpanElement>(".item-pill");

  const projectsTypeahead = () => spec.query("#projects-input");
  const projectsInput = () => projectsTypeahead().querySelector("input");

  const dateToggleInput = () => spec.query<HTMLInputElement>("#date-filtering");
  const endDateInput = () =>
    spec.query<HTMLInputElement>("#date-finished-before");

  const lowerScoreInput = () =>
    spec.query<HTMLInputElement>("#lower-score-input");
  const upperScoreInput = () =>
    spec.query<HTMLInputElement>("#upper-score-input");
  const scoreErrors = () => spec.query("#score-errors");

  const advancedFiltersToggle = () =>
    spec.query<HTMLButtonElement>("#advanced-filters-toggle");
  const advancedFiltersCollapsable = () =>
    spec.query(".advanced-filters>[ng-reflect-collapsed]");
  const recordingsTypeahead = () => spec.query("#recordings-input");

  const eventImportTypeahead = () => spec.query("#event-imports-input");
  const eventImportFilesTypeahead = () =>
    spec.query("#event-imports-files-input");

  const sortingDropdown = () => spec.query("#sort-input");

  function setup(
    params: Partial<Record<keyof IAnnotationSearchParameters, string>> = {},
  ): Promise<any> {
    spec = createComponent({ detectChanges: false });

    const injector = spec.inject(ASSOCIATION_INJECTOR);
    const tagsApi = spec.inject(TagsService);
    const sitesApi = spec.inject(ShallowSitesService);
    const recordingsApi = spec.inject(AudioRecordingsService);

    // so that the models can use their associations, we need to provide the
    // association injector to the mock models
    mockTagsResponse.forEach((tag) => (tag["injector"] = injector));
    mockSitesResponse.forEach((site) => (site["injector"] = injector));
    mockProject["injector"] = injector;
    mockRecording["injector"] = injector;

    mockAudioEventImport["injector"] = injector;
    mockAudioEventImportFiles.forEach((file) => (file["injector"] = injector));

    modelChangeSpy = spyOn(spec.component.searchParametersChange, "emit");

    sitesApi.filter.andCallFake(() => of(mockSitesResponse));
    sitesApi.show.andCallFake((id: Id) =>
      of(mockSitesResponse.find((site) => site.id === id)),
    );

    // we mock both filter and show requests because we need to have consistent
    // mock data for the typeahead queries that use filter requests, and the
    // has-many associations that use show requests
    tagsApi.typeaheadCallback.and.returnValue(() => of(mockTagsResponse));

    const mockTagShowResponses = new Map<any, Tag>([]);
    for (const tag of mockTagsResponse) {
      mockTagShowResponses.set(tag.id, tag);
    }

    const response = Promise.all([
      interceptFilterApiRequest(tagsApi, injector, mockTagsResponse, Tag),

      interceptMappedApiRequests(tagsApi.show, mockTagShowResponses),

      interceptFilterApiRequest(
        recordingsApi,
        injector,
        [mockRecording],
        AudioRecording,
      ),

      interceptShowApiRequest(
        recordingsApi,
        injector,
        mockRecording,
        AudioRecording,
      ),
    ]);

    const searchParameters = new AnnotationSearchParameters(
      params,
      mockUser,
      injector,
    );
    searchParameters.routeProjectModel = mockProject;
    spec.setInput("searchParameters", searchParameters);

    tick();
    spec.detectChanges();

    return response;
  }

  function setLowerBoundScore(value: string) {
    spec.typeInElement(value, lowerScoreInput());
    tick(defaultDebounceTime);
    spec.detectChanges();
  }

  function setUpperBoundScore(value: string) {
    spec.typeInElement(value, upperScoreInput());
    tick(defaultDebounceTime);
    spec.detectChanges();
  }

  beforeEach(() => {
    // We use the index in the array as the id so that we are guaranteed to have
    // no conflicting ids.
    mockTagsResponse = Array.from(
      { length: 10 },
      (_, i) => new Tag(generateTag({ id: i })),
    );

    mockSitesResponse = Array.from(
      { length: 10 },
      (_, i) => new Site(generateSite({ id: i })),
    );

    mockProject = new Project(generateProject());
    mockRecording = new AudioRecording(generateAudioRecording());
    mockUser = new User(generateUser());

    mockAudioEventImport = new AudioEventImport(
      generateAudioEventImport({ id: 1 }),
    );

    mockAudioEventImportFiles = modelData.randomArray(1, 5, () => {
      return new AudioEventImportFile({
        audioEventImportId: mockAudioEventImport.id,
      });
    });
  });

  it("should create", fakeAsync(() => {
    setup();
    expect(spec.component).toBeInstanceOf(AnnotationSearchFormComponent);
  }));

  it("should have a collapsable advanced filters section", fakeAsync(() => {
    setup();
    expect(recordingsTypeahead()).toBeHidden();
    toggleDropdown(spec, advancedFiltersToggle());
    expect(recordingsTypeahead()).toBeVisible();
  }));

  describe("pre-population from first load", () => {
    // check the population of a typeahead input that uses a property backing
    it("should pre-populate the project typeahead input if provided", fakeAsync(() => {
      setup();
      expect(projectsInput()).toHaveProperty("placeholder", mockProject.name);
    }));

    // check the population of a typeahead input that does not use a property backing
    it("should pre-populate the tags typeahead input if provided in the search parameters model", fakeAsync(async () => {
      const testedTag = mockTagsResponse[0];

      const response = setup({ tags: testedTag.id.toString() });
      spec.detectChanges();
      await response;
      spec.detectChanges();

      const realizedTagPills = tagPills();
      expect(realizedTagPills).toHaveLength(1);
      expect(realizedTagPills[0]).toHaveExactTrimmedText(testedTag.text);
    }));

    // check the population of an external component that is not a typeahead input
    it("should pre-populate the date filters if provided in the search parameters model", fakeAsync(() => {
      const testEndDate = modelData.dateTime();
      const testEndDateString = testEndDate.toFormat("yyyy-MM-dd");

      setup({ recordingDate: `,${testEndDateString}` });
      waitForDropdown(spec);

      expect(endDateInput()).toHaveValue(testEndDate.toFormat("yyyy-MM-dd"));
      expect(
        spec.component.searchParameters().recordingDateStartedAfter,
      ).toBeFalsy();
      expect(
        spec.component.searchParameters().recordingDateFinishedBefore,
      ).toBeTruthy();
    }));

    it("should not apply date filters if the dropdown is closed", fakeAsync(() => {
      const testEndDate = modelData.dateTime();
      const testEndDateString = testEndDate.toFormat("yyyy-MM-dd");

      setup({ recordingDate: `,${testEndDateString}` });
      // wait for the initial date/time filters to open
      waitForDropdown(spec);

      // close the date/time filters and assert that the filter conditions are
      // no longer applied
      spec.click(dateToggleInput());
      waitForDropdown(spec);

      expect(
        spec.component.searchParameters().recordingDateStartedAfter,
      ).toBeFalsy();
      expect(
        spec.component.searchParameters().recordingDateFinishedBefore,
      ).toBeFalsy();
    }));

    it("should pre-populate the sorting dropdown correctly", fakeAsync(() => {
      const testedSorting = "score-asc" satisfies SortingKey;

      setup({ sort: testedSorting });
      expect(sortingDropdown()).toHaveValue("score-asc");
      expect(spec.component.searchParameters().sort).toEqual("score-asc");
    }));

    it("should have the correct sorting selection for an empty parameter", fakeAsync(() => {
      setup();
      expect(sortingDropdown()).toHaveValue("created-asc");
    }));

    it("should pre-populate the score filter correctly", fakeAsync(() => {
      const mockLowerScore = modelData.datatype.number();
      const mockUpperScore = modelData.datatype.number();

      setup({ score: `${mockLowerScore},${mockUpperScore}` });

      expect(lowerScoreInput()).toHaveValue(mockLowerScore.toString());
      expect(upperScoreInput()).toHaveValue(mockUpperScore.toString());

      expect(spec.component.searchParameters().score).toEqual([
        mockLowerScore,
        mockUpperScore,
      ]);
    }));

    it("should automatically open the advanced filters if the search parameters have advanced filters", fakeAsync(() => {
      setup({ audioRecordings: "1" });
      const expectedText = `Recording IDs of interest ${mockRecording.id}`;

      waitForDropdown(spec);

      expect(recordingsTypeahead()).toBeVisible();
      expect(recordingsTypeahead()).toHaveExactTrimmedText(expectedText);
      expect(advancedFiltersCollapsable()).toHaveClass("show");
    }));

    it("should not apply the audio recording id filters if the advanced filters dropdown is closed", fakeAsync(() => {
      setup({ audioRecordings: "1" });
      expect(spec.component.searchParameters().audioRecordings).toHaveLength(1);

      toggleDropdown(spec, advancedFiltersToggle());

      expect(spec.component.searchParameters().audioRecordings).toHaveLength(0);
    }));

    it("should disable the import files typeahead when no audio event imports are selected", fakeAsync(() => {
      setup();

      // Because there are no advanced filters, we expect that the dropdown is
      // initially closed and we need to open it to see the import files input.
      toggleDropdown(spec, advancedFiltersToggle());
      waitForDropdown(spec);

      const importFilesInput =
        eventImportFilesTypeahead()?.querySelector("input");
      expect(importFilesInput).toBeDisabled();
    }));

    xit("should pre-populate the annotation imports correctly", fakeAsync(() => {
      setup({
        audioEventImports: "1,2,3",
        importFiles: "4,5",
      });

      expect(advancedFiltersCollapsable()).toHaveClass("show");

      expect(eventImportTypeahead()).toBeVisible();
      expect(eventImportTypeahead()).toHaveExactTrimmedText(
        "3 Audio Event Imports Selected",
      );

      expect(eventImportFilesTypeahead()).toBeVisible();
      expect(eventImportFilesTypeahead()).toHaveExactTrimmedText(
        "2 Import Files Selected",
      );
    }));

    it("should not populate import files if there are no annotation imports", fakeAsync(() => {
      setup({ importFiles: "4,5" });

      // We expect that the advanced filters section is not opened because
      // although there are annotation import files, there are no annotation
      // imports, so the import files filter should not be applied.
      expect(advancedFiltersCollapsable()).not.toHaveClass("show");
      expect(spec.component.searchParameters().importFiles).toBeUndefined();
    }));
  });

  describe("update emission", () => {
    beforeEach(fakeAsync(() => {
      setup();
    }));

    // check a typeahead input that also has an optional property backing
    it("should emit the correct model if the site is updated", fakeAsync(() => {
      const testedSite = mockSitesResponse[0];

      // When the form initializes it will make an initial model emission with
      // its initial model.
      // Because we want to assert that updating the site causes one update with
      // the correct parameters, we reset the call spy.
      modelChangeSpy.calls.reset();
      selectFromTypeahead(spec, sitesTypeahead(), testedSite.name);

      expect(spec.component.searchParameters().sites).toEqual([testedSite.id]);
      expect(modelChangeSpy).toHaveBeenCalledOnceWith(
        spec.component.searchParameters(),
      );
    }));

    // check a typeahead input that does not have an optional property backing
    it("should emit the correct model if the tags are updated", fakeAsync(() => {
      const testedTag = mockTagsResponse[0];

      modelChangeSpy.calls.reset();
      selectFromTypeahead(spec, tagsTypeahead(), testedTag.text, false);

      expect(spec.component.searchParameters().tags).toEqual([testedTag.id]);
      expect(modelChangeSpy).toHaveBeenCalledOnceWith(
        spec.component.searchParameters(),
      );
    }));

    // check an external component that is not a typeahead input
    //
    // TODO: I have sunk a lot of time into this test, and I have determined
    // that the extra effort to get this test working will not reap benefits
    // we should eventually finish this test
    // at the moment the date/time filter components form is not triggering
    // its form change event when the input is changed and the dropdown is not
    // opening when the checkbox is toggled
    it("should emit the correct model if the date filters are updated", fakeAsync(() => {
      const testedDate = "2021-10-10";
      const expectedNewModel = jasmine.objectContaining({
        recordingDate: [null, jasmine.any(DateTime)],
      });

      modelChangeSpy.calls.reset();
      spec.click(dateToggleInput());
      waitForDropdown(spec);

      spec.typeInElement(testedDate, endDateInput());
      tick(defaultDebounceTime);

      expect(modelChangeSpy).toHaveBeenCalledOnceWith(expectedNewModel);
    }));

    it("should not emit a new model if the date filters are updated with an invalid value", fakeAsync(() => {
      const testedDate = "2021109-12";

      modelChangeSpy.calls.reset();
      spec.click(dateToggleInput());
      waitForDropdown(spec);

      spec.typeInElement(testedDate, endDateInput());

      expect(modelChangeSpy).not.toHaveBeenCalled();
    }));

    it("should emit a new model if the score is updated to a truthy value", fakeAsync(() => {
      const testedValue = modelData.datatype.number({ min: 1 });

      modelChangeSpy.calls.reset();
      setLowerBoundScore(testedValue.toString());

      expect(modelChangeSpy).toHaveBeenCalledTimes(1);
    }));

    it("should emit a new model if the score is updated to a falsy value", fakeAsync(() => {
      modelChangeSpy.calls.reset();
      setLowerBoundScore("0");
      expect(modelChangeSpy).toHaveBeenCalledTimes(1);
    }));

    it("should emit a new model if the score is updated to an empty value", fakeAsync(() => {
      modelChangeSpy.calls.reset();
      setLowerBoundScore("42");
      expect(modelChangeSpy).toHaveBeenCalledTimes(1);

      setLowerBoundScore("");
      expect(modelChangeSpy).toHaveBeenCalledTimes(2);
    }));

    it("should emit a new model if the sort is updated to a non-default value", fakeAsync(() => {
      const targetOption = getElementByTextContent<HTMLOptionElement>(
        spec,
        "Score (Ascending)",
      );

      modelChangeSpy.calls.reset();
      spec.selectOption(sortingDropdown(), targetOption);

      expect(modelChangeSpy).toHaveBeenCalledTimes(1);
    }));

    it("should emit a new model if the sort is updated to the default value", fakeAsync(() => {
      const targetOption = getElementByTextContent<HTMLOptionElement>(
        spec,
        "Created Date (Oldest First)",
      );

      modelChangeSpy.calls.reset();
      spec.selectOption(sortingDropdown(), targetOption);

      expect(modelChangeSpy).toHaveBeenCalledTimes(1);
    }));
  });

  describe("form validation", () => {
    // This has been temporarily disabled because of "value changed after it was
    // checked" errors that only occur in testing environments.
    // TODO: Re-enable this test if we get some time.
    xit("should show an error if the upper bound score is greater than the lower bound", fakeAsync(async () => {
      setup();

      setLowerBoundScore("0.8");
      setUpperBoundScore("0.2");

      expect(scoreErrors()).toHaveExactTrimmedText(
        "Score minimum must be less than or equal to the score maximum.",
      );
    }));

    it("should display an error if the initial state is incorrect", fakeAsync(() => {
      setup({ score: "0.8,0.2" });
      expect(scoreErrors()).toHaveExactTrimmedText(
        "Score minimum must be less than or equal to the score maximum.",
      );
    }));

    // This test is really only needed for Firefox because other browsers like
    // Chrome and Safari don't allow users to input free form text into number
    // inputs.
    //
    // TODO: Remove once https://bugzilla.mozilla.org/show_bug.cgi?id=1398528
    // is resolved.
    it("should display an error if the score is set to a non-number input", fakeAsync(() => {
      setup();

      // Note that I am pushing the score input to its limit by testing against
      // a hexadecimal input.
      // If we are using parseInt or parsing hexadecimal, the lower bound would
      // incorrectly pass.
      setLowerBoundScore("0xa");
      setUpperBoundScore("0.2");

      // Most browsers (Chrome and Safari) will not update the number input box
      // because the value input is not a number.
      // However, Firefox will allow users to input free form text into the
      // number input. Therefore we only assert for the error if the value of
      // the input box has changed to the invalid value.
      if (lowerScoreInput().value) {
        expect(scoreErrors()).toHaveExactTrimmedText("Score must be a number.");
      }
    }));

    xit("should be able to remove an error by deleting everything in the input", fakeAsync(() => {
      setup();

      setLowerBoundScore("0.8");
      setUpperBoundScore("0.2");

      setLowerBoundScore("");
      expect(scoreErrors()).not.toExist();
    }));

    it("should not display an error message if there is only a minimum score", fakeAsync(() => {
      setup();

      // If we are not correctly handling the null upper bound case, a positive
      // minimum score because in JavaScript 1 > null === true.
      setLowerBoundScore("1");
      expect(scoreErrors()).not.toExist();
    }));

    it("should not display an error message if there is only a maximum score", fakeAsync(() => {
      setup();

      // Similar to the comment above, if you don't handle the null lower bound
      // case, this test case will fail because -1 < null === true
      setLowerBoundScore("-1");
      expect(scoreErrors()).not.toExist();
    }));
  });

  // TODO: ---Copilot---: DO NOT LET ME FORGET ABOUT THESE TESTS
  xdescribe("annotation import files", () => {
    it("should clear import files when audio event imports are cleared", fakeAsync(() => {
      setup({
        audioEventImports: "1,2",
        importFiles: "3,4",
      });

      // Clear the audio event imports by calling updateSubModel with empty array
      spec.component["updateAudioEventImports"]([]);
      spec.detectChanges();

      // Verify that import files were also cleared
      expect(spec.component.searchParameters().audioEventImports).toEqual([]);
      expect(spec.component.searchParameters().importFiles).toBeNull();
    }));

    it("should not clear import files when audio event imports still has values", fakeAsync(() => {
      setup({
        audioEventImports: "1,2",
        importFiles: "3,4",
      });

      // Call updateSubModel directly without detectChanges to avoid template rendering issues
      spec.component["updateAudioEventImports"]([mockAudioEventImport]);

      // Verify that import files were NOT cleared
      expect(spec.component.searchParameters().audioEventImports).toEqual([5]);
      expect(spec.component.searchParameters().importFiles).toEqual([3, 4]);
    }));

    it("should have the correct tooltip that shows details about the file", () => {
      setup();
    });
  });
});

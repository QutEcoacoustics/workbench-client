import {
  createComponentFactory,
  Spectator,
  SpyObject,
} from "@ngneat/spectator";
import { provideMockBawApi } from "@baw-api/provide-baw-ApiMock";
import {
  AnnotationSearchParameters,
  IAnnotationSearchParameters,
  SortingKey,
} from "@components/annotations/pages/annotationSearchParameters";
import { Project } from "@models/Project";
import { generateProject } from "@test/fakes/Project";
import { TagsService } from "@baw-api/tag/tags.service";
import { AUDIO_RECORDING, SHALLOW_SITE, TAG } from "@baw-api/ServiceTokens";
import { Tag } from "@models/Tag";
import { of } from "rxjs";
import { generateTag } from "@test/fakes/Tag";
import { ShallowSitesService } from "@baw-api/site/sites.service";
import { Site } from "@models/Site";
import { generateSite } from "@test/fakes/Site";
import {
  getElementByTextContent,
  selectFromTypeahead,
  toggleDropdown,
  waitForDropdown,
} from "@test/helpers/html";
import { fakeAsync, tick } from "@angular/core/testing";
import { modelData } from "@test/helpers/faker";
import { AudioRecordingsService } from "@baw-api/audio-recording/audio-recordings.service";
import { AudioRecording } from "@models/AudioRecording";
import { generateAudioRecording } from "@test/fakes/AudioRecording";
import { AssociationInjector } from "@models/ImplementsInjector";
import { ASSOCIATION_INJECTOR } from "@services/association-injector/association-injector.tokens";
import { Id } from "@interfaces/apiInterfaces";
import {
  interceptFilterApiRequest,
  interceptMappedApiRequests,
  interceptShowApiRequest,
} from "@test/helpers/general";
import { IconsModule } from "@shared/icons/icons.module";
import { defaultDebounceTime } from "src/app/app.helper";
import { User } from "@models/User";
import { generateUser } from "@test/fakes/User";
import { AnnotationSearchFormComponent } from "./annotation-search-form.component";

describe("AnnotationSearchFormComponent", () => {
  let spec: Spectator<AnnotationSearchFormComponent>;
  let injector: SpyObject<AssociationInjector>;

  let tagsApiSpy: SpyObject<TagsService>;
  let sitesApiSpy: SpyObject<ShallowSitesService>;
  let recordingsApiSpy: SpyObject<AudioRecordingsService>;
  let modelChangeSpy: jasmine.Spy;

  let mockTagsResponse: Tag[] = [];
  let mockSitesResponse: Site[] = [];
  let mockProject: Project;
  let mockRecording: AudioRecording;
  let mockUser: User;

  const createComponent = createComponentFactory({
    component: AnnotationSearchFormComponent,
    imports: [IconsModule],
    providers: [provideMockBawApi()],
  });

  const sitesTypeahead = () => spec.query("#sites-input");

  const tagsTypeahead = () => spec.query("#tags-input");
  const tagPills = () =>
    tagsTypeahead().querySelectorAll<HTMLSpanElement>(".item-pill");

  const taskTagTypeahead = () => spec.query("#task-tag-input");
  const taskTagInput = () => taskTagTypeahead().querySelector("input");

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

  const sortingDropdown = () => spec.query("#sort-input");

  function setup(
    params: Partial<Record<keyof IAnnotationSearchParameters, string>> = {},
  ): Promise<any> {
    spec = createComponent({ detectChanges: false });

    injector = spec.inject(ASSOCIATION_INJECTOR);
    tagsApiSpy = spec.inject(TAG.token);
    sitesApiSpy = spec.inject(SHALLOW_SITE.token);
    recordingsApiSpy = spec.inject(AUDIO_RECORDING.token);

    // so that the models can use their associations, we need to provide the
    // association injector to the mock models
    mockTagsResponse.forEach((tag) => (tag["injector"] = injector));
    mockSitesResponse.forEach((site) => (site["injector"] = injector));
    mockProject["injector"] = injector;
    mockRecording["injector"] = injector;

    modelChangeSpy = spyOn(spec.component.searchParametersChange, "emit");

    sitesApiSpy.filter.andCallFake(() => of(mockSitesResponse));
    sitesApiSpy.show.andCallFake((id: Id) =>
      of(mockSitesResponse.find((site) => site.id === id)),
    );

    // we mock both filter and show requests because we need to have consistent
    // mock data for the typeahead queries that use filter requests, and the
    // has-many associations that use show requests
    tagsApiSpy.typeaheadCallback.and.returnValue(() => of(mockTagsResponse));

    const mockTagShowResponses = new Map<any, Tag>([]);
    for (const tag of mockTagsResponse) {
      mockTagShowResponses.set(tag.id, tag);
    }

    const response = Promise.all([
      interceptFilterApiRequest(tagsApiSpy, injector, mockTagsResponse, Tag),

      interceptMappedApiRequests(tagsApiSpy.show, mockTagShowResponses),

      interceptFilterApiRequest(
        recordingsApiSpy,
        injector,
        [mockRecording],
        AudioRecording,
      ),

      interceptShowApiRequest(
        recordingsApiSpy,
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

    it("should pre-populate the tag task input if provided in the search parameters model", fakeAsync(async () => {
      const testedTag = mockTagsResponse[0];

      const response = setup({
        tags: testedTag.id.toString(),
        taskTag: testedTag.id.toString(),
      });

      spec.detectChanges();
      await response;
      spec.detectChanges();

      expect(spec.component.searchParameters().taskTag).toEqual(testedTag.id);
      expect(taskTagInput()).toHaveValue(testedTag.text);
    }));

    it("should show a placeholder of multiple tag if there is no tag task in the parameter model", fakeAsync(async () => {
      const response = setup({
        tags: `${mockTagsResponse[0].id},${mockTagsResponse[1].id}`,
      });

      spec.detectChanges();
      await response;
      spec.detectChanges();

      const expectedPlaceholder = `${mockTagsResponse[0].text},${mockTagsResponse[1].text}`;
      expect(taskTagInput()).toHaveProperty("placeholder", expectedPlaceholder);
    }));

    it("should show a placeholder of one tag if there is a tag task in the parameter model", fakeAsync(async () => {
      const testedTag = mockTagsResponse[0];

      const response = setup({ tags: `${testedTag.id}` });
      spec.detectChanges();
      await response;
      spec.detectChanges();

      expect(taskTagInput()).toHaveProperty("placeholder", testedTag.text);
    }));

    xit("should have 'First Tag' placeholder if there are no tag parameters", fakeAsync(async () => {
      const response = setup({ tags: "" });

      spec.detectChanges();
      await response;
      spec.detectChanges();

      expect(taskTagInput()).toHaveProperty("placeholder", "First Tag");
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
    xit("should emit the correct model if the date filters are updated", fakeAsync(() => {
      const testedDate = "2021-10-10";
      const expectedNewModel = {};

      modelChangeSpy.calls.reset();
      spec.click(dateToggleInput());
      waitForDropdown(spec);

      spec.typeInElement(testedDate, endDateInput());

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

  describe("showVerificationFilters", () => {
    const taskBehaviorElement = () =>
      getElementByTextContent(spec, "Task Behavior");
    const verificationStatusElement = () =>
      getElementByTextContent(spec, "Show annotations that");

    it("should show verification filters by default", fakeAsync(() => {
      setup();

      expect(spec.component.showVerificationFilters()).toBeTrue();
      expect(taskBehaviorElement()).toExist();
      expect(verificationStatusElement()).toExist();
    }));

    it("should hide the correct inputs when 'showVerificationFilters' is set", fakeAsync(() => {
      setup();
      spec.setInput("showVerificationFilters", false);

      // We assert that inputs like the "sort by" dropdown is still visible to
      // assert that we haven't hard failed or hidden the entire form
      expect(sortingDropdown()).toBeVisible();
      expect(verificationStatusElement()).toBeVisible();

      expect(taskBehaviorElement()).not.toExist();
      expect(taskTagTypeahead()).not.toExist();

      // We want to assert that if we re-enable the verification filters,
      // they will be in the correct state.
      spec.setInput("showVerificationFilters", true);

      expect(taskBehaviorElement()).toExist();
      expect(taskTagTypeahead()).toExist();
    }));
  });

  describe("showSortingFilters", () => {
    it("should show sorting filters by default", fakeAsync(() => {
      setup();

      expect(spec.component.showSortingFilters()).toBeTrue();
      expect(sortingDropdown()).toExist();
    }));

    it("should hide the correct inputs when 'showSortingFilters' is set", fakeAsync(() => {
      setup();
      spec.setInput("showSortingFilters", false);

      expect(sortingDropdown()).not.toExist();

      spec.setInput("showSortingFilters", true);
      expect(sortingDropdown()).toBeVisible();
    }));
  });
});

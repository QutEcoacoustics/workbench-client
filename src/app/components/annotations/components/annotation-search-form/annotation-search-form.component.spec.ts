import { createComponentFactory, Spectator, SpyObject } from "@ngneat/spectator";
import { SharedModule } from "@shared/shared.module";
import { MockBawApiModule } from "@baw-api/baw-apiMock.module";
import { AnnotationSearchParameters } from "@components/annotations/pages/annotationSearchParameters";
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
import { selectFromTypeahead, toggleDropdown, waitForDropdown } from "@test/helpers/html";
import { fakeAsync } from "@angular/core/testing";
import { modelData } from "@test/helpers/faker";
import { DateTimeFilterComponent } from "@shared/date-time-filter/date-time-filter.component";
import { TypeaheadInputComponent } from "@shared/typeahead-input/typeahead-input.component";
import { Params } from "@angular/router";
import { AudioRecordingsService } from "@baw-api/audio-recording/audio-recordings.service";
import { AudioRecording } from "@models/AudioRecording";
import { generateAudioRecording } from "@test/fakes/AudioRecording";
import { AssociationInjector } from "@models/ImplementsInjector";
import { ASSOCIATION_INJECTOR } from "@services/association-injector/association-injector.tokens";
import { Id } from "@interfaces/apiInterfaces";
import { interceptFilterApiRequest, interceptShowApiRequest } from "@test/helpers/general";
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

  const createComponent = createComponentFactory({
    component: AnnotationSearchFormComponent,
    imports: [MockBawApiModule, SharedModule],
    declarations: [DateTimeFilterComponent, TypeaheadInputComponent],
  });

  function setup(params: Params = {}): Promise<any> {
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
    sitesApiSpy.show.andCallFake((id: Id) => of(mockSitesResponse.find((site) => site.id === id)));

    // we mock both filter and show requests because we need to have consistent
    // mock data for the typeahead queries that use filter requests, and the
    // has-many associations that use show requests
    tagsApiSpy.typeaheadCallback.and.returnValue(() => of(mockTagsResponse));

    const response = Promise.all([
      interceptFilterApiRequest(tagsApiSpy, injector, mockTagsResponse, Tag),

      interceptShowApiRequest(
        tagsApiSpy,
        injector,
        (tag: Tag) => mockTagsResponse.find((requestModel) => requestModel.id === tag.id),
        Tag,
      ),

      interceptFilterApiRequest(recordingsApiSpy, injector, [mockRecording], AudioRecording),

      interceptShowApiRequest(recordingsApiSpy, injector, mockRecording, AudioRecording),
    ]);

    const searchParameters = new AnnotationSearchParameters(params, injector);
    searchParameters.routeProjectModel = mockProject;
    spec.setInput("searchParameters", searchParameters);

    return response;
  }

  const sitesTypeahead = () => spec.query("#sites-input");
  const onlyVerifiedCheckbox = () => spec.query("#filter-verified");

  const tagsTypeahead = () => spec.query("#tags-input");
  const tagPills = () => tagsTypeahead().querySelectorAll<HTMLSpanElement>(".item-pill");

  const projectsInput = () => projectsTypeahead().querySelector("input");
  const projectsTypeahead = () => spec.query("#projects-input");

  const dateToggleInput = () => spec.query<HTMLInputElement>("#date-filtering");
  const endDateInput = () => spec.query<HTMLInputElement>("#date-finished-before");

  const advancedFiltersToggle = () => spec.query<HTMLButtonElement>("#advanced-filters-toggle");
  const advancedFiltersCollapsable = () => spec.query(".advanced-filters>[ng-reflect-collapsed]");
  const recordingsTypeahead = () => spec.query("#recordings-input");

  beforeEach(() => {
    mockTagsResponse = Array.from({ length: 10 }, () => new Tag(generateTag()));
    mockSitesResponse = Array.from({ length: 10 }, () => new Site(generateSite()));
    mockProject = new Project(generateProject());
    mockRecording = new AudioRecording(generateAudioRecording());
  });

  it("should create", () => {
    setup();
    expect(spec.component).toBeInstanceOf(AnnotationSearchFormComponent);
  });

  it("should have a collapsable advanced filters section", fakeAsync(() => {
    setup();
    expect(recordingsTypeahead()).toBeHidden();
    toggleDropdown(spec, advancedFiltersToggle());
    expect(recordingsTypeahead()).toBeVisible();
  }));

  describe("pre-population from first load", () => {
    // check the population of a typeahead input that uses a property backing
    it("should pre-populate the project typeahead input if provided", () => {
      setup();
      expect(projectsInput()).toHaveProperty("placeholder", mockProject.name);
    });

    // check the population of a typeahead input that does not use a property backing
    xit("should pre-populate the tags typeahead input if provided in the search parameters model", async () => {
      const testedTag = mockTagsResponse[0];

      const response = setup({ tags: testedTag.id.toString() });
      spec.detectChanges();
      await response;
      spec.detectChanges();

      const realizedTagPills = tagPills();
      expect(realizedTagPills[0].innerText).toEqual(`${testedTag.text}`);
    });

    // check the population of an external component that is not a typeahead input
    it("should pre-populate the date filters if provided in the search parameters model", fakeAsync(() => {
      const testEndDate = modelData.dateTime();
      const testEndDateString = testEndDate.toFormat("yyyy-MM-dd");

      setup({ recordingDate: `,${testEndDateString}` });
      waitForDropdown(spec);

      expect(endDateInput()).toHaveValue(testEndDate.toFormat("yyyy-MM-dd"));
      expect(spec.component.searchParameters.recordingDateStartedAfter).toBeFalsy();
      expect(spec.component.searchParameters.recordingDateFinishedBefore).toBeTruthy();
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

      expect(spec.component.searchParameters.recordingDateStartedAfter).toBeFalsy();
      expect(spec.component.searchParameters.recordingDateFinishedBefore).toBeFalsy();
    }));

    // check the population of a checkbox boolean input
    // TODO: enable this test once we have the endpoint avaliable to filter by verified status
    xit("should pre-populate the only verified checkbox if provided in the search parameters model", () => {
      expect(spec.component.searchParameters.onlyUnverified).toBeTrue();
    });

    it("should automatically open the advanced filters if the search parameters have advanced filters", fakeAsync(() => {
      setup({ audioRecordings: "1" });
      const expectedText = `Recording IDs of interest ${mockRecording.id}`;

      waitForDropdown(spec);

      expect(recordingsTypeahead()).toBeVisible();
      expect(recordingsTypeahead()).toHaveExactTrimmedText(expectedText);
      expect(advancedFiltersCollapsable()).toHaveClass("show");
    }));

    it("should not apply the advanced filters if the dropdown is closed", fakeAsync(() => {
      setup({ audioRecordings: "1" });
      expect(spec.component.searchParameters.audioRecordings).toHaveLength(1);

      toggleDropdown(spec, advancedFiltersToggle());

      const realizedModel = spec.component.searchParameters;
      expect(realizedModel.audioRecordings).toHaveLength(0);
    }));
  });

  describe("update emission", () => {
    beforeEach(() => {
      setup();
    });

    // check a typeahead input that also has an optional property backing
    it("should emit the correct model if the site is updated", fakeAsync(() => {
      const testedSite = mockSitesResponse[0];
      selectFromTypeahead(spec, sitesTypeahead(), testedSite.name);

      expect(spec.component.searchParameters.sites).toEqual([testedSite.id]);
      expect(modelChangeSpy).toHaveBeenCalledOnceWith(spec.component.searchParameters);
    }));

    // check a typeahead input that does not have an optional property backing
    it("should emit the correct model if the tags are updated", fakeAsync(() => {
      const testedTag = mockTagsResponse[0];
      selectFromTypeahead(spec, tagsTypeahead(), testedTag.text, false);

      expect(spec.component.searchParameters.tags).toEqual([testedTag.id]);
      expect(modelChangeSpy).toHaveBeenCalledOnceWith(spec.component.searchParameters);
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

      spec.click(dateToggleInput());
      waitForDropdown(spec);

      spec.typeInElement(testedDate, endDateInput());

      expect(modelChangeSpy).toHaveBeenCalledOnceWith(expectedNewModel);
    }));

    it("should not emit a new model if the date filters are updated with an invalid value", fakeAsync(() => {
      const testedDate = "2021109-12";

      spec.click(dateToggleInput());
      waitForDropdown(spec);

      spec.typeInElement(testedDate, endDateInput());

      expect(modelChangeSpy).not.toHaveBeenCalled();
    }));

    // TODO: enable this test once we have the endpoint available to filter by verified status
    xit("should emit the correct model if the only verified checkbox is updated", () => {
      spec.click(onlyVerifiedCheckbox());

      expect(spec.component.searchParameters.onlyUnverified).toBeTrue();
      expect(modelChangeSpy).toHaveBeenCalledOnceWith(jasmine.objectContaining({ onlyUnverified: true }));
    });
  });
});

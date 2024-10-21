import {
  createComponentFactory,
  Spectator,
  SpyObject,
} from "@ngneat/spectator";
import { SharedModule } from "@shared/shared.module";
import { MockBawApiModule } from "@baw-api/baw-apiMock.module";
import { AnnotationSearchParameters } from "@components/annotations/pages/annotationSearchParameters";
import { Injector, INJECTOR } from "@angular/core";
import { Project } from "@models/Project";
import { generateProject } from "@test/fakes/Project";
import { TagsService } from "@baw-api/tag/tags.service";
import { SHALLOW_SITE, TAG } from "@baw-api/ServiceTokens";
import { Tag } from "@models/Tag";
import { of } from "rxjs";
import { generateTag } from "@test/fakes/Tag";
import { ShallowSitesService } from "@baw-api/site/sites.service";
import { Site } from "@models/Site";
import { generateSite } from "@test/fakes/Site";
import { selectFromTypeahead } from "@test/helpers/html";
import { fakeAsync } from "@angular/core/testing";
import { modelData } from "@test/helpers/faker";
import { AnnotationSearchFormComponent } from "./annotation-search-form.component";

describe("AnnotationSearchFormComponent", () => {
  let spectator: Spectator<AnnotationSearchFormComponent>;
  let injector: SpyObject<Injector>;

  let mockTagsApi: SpyObject<TagsService>;
  let mockSitesApi: SpyObject<ShallowSitesService>;
  let modelChangeSpy: jasmine.Spy;

  let mockTagsResponse: Tag[] = [];
  let mockSitesResponse: Site[] = [];
  let mockProject: Project;

  const createComponent = createComponentFactory({
    component: AnnotationSearchFormComponent,
    imports: [MockBawApiModule, SharedModule],
  });

  function setup(): void {
    spectator = createComponent({ detectChanges: false });

    injector = spectator.inject(INJECTOR);
    mockTagsApi = spectator.inject(TAG.token);
    mockSitesApi = spectator.inject(SHALLOW_SITE.token);

    mockTagsResponse = Array.from(
      { length: 10 },
      () => new Tag(generateTag(), injector)
    );
    mockSitesResponse = Array.from(
      { length: 10 },
      () => new Site(generateSite(), injector)
    );
    mockProject = new Project(generateProject(), injector);

    modelChangeSpy = spyOn(spectator.component.searchParametersChange, "emit");

    mockTagsApi.filter.andCallFake(() => of(mockTagsResponse));
    mockSitesApi.filter.andCallFake(() => of(mockSitesResponse));

    const searchParameters = new AnnotationSearchParameters({}, injector);
    searchParameters.routeProjectModel = mockProject;
    spectator.setInput("searchParameters", searchParameters);
  }

  const sitesTypeahead = () => spectator.query("#sites-input");
  const onlyVerifiedCheckbox = () => spectator.query("#filter-verified");

  const tagsTypeahead = () => spectator.query("#tags-input");
  const tagPills = () => tagsTypeahead().querySelector(".item-pill");

  const projectsInput = () => projectsTypeahead().querySelector("input");
  const projectsTypeahead = () => spectator.query("#projects-input");

  const dateToggleInput = () =>
    spectator.query<HTMLInputElement>("#date-filtering");
  const endDateInput = () =>
    spectator.query<HTMLInputElement>("#date-finished-before");

  function toggleDateFilters(): void {
    spectator.click(dateToggleInput());
    spectator.detectChanges();
    spectator.tick(1000);
    spectator.detectChanges();
  }

  beforeEach(() => {
    setup();
  });

  it("should create", () => {
    expect(spectator.component).toBeInstanceOf(AnnotationSearchFormComponent);
  });

  it("should have a collapsable advanced filters section", () => {});

  describe("pre-population from first load", () => {
    // check the population of a typeahead input that uses a property backing
    it("should pre-populate the project typeahead input if provided", () => {
      expect(projectsInput()).toHaveProperty("placeholder", mockProject.name);
    });

    // check the population of a typeahead input that does not use a property backing
    it("should pre-populate the tags typeahead input if provided in the search parameters model", () => {
      const testTag = mockTagsResponse[0];
      spectator.component.searchParameters.tags = new Set([testTag.id]);
      spectator.detectChanges();

      expect(tagPills()).toHaveLength(1);
      expect(tagPills()[0].innerText).toEqual([testTag]);
    });

    // check the population of an external component that is not a typeahead input
    it("should pre-populate the date-time filters if provided in the search parameters model", fakeAsync(() => {
      toggleDateFilters();

      const testStartDate = modelData.dateTime();
      spectator.component.searchParameters.recordingDate = [
        testStartDate,
      ] as any;
      expect(endDateInput()).toHaveValue(testStartDate.toFormat("yyyy-MM-dd"));
    }));

    // check the population of a checkbox boolean input
    // TODO: enable this test once we have the endpoint avaliable to filter by verified status
    xit("should pre-populate the only verified checkbox if provided in the search parameters model", () => {
      expect(spectator.component.searchParameters.onlyUnverified).toBeTrue();
    });
  });

  describe("update emission", () => {
    // check a typeahead input that also has an optional property backing
    it("should emit the correct model if the site is updated", fakeAsync(() => {
      const testedSite = mockSitesResponse[0];
      selectFromTypeahead(spectator, sitesTypeahead(), testedSite.name);

      expect(spectator.component.searchParameters.sites).toEqual([
        testedSite.id,
      ]);
      expect(modelChangeSpy).toHaveBeenCalledOnceWith(
        spectator.component.searchParameters
      );
    }));

    // check a typeahead input that does not have an optional property backing
    it("should emit the correct model if the tags are updated", fakeAsync(() => {
      const testedTag = mockTagsResponse[0];
      selectFromTypeahead(spectator, tagsTypeahead(), testedTag.text);

      expect(spectator.component.searchParameters.tags).toEqual([testedTag.id]);
      expect(modelChangeSpy).toHaveBeenCalledOnceWith(
        spectator.component.searchParameters
      );
    }));

    // check an external component that is not a typeahead input
    it("should emit the correct model if the date-time filters are updated", fakeAsync(() => {
      const testedDate = "2021-10-10";
      const expectedNewModel = {};

      toggleDateFilters();
      spectator.typeInElement(testedDate, endDateInput());

      expect(modelChangeSpy).toHaveBeenCalledOnceWith(expectedNewModel);
    }));

    it("should not emit a new model if the date-time filters are updated with an invalid value", fakeAsync(() => {
      const testedDate = "2021109-12";

      toggleDateFilters();
      spectator.typeInElement(testedDate, endDateInput());

      expect(modelChangeSpy).not.toHaveBeenCalled();
    }));

    // TODO: enable this test once we have the endpoint available to filter by verified status
    xit("should emit the correct model if the only verified checkbox is updated", () => {
      spectator.click(onlyVerifiedCheckbox());

      expect(spectator.component.searchParameters.onlyUnverified).toBeTrue();
      expect(modelChangeSpy).toHaveBeenCalledOnceWith(
        jasmine.objectContaining({ onlyUnverified: true })
      );
    });
  });
});

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
import { AnnotationSearchFormComponent } from "./annotation-search-form.component";

describe("AnnotationSearchFormComponent", () => {
  let spectator: Spectator<AnnotationSearchFormComponent>;
  let injector: SpyObject<Injector>;

  let mockTagsApi: SpyObject<TagsService>;
  let mockSitesApi: SpyObject<ShallowSitesService>;
  let modelChangeSpy: jasmine.Spy;

  let mockTagsResponse: Tag[] = [];
  let mockSitesResponse: Site[] = [];
  let defaultFakeProject: Project;

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

    modelChangeSpy = spyOn(spectator.component.searchParametersChange, "emit");

    mockTagsApi.filter.andCallFake(() => of(mockTagsResponse));
    mockSitesApi.filter.andCallFake(() => of(mockSitesResponse));

    spectator.component.project = defaultFakeProject;
    spectator.component.searchParameters = new AnnotationSearchParameters(
      {},
      injector
    );

    spectator.detectChanges();
  }

  const tagsTypeahead = () => spectator.query("#tags-input");
  const projectsTypeahead = () => spectator.query("#projects-input");
  const regionsTypeahead = () => spectator.query("#regions-input");
  const sitesTypeahead = () => spectator.query("#sites-input");
  const onlyVerifiedCheckbox = () =>
    spectator.query<HTMLInputElement>("#filter-verified");

  const tagsInput = () => tagsTypeahead().querySelector("input");
  const projectsInput = () => projectsTypeahead().querySelector("input");
  const regionsInput = () => regionsTypeahead().querySelector("input");
  const sitesInput = () => sitesTypeahead().querySelector("input");

  beforeEach(() => {
    defaultFakeProject = new Project(generateProject());
    setup();
  });

  it("should create", () => {
    expect(spectator.component).toBeInstanceOf(AnnotationSearchFormComponent);
  });

  describe("pre-population from first load", () => {
    // check the population of a typeahead input that uses a property backing
    it("should pre-populate the project typeahead input if provided", () => {
      expect(projectsInput()).toHaveProperty(
        "placeholder",
        defaultFakeProject.name
      );
    });

    // check the population of a typeahead input that does not use a property backing
    xit("should pre-populate the tags typeahead input if provided in the search parameters model", () => {});

    // check the population of an external component that is not a typeahead input
    it("should pre-populate the date-time filters if provided in the search parameters model", () => {});

    // check the population of a checkbox boolean input
    it("should pre-populate the only verified checkbox if provided in the search parameters model", () => {});
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
    fit("should emit the correct model if the date-time filters are updated", () => {
      const newStartDate = new Date(2020, 1, 1);
    });

    // check a checkbox boolean input
    it("should emit the correct model if the only verified checkbox is updated", () => {
      spectator.click(onlyVerifiedCheckbox());

      expect(spectator.component.searchParameters.onlyUnverified).toBeTrue();
      expect(modelChangeSpy).toHaveBeenCalledOnceWith(
        spectator.component.searchParameters
      );
    });
  });
});

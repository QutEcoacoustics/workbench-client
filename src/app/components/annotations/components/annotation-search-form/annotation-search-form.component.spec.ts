import {
  createComponentFactory,
  Spectator,
  SpyObject,
} from "@ngneat/spectator";
import { TypeaheadInputComponent } from "@shared/typeahead-input/typeahead-input.component";
import { DateTimeFilterComponent } from "@shared/date-time-filter/date-time-filter.component";
import { MockBawApiModule } from "@baw-api/baw-apiMock.module";
import { SharedModule } from "@shared/shared.module";
import { ProjectsService } from "@baw-api/project/projects.service";
import { TagsService } from "@baw-api/tag/tags.service";
import { ShallowRegionsService } from "@baw-api/region/regions.service";
import { ShallowSitesService } from "@baw-api/site/sites.service";
import {
  PROJECT,
  SHALLOW_REGION,
  SHALLOW_SITE,
  TAG,
} from "@baw-api/ServiceTokens";
import { AnnotationSearchParameters } from "@components/annotations/pages/annotationSearchParameters";
import { generateAnnotationSearchUrlParameters } from "@test/fakes/data/AnnotationSearchParameters";
import { Injector } from "@angular/core";
import { of } from "rxjs";
import { AnnotationSearchFormComponent } from "./annotation-search-form.component";

describe("AnnotationSearchFormComponent", () => {
  let spectator: Spectator<AnnotationSearchFormComponent>;
  let mockProjectsApi: SpyObject<ProjectsService>;
  let mockRegionsApi: SpyObject<ShallowRegionsService>;
  let mockSitesApi: SpyObject<ShallowSitesService>;
  let mockTagsApi: SpyObject<TagsService>;
  let injector: SpyObject<Injector>;

  const createComponent = createComponentFactory({
    declarations: [TypeaheadInputComponent, DateTimeFilterComponent],
    component: AnnotationSearchFormComponent,
    imports: [MockBawApiModule, SharedModule],
  });

  function setup() {
    spectator = createComponent({ detectChanges: false });

    injector = spectator.inject(Injector);

    mockProjectsApi = spectator.inject(PROJECT.token);
    mockRegionsApi = spectator.inject(SHALLOW_REGION.token);
    mockSitesApi = spectator.inject(SHALLOW_SITE.token);
    mockTagsApi = spectator.inject(TAG.token);

    mockProjectsApi.filter.and.returnValue(of([]));
    mockRegionsApi.filter.and.returnValue(of([]));
    mockSitesApi.filter.and.returnValue(of([]));
    mockTagsApi.filter.and.returnValue(of([]));

    spectator.component.modelChange.emit = jasmine.createSpy("EventEmitter");

    spectator.detectChanges();
  }

  const unverifiedAnnotationsCheckbox = () =>
    spectator.query<HTMLInputElement>("#filter-verified");

  function toggleOnlyVerified(): void {
    const targetCheckbox = unverifiedAnnotationsCheckbox();
    targetCheckbox.click();
    expect(targetCheckbox).toBeChecked();
  }

  beforeEach(() => {
    setup();
  });

  it("should create", () => {
    expect(spectator.component).toBeInstanceOf(AnnotationSearchFormComponent);
  });

  it("should not make any api calls on initialization", () => {
    expect(mockProjectsApi.filter).not.toHaveBeenCalled();
    expect(mockRegionsApi.filter).not.toHaveBeenCalled();
    expect(mockSitesApi.filter).not.toHaveBeenCalled();
    expect(mockTagsApi.filter).not.toHaveBeenCalled();
  });

  it("should update the model correctly when the fields change", () => {
    toggleOnlyVerified();
    expect(spectator.component.model).toEqual(
      jasmine.objectContaining({ onlyUnverified: true })
    );
  });

  it("should emit the correct updated model when fields change", () => {
    toggleOnlyVerified();
    expect(spectator.component.modelChange.emit).toHaveBeenCalledWith(
      jasmine.objectContaining({ onlyUnverified: true })
    );
  });

  it("should react correctly to having its model updated", () => {
    const mockModel = new AnnotationSearchParameters(
      generateAnnotationSearchUrlParameters({ onlyUnverified: "true" }),
      injector
    );
    spectator.component.model = mockModel;
    spectator.detectChanges();

    expect(unverifiedAnnotationsCheckbox()).toBeChecked();
  });
});

import { createComponentFactory, Spectator, SpyObject } from "@ngneat/spectator";
import { AnnotationSearchParameters } from "@components/annotations/pages/annotationSearchParameters";
import { ASSOCIATION_INJECTOR } from "@services/association-injector/association-injector.tokens";
import { AssociationInjector } from "@models/ImplementsInjector";
import { generateAnnotationSearchUrlParameters } from "@test/fakes/data/AnnotationSearchParameters";
import { IconsModule } from "@shared/icons/icons.module";
import { provideMockBawApi } from "@baw-api/provide-baw-ApiMock";
import { ShallowSitesService } from "@baw-api/site/sites.service";
import { ShallowRegionsService } from "@baw-api/region/regions.service";
import { TagsService } from "@baw-api/tag/tags.service";
import { SHALLOW_REGION, SHALLOW_SITE, TAG } from "@baw-api/ServiceTokens";
import { of } from "rxjs";
import { User } from "@models/User";
import { generateUser } from "@test/fakes/User";
import { SearchFiltersModalComponent } from "./search-filters.component";

describe("SearchFiltersModalComponent", () => {
  let spec: Spectator<SearchFiltersModalComponent>;
  let injector: AssociationInjector;
  let successSpy: jasmine.Spy<SearchFiltersModalComponent["successCallback"]>;

  let mockSitesApi: SpyObject<ShallowSitesService>;
  let mockRegionsApi: SpyObject<ShallowRegionsService>;
  let mockTagsApi: SpyObject<TagsService>;

  let mockUser: User;

  const createComponent = createComponentFactory({
    component: SearchFiltersModalComponent,
    imports: [IconsModule],
    providers: [provideMockBawApi()],
  });

  beforeEach(() => {
    spec = createComponent({ detectChanges: false });

    injector = spec.inject(ASSOCIATION_INJECTOR);

    successSpy = spec.component.successCallback =
      jasmine.createSpy("successCallback");
    successSpy.and.stub();

    mockUser = new User(generateUser());
    const searchParameters = new AnnotationSearchParameters(
      generateAnnotationSearchUrlParameters(),
      mockUser,
      injector,
    );

    mockSitesApi = spec.inject(SHALLOW_SITE.token);
    mockSitesApi.show.andReturn(of());

    mockRegionsApi = spec.inject(SHALLOW_REGION.token);
    mockRegionsApi.show.andReturn(of())

    mockTagsApi = spec.inject(TAG.token);
    mockTagsApi.show.andReturn(of())

    const mockModal = {
      close: () => undefined,
    };

    spec.setInput({
      formValue: searchParameters,
      modal: mockModal,
    });
    spec.detectChanges();
  });

  const exitButton = () => spec.query<HTMLButtonElement>("#exit-btn");
  const updateButton = () =>
    spec.query<HTMLButtonElement>("#update-filters-btn");

  it("should create", () => {
    expect(spec.component).toBeInstanceOf(SearchFiltersModalComponent);
  });

  it("should not use the success callback if the cancel button is clicked", () => {
    exitButton().click();
    expect(successSpy).not.toHaveBeenCalled();
  });

  it("should use the success callback if the update button is clicked", () => {
    updateButton().click();
    expect(successSpy).toHaveBeenCalled();
  });

  it("should have a primary button if the host does not have decisions", () => {
    spec.setInput("hasDecisions", false);
    expect(updateButton()).toHaveClass("btn-primary");
  });
});

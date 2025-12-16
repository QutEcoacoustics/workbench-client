import { ShallowAudioEventImportFileService } from "@baw-api/audio-event-import-file/audio-event-import-file.service";
import { provideMockBawApi } from "@baw-api/provide-baw-ApiMock";
import { ShallowRegionsService } from "@baw-api/region/regions.service";
import { SHALLOW_REGION, SHALLOW_SITE, TAG } from "@baw-api/ServiceTokens";
import { ShallowSitesService } from "@baw-api/site/sites.service";
import { TagsService } from "@baw-api/tag/tags.service";
import { AssociationInjector } from "@models/ImplementsInjector";
import { User } from "@models/User";
import { createComponentFactory, mockProvider, Spectator, SpyObject } from "@ngneat/spectator";
import { ASSOCIATION_INJECTOR } from "@services/association-injector/association-injector.tokens";
import { IconsModule } from "@shared/icons/icons.module";
import { generateAnnotationSearchUrlParams } from "@test/fakes/data/AnnotationSearchParameters";
import { generateUser } from "@test/fakes/User";
import { of } from "rxjs";
import { AnnotationSearchParameters } from "../../annotation-search-form/annotationSearchParameters";
import { SearchFiltersModalComponent } from "./search-filters.component";

describe("SearchFiltersModalComponent", () => {
  let spec: Spectator<SearchFiltersModalComponent>;
  let injector: AssociationInjector;
  let successSpy: jasmine.Spy<SearchFiltersModalComponent["successCallback"]>;

  let sitesApi: SpyObject<ShallowSitesService>;
  let regionsApi: SpyObject<ShallowRegionsService>;
  let tagsApi: SpyObject<TagsService>;

  let mockUser: User;

  const createComponent = createComponentFactory({
    component: SearchFiltersModalComponent,
    imports: [IconsModule],
    providers: [
      provideMockBawApi(),
      mockProvider(ShallowAudioEventImportFileService, {
        filter: () => of([]),
      }),
    ],
  });

  beforeEach(() => {
    spec = createComponent({ detectChanges: false });

    injector = spec.inject(ASSOCIATION_INJECTOR);

    successSpy = spec.component.successCallback =
      jasmine.createSpy("successCallback");
    successSpy.and.stub();

    mockUser = new User(generateUser());
    const searchParameters = new AnnotationSearchParameters(
      generateAnnotationSearchUrlParams(),
      mockUser,
      injector,
    );

    sitesApi = spec.inject(SHALLOW_SITE.token);
    sitesApi.show.andReturn(of());

    regionsApi = spec.inject(SHALLOW_REGION.token);
    regionsApi.show.andReturn(of())

    tagsApi = spec.inject(TAG.token);
    tagsApi.show.andReturn(of())

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

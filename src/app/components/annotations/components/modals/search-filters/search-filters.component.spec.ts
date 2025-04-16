import { createComponentFactory, Spectator } from "@ngneat/spectator";
import { MockBawApiModule } from "@baw-api/baw-apiMock.module";
import { AnnotationSearchParameters } from "@components/annotations/pages/annotationSearchParameters";
import { ASSOCIATION_INJECTOR } from "@services/association-injector/association-injector.tokens";
import { AssociationInjector } from "@models/ImplementsInjector";
import { generateAnnotationSearchUrlParameters } from "@test/fakes/data/AnnotationSearchParameters";
import { IconsModule } from "@shared/icons/icons.module";
import { SearchFiltersModalComponent } from "./search-filters.component";

describe("SearchFiltersModalComponent", () => {
  let spectator: Spectator<SearchFiltersModalComponent>;
  let injector: AssociationInjector;
  let successSpy: jasmine.Spy;

  const createComponent = createComponentFactory({
    component: SearchFiltersModalComponent,
    imports: [MockBawApiModule, IconsModule],
  });

  function setup(): void {
    spectator = createComponent({ detectChanges: false });

    injector = spectator.inject(ASSOCIATION_INJECTOR);

    successSpy = spectator.component.successCallback =
      jasmine.createSpy("successCallback");
    successSpy.and.stub();

    const searchParameters = new AnnotationSearchParameters(
      generateAnnotationSearchUrlParameters(),
      injector,
    );

    spectator.setInput("formValue", searchParameters);

    spectator.detectChanges();
  }

  const exitButton = () => spectator.query<HTMLButtonElement>("#exit-btn");
  const updateButton = () =>
    spectator.query<HTMLButtonElement>("#update-filters-btn");

  beforeEach(() => {
    setup();
  });

  it("should create", () => {
    expect(spectator.component).toBeInstanceOf(SearchFiltersModalComponent);
  });

  it("should not use the success callback if the cancel button is clicked", () => {
    exitButton().click();
    expect(successSpy).not.toHaveBeenCalled();
  });

  it("should use the success callback if the update button is clicked", () => {
    updateButton().click();
    expect(successSpy).toHaveBeenCalled();
  });

  it("should have a warning button if the host has decisions", () => {
    spectator.setInput("hasDecisions", true);
    expect(updateButton()).toHaveClass("btn-warning");
  });

  it("should have a primary button if the host does not have decisions", () => {
    spectator.setInput("hasDecisions", false);
    expect(updateButton()).toHaveClass("btn-primary");
  });
});

import { createComponentFactory, Spectator } from "@ngneat/spectator";
import { MockBawApiModule } from "@baw-api/baw-apiMock.module";
import { SearchFiltersModalComponent } from "./search-filters.component";

describe("SearchFiltersModalComponent", () => {
  let spectator: Spectator<SearchFiltersModalComponent>;
  let successSpy: jasmine.Spy;

  const createComponent = createComponentFactory({
    component: SearchFiltersModalComponent,
    imports: [MockBawApiModule],
  });

  function setup(): void {
    spectator = createComponent({ detectChanges: false });

    successSpy = spectator.component.successCallback = jasmine.createSpy("successCallback");
    successSpy.and.stub();

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

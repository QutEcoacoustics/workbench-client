import { createComponentFactory, Spectator } from "@ngneat/spectator";
import { AnnotationSearchFormComponent } from "./annotation-search-form.component";

describe("AnnotationSearchFormComponent", () => {
  let spectator: Spectator<AnnotationSearchFormComponent>;

  const createComponent = createComponentFactory({
    component: AnnotationSearchFormComponent,
  });

  function setup() {
    spectator = createComponent({ detectChanges: false });
    spectator.detectChanges();
  }

  beforeEach(() => {
    setup();
  });

  it("should create", () => {
    expect(spectator.component).toBeInstanceOf(AnnotationSearchFormComponent);
  });
});

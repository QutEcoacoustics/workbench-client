import { createComponentFactory, Spectator } from "@ngneat/spectator";
import { SharedModule } from "@shared/shared.module";
import { MockBawApiModule } from "@baw-api/baw-apiMock.module";
import { AnnotationSearchFormComponent } from "./annotation-search-form.component";

describe("AnnotationSearchFormComponent", () => {
  let spectator: Spectator<AnnotationSearchFormComponent>;

  const createComponent = createComponentFactory({
    component: AnnotationSearchFormComponent,
    imports: [SharedModule, MockBawApiModule],
  });

  function setup(): void {
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

import { createComponent } from "@angular/core";
import { createComponentFactory, mockProvider, Spectator } from "@ngneat/spectator";
import { EventModalComponent } from "./event-modal.component";
import { provideMockBawApi } from "@baw-api/provide-baw-ApiMock";
import { AnnotationService } from "@services/models/annotations/annotation.service";
import { Annotation } from "@models/data/Annotation";
import { generateAnnotation } from "@test/fakes/data/Annotation";

describe("EventModalComponent", () => {
  let spec: Spectator<EventModalComponent>;

  const createComponent = createComponentFactory({
    component: EventModalComponent,
    providers: [
      provideMockBawApi(),
      mockProvider(AnnotationService, {
        show: async () => new Annotation(generateAnnotation()),
      }),
    ],
  });

  beforeEach(() => {
    spec = createComponent();
  });

  it("should create", () => {
    expect(spec.component).toBeInstanceOf(EventModalComponent);
  });
});

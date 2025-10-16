import { createComponentFactory, mockProvider, Spectator } from "@ngneat/spectator";
import { EventModalComponent } from "./event-modal.component";
import { provideMockBawApi } from "@baw-api/provide-baw-ApiMock";
import { AnnotationService } from "@services/models/annotations/annotation.service";
import { Annotation } from "@models/data/Annotation";
import { generateAnnotation } from "@test/fakes/data/Annotation";
import { AnnotationEventCardComponent } from "@shared/audio-event-card/annotation-event-card.component";

describe("EventModalComponent", () => {
  let spec: Spectator<EventModalComponent>;
  let annotation: Annotation;

  const createComponent = createComponentFactory({
    component: EventModalComponent,
    providers: [
      provideMockBawApi(),
      mockProvider(AnnotationService, {
        show: () => Promise.resolve(annotation),
      }),
    ],
  });

  beforeEach(() => {
    annotation = new Annotation(generateAnnotation());

    spec = createComponent();
  });

  it("should create", () => {
    expect(spec.component).toBeInstanceOf(EventModalComponent);
  });

  // TODO: The async pipe does not seem to resolve in the test environment
  xit("should correctly attach the annotation to the annotation event card", () => {
    const eventCard = spec.query(AnnotationEventCardComponent);
    expect(eventCard).toBeVisible();

    expect(eventCard.annotation).toEqual(annotation);
  });
});

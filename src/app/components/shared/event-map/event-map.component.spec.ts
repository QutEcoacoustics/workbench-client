import { createComponentFactory, Spectator } from "@ngneat/spectator";
import { MapComponent } from "@shared/map/map.component";
import { MockModule } from "ng-mocks";
import { GoogleMapsModule } from "@angular/google-maps";
import { provideMockBawApi } from "@baw-api/provide-baw-ApiMock";
import { EventMapComponent } from "./event-map.component";

describe("EventMapComponent", () => {
  let spec: Spectator<EventMapComponent>;

  const createComponent = createComponentFactory({
    component: EventMapComponent,
    imports: [MapComponent, MockModule(GoogleMapsModule)],
    providers: [provideMockBawApi()],
  });

  beforeEach(() => {
    spec = createComponent({
      props: {
        events: [],
      },
      detectChanges: false,
    });
    spec.detectChanges();
  });

  it("should create", () => {
    expect(spec.component).toBeInstanceOf(EventMapComponent);
  });
});

import { createRoutingFactory, SpectatorRouting } from "@ngneat/spectator";
import { provideMockBawApi } from "@baw-api/provide-baw-ApiMock";
import { Params } from "@angular/router";
import { EventsPageComponent } from "./events.component";

describe("EventsPageComponent", () => {
  let spec: SpectatorRouting<EventsPageComponent>;

  const createComponent = createRoutingFactory({
    component: EventsPageComponent,
    providers: [provideMockBawApi()],
  });

  function setup(queryParams: Params = {}): void {
    spec = createComponent({ queryParams });

    // spec.component["searchParameters"].set(mockSearchParameters);
  }

  it("should create", () => {
    setup();
    expect(spec.component).toBeInstanceOf(EventsPageComponent);
  });
});

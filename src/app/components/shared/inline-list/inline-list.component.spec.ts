import { Spectator, createComponentFactory } from "@ngneat/spectator";
import { SharedModule } from "@shared/shared.module";
import { MockBawApiModule } from "@baw-api/baw-apiMock.module";
import { InlineListComponent } from "./inline-list.component";

describe("InlineListComponent", () => {
  let spectator: Spectator<InlineListComponent>;

  const createComponent = createComponentFactory({
    imports: [SharedModule, MockBawApiModule],
    component: InlineListComponent,
  });

  function setup(): void {
    spectator = createComponent();
    spectator.detectChanges();
  }

  beforeEach(() => setup());

  it("should create", () => {
    expect(spectator.component).toBeInstanceOf(InlineListComponent);
  });
});

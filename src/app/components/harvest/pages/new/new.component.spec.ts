import { MockBawApiModule } from "@baw-api/baw-apiMock.module";
import { HarvestsService } from "@baw-api/harvest/harvest.service";
import { TitleComponent } from "@components/harvest/components/shared/title.component";
import { createRoutingFactory, Spectator } from "@ngneat/spectator";
import { assertPageInfo } from "@test/helpers/pageRoute";
import { ToastService } from "@services/toasts/toasts.service";
import { NewComponent } from "./new.component";

describe("newHarvestComponent", () => {
  let spectator: Spectator<NewComponent>;

  const createComponent = createRoutingFactory({
    component: NewComponent,
    imports: [MockBawApiModule, TitleComponent],
    mocks: [ToastService, HarvestsService],
  });

  assertPageInfo(NewComponent, "New Upload");

  beforeEach(() => {
    spectator = createComponent({ detectChanges: false });
  });

  it("should create", () => {
    expect(spectator.component).toBeInstanceOf(NewComponent);
  });
});

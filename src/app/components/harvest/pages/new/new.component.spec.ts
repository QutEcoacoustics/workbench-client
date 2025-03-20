import { MockBawApiModule } from "@baw-api/baw-apiMock.module";
import { HarvestsService } from "@baw-api/harvest/harvest.service";
import { TitleComponent } from "@components/harvest/components/shared/title.component";
import {
  createRoutingFactory,
  mockProvider,
  Spectator,
} from "@ngneat/spectator";
import { SharedModule } from "@shared/shared.module";
import { assertPageInfo } from "@test/helpers/pageRoute";
import { ToastsService } from "@services/toasts/toasts.service";
import { NewComponent } from "./new.component";

describe("newHarvestComponent", () => {
  let spectator: Spectator<NewComponent>;

  const createComponent = createRoutingFactory({
    component: NewComponent,
    declarations: [TitleComponent],
    providers: [
      mockProvider(HarvestsService),
    ],
    imports: [MockBawApiModule, SharedModule],
    mocks: [ToastsService],
  });

  assertPageInfo(NewComponent, "New Upload");

  beforeEach(() => spectator = createComponent({ detectChanges: false }));

  it("should create", () => {
    expect(spectator.component).toBeInstanceOf(NewComponent);
  });
});

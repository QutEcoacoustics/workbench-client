import { AccountsService } from "@baw-api/account/accounts.service";
import { createRoutingFactory, mockProvider, Spectator } from "@ngneat/spectator";
import { assertPageInfo } from "@test/helpers/pageRoute";
import { ToastsService } from "@services/toasts/toasts.service";
import { MyPasswordComponent } from "./my-password.component";

describe("MyPasswordComponent", () => {
  let spectator: Spectator<MyPasswordComponent>;

  const createComponent = createRoutingFactory({
    component: MyPasswordComponent,
    providers: [
      mockProvider(AccountsService),
    ],
    mocks: [ToastsService],
  });

  function setup(): void {
    spectator = createComponent();
    spectator.detectChanges();
  }

  beforeEach(() => setup());

  assertPageInfo(MyPasswordComponent, "Edit My Password");

  it("should create", () => {
    expect(spectator.component).toBeInstanceOf(MyPasswordComponent);
  });
});

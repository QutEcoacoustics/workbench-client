import { MockBawApiModule } from "@baw-api/baw-apiMock.module";
import { User } from "@models/User";
import { createRoutingFactory, SpectatorRouting } from "@ngneat/spectator";
import { SharedModule } from "@shared/shared.module";
import { generateUser } from "@test/fakes/User";
import { ToastrService } from "ngx-toastr";
import { TheirEditComponent } from "./their-edit.component";

describe("TheirProfileEditComponent", () => {
  let defaultUser: User;
  let spec: SpectatorRouting<TheirEditComponent>;
  const createComponent = createRoutingFactory({
    component: TheirEditComponent,
    mocks: [ToastrService],
    imports: [SharedModule, MockBawApiModule],
  });

  function setup(model: User) {
    spec = createComponent({
      data: { resolvers: { account: "resolver" }, account: { model } },
    });
    spec.detectChanges();
  }

  beforeEach(() => {
    defaultUser = new User(generateUser());
  });

  it("should create", () => {
    setup(defaultUser);
    expect(spec.component).toBeInstanceOf(TheirEditComponent);
  });
});

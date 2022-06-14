import { MockBawApiModule } from "@baw-api/baw-apiMock.module";
import { User } from "@models/User";
import { createRoutingFactory, SpectatorRouting } from "@ngneat/spectator";
import { SharedModule } from "@shared/shared.module";
import { generateUser } from "@test/fakes/User";
import { ToastrService } from "ngx-toastr";
import { MyEditComponent } from "./my-edit.component";

describe("MyProfileEditComponent", () => {
  let defaultUser: User;
  let spec: SpectatorRouting<MyEditComponent>;
  const createComponent = createRoutingFactory({
    component: MyEditComponent,
    mocks: [ToastrService],
    imports: [SharedModule, MockBawApiModule],
  });

  function setup(model: User) {
    spec = createComponent({
      data: { resolvers: { user: "resolver" }, user: { model } },
    });
    spec.detectChanges();
  }

  beforeEach(() => {
    defaultUser = new User(generateUser());
  });

  it("should create", () => {
    setup(defaultUser);
    expect(spec.component).toBeInstanceOf(MyEditComponent);
  });
});

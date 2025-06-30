import { BawSessionService } from "@baw-api/baw-session.service";
import { createComponentFactory, Spectator } from "@ngneat/spectator";
import { provideMockConfig } from "@services/config/provide-configMock";
import { IconsModule } from "@shared/icons/icons.module";
import { User } from "@models/User";
import { generateUser } from "@test/fakes/User";
import { WIPComponent } from "./wip.component";

describe("WIPComponent", () => {
  let spec: Spectator<WIPComponent>;

  const wipContent = () => spec.query(".wip-content");

  const createComponent = createComponentFactory({
    component: WIPComponent,
    imports: [IconsModule],
    providers: [BawSessionService, provideMockConfig()],
  });

  function setup(userModel?: User) {
    spec = createComponent({ detectChanges: false});

    const sessionService = spec.inject(BawSessionService);
    spyOnProperty(sessionService, "loggedInUser").and.returnValue(userModel);

    spec.detectChanges();
  }

  beforeEach(() => {
    spec = createComponent();
  });

  it("should create", () => {
    setup();
    expect(spec.component).toBeInstanceOf(WIPComponent);
  });

  it("should be hidden for guest users", () => {
    setup();
    expect(wipContent()).not.toExist();
  });

  it("should be hidden for non-admin logged in users", () => {
    const user = new User(generateUser({}, false));
    setup(user);

    expect(wipContent()).not.toExist();
  });

  it("should be visible for admin users", () => {
    const user = new User(generateUser({}, true));
    setup(user);

    expect(wipContent()).toExist();
  })
});

import { createComponentFactory, Spectator, SpyObject } from "@ngneat/spectator";
import { BawSessionService } from "@baw-api/baw-session.service";
import { IfLoggedInComponent } from "./if-logged-in.component";

describe("IsLoggedInComponent", () => {
  let spectator: Spectator<IfLoggedInComponent>;

  let sessionSpy: SpyObject<BawSessionService>
  let mockLoggedInResponse = true;

  const createComponent = createComponentFactory({
    component: IfLoggedInComponent,
  });

  function setup() {
    spectator = createComponent({ detectChanges: false });

    sessionSpy = spectator.inject(BawSessionService);
    (sessionSpy.isLoggedIn as any).andCallFake(() => mockLoggedInResponse);

    spectator.detectChanges();
  }

  beforeEach(() => {
    mockLoggedInResponse = true;
    setup();
  });

  it("should create", () => {
    expect(spectator.component).toBeInstanceOf(IfLoggedInComponent);
  });

  describe("when the user is logged in", () => {
    it("should not have a tooltip", () => {});

    it("should display the content unmodified", () => {});
  });

  describe("when the user is not logged in", () => {
    it("should have a tooltip", () => {});

    it("should display the content inside a span", () => {});

    it("should disable disable interactive content", () => {});

    it("should not add a disabled attribute to non-interactive content", () => {});
  });
});

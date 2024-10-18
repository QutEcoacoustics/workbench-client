import {
  createComponentFactory,
  Spectator,
  SpyObject,
} from "@ngneat/spectator";
import { BawSessionService } from "@baw-api/baw-session.service";
import { SharedModule } from "@shared/shared.module";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { MockBawApiModule } from "@baw-api/baw-apiMock.module";
import { IfLoggedInComponent } from "./if-logged-in.component";

describe("IsLoggedInComponent", () => {
  let spectator: Spectator<IfLoggedInComponent>;
  let sessionSpy: SpyObject<BawSessionService>;

  const createComponent = createComponentFactory({
    component: IfLoggedInComponent,
    imports: [SharedModule, HttpClientTestingModule, MockBawApiModule],
  });

  function setup(isLoggedIn: boolean) {
    spectator = createComponent({ detectChanges: false });

    sessionSpy = spectator.inject(BawSessionService);
    spyOnProperty(sessionSpy, "isLoggedIn").and.returnValue(isLoggedIn);

    spectator.detectChanges();
  }

  const wrapperSpan = () => spectator.query<HTMLSpanElement>("span");

  it("should create", () => {
    setup(false);
    expect(spectator.component).toBeInstanceOf(IfLoggedInComponent);
  });

  describe("when the user is logged in", () => {
    beforeEach(() => {
      setup(true);
    });

    it("should not have a tooltip", () => {
      expect(wrapperSpan()).not.toHaveAttribute("ngbTooltip");
    });
  });

  describe("when the user is not logged in", () => {
    beforeEach(() => {
      setup(false);
    });

    it("should have a tooltip", () => {
      const expectedContent = "You must be logged in";
      expect(wrapperSpan()).toHaveAttribute(
        "ng-reflect-ngb-tooltip",
        expectedContent
      );
    });
  });
});

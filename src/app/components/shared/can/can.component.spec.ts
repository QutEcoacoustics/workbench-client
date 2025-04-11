import { createHostFactory, SpectatorHost, SpyObject } from "@ngneat/spectator";
import { BawSessionService } from "@baw-api/baw-session.service";
import { SharedModule } from "@shared/shared.module";
import { provideHttpClientTesting } from "@angular/common/http/testing";
import { MockBawApiModule } from "@baw-api/baw-apiMock.module";
import { provideHttpClient, withInterceptorsFromDi } from "@angular/common/http";
import { IfLoggedInComponent } from "./can.component";

describe("IsLoggedInComponent", () => {
  let spectator: SpectatorHost<IfLoggedInComponent>;
  let sessionSpy: SpyObject<BawSessionService>;

  let isLoggedIn: boolean;

  const createHost = createHostFactory({
    component: IfLoggedInComponent,
    imports: [SharedModule, MockBawApiModule],
    providers: [provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()],
  });

  function setup(setupState: boolean) {
    const template = `
      <baw-can [ifLoggedIn]="true">
        <p id="non-interactive-p">non-interactive element</p>

        <button id="shallow-button">Test</button>
        <input id="shallow-input" />
      </baw-can>
    `;

    spectator = createHost(template, { detectChanges: false });

    isLoggedIn = setupState;

    sessionSpy = spectator.inject(BawSessionService);
    spyOnProperty(sessionSpy, "isLoggedIn").and.callFake(() => isLoggedIn);

    spectator.detectChanges();
  }

  const wrapperSpan = () => spectator.query<HTMLSpanElement>("span");

  const nonInteractiveElement = () => spectator.query("#non-interactive-p");
  const shallowButton = () => spectator.query("#shallow-button");
  const shallowInput = () => spectator.query("#shallow-input");

  function updateAuthState(state: boolean) {
    isLoggedIn = state;
    spectator.component.updateState();
    spectator.detectChanges();
  }

  it("should create", () => {
    setup(false);
    expect(spectator.component).toBeInstanceOf(IfLoggedInComponent);
  });

  describe("logged in predicate", () => {
    describe("when the user is logged in", () => {
      beforeEach(() => {
        setup(true);
      });

      it("should not have a tooltip", () => {
        expect(wrapperSpan()).not.toHaveAttribute("ngbTooltip");
      });

      it("should not disable any elements", () => {
        expect(shallowButton()).not.toHaveAttribute("disabled");
        expect(shallowInput()).not.toHaveAttribute("disabled");
        expect(nonInteractiveElement()).not.toHaveAttribute("disabled");
      });

      it("should go to a disabled state when the user logs out", () => {
        updateAuthState(false);

        expect(shallowButton()).toHaveAttribute("disabled");
        expect(shallowInput()).toHaveAttribute("disabled");
      });
    });

    describe("when the user is not logged in", () => {
      beforeEach(() => {
        setup(false);
      });

      it("should have a tooltip", () => {
        const expectedContent = "You must be logged in";
        expect(wrapperSpan()).toHaveAttribute("ng-reflect-ngb-tooltip", expectedContent);
      });

      it("should disable buttons and input elements", () => {
        expect(shallowButton()).toHaveAttribute("disabled");
        expect(shallowInput()).toHaveAttribute("disabled");
      });

      it("should go to an enabled state when the user logs in", () => {
        updateAuthState(true);

        expect(shallowButton()).not.toHaveAttribute("disabled");
        expect(shallowInput()).not.toHaveAttribute("disabled");
      });
    });
  });
});

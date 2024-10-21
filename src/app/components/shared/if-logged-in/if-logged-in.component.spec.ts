import { createHostFactory, Spectator, SpyObject } from "@ngneat/spectator";
import { BawSessionService } from "@baw-api/baw-session.service";
import { SharedModule } from "@shared/shared.module";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { MockBawApiModule } from "@baw-api/baw-apiMock.module";
import { IfLoggedInComponent } from "./if-logged-in.component";

describe("IsLoggedInComponent", () => {
  let spectator: Spectator<IfLoggedInComponent>;
  let sessionSpy: SpyObject<BawSessionService>;

  const createHost = createHostFactory({
    component: IfLoggedInComponent,
    imports: [SharedModule, HttpClientTestingModule, MockBawApiModule],
  });

  function setup(isLoggedIn: boolean) {
    const template = `
      <baw-if-logged-in>
        <p id="non-interactive-p">non-interactive element</p>

        <button id="shallow-button">Test</button>
        <input id="shallow-input" />

        <div>
          <button id="nested-button">Test</button>
          <input id="nested-input" />
        </div>
      </baw-if-logged-in>
    `;

    spectator = createHost(template, { detectChanges: false });

    sessionSpy = spectator.inject(BawSessionService);
    spyOnProperty(sessionSpy, "isLoggedIn").and.returnValue(isLoggedIn);

    spectator.detectChanges();
  }

  const wrapperSpan = () => spectator.query<HTMLSpanElement>("span");

  const nonInteractiveElement = () => spectator.query("#non-interactive-p");
  const shallowButton = () => spectator.query("#shallow-button");
  const shallowInput = () => spectator.query("#shallow-input");
  const nestedButton = () => spectator.query("#nested-button");
  const nestedInput = () => spectator.query("#nested-input");

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

    it("should not disable any button and input elements", () => {
      expect(shallowButton()).not.toHaveAttribute("disabled");
      expect(shallowInput()).not.toHaveAttribute("disabled");
      expect(nestedButton()).not.toHaveAttribute("disabled");
      expect(nestedInput()).not.toHaveAttribute("disabled");

      expect(nonInteractiveElement()).not.toHaveAttribute("disabled");
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

    it("should disable buttons and input elements", () => {
      expect(shallowButton()).toHaveAttribute("disabled");
      expect(shallowInput()).toHaveAttribute("disabled");
    });

    it("should disable nested buttons and input elements", () => {
      expect(nestedButton()).toHaveAttribute("disabled");
      expect(nestedInput()).toHaveAttribute("disabled");
    });

    it("should not disable any non-interactive elements", () => {
      expect(nonInteractiveElement()).not.toHaveAttribute("disabled");
    });
  });
});

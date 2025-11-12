import { TestBed } from "@angular/core/testing";
import { signal } from "@angular/core";
import {
  NavigationConfirmationGuard,
  WithNavigationConfirmation,
} from "./confirmation.guard";

const defaultMessage = "Are you sure you want to leave this page?";

describe("NavigationConfirmationGuard", () => {
  let guard: NavigationConfirmationGuard;

  function spyOnConfirm(confirmation: boolean) {
    spyOn(window, "confirm").and.returnValue(confirmation);
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NavigationConfirmationGuard],
    }).compileComponents();

    guard = TestBed.inject(NavigationConfirmationGuard);
  });

  it("should not navigate if the confirmation is rejected", () => {
    spyOnConfirm(false);

    const component: WithNavigationConfirmation = {
      confirmNavigation: true,
    };

    const canNavigate = guard.canDeactivate(component);

    expect(canNavigate).toBeFalse();
    expect(window.confirm).toHaveBeenCalledOnceWith(defaultMessage);
  });

  it("should use a custom confirmation message if provided", () => {
    const customMessage = "Custom confirmation message";
    spyOnConfirm(true);

    const component: WithNavigationConfirmation = {
      confirmNavigation: true,
      confirmNavigationMessage: customMessage,
    };

    const canNavigate = guard.canDeactivate(component);
    expect(canNavigate).toBeTrue();
    expect(window.confirm).toHaveBeenCalledOnceWith(customMessage);
  });

  describe("confirmNavigation", () => {
    it("should handle a component that does not have a confirmation property", () => {
      spyOnConfirm(true);

      const component: WithNavigationConfirmation = {};
      const canNavigate = guard.canDeactivate(component);

      // We expect that canNavigate is true because we spied on the confirm dialog
      // to always accept the navigation confirmation.
      expect(canNavigate).toBeTrue();
      expect(window.confirm).not.toHaveBeenCalledOnceWith(defaultMessage);
    });

    it("should handle static 'false' boolean properties", () => {
      spyOnConfirm(true);

      const component: WithNavigationConfirmation = {
        confirmNavigation: false,
      };

      const canNavigate = guard.canDeactivate(component);

      expect(canNavigate).toBeTrue();
      expect(window.confirm).not.toHaveBeenCalled();
    });

    it("should handle static 'true' boolean properties", () => {
      spyOnConfirm(true);

      const component: WithNavigationConfirmation = {
        confirmNavigation: true,
      };

      const canNavigate = guard.canDeactivate(component);

      expect(canNavigate).toBeTrue();
      expect(window.confirm).toHaveBeenCalledOnceWith(defaultMessage);
    });

    it("should handle signals that return 'false'", () => {
      spyOnConfirm(true);

      const component: WithNavigationConfirmation = {
        confirmNavigation: signal(false),
      };

      const canNavigate = guard.canDeactivate(component);

      expect(canNavigate).toBeTrue();
      expect(window.confirm).not.toHaveBeenCalled();
    });

    it("should handle signals that return 'true'", () => {
      spyOnConfirm(true);

      const component: WithNavigationConfirmation = {
        confirmNavigation: signal(true),
      };

      const canNavigate = guard.canDeactivate(component);

      expect(canNavigate).toBeTrue();
      expect(window.confirm).toHaveBeenCalled();
    });
  });
});

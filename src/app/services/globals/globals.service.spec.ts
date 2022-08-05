import { createServiceFactory, SpectatorService } from "@ngneat/spectator";
import { cacheSettings } from "@services/cache/cache-settings";
import { getCallArgs } from "@test/helpers/general";
import { GlobalsService } from "./globals.service";

describe("GlobalsService", () => {
  let consoleSpy: jasmine.Spy;
  let spec: SpectatorService<GlobalsService>;
  const createService = createServiceFactory(GlobalsService);

  function stubConsoleLogs() {
    consoleSpy = spyOn(spec.service as any, "logToConsole").and.stub();
  }

  function checkGlobalFunction(func: string) {
    expect(window["__bawWorkbenchClient"][func]).toBeTruthy();
  }

  function callGlobalFunction(func: string) {
    window["__bawWorkbenchClient"][func]();
  }

  beforeEach(() => {
    spec = createService();
  });

  describe("introduction", () => {
    it("should log introduction to developers", () => {
      stubConsoleLogs();
      spec.service.initialize();

      expect(getCallArgs(consoleSpy)[0]).toContain(
        "Some functionality of this website can be toggled from the dev tools. A list of commands and their usages can be seen below:"
      );
    });
  });

  describe("toggle cache", () => {
    beforeEach(() => {
      stubConsoleLogs();
      spec.service.initialize();
    });

    it("should list option", () => {
      expect(getCallArgs(consoleSpy)[0]).toContain(
        "- __bawWorkbenchClient.toggleCache(): This will toggle on/off caching of API requests"
      );
    });

    it("should add function to windows global", () => {
      checkGlobalFunction("toggleCache");
    });

    it("should toggle caching on", () => {
      cacheSettings.setCaching(false);
      callGlobalFunction("toggleCache");
      expect(cacheSettings.enabled).toBeTrue();
    });

    it("should toggle caching off", () => {
      cacheSettings.setCaching(true);
      callGlobalFunction("toggleCache");
      expect(cacheSettings.enabled).toBeFalse();
    });
  });

  describe("toggle cache logging", () => {
    beforeEach(() => {
      stubConsoleLogs();
      spec.service.initialize();
    });

    it("should list option", () => {
      expect(getCallArgs(consoleSpy)[0]).toContain(
        "- __bawWorkbenchClient.toggleCacheLogging(): This will toggle on/off logging when API request caching occurs"
      );
    });

    it("should add function to windows global", () => {
      checkGlobalFunction("toggleCacheLogging");
    });

    it("should toggle cache logging on", () => {
      cacheSettings.setCaching(true);
      cacheSettings.setLogging(false);
      callGlobalFunction("toggleCacheLogging");
      expect(cacheSettings.showLogging).toBeTrue();
    });

    it("should toggle cache logging off", () => {
      cacheSettings.setCaching(true);
      cacheSettings.setLogging(true);
      callGlobalFunction("toggleCacheLogging");
      expect(cacheSettings.showLogging).toBeFalse();
    });
  });
});

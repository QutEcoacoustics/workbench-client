import { createServiceFactory, SpectatorService } from "@ngneat/spectator";
import { CacheSettings, CACHE_SETTINGS } from "@services/cache/cache-settings";
import { getCallArgs } from "@test/helpers/general";
import { provideCaching } from "@services/cache/provide-caching";
import { GlobalsService } from "./globals.service";

describe("GlobalsService", () => {
  let consoleSpy: jasmine.Spy;
  let cacheSettings: CacheSettings;
  let spec: SpectatorService<GlobalsService>;

  const createService = createServiceFactory({
    service: GlobalsService,
    providers: [provideCaching()],
  });

  function stubConsoleLogs() {
    consoleSpy = spyOn(spec.service as any, "logToConsole").and.stub();
  }

  function callGlobalGetterFunction(func: string): any {
    return window["__bawWorkbenchClient"][func];
  }

  function callGlobalSetterFunction(func: string, value: any) {
    window["__bawWorkbenchClient"][func] = value;
  }

  beforeEach(() => {
    spec = createService();
    cacheSettings = spec.inject(CACHE_SETTINGS);
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

  describe("cache", () => {
    const funcName = "cacheEnabled";

    beforeEach(() => {
      stubConsoleLogs();
      spec.service.initialize();
    });

    it("should list option", () => {
      expect(getCallArgs(consoleSpy)[0]).toContain(
        `- __bawWorkbenchClient.${funcName}:`
      );
    });

    it("should turn caching on", () => {
      cacheSettings.setCaching(false);
      callGlobalSetterFunction(funcName, true);
      expect(cacheSettings.enabled).toBeTrue();
    });

    it("should turn caching off", () => {
      cacheSettings.setCaching(true);
      callGlobalSetterFunction(funcName, false);
      expect(cacheSettings.enabled).toBeFalse();
    });

    it("should return state of cache", () => {
      cacheSettings.setCaching(true);
      expect(callGlobalGetterFunction(funcName)).toBeTrue();
      cacheSettings.setCaching(false);
      expect(callGlobalGetterFunction(funcName)).toBeFalse();
    });
  });

  describe("cache logging", () => {
    const funcName = "cacheLoggingEnabled";

    beforeEach(() => {
      cacheSettings.setCaching(true);
      stubConsoleLogs();
      spec.service.initialize();
    });

    it("should list option", () => {
      expect(getCallArgs(consoleSpy)[0]).toContain(
        `- __bawWorkbenchClient.${funcName}:`
      );
    });

    it("should turn cache logging on", () => {
      cacheSettings.setLogging(false);
      callGlobalSetterFunction(funcName, true);
      expect(cacheSettings.showLogging).toBeTrue();
    });

    it("should turn cache logging off", () => {
      cacheSettings.setLogging(true);
      callGlobalSetterFunction(funcName, false);
      expect(cacheSettings.showLogging).toBeFalse();
    });
  });
});

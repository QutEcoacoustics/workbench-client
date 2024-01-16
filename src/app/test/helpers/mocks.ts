import { Settings } from "luxon";

/**
 * @description
 * Runs a test with in a fake timezone.
 *
 * @param zone The timezone to run the test in
 * @param test A callback that contains the tests to be run
 */
export function withDefaultZone(zone: string, test: () => void) {
  describe(`With default zone: ${zone}`, () => {
    const originalZone = Settings.defaultZone;

    Settings.defaultZone = zone;

    beforeEach(() => {
      Settings.defaultZone = zone;
    });

    afterEach(() => {
      Settings.defaultZone = originalZone;
    });

    test.call(this);
  });
}

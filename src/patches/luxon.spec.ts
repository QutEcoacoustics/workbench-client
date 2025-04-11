import { Duration, DurationLikeObject } from "luxon";

function test(
  input: string | Duration,
  output: string | Duration,
  expectedLuxonOutput: string | Duration,
  format?: string,
): any {
  return { input, output, expectedLuxonOutput, format };
}

function duration(durationObject: DurationLikeObject): Duration {
  return Duration.fromObject(durationObject);
}

//! These tests will fail if Luxon issue https://github.com/moment/luxon/issues/415 is fixed
describe("Luxon Duration Monkey Patches", () => {
  const target = Duration;
  const patchedMethods = ["toISO", "toFormat"] as const;

  describe("monkey patch changes", () => {
    for (const method of patchedMethods) {
      const patchedMethod = target.prototype[method] as () => any;
      const originalMethod = target.prototype[`_${method}`] as () => any;

      it(`should patch ${method}`, () => {
        expect(patchedMethod).not.toBe(originalMethod);
      });
    }
  });

  describe("toFormat", () => {
    // prettier-ignore
    /* eslint-disable max-len */
    const tests = [
      test(duration({ minutes: -10, seconds: -1, milliseconds: -500 }), "-10:01.500", "-10:-01.-500", "mm:ss.SS"),
      test(duration({ minutes: 10, seconds: 1, milliseconds: 500 }), "10:01.500", "10:01.500", "mm:ss.SS"),
      test(duration({ minutes: -10, seconds: 1, milliseconds: 500 }), "-09:58.500", "-09:-58.-500", "mm:ss.SS"),
      test(duration({ minutes: 10, seconds: -1, milliseconds: -500 }), "09:58.500", "09:58.500", "mm:ss.SS"),
      test(duration({ years: 4, months: 2, days: 10, hours: 2, minutes: 6, seconds: 5, milliseconds: 500 }), "0004-02-10 02:06:05.500", "0004-02-10 02:06:05.500", "yyyy-MM-dd hh:mm:ss.SSS"),
      test(duration({ years: -4, months: -2, days: -10, hours: -2, minutes: -6, seconds: -5, milliseconds: -500 }), "-0004-02-10 02:06:05.500", "-0004--02--10 -02:-06:-05.-500", "yyyy-MM-dd hh:mm:ss.SSS"),
    ];
    /* eslint-enable max-len */

    // we assert both the expected new output and previous output so that the tests will fail if Luxon changes their implementation
    for (const { input, output, expectedLuxonOutput, format } of tests) {
      it(`should create ${output} correctly from format ${format}`, () => {
        expect(input.toFormat(format)).toEqual(output);
      });

      it("should have the expected luxon output", () => {
        expect(input["_toFormat"](format)).toEqual(expectedLuxonOutput);
      });
    }
  });

  describe("toISO", () => {
    // prettier-ignore
    /* eslint-disable max-len */
    const tests = [
      test(duration({ minutes: -10, seconds: -1, milliseconds: -500 }), "-PT10M1.5S", "PT-10M-1.5S"),
      test(duration({ minutes: 10, seconds: 1, milliseconds: 500 }), "PT10M1.5S", "PT10M1.5S"),
      test(duration({ minutes: -10, seconds: 1, milliseconds: 500 }), "-PT9M58.5S", "PT-10M1.5S"),
      test(duration({ minutes: 10, seconds: -1, milliseconds: -500 }), "PT9M58.5S", "PT10M-1.5S"),
      test(duration({ years: 4, months: 2, days: 10, hours: 2, minutes: 6, seconds: 5, milliseconds: 500 }), "P4Y2M1W3DT2H6M5.5S", "P4Y2M10DT2H6M5.5S"),
      test(duration({ years: -4, months: -2, days: -10, hours: -2, minutes: -6, seconds: -5, milliseconds: -500 }), "-P4Y2M1W3DT2H6M5.5S", "P-4Y-2M-10DT-2H-6M-5.5S"),
    ];
    /* eslint-enable max-len */

    for (const { input, expectedLuxonOutput, output } of tests) {
      it(`should create ${output} correctly from duration`, () => {
        expect(input.toISO()).toEqual(output);
      });

      it("should have the expected luxon output", () => {
        expect(input["_toISO"]()).toEqual(expectedLuxonOutput);
      });
    }
  });

  describe("fromISO", () => {
    // prettier-ignore
    /* eslint-disable max-len */
    const tests = [
      test("-PT10M1.5S", duration({ minutes: -10, seconds: -1, milliseconds: -500 }), duration({ minutes: -10, seconds: -1, milliseconds: -500 })),
      test("PT10M1.5S", duration({ minutes: 10, seconds: 1, milliseconds: 500 }), duration({ minutes: 10, seconds: 1, milliseconds: 500 })),
      test("PT-10M-1.5S", duration({ minutes: -10, seconds: -1, milliseconds: -500 }), duration({ minutes: -10, seconds: -1, milliseconds: -500 })),
      test("PT-10M1.5S", duration({ minutes: -10, seconds: 1, milliseconds: 500 }), duration({ minutes: -10, seconds: 1, milliseconds: 500 })),
      test("PT10M-1.5S", duration({ minutes: 10, seconds: -1, milliseconds: -500 }), duration({ minutes: 10, seconds: -1, milliseconds: -500 })),
      test("P4Y2M10DT2H6M5.5S", duration({ years: 4, months: 2, days: 10, hours: 2, minutes: 6, seconds: 5, milliseconds: 500 }), duration({ years: 4, months: 2, days: 10, hours: 2, minutes: 6, seconds: 5, milliseconds: 500 })),
      test("-P4Y2M10DT2H6M5.5S", duration({ years: -4, months: -2, days: -10, hours: -2, minutes: -6, seconds: -5, milliseconds: -500 }), duration({ years: -4, months: -2, days: -10, hours: -2, minutes: -6, seconds: -5, milliseconds: -500 })),
    ];
    /* eslint-enable max-len */

    for (const { input, expectedLuxonOutput, output } of tests) {
      it(`should parse ${input} correctly`, () => {
        expect(Duration.fromISO(input)).toEqual(output);
      });

      it("should have the expected luxon output", () => {
        expect(Duration["_fromISO"](input)).toEqual(expectedLuxonOutput);
      });
    }
  });
});

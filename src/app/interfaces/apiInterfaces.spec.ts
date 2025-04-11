import { modelData } from "@test/helpers/faker";
import { Duration } from "luxon";
import {
  PermissionLevel,
  hasRequiredAccessLevelOrHigher,
  ImageSizes,
  ImageUrl,
  isImageUrl,
  toRelative,
} from "./apiInterfaces";

describe("hasRequiredAccessLevelOrHigher", () => {
  const { owner, writer, reader, unresolved, unknown } = PermissionLevel;

  [
    { required: owner, current: owner, expected: true },
    { required: owner, current: writer, expected: false },
    { required: owner, current: reader, expected: false },
    { required: owner, current: unresolved, expected: false },
    { required: owner, current: unknown, expected: false },
    { required: writer, current: owner, expected: true },
    { required: writer, current: writer, expected: true },
    { required: writer, current: reader, expected: false },
    { required: writer, current: unresolved, expected: false },
    { required: writer, current: unknown, expected: false },
    { required: reader, current: owner, expected: true },
    { required: reader, current: writer, expected: true },
    { required: reader, current: reader, expected: true },
    { required: reader, current: unresolved, expected: false },
    { required: reader, current: unknown, expected: false },
  ].forEach(({ required, current, expected }) => {
    describe(`when ${required} access level is required`, () => {
      describe(`and ${current} access level is given`, () => {
        it(`should return ${expected}`, () => {
          expect(hasRequiredAccessLevelOrHigher(required, current)).toBe(
            expected
          );
        });
      });
    });
  });

  [unknown, unresolved, null, undefined].forEach((required) => {
    describe(`${required} access level`, () => {
      [owner, writer, reader, null, undefined].forEach((current) => {
        it(`should return false when ${current} access level is given`, () => {
          expect(hasRequiredAccessLevelOrHigher(unresolved, current)).toBe(
            false
          );
        });
      });
    });
  });
});

describe("toRelative", () => {
  [
    {
      test: "Should return a relative time with no options",
      input: Duration.fromObject({ seconds: 10 }),
      options: {},
      expected: "10 seconds",
    },
    {
      test: "Should return a relative time with no options",
      input: Duration.fromObject({ minutes: 2, seconds: 10 }),
      options: { units: ["s"] as any },
      expected: "130 seconds",
    },
  ].forEach(({ test, input, options, expected }) => {
    it(test, () => {
      expect(toRelative(input, options)).toBe(expected);
    });
  });
});

describe("isImageUrl", () => {
  [
    { test: "undefined", value: undefined, output: false },
    { test: "null", value: null, output: false },
    {
      test: "image url without height or width",
      value: {
        size: ImageSizes.default,
        url: modelData.imageUrl(),
      } as ImageUrl,
      output: true,
    },
    {
      test: "image url with height of 0",
      value: {
        size: ImageSizes.default,
        url: modelData.imageUrl(),
        height: 0,
      } as ImageUrl,
      output: true,
    },
    {
      test: "image url with height",
      value: {
        size: ImageSizes.default,
        url: modelData.imageUrl(),
        height: modelData.datatype.number(),
      } as ImageUrl,
      output: true,
    },
    {
      test: "image url with width of 0",
      value: {
        size: ImageSizes.default,
        url: modelData.imageUrl(),
        width: 0,
      } as ImageUrl,
      output: true,
    },
    {
      test: "image url with width",
      value: {
        size: ImageSizes.default,
        url: modelData.imageUrl(),
        width: modelData.datatype.number(),
      } as ImageUrl,
      output: true,
    },
    {
      test: "image url with height and width",
      value: {
        size: ImageSizes.default,
        url: modelData.imageUrl(),
        height: modelData.datatype.number(),
        width: modelData.datatype.number(),
      } as ImageUrl,
      output: true,
    },
  ].forEach(({ test, value, output }) => {
    it(`should return ${output} if ${test}`, () => {
      expect(isImageUrl(value)).toBe(output);
    });
  });
});

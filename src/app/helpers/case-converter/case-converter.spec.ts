/* eslint-disable @typescript-eslint/naming-convention */
import { toCamelCase, toSnakeCase } from "./case-converter";

const conversionCallbacks = [
  {
    name: "to camelCase",
    callback: toCamelCase,
    fieldOne: "fieldOne",
    fieldTwo: "fieldTwo",
    allowListKey: "allowListKey",
    allowListValue: "contentOne",
  },
  {
    name: "to snake_case",
    callback: toSnakeCase,
    fieldOne: "field_one",
    fieldTwo: "field_two",
    allowListKey: "allow_list_key",
    allowListValue: "content_one",
  },
];

conversionCallbacks.forEach((test) => {
  const fieldOne = test.fieldOne;
  const fieldTwo = test.fieldTwo;
  const allowedKey = test.allowListKey;
  const allowedValues = test.allowListValue;

  describe(test.name, () => {
    it("simple objects", () => {
      const before = { field_one: "content one", "field-two": "content two" };
      const expected = { [fieldOne]: "content one", [fieldTwo]: "content two" };
      const result = test.callback(before);
      expect(expected).toEqual(result);
    });

    it("nested objects", () => {
      const before = {
        field_one: {
          field_one: "content one",
          field_two: "content two",
        },
        field_two: {
          "field-one": "content one",
          "field-two": "content two",
        },
      };
      const expected = {
        [fieldOne]: {
          [fieldOne]: "content one",
          [fieldTwo]: "content two",
        },
        [fieldTwo]: {
          [fieldOne]: "content one",
          [fieldTwo]: "content two",
        },
      };
      const result = test.callback(before);
      expect(expected).toEqual(result);
    });

    it("objects in arrays", () => {
      const before = [
        {
          field_one: "content one one",
          field_two: "content two two",
        },
        {
          "field-one": "content two one",
          "field-two": "content two two",
        },
      ];
      const expected = [
        { [fieldOne]: "content one one", [fieldTwo]: "content two two" },
        { [fieldOne]: "content two one", [fieldTwo]: "content two two" },
      ];
      const result = test.callback(before);
      expect(expected).toEqual(result);
    });

    it("objects in arrays in arrays", () => {
      const before = [
        [
          {
            field_one: "content one one",
            field_two: "content two two",
          },
        ],
        [
          {
            "field-one": "content two one",
            "field-two": "content two two",
          },
        ],
      ];
      const expected = [
        [{ [fieldOne]: "content one one", [fieldTwo]: "content two two" }],
        [{ [fieldOne]: "content two one", [fieldTwo]: "content two two" }],
      ];
      const result = test.callback(before);
      expect(expected).toEqual(result);
    });

    it("objects in arrays in objects", () => {
      const before = {
        field_one: [
          {
            field_one: "content one one",
            field_two: "content two two",
          },
          {
            "field-one": "content two one",
            "field-two": "content two two",
          },
        ],
      };
      const expected = {
        [fieldOne]: [
          { [fieldOne]: "content one one", [fieldTwo]: "content two two" },
          { [fieldOne]: "content two one", [fieldTwo]: "content two two" },
        ],
      };
      const result = test.callback(before);
      expect(expected).toEqual(result);
    });

    it("undefined and null object", () => {
      const before = { field_one: undefined, field_two: null };
      const expected = { [fieldOne]: undefined, [fieldTwo]: null };
      const result = test.callback(before);
      expect(expected).toEqual(result);
    });

    it("should not convert .'s", () => {
      const before = {
        ["field_one.field_two"]: "content one",
        ["field-two.field-one"]: "content two",
      };
      const expected = {
        [`${fieldOne}.${fieldTwo}`]: "content one",
        [`${fieldTwo}.${fieldOne}`]: "content two",
      };
      const result = test.callback(before);
      expect(expected).toEqual(result);
    });

    // TODO Add checking for allowed key after conversion
    describe("allowlist", () => {
      it("should convert allowed value", () => {
        const before = { ["allow-list-key"]: "content one" };
        const expected = { [allowedKey]: allowedValues };
        const result = test.callback(before);
        expect(expected).toEqual(result);
      });

      it("should convert allow-listed value object", () => {
        const before = { ["allow-list-key"]: { field_one: "content one" } };
        const expected = { [allowedKey]: { [fieldOne]: allowedValues } };
        const result = test.callback(before);
        expect(expected).toEqual(result);
      });

      it("should convert allowed value array", () => {
        const before = { ["allow-list-key"]: ["content one"] };
        const expected = { [allowedKey]: [allowedValues] };
        const result = test.callback(before);
        expect(expected).toEqual(result);
      });
    });
  });
});

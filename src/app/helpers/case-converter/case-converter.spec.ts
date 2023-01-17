/* eslint-disable @typescript-eslint/naming-convention */
import { toCamelCase, toSnakeCase } from "./case-converter";

interface IConversionCallback {
  name: string;
  callback: (obj: any) => any;
  fieldOne: string;
  fieldTwo: string;
  allowListKey: string;
  allowListValue: string;
}

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

conversionCallbacks.forEach((test: IConversionCallback) => {
  const fieldOne = test.fieldOne;
  const fieldTwo = test.fieldTwo;
  const allowedKey = test.allowListKey;
  const allowedValues = test.allowListValue;

  describe(test.name, () => {
    // this test asserts that an object without a toJSON implementation is correctly case-converted and simplified
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

    it("should be idempotent", () => {
      const before = { field_one: "content one", field_two: "content two" };
      const expected = { [fieldOne]: "content one", [fieldTwo]: "content two" };

      const processedBefore = test.callback(test.callback(before));
      const result = test.callback(test.callback(processedBefore));

      expect(result).toEqual(expected);
    });

    it("should call toJSON on simple objects that implement toJSON", () => {
    const before = {
        field_one: "content one",
        "field-two": "content two",
        toJSON: () => "toJsonResult",
      };
      const expected = "toJsonResult";

      const result = test.callback(before);
      expect(result).toEqual(expected);
    });

    it("should call toJSON on simple objects that implement toJSON in their prototypes", () => {
      const before = {
        field_one: "content one",
        "field-two": "content two",
      };
      const expected = "toJsonResult";

      Object.setPrototypeOf(before, {
        toJSON: () => expected,
      });

      const result = test.callback(before);
      expect(result).toEqual(expected);
    });

    it("should only call toJSON on nested objects that implement toJSON", () => {
      const before = {
        field_one: {
          "field-one": "content one",
          field_two: "content two",
        },
        field_two: {
          field_one: "content one",
          "field-two": "content two",
          toJSON: () => "toJsonResult",
        },
      };
      const expected = {
        [fieldOne]: {
          [fieldOne]: "content one",
          [fieldTwo]: "content two",
        },
        [fieldTwo]: "toJsonResult",
      };

      const result = test.callback(before);
      expect(result).toEqual(expected);
    });

    it("should simplify to to the highest level object in a composed object structure that implements toJSON", () => {
      const before = {
        field_one: {
          "field-one": "content one",
          field_two: {
            "field-one": "content one",
            field_two: "content two",
            toJSON: () => "this method should not be called",
          },
          toJSON: () => "toJsonResult",
        },
        field_two: {
          field_one: "content one",
          "field-two": "content two",
        },
      };

      const expected = {
        [fieldOne]: "toJsonResult",
        [fieldTwo]: {
          [fieldOne]: "content one",
          [fieldTwo]: "content two",
        },
      };

      const result = test.callback(before);
      expect(result).toEqual(expected);
    });

    it("should only call toJSON on array objects that implement toJSON", () => {
      const before = [
        {
          field_one: "content one one",
          field_two: "content two two",
        },
        {
          "field-one": "content two one",
          "field-two": "content two two",
          toJSON: () => "toJsonResult",
        },
      ];
      const expected = [
        { [fieldOne]: "content one one", [fieldTwo]: "content two two" },
        "toJsonResult",
      ];

      const result = test.callback(before);
      expect(expected).toEqual(result);
    });

    it("should only call toJSON on objects in multi-dimensional arrays that implement toJSON", () => {
      const before = [
        [
          {
            field_one: "content one one",
            field_two: "content two two",
            toJSON: () => "toJsonResult",
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
        ["toJsonResult"],
        [{ [fieldOne]: "content two one", [fieldTwo]: "content two two" }],
      ];

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

      it("should call toJSON before converting allowed value objects", () => {
        // the content one and content two fields should be converted to the correct casing however, because toJSON should be called
        // on the "allow-list-key" values first, the content one and content two fields should not exist, and only emit to toJson string
        const before = {
          ["allow-list-key"]: {
            firstName: "content one",
            lastName: "content two",
            toJSON: () => allowedValues,
          },
        };
        const expected = { [allowedKey]: allowedValues };

        const result = test.callback(before);
        expect(result).toEqual(expected);
      });
    });
  });
});

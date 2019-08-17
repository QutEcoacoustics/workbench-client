import { toCamelCase, toSnakeCase } from "./case-converter";

/**
 * Tests are developed here: https://github.com/travelperk/case-converter
 * @author travelperk
 * @copyright MIT
 */

describe("to camelCase", () => {
  it("simple objects", () => {
    const before = { field_one: "content one", "field-two": "content two" };
    const expected = { fieldOne: "content one", fieldTwo: "content two" };
    const result = toCamelCase(before);
    expect(expected).toEqual(result);
  });

  it("nested objects", () => {
    const before = {
      field_one: {
        nested_field_one: "content one",
        nested_field_two: "content two"
      },
      field_two: {
        "nested-field-one": "content one",
        "nested-field-two": "content two"
      }
    };
    const expected = {
      fieldOne: {
        nestedFieldOne: "content one",
        nestedFieldTwo: "content two"
      },
      fieldTwo: { nestedFieldOne: "content one", nestedFieldTwo: "content two" }
    };
    const result = toCamelCase(before);
    expect(expected).toEqual(result);
  });

  it("objects in arrays", () => {
    const before = [
      { field_one_one: "content one one", field_one_two: "content two two" },
      { "field-two-one": "content two one", "field-two-two": "content two two" }
    ];
    const expected = [
      { fieldOneOne: "content one one", fieldOneTwo: "content two two" },
      { fieldTwoOne: "content two one", fieldTwoTwo: "content two two" }
    ];
    const result = toCamelCase(before);
    expect(expected).toEqual(result);
  });

  it("objects in arrays in arrays", () => {
    const before = [
      [{ field_one_one: "content one one", field_one_two: "content two two" }],
      [
        {
          "field-two-one": "content two one",
          "field-two-two": "content two two"
        }
      ]
    ];
    const expected = [
      [{ fieldOneOne: "content one one", fieldOneTwo: "content two two" }],
      [{ fieldTwoOne: "content two one", fieldTwoTwo: "content two two" }]
    ];
    const result = toCamelCase(before);
    expect(expected).toEqual(result);
  });

  it("objects in arrays in objects", () => {
    const before = {
      an_array: [
        { field_one_one: "content one one", field_one_two: "content two two" },
        {
          "field-two-one": "content two one",
          "field-two-two": "content two two"
        }
      ]
    };
    const expected = {
      anArray: [
        { fieldOneOne: "content one one", fieldOneTwo: "content two two" },
        { fieldTwoOne: "content two one", fieldTwoTwo: "content two two" }
      ]
    };
    const result = toCamelCase(before);
    expect(expected).toEqual(result);
  });

  it("undefined and null object", () => {
    const before = {
      an_array: [
        { field_one_one: "content one one", field_one_two: "content two two" },
        {
          "field-two-one": "content two one",
          "field-two-two": "content two two"
        }
      ]
    };
    const expected = {
      anArray: [
        { fieldOneOne: "content one one", fieldOneTwo: "content two two" },
        { fieldTwoOne: "content two one", fieldTwoTwo: "content two two" }
      ]
    };
    const result = toCamelCase(before);
    expect(expected).toEqual(result);
  });

  it("objects containing dates", () => {
    const date = new Date();
    const before = { a_date: date };
    const expected = { aDate: date };
    const result = toCamelCase(before);
    expect(result.aDate instanceof Date).toBe(true);
    expect(expected).toEqual(result);
  });
});

describe("to snake_case", () => {
  it("simple objects", () => {
    const before = { fieldOne: "content one", "field-two": "content two" };
    const expected = { field_one: "content one", field_two: "content two" };
    const result = toSnakeCase(before);
    expect(expected).toEqual(result);
  });

  it("nested objects", () => {
    const before = {
      fieldOne: {
        nestedFieldOne: "content one",
        nestedFieldTwo: "content two"
      },
      fieldTwo: {
        "nested-field-one": "content one",
        "nested-field-two": "content two"
      }
    };
    const expected = {
      field_one: {
        nested_field_one: "content one",
        nested_field_two: "content two"
      },
      field_two: {
        nested_field_one: "content one",
        nested_field_two: "content two"
      }
    };
    const result = toSnakeCase(before);
    expect(expected).toEqual(result);
  });

  it("objects in arrays", () => {
    const before = [
      { fieldOneOne: "content one one", fieldOneTwo: "content two two" },
      { "field-two-one": "content two one", "field-two-two": "content two two" }
    ];
    const expected = [
      { field_one_one: "content one one", field_one_two: "content two two" },
      { field_two_one: "content two one", field_two_two: "content two two" }
    ];
    const result = toSnakeCase(before);
    expect(expected).toEqual(result);
  });

  it("objects in arrays in arrays", () => {
    const before = [
      [{ fieldOneOne: "content one one", fieldOneTwo: "content two two" }],
      [
        {
          "field-two-one": "content two one",
          "field-two-two": "content two two"
        }
      ]
    ];
    const expected = [
      [{ field_one_one: "content one one", field_one_two: "content two two" }],
      [{ field_two_one: "content two one", field_two_two: "content two two" }]
    ];
    const result = toSnakeCase(before);
    expect(expected).toEqual(result);
  });

  it("objects in arrays in objects", () => {
    const before = {
      anArray: [
        { fieldOneOne: "content one one", fieldOneTwo: "content two two" },
        {
          "field-two-one": "content two one",
          "field-two-two": "content two two"
        }
      ]
    };
    const expected = {
      an_array: [
        { field_one_one: "content one one", field_one_two: "content two two" },
        { field_two_one: "content two one", field_two_two: "content two two" }
      ]
    };
    const result = toSnakeCase(before);
    expect(expected).toEqual(result);
  });

  it("objects containing dates", () => {
    const date = new Date();
    const before = { aDate: date };
    const expected = { a_date: date };
    const result = toSnakeCase(before);
    expect(result.a_date instanceof Date).toBe(true);
    expect(expected).toEqual(result);
  });
});

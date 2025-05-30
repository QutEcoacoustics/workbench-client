import { Params } from "@angular/router";
import {
  IQueryStringParameterSpec,
  deserializeParamsToObject,
  jsBoolean,
  jsNumber,
  jsNumberArray,
  jsString,
  luxonDuration,
  luxonDurationArray,
  serializeObjectToParams,
} from "./queryStringParameters";

describe("queryStringParameters", () => {
  describe("serialization", () => {
    it("should return an empty params object when serializing an empty object", () => {
      const testInput = {};
      const expectedOutput: Params = {};
      const testSpec: IQueryStringParameterSpec = {};

      const result = serializeObjectToParams(testInput, testSpec);

      expect(result).toEqual(expectedOutput);
    });

    it("should return an empty params object when serializing an undefined value", () => {
      const testInput = undefined;
      const expectedOutput: Params = {};
      const testSpec: IQueryStringParameterSpec = {};

      const result = serializeObjectToParams(testInput, testSpec);

      expect(result).toEqual(expectedOutput);
    });

    it("should return an empty params object when serializing a null value", () => {
      const testInput = null;
      const expectedOutput: Params = {};
      const testSpec: IQueryStringParameterSpec = {};

      const result = serializeObjectToParams(testInput, testSpec);

      expect(result).toEqual(expectedOutput);
    });

    it("should only serialize keys that are in the spec", () => {
      const testInput = { test: 42, doNotSerialize: false };
      const expectedOutput: Params = { test: "42" };

      const testSpec: IQueryStringParameterSpec = {
        test: jsNumber,
      };

      const result = serializeObjectToParams(testInput, testSpec);

      expect(result).toEqual(expectedOutput);
    });

    it("should return an empty params object when serializing an object with no key-value pairs in the spec", () => {
      const testInput = { test: "test" };
      const expectedOutput: Params = {};
      const testSpec: IQueryStringParameterSpec = {};

      const result = serializeObjectToParams(testInput, testSpec);

      expect(result).toEqual(expectedOutput);
    });

    it("should be able to serialize an object to a params object", () => {
      const testInput = {
        test: "test",
        isDaylightSavings: false,
        siteIds: [1, 2, 3, 4, 5],
      };
      const expectedOutput: Params = {
        test: "test",
        isDaylightSavings: "false",
        siteIds: "1,2,3,4,5",
      };

      const testSpec: IQueryStringParameterSpec = {
        test: jsString,
        isDaylightSavings: jsBoolean,
        siteIds: jsNumberArray,
      };

      const result = serializeObjectToParams(testInput, testSpec);

      expect(result).toEqual(expectedOutput);
    });

    it("should not serialize keys which have a null value", () => {
      const testInput = { test: "test", doNotSerialize: null };
      const expectedOutput: Params = { test: "test" };

      const testSpec: IQueryStringParameterSpec = {
        test: jsString,
        doNotSerialize: jsString,
      };

      const result = serializeObjectToParams(testInput, testSpec);

      expect(result).toEqual(expectedOutput);
    });

    it("should not serialize keys which have an undefined value", () => {
      const testInput = {
        testing: "test",
        time: undefined,
        fakeKey: 42,
        daylightSavings: true,
      };
      const expectedOutput: Params = {
        testing: "test",
        fakeKey: "42",
        daylightSavings: "true",
      };

      const testSpec: IQueryStringParameterSpec = {
        testing: jsString,
        time: luxonDuration,
        fakeKey: jsNumber,
        daylightSavings: jsBoolean,
      };

      const result = serializeObjectToParams(testInput, testSpec);

      expect(result).toEqual(expectedOutput);
    });
  });

  describe("deserialization", () => {
    it("should return an empty object when deserializing an empty params object", () => {
      const testInput: Params = {};
      const expectedOutput = {};
      const testSpec: IQueryStringParameterSpec = {};

      const result = deserializeParamsToObject(testInput, testSpec);

      expect(result).toEqual(expectedOutput);
    });

    it("should return an empty object when deserializing a null value", () => {
      const testInput: Params = null;
      const expectedOutput = {};
      const testSpec: IQueryStringParameterSpec = {};

      const result = deserializeParamsToObject(testInput, testSpec);

      expect(result).toEqual(expectedOutput);
    });

    it("should return an empty object when deserializing an undefined value", () => {
      const testInput: Params = undefined;
      const expectedOutput = {};
      const testSpec: IQueryStringParameterSpec = {};

      const result = deserializeParamsToObject(testInput, testSpec);

      expect(result).toEqual(expectedOutput);
    });

    it("should only serialize the keys in the spec", () => {
      const testInput: Params = { test: "51", doNotSerialize: "false" };
      const expectedOutput = { test: 51 };

      const testSpec: IQueryStringParameterSpec = {
        test: jsNumber,
      };

      const result = deserializeParamsToObject(testInput, testSpec);

      expect(result).toEqual(expectedOutput);
    });

    it("should return an empty object when deserializing an params with no key-value pairs in the spec", () => {
      const testInput: Params = { test: "test" };
      const expectedOutput = {};
      const testSpec: IQueryStringParameterSpec = {};

      const result = deserializeParamsToObject(testInput, testSpec);

      expect(result).toEqual(expectedOutput);
    });

    it("should be able to deserialize a params object an object data model", () => {
      const testInput: Params = {
        test: "test",
        isDaylightSavings: "false",
        siteIds: "1,2,3,4,5",
      };

      const expectedOutput = {
        test: "test",
        isDaylightSavings: false,
        siteIds: [1, 2, 3, 4, 5],
      };

      const testSpec: IQueryStringParameterSpec = {
        test: jsString,
        isDaylightSavings: jsBoolean,
        siteIds: jsNumberArray,
      };

      const result = deserializeParamsToObject(testInput, testSpec);

      expect(result).toEqual(expectedOutput);
    });

    it("should emit null values in an array when deserializing a params duration object array", () => {
      const testSpec: IQueryStringParameterSpec = {
        time: luxonDurationArray,
      };

      const testInput: Params = {
        time: ",12:12",
      };

      const result = deserializeParamsToObject(testInput, testSpec);

      expect(result["time"][0]).toBeNull();
      expect(result["time"][1].toFormat("hh:mm")).toEqual("12:12");
    });

    it("should emit null values if a number param is not a number", () => {
      const testSpec: IQueryStringParameterSpec = {
        badId: jsNumber,
      };

      const testInput: Params = {
        badId: "this is not a number",
      };

      const result = deserializeParamsToObject(testInput, testSpec);
      expect(result["badId"]).toBeNull();
    });
  });
});

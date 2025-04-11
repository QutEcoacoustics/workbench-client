import { generateApiErrorDetails } from "@test/fakes/ApiErrorDetails";
import { generateBawApiError } from "@test/fakes/BawApiError";
import { UNAUTHORIZED, UNPROCESSABLE_ENTITY } from "http-status";
import { ApiErrorDetails, BawApiError, isApiErrorDetails, isBawApiError } from "./baw-api-error";

describe("BawApiError", () => {
  it("should be called BawApiError", () => {
    const error = generateBawApiError();
    expect(error.name).toBe("BawApiError");
  });

  it("should return info", () => {
    const info = { name: ["Duplicate name for entity"] };
    const error = new BawApiError(UNPROCESSABLE_ENTITY, "Unprocessable Entity", null, info);
    expect(error.info).toEqual(info);
  });

  describe("message", () => {
    it("should return message", () => {
      const error = new BawApiError(UNAUTHORIZED, "Unauthorized Access", null);
      expect(error.message).toEqual("Unauthorized Access");
    });

    it("should return message with info with one value", () => {
      const info = { name: ["Duplicate name for entity"] };
      const error = new BawApiError(UNPROCESSABLE_ENTITY, "Unprocessable Entity", null, info);
      expect(error.message).toEqual("Unprocessable Entity: [name: Duplicate name for entity]");
    });

    it("should return message with info with multiple values", () => {
      const info = {
        name: ["Duplicate name for entity", "Invalid name value"],
      };
      const error = new BawApiError(UNPROCESSABLE_ENTITY, "Unprocessable Entity", null, info);
      expect(error.message).toEqual('Unprocessable Entity: [name: ["Duplicate name for entity","Invalid name value"]]');
    });
  });

  describe("formattedMessage", () => {
    it("should return error message", () => {
      const error = new BawApiError(UNAUTHORIZED, "Unauthorized Access", null);
      expect(error.formattedMessage("___")).toBe("Unauthorized Access");
    });

    it("should return message with info with one value", () => {
      const info = { name: ["Duplicate name for entity"] };
      const error = new BawApiError(UNPROCESSABLE_ENTITY, "Unprocessable Entity", null, info);
      expect(error.formattedMessage("___")).toEqual("Unprocessable Entity___name: Duplicate name for entity");
    });

    it("should return message with info with multiple values", () => {
      const info = {
        name: ["Duplicate name for entity", "Invalid name value"],
      };
      const error = new BawApiError(UNPROCESSABLE_ENTITY, "Unprocessable Entity", null, info);
      expect(error.formattedMessage("___")).toEqual(
        'Unprocessable Entity___name: ["Duplicate name for entity","Invalid name value"]',
      );
    });
  });
});

describe("isBawApiError", () => {
  it("should return true for bawApiError", () => {
    const error = new BawApiError(UNAUTHORIZED, "Unauthorized Access", null);
    expect(isBawApiError(error)).toBeTrue();
  });

  it("should return true for bawApiError with info", () => {
    const error = new BawApiError(UNPROCESSABLE_ENTITY, "Unprocessable Entity", null, {
      name: ["Duplicate name for entity"],
    });
    expect(isBawApiError(error)).toBeTrue();
  });

  it("should return false for Error", () => {
    const error = new Error("Unauthorized Access");
    expect(isBawApiError(error)).toBeFalse();
  });

  it("should return false for ApiErrorDetails", () => {
    const error = generateApiErrorDetails();
    expect(isBawApiError(error)).toBeFalse();
  });

  it("should return false for random object", () => {
    const error = { random: "value" };
    expect(isBawApiError(error)).toBeFalse();
  });
});

describe("isApiErrorDetails", () => {
  it("should return true for ApiErrorDetails", () => {
    const error = {
      status: UNAUTHORIZED,
      message: "Unauthorized Access",
    } satisfies ApiErrorDetails;
    expect(isApiErrorDetails(error)).toBeTrue();
  });

  it("should return true for ApiErrorDetails with info", () => {
    const error = {
      status: UNPROCESSABLE_ENTITY,
      message: "Unprocessable Entity",
      info: { name: ["Duplicate name for entity"] },
    } satisfies ApiErrorDetails;
    expect(isApiErrorDetails(error)).toBeTrue();
  });

  it("should return false for random object", () => {
    const error = { random: "value" };
    expect(isApiErrorDetails(error)).toBeFalse();
  });
});

import { ApiErrorDetails } from "src/app/services/baw-api/api.interceptor.service";
import {
  defaultErrorMsg,
  defaultSuccessMsg,
  extendedErrorMsg
} from "./formTemplate";

xdescribe("formTemplate", () => {
  describe("resolvers", () => {
    it("should handle no resolvers", () => {});
    it("should handle single resolver", () => {});
    it("should handle multiple resolvers", () => {});
    it("should handle single resolver failure", () => {});
    it("should handle any resolver failure", () => {});
  });

  describe("modelKey", () => {
    it("should handle undefined modelKey", () => {});
    it("should find model with single resolver", () => {});
    it("should find model with multiple resolvers", () => {});
    it("should handle failure to find model", () => {});
    it("should handle failure to find resolvers", () => {});
  });

  describe("hasFormCheck", () => {
    it("should extend WithFormCheck", () => {});
    it("should disable isFormTouched", () => {});
    it("should disable resetForms", () => {});
  });

  describe("submit", () => {
    it("should call apiAction on submit", () => {});
    it("should reset form on successful submission", () => {});
    it("should redirect user on successful submission", () => {});
  });

  describe("successMessage", () => {
    it("should handle update form success message", () => {});
    it("should handle new form success message", () => {});
  });

  describe("notifications", () => {
    it("should display notification on successful submission", () => {});
    it("should display notification on failed submission", () => {});
  });

  describe("loading", () => {
    it("should be false initially", () => {});
    it("should be set true on submit", () => {});
    it("should be set true on successful submission", () => {});
    it("should be set true on failed submit", () => {});
  });
});

describe("defaultSuccessMsg", () => {
  it("should handle model name", () => {
    expect(defaultSuccessMsg("created", "custom name")).toBe(
      "Successfully created custom name"
    );
  });

  it("should handle created action", () => {
    expect(defaultSuccessMsg("created", "name")).toBe(
      "Successfully created name"
    );
  });

  it("should handle updated action", () => {
    expect(defaultSuccessMsg("updated", "name")).toBe(
      "Successfully updated name"
    );
  });

  it("should handle destroyed action", () => {
    expect(defaultSuccessMsg("destroyed", "name")).toBe(
      "Successfully destroyed name"
    );
  });
});

describe("defaultErrorMsg", () => {
  it("should return error message", () => {
    const apiError: ApiErrorDetails = {
      status: 400,
      message: "Custom Message"
    } as ApiErrorDetails;

    expect(defaultErrorMsg(apiError)).toBe("Custom Message");
  });
});

describe("extendedErrorMsg", () => {
  it("should return error message", () => {
    const apiError: ApiErrorDetails = {
      status: 400,
      message: "Custom Message"
    } as ApiErrorDetails;

    expect(extendedErrorMsg(apiError, {})).toBe("Custom Message");
  });

  it("should return error message with single info field", () => {
    const apiError: ApiErrorDetails = {
      status: 400,
      message: "Custom Message",
      info: {
        name: "this name already exists"
      }
    } as ApiErrorDetails;

    expect(
      extendedErrorMsg(apiError, { name: value => "custom message: " + value })
    ).toBe("Custom Message<br />custom message: this name already exists");
  });

  it("should return error message with multiple info fields", () => {
    const apiError: ApiErrorDetails = {
      status: 400,
      message: "Custom Message",
      info: {
        name: "this name already exists",
        foo: "bar"
      }
    } as ApiErrorDetails;

    expect(
      extendedErrorMsg(apiError, {
        name: () => "custom message",
        foo: value => value
      })
    ).toBe("Custom Message<br />custom message<br />bar");
  });
});

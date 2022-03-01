/*
describe("defaultErrorMsg", () => {
  it("should return error message", () => {
    const apiError = generateBawApiError(BAD_REQUEST, "Custom Message");
    expect(defaultErrorMsg(apiError)).toBe("Custom Message");
  });
});

describe("extendedErrorMsg", () => {
  it("should return error message", () => {
    const apiError = generateBawApiError(BAD_REQUEST, "Custom Message");
    expect(extendedErrorMsg(apiError, {})).toBe("Custom Message");
  });

  it("should return error message with single info field", () => {
    const apiError = generateBawApiError(BAD_REQUEST, "Custom Message", {
      name: "this name already exists",
    });

    expect(
      extendedErrorMsg(apiError, {
        name: (value) => "custom message: " + value,
      })
    ).toBe("Custom Message<br />custom message: this name already exists");
  });

  it("should return error message with multiple info fields", () => {
    const apiError = generateBawApiError(BAD_REQUEST, "Custom Message", {
      name: "this name already exists",
      foo: "bar",
    });

    expect(
      extendedErrorMsg(apiError, {
        name: () => "custom message",
        foo: (value) => value,
      })
    ).toBe("Custom Message<br />custom message<br />bar");
  });
});

it("should handle duplicate project name", () => {
      api.create.and.callFake(() => {
        const subject = new Subject<Project>();
        subject.error(
          generateBawApiError(
            UNPROCESSABLE_ENTITY,
            "Record could not be saved",
            { name: ["has already been taken"] }
          )
        );
        return subject;
      });

      component.submit({});

      expect(notifications.error).toHaveBeenCalledWith(
        "Record could not be saved<br />name has already been taken"
      );
    });
*/

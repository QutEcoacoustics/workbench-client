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

xdescribe("defaultSuccessMsg", () => {
  it("should handle model name", () => {});
  it("should handle created action", () => {});
  it("should handle updated action", () => {});
  it("should handle destroyed action", () => {});
});

xdescribe("defaultErrorMsg", () => {
  it("should return error message", () => {});
});

xdescribe("extendedErrorMsg", () => {
  it("should return error message", () => {});
  it("should return error message with single info field", () => {});
  it("should return error message with multiple info fields", () => {});
});

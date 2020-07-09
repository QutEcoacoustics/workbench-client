import { AuthenticatedImageDirective } from "./image.directive";

xdescribe("ImageDirective", () => {
  it("should create", () => {});
  it("should insert url into image src", () => {});

  describe("error handling", () => {
    it("should handle url error", () => {});
    it("should handle multiple url errors", () => {});
    it("should handle running out of urls", () => {});
    it("should handle empty list of urls", () => {});
  });

  describe("thumbnail", () => {
    it("should use thumbnail url", () => {});
    it("should handle missing thumbnail url", () => {});
  });

  describe("internal links", () => {
    it("should prepend asset root path to url", () => {});
    it("should not double prepend asset root path to url", () => {});
  });

  describe("api links", () => {
    it("should append authToken", () => {});
    it("should not double append authToken", () => {});
    it("should not append authToken if disableAuthentication set", () => {});
    it("should not append authToken if not logged in", () => {});
    it("should handle parameters in url", () => {});
  });

  describe("external links", () => {
    it("should not modify external link url", () => {});
  });
});

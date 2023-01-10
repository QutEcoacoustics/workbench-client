import { modelData } from "@test/helpers/faker";

describe("Files helper", () => {
  it("should run", () => {
    const mockPaths = [ Array<void>(3).map(_ => modelData.system.fileName) ];
    console.log(mockPaths);
    expect(true).toBeFalse();
  });

  it("should return 0 for files at the same depth", () => {
  });

  it("should return 0 for folders at the same depth", () => {
  });

  it("should return 1 if a is a higher depth than b", () => {
  });

  it("should return 0 if a is lower depth than b", () => {
  });

  it("should sort a directory correctly", () => {
  });
});

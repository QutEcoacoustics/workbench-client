import { modelData } from "@test/helpers/faker";
import { compareByPath } from "./files";

describe("Files helper", () => {
  it("should run without errors", () => {
    const mockPaths = [modelData.system.fileName(), modelData.system.fileName(), modelData.system.fileName()];
    expect(() => mockPaths.sort(compareByPath)).not.toThrow();
  });

  it("should return 0 for files of the same name", () => {
    expect(compareByPath("a.csv", "a.csv")).toEqual(0);
  });

  it("should return 1 if a is a higher depth than b", () => {
    expect(compareByPath("folderA/file.png", "file.csv")).toEqual(1);
  });

  it("should sort files of the same depth alphabetically", () => {
    const mockPaths = ["b", "a"];

    // since the sort method by default, sorts alphabetically
    // we can asset that this condition is true by using the `.sort()` method on the same array
    expect(mockPaths.sort(compareByPath)).toEqual(
      mockPaths.sort()
    );
  });

  it("should sort folders before sub items in folders", () => {
    // since the sub folder comes before the folder in this condition, we can assert that the two elements are swapped
    const mockFolder = "FolderA/";
    const mockSubFolder = "FolderA/test.png"
    const mockPaths = ["FolderA/test.png", "FolderA/"];

    const sortedPaths = mockPaths.sort(compareByPath);

    expect(sortedPaths).toEqual([mockFolder, mockSubFolder]);
  });

  it("should sort a large directory correctly", () => {
    const mockPathStructure = [
      "FolderA/file.csv",
      "results.txt",
      "FolderA/",
      "FolderB/",
      "FolderA/aa/",
      "FolderA/test.png",
      "FolderA/aa/this.txt",
      "FolderA/that"
    ];

    const expectedPathStructure = [
      "FolderA/",
      "FolderA/aa/",
      "FolderA/aa/this.txt",
      "FolderA/file.csv",
      "FolderA/test.png",
      "FolderA/that",
      "FolderB/",
      "results.txt"
    ];

    expect(mockPathStructure.sort(compareByPath)).toEqual(expectedPathStructure);
  });
});

import { generateAnnotationMapUrlParameters } from "@test/fakes/data/AnnotationMapParameters";
import { modelData } from "@test/helpers/faker";
import { AnnotationMapParameters } from "./annotationMapParameters";

describe("AnnotationMapParameters", () => {
  it("should create", () => {
    const dataModel = new AnnotationMapParameters(
      generateAnnotationMapUrlParameters(),
    );

    expect(dataModel).toBeInstanceOf(AnnotationMapParameters);
  });

  it("should serialize to a filter correctly", () => {
    const dataModel = new AnnotationMapParameters(
      generateAnnotationMapUrlParameters(),
    );

    expect(dataModel.toFilter()).toEqual({});
  });

  it("should serialize to url parameters correctly", () => {
    const mockFocused = modelData.id();

    const dataModel = new AnnotationMapParameters(
      generateAnnotationMapUrlParameters({
        focused: mockFocused.toString(),
      }),
    );

    expect(dataModel.toQueryParams()).toEqual({
      focused: mockFocused,
    });
  });
});

import { AnnotationSearchParameters } from "./annotationSearchParameters";

describe("annotationSearchParameters", () => {
  it("should create", () => {
    const dataModel = new AnnotationSearchParameters();
    expect(dataModel).toBeInstanceOf(AnnotationSearchParameters);
  });
});

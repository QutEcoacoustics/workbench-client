import { generateAnnotation } from "@test/fakes/data/Annotation";
import { Tag } from "@models/Tag";
import { generateTag } from "@test/fakes/Tag";
import { Annotation, TagComparer } from "./Annotation";

describe("sorted tags getter", () => {
  it("should be able to sort tags using an AnnotationSearchParameter tagComparer", () => {
    const reverseIdComparer: TagComparer = (a: Tag, b: Tag) => b.id - a.id;

    const model = new Annotation(
      generateAnnotation({
        tagComparer: reverseIdComparer,
        unsortedTags: [
          new Tag(generateTag({ id: 0 })),
          new Tag(generateTag({ id: 1 })),
          new Tag(generateTag({ id: 2 })),
        ],
      }),
    );

    const expectedResult: Tag[] = [
      model.unsortedTags[2],
      model.unsortedTags[1],
      model.unsortedTags[0],
    ];

    expect(model.tags).toEqual(expectedResult);
  });
});

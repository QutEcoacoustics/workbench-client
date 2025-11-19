import { firstValueFrom, of } from "rxjs";
import { modelData } from "@test/helpers/faker";
import { Tag } from "@models/Tag";
import { generateTag } from "@test/fakes/Tag";
import { InnerFilter, Projection } from "@baw-api/baw-api.service";
import { TagsService } from "@baw-api/tag/tags.service";
import { createItemSearchCallback, createSearchCallback } from "./typeaheadCallbacks";

describe("typeaheadCallbacks", () => {
  describe("createSearchCallback", () => {
    let apiSpy: jasmine.SpyObj<TagsService>;

    beforeEach(() => {
      apiSpy = jasmine.createSpyObj<TagsService>(["filter"]);
      apiSpy.filter.and.returnValue(of([]));
    });

    it("should include the correct filter conditions", () => {
      const predefinedFilter: InnerFilter<Tag> = {
        notes: { contains: "migrated from:" },
      };

      const callback = createSearchCallback(apiSpy, "text", predefinedFilter);

      const filteredTag = new Tag(generateTag());
      callback("test", [filteredTag]);

      expect(apiSpy.filter).toHaveBeenCalledWith(
        jasmine.objectContaining({
          filter: {
            and: [
              predefinedFilter,
              { text: { contains: "test" } },
              { text: { notIn: [filteredTag.text] } },
            ],
          },
        }),
      );
    });

    it("should omit the 'filters' parameter if it is not provided", () => {
      const callback = createSearchCallback(apiSpy, "text");

      const filteredTag = new Tag(generateTag());
      callback("test", [filteredTag]);

      expect(apiSpy.filter).toHaveBeenCalledWith(
        jasmine.objectContaining({
          filter: {
            and: [
              { text: { contains: "test" } },
              { text: { notIn: [filteredTag.text] } },
            ],
          },
        }),
      );
    });

    it("should include 'projection' parameters when provided", () => {
      const projection: Projection<Tag> = { include: ["id", "text"] };
      const callback = createSearchCallback(apiSpy, "text", {}, projection);

      callback("test", []);

      expect(apiSpy.filter).toHaveBeenCalledWith(
        jasmine.objectContaining({
          projection,
        }),
      );
    });

    it("should omit the 'projection' parameter if it is not provided", () => {
      const callback = createSearchCallback(apiSpy, "text");

      callback("test", []);

      expect(apiSpy.filter).not.toHaveBeenCalledWith(
        jasmine.objectContaining({
          projection: jasmine.anything(),
        }),
      );
    });
  });

  describe("createItemSearchCallback", () => {
    // when matching against the search term, we convert to lower case
    // therefore, in this test, I purposely use a search term with mixed casing
    it("should be able to filter items based on a search term", async () => {
      const callback = createItemSearchCallback(["apple", "Banana", "cHerRY"]);
      const searchTerm = "cher";

      const expectedResults = ["cHerRY"];
      const realizedResults = await firstValueFrom(callback(searchTerm, []));

      expect(realizedResults).toEqual(expectedResults);
    });

    it("should limit the number of results to maxResults", async () => {
      const expectedMaxResults = 10;
      // we have to multiply the expected max results by at least 2 to ensure
      // that the tested length is greater than the expected max results
      const testedLength =
        expectedMaxResults * modelData.datatype.number({ min: 2, max: 20 });

      const callback = createItemSearchCallback(
        Array.from({ length: testedLength }, (_, i) => `Item ${i}`)
      );

      const searchTerm = "Item";
      const results = await firstValueFrom(callback(searchTerm, []));

      expect(results.length).toEqual(expectedMaxResults);
    });

    it("should return an empty array if no items match the search term", async () => {
      const callback = createItemSearchCallback(["apple", "banana", "cherry"]);
      const searchTerm = "orange";

      const expectedResults: string[] = [];
      const realizedResults = await firstValueFrom(callback(searchTerm, []));

      expect(realizedResults).toEqual(expectedResults);
    });

    it("should return all items if no search term is provided", async () => {
      const testedItems = ["apple", "banana", "cherry"];
      const callback = createItemSearchCallback(testedItems);

      const searchTerm = "";
      const realizedResults = await firstValueFrom(callback(searchTerm, []));

      expect(realizedResults).toEqual(testedItems);
    });
  });
});

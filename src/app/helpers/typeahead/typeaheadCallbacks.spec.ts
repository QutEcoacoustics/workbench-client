import { firstValueFrom } from "rxjs";
import { createItemSearchCallback } from "./typeaheadCallbacks";

describe("typeaheadCallbacks", () => {
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

    it("should limit the number of results to maxResults", () => {});

    it("should return an empty array if no items match the search term", () => {});

    it("should return an empty array if no search term is provided", () => {});
  });
});

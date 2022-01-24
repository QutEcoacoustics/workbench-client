import { fromBase64Url, toBase64Url } from "./encoding";

describe("encoding", () => {
  [
    // Using non latin1 values
    {
      input: "Привет",
      encoded: "0J_RgNC40LLQtdGC",
    },
    // Odd number of characters
    {
      input: "123456789",
      encoded: "MTIzNDU2Nzg5",
    },
    // Random text
    {
      input: "sdfsdf654654",
      encoded: "c2Rmc2RmNjU0NjU0",
    },
    // Fake buffer
    {
      input: "Awa=",
      encoded: "QXdhPQ",
    },
    // Special character
    {
      input: "Aw_",
      encoded: "QXdf",
    },
    // General object with multiple data types
    {
      input: JSON.stringify({
        custom: { object: "with" },
        some: 5,
        value: [1, 2, 3],
      }),
      encoded:
        "eyJjdXN0b20iOnsib2JqZWN0Ijoid2l0aCJ9LCJzb21lIjo1LCJ2YWx1ZSI6WzEsMiwzXX0",
    },
    // Object with non latin text, and symbols
    {
      input: JSON.stringify({
        nonLatin: "Привет",
        specialCharacters: "~!@#$%^&*()_+{}|:\"<>?'",
      }),
      encoded:
        "eyJub25MYXRpbiI6ItCf0YDQuNCy0LXRgiIsInNwZWNpYWxDaGFyYWN0ZXJzIjoifiFAIyQlXiYqKClfK3t9fDpcIjw-PycifQ",
    },
  ].forEach(({ input, encoded }) => {
    it(`should encode ${input}`, () => {
      const actual = toBase64Url(input);
      expect(actual).toBeInstanceOf(String);
      expect(actual).toEqual(encoded);
    });

    it(`should decode ${encoded}`, () => {
      const actual = fromBase64Url(encoded);
      expect(actual).toBeInstanceOf(String);
      expect(actual).toEqual(input);
    });
  });
});

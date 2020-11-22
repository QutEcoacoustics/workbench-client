import {
  AccessLevel,
  Id,
  ImageSizes,
  ImageUrl,
  TimezoneInformation,
} from "@interfaces/apiInterfaces";
import faker from "faker";

const specialCharRegex = /[^\w\s]/gi;

export const modelData = {
  accessLevel: () =>
    faker.random.arrayElement<AccessLevel>(["Reader", "Writer", "Owner"]),
  bool: () => faker.random.boolean(),
  description: () => faker.lorem.sentence().replace(specialCharRegex, ""),
  descriptionLong: () =>
    [0, 1, 2, 3, 4]
      .map(() => faker.lorem.sentences())
      .join(" ")
      .replace(specialCharRegex, ""),
  descriptionHtml: () =>
    `<b>${modelData.param()}</b><br><p>${modelData.description()}</p>`,
  defaults: {
    sampleRateHertz: [8000, 22050, 44100, 48000],
    bitRateBps: [
      64000,
      82000,
      123000,
      124000,
      125000,
      128000,
      256000,
      352800,
      353000,
      512000,
      705600,
      768000,
      1411200,
    ],
  },
  hash: () => "SHA256::" + modelData.hexaDecimal(256 / 4).substr(2),
  html: () => "hello <b>world</b>",
  id: (id?: Id) => (id ? id : faker.random.number(25)),
  ids: () => randomArray(0, 5, () => faker.random.number(100)),
  imageUrl: () => faker.image.imageUrl(),
  imageUrls,
  latitude: () => parseFloat(faker.address.latitude()),
  longitude: () => parseFloat(faker.address.longitude()),
  notes: () => randomObject(0, 5),
  offset: () =>
    faker.random.arrayElement(["+", "-"]) +
    faker.random.number(11) +
    ":" +
    faker.random.arrayElement(["00", "30"]),
  param: () => faker.name.title().replace(specialCharRegex, ""),
  seconds: () => faker.random.number(86400 - 30) + 30,
  startEndSeconds: () => {
    const min = faker.random.number(86400 - 30) + 30;
    const max = faker.random.number(86400 - min) + min;
    return [min, max];
  },
  startEndArray: (arr: any[]) => {
    const min = faker.random.number(arr.length - 1);
    const inc = faker.random.number(arr.length - 1 - min);
    return [arr[min], arr[min + inc]];
  },
  timestamp: () => faker.date.past().toISOString(),
  tzInfoTz: () =>
    faker.random.arrayElement([
      "America/Costa_Rica",
      "Australia/Brisbane",
      "Asia/Makassar",
    ]),
  uuid: () => faker.random.uuid(),
  hexaDecimal,
  randomArray,
  randomObject,
  shuffleArray,
  timezone,
  model: {
    generateDescription: () => ({
      description: modelData.description(),
      descriptionHtml: modelData.descriptionHtml(),
      descriptionHtmlTagline: modelData.descriptionHtml(),
    }),
    generateCreator: () => ({
      creatorId: modelData.id(),
      createdAt: modelData.timestamp(),
    }),
    generateUpdater: () => ({
      updaterId: modelData.id(),
      updatedAt: modelData.timestamp(),
    }),
    generateDeleter: () => ({
      deleterId: modelData.id(),
      deletedAt: modelData.timestamp(),
    }),
    generateCreatorAndUpdater: () => ({
      ...modelData.model.generateCreator(),
      ...modelData.model.generateUpdater(),
    }),
    generateCreatorAndDeleter: () => ({
      ...modelData.model.generateCreator(),
      ...modelData.model.generateDeleter(),
    }),
    generateAllUsers: () => ({
      ...modelData.model.generateCreator(),
      ...modelData.model.generateUpdater(),
      ...modelData.model.generateDeleter(),
    }),
  },
  ...faker,
};

/**
 * Randomly shuffle array using Fisher-Yates Shuffle
 *
 * @param array Array to shuffle
 */
function shuffleArray<T>(array: T[]): T[] {
  let currentIndex = array.length;
  let temporaryValue: T;
  let randomIndex: number;

  // While there remain elements to shuffle...
  while (currentIndex !== 0) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

/**
 * Generate image urls
 *
 * @param url Base url for image urls. Do not end url with '/' ie /broken_links/.
 */
function imageUrls(url?: string): ImageUrl[] {
  return [
    { image: ImageSizes.extraLarge, size: 300 },
    { image: ImageSizes.large, size: 220 },
    { image: ImageSizes.medium, size: 140 },
    { image: ImageSizes.small, size: 60 },
    { image: ImageSizes.tiny, size: 30 },
  ].map(({ image, size }) => ({
    size: image,
    url: url ? url + "/300/300" : faker.image.imageUrl(size, size),
    width: size,
    height: size,
  }));
}

/**
 * Generate timezone data
 */
function timezone(): TimezoneInformation {
  return faker.random.arrayElement<TimezoneInformation>([
    {
      identifierAlt: null,
      identifier: "America/Costa_Rica",
      friendlyIdentifier: "America - Costa Rica",
      utcOffset: -21600,
      utcTotalOffset: -21600,
    },
    {
      identifierAlt: "Brisbane",
      identifier: "Australia/Brisbane",
      friendlyIdentifier: "Australia - Brisbane",
      utcOffset: 36000,
      utcTotalOffset: 36000,
    },
    {
      identifierAlt: null,
      identifier: "Asia/Makassar",
      friendlyIdentifier: "Asia - Makassar",
      utcOffset: 28800,
      utcTotalOffset: 28800,
    },
  ]);
}

/**
 * Generate a series of hexadecimal digits
 *
 * @param count Size of hash
 */
function hexaDecimal(count: number = 1): string {
  let wholeString = "";
  for (let i = 0; i < count; i++) {
    wholeString += faker.random.arrayElement([
      "0",
      "1",
      "2",
      "3",
      "4",
      "5",
      "6",
      "7",
      "8",
      "9",
      "a",
      "b",
      "c",
      "d",
      "e",
      "f",
    ]);
  }

  return "0x" + wholeString;
}

/**
 * Create an array of random elements with random length
 *
 * @param min Minimum number of elements
 * @param max Maximum number of elements
 * @param callback Callback function to generate element
 */
function randomArray<T>(
  min: number,
  max: number,
  callback: (index: number) => T
): T[] {
  const len = faker.random.number({ min, max });
  const array = [];

  for (let i = 0; i < len; ++i) {
    array[i] = callback(i);
  }

  return array;
}

/**
 * Create an object containing random key-value pairs
 *
 * @param min Minimum number of keys
 * @param max Maximum number of keys
 */
function randomObject(min: number, max: number): Record<string, string> {
  const len = faker.random.number({ min, max });
  const obj = {};

  for (let i = 0; i < len; ++i) {
    obj[
      faker.random.word().replace(specialCharRegex, "")
    ] = faker.random.words().replace(specialCharRegex, "");
  }

  return obj;
}

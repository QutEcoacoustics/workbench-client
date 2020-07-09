import {
  Id,
  ImageSizes,
  ImageUrl,
  TimezoneInformation,
} from "@interfaces/apiInterfaces";
import faker from "faker";

export const modelData = {
  boolean: () => faker.random.boolean(),
  description: () => faker.lorem.sentence(),
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
  id: (id?: Id) => (id ? id : faker.random.number(25) + 1),
  ids: () => randomArray(0, 5, () => faker.random.number(100) + 1),
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
  param: () => faker.name.title(),
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
  uuid: () => faker.random.uuid(),
  timezone,
  hexaDecimal,
  randomArray,
  randomObject,
  ...faker,
};

/**
 * Generate image urls
 * @param url Base url for image urls. Do not end url with '/' ie /broken_links/.
 */
function imageUrls(url?: string): ImageUrl[] {
  return new Array<ImageUrl>(
    {
      size: ImageSizes.EXTRA_LARGE,
      url: url ? url + "/300/300" : faker.image.imageUrl(300, 300),
      width: 300,
      height: 300,
    },
    {
      size: ImageSizes.LARGE,
      url: url ? url + "/220/220" : faker.image.imageUrl(220, 220),
      width: 220,
      height: 220,
    },
    {
      size: ImageSizes.MEDIUM,
      url: url ? url + "/140/140" : faker.image.imageUrl(140, 140),
      width: 140,
      height: 140,
    },
    {
      size: ImageSizes.SMALL,
      url: url ? url + "/60/60" : faker.image.imageUrl(60, 60),
      width: 60,
      height: 60,
    },
    {
      size: ImageSizes.TINY,
      url: url ? url + "/30/30" : faker.image.imageUrl(30, 30),
      width: 30,
      height: 30,
    }
  );
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
 * @param min Minimum number of keys
 * @param max Maximum number of keys
 */
function randomObject(min: number, max: number): object {
  const len = faker.random.number({ min, max });
  const obj = {};

  for (let i = 0; i < len; ++i) {
    obj[faker.random.word()] = faker.random.words();
  }

  return obj;
}

import { IconName, IconProp } from "@fortawesome/fontawesome-svg-core";
import {
  PermissionLevel,
  Id,
  ImageSizes,
  ImageUrl,
  TimezoneInformation,
  UserConcent,
} from "@interfaces/apiInterfaces";
import { faker } from "@faker-js/faker";
import { DateTime, Duration } from "luxon";
import { PbsResources } from "@interfaces/pbsInterfaces";
import { Meta } from "@baw-api/baw-api.service";

// This is a 5MB import that should ONLY be present in the test environment
// If this file is imported to the production environment, it will cause the
// production bundle to increase significantly because both the spdx license
// list and faker.js would be included in the bundle.
import spdxLicenseListFull from "spdx-license-list/full";

const specialCharRegex = /[^\w\s]/gi;

export const modelData = {
  permissionLevel: () =>
    faker.helpers.arrayElement<PermissionLevel>([
      PermissionLevel.reader,
      PermissionLevel.writer,
      PermissionLevel.owner,
    ]),
  authToken: () => faker.random.alphaNumeric(20),
  bool: () => faker.datatype.boolean(),
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
      64000, 82000, 123000, 124000, 125000, 128000, 256000, 352800, 353000,
      512000, 705600, 768000, 1411200,
    ],
  },
  hash: () => "SHA256::" + modelData.hexaDecimal(256 / 4).substring(2),
  html: () => "hello <b>world</b>",
  id: (id?: Id) => (id ? id : faker.datatype.number(25)),
  ids: () => randomArray(1, 5, () => faker.datatype.number(100)),
  imageUrl: () => faker.image.imageUrl(),
  imageUrls,
  licenseName: () =>
    modelData.helpers.arrayElement(Object.keys(spdxLicenseListFull)),
  license: () =>
    modelData.helpers.arrayElement(Object.values(spdxLicenseListFull)),
  icon: (): IconProp => [
    "fas",
    faker.helpers.arrayElement<IconName>([
      "anchor",
      "apple-whole",
      "atom",
      "bacon",
      "ban",
      "bed",
    ]),
  ],
  latitude: () => parseFloat(faker.address.latitude()),
  longitude: () => parseFloat(faker.address.longitude()),
  percentage: (): number =>
    faker.datatype.float({ min: 0, max: 1, precision: 0.0001 }),
  notes: () => randomObject(1, 5),
  offset: () =>
    faker.helpers.arrayElement(["+", "-"]) +
    faker.datatype.number(11) +
    ":" +
    faker.helpers.arrayElement(["00", "30"]),
  param: () => faker.name.jobTitle().replace(specialCharRegex, ""),
  version: () =>
    `${modelData.datatype.number()}.${modelData.datatype.number()}`,
  seconds: () => faker.datatype.number(86400 - 30) + 30,
  startEndSeconds: () => {
    const min = faker.datatype.number(86400 - 30) + 30;
    const max = faker.datatype.number(86400 - min) + min;
    return [min, max];
  },
  startEndArray: (arr: any[]) => {
    const min = faker.datatype.number(arr.length - 1);
    const inc = faker.datatype.number(arr.length - 1 - min);
    return [arr[min], arr[min + inc]];
  },
  timestamp: () => faker.date.past().toISOString(),
  tzInfoTz: () =>
    faker.helpers.arrayElement([
      "America/Costa_Rica",
      "Australia/Brisbane",
      "Asia/Makassar",
    ]),
  time: (): Duration =>
    Duration.fromObject({
      hours: faker.datatype.number(23),
      minutes: faker.datatype.number(59),
      seconds: faker.datatype.number(59),
    }),
  dateTime: (): DateTime => DateTime.fromJSDate(faker.date.past()),
  uuid: () => faker.datatype.uuid(),
  typeSpecification: () =>
    modelData.helpers.arrayElement(["string", "int", "nil"]),
  file: randomFile,
  pbsResources: (): Required<PbsResources> => ({
    ncpus: modelData.datatype.number(),
    ngpus: modelData.datatype.number(),
    mem: modelData.datatype.number(),
    walltime: modelData.datatype.number(),
  }),
  concent: () =>
    faker.helpers.arrayElement([
      UserConcent.yes,
      UserConcent.no,
      UserConcent.unasked,
    ]),
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
    generatePagingMetadata: (data?: Partial<Meta["paging"]>): Meta => ({
      paging: {
        items: modelData.datatype.number(),
        page: modelData.datatype.number(),
        total: modelData.datatype.number(),
        maxPage: modelData.datatype.number(),
        ...data,
      },
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
  return faker.helpers.arrayElement<TimezoneInformation>([
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
    wholeString += faker.helpers.arrayElement([
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
  callback: (index: number) => T,
): T[] {
  const len = faker.datatype.number({ min, max });
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
  const len = faker.datatype.number({ min, max });
  const obj = {};

  for (let i = 0; i < len; ++i) {
    obj[faker.random.word().replace(specialCharRegex, "")] = faker.random
      .words()
      .replace(specialCharRegex, "");
  }

  return obj;
}

function randomFile(
  data: Partial<{
    type: string;
    name: string;
    contents: BlobPart[];
  }> = {},
) {
  return new File(data.contents ?? [], data?.name ?? faker.system.fileName(), {
    type: data.type ?? "text/plain",
  });
}

import { Id, ImageURL } from "@interfaces/apiInterfaces";
import faker from "faker";

export const modelData = {
  boolean: () => faker.random.boolean(),
  description: () => faker.lorem.sentence(),
  id: (id?: Id) => (id ? id : faker.random.number(25)),
  ids: () => randomArray(0, 5, () => faker.random.number(100)),
  imageUrl: () => faker.image.imageUrl(),
  imageUrls: () =>
    new Array<ImageURL>(
      {
        size: "extralarge",
        url: faker.image.imageUrl(300, 300),
        width: 300,
        height: 300,
      },
      {
        size: "large",
        url: faker.image.imageUrl(220, 220),
        width: 220,
        height: 220,
      },
      {
        size: "medium",
        url: faker.image.imageUrl(140, 140),
        width: 140,
        height: 140,
      },
      {
        size: "small",
        url: faker.image.imageUrl(60, 60),
        width: 60,
        height: 60,
      },
      {
        size: "tiny",
        url: faker.image.imageUrl(30, 30),
        width: 30,
        height: 30,
      }
    ),
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
  timestamp: () => faker.date.past().toISOString(),
  timezone: () => undefined, // TODO
  uuid: () => faker.random.uuid(),
  randomArray,
  randomObject,
  ...faker,
};

/**
 * Create an array of random elements with random length
 * @param min Minimum number of elements
 * @param max Maximum number of elements
 * @param callback Callback function to generate element
 */
export function randomArray<T>(
  min: number,
  max: number,
  callback: (index: number) => T
) {
  const len = faker.random.number({ min, max });
  const array = [];

  for (let i = 0; i < len; ++i) {
    array[i] = callback(i);
  }

  return array;
}

export function randomObject(min: number, max: number) {
  const len = faker.random.number({ min, max });
  const obj = {};

  for (let i = 0; i < len; ++i) {
    obj[faker.random.word()] = faker.random.words();
  }

  return obj;
}

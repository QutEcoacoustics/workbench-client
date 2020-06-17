import { Id } from "@interfaces/apiInterfaces";
import faker from "faker";

export const modelData = {
  boolean: () => faker.random.boolean(),
  description: () => faker.lorem.sentence(),
  id: (id?: Id) => (id ? id : faker.random.number(25)),
  ids: () => randomArray(0, 5, () => faker.random.number(100)),
  imageUrl: () => faker.image.imageUrl(),
  latitude: () => parseFloat(faker.address.latitude()),
  longitude: () => parseFloat(faker.address.longitude()),
  notes: () => randomObject(0, 5),
  param: () => faker.name.title(),
  seconds: () => faker.random.number(86400 - 30) + 30,
  timestamp: () => faker.date.past().toISOString(),
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

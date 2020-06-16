import { Id } from "@interfaces/apiInterfaces";
import faker from "faker";

export const modelData = {
  id: (id?: Id) => (id ? id : faker.random.number(25)),
  ids: () => randomArray(0, 5, () => faker.random.number(100)),
  name: () => faker.name.title(),
  description: () => faker.lorem.sentence(),
  imageUrl: () => faker.image.imageUrl(),
  accountId: () => faker.random.number(100),
  timestamp: () => faker.date.past().toISOString(),
  boolean: () => faker.random.boolean(),
  hertz: () => faker.random.arrayElement([22050, 8000, 44100, 48000]),
  seconds: () => faker.random.number(86400 - 30) + 30,
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

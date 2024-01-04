import { faker } from "@faker-js/faker";
import {
  IWebsiteStatus,
  RedisStatus,
  StorageStatus,
  UploadStatus,
  WebsiteOverallStatus,
} from "@models/WebsiteStatus";
import { modelData } from "@test/helpers/faker";

export function generateWebsiteStatus(
  data?: Partial<IWebsiteStatus>
): Required<IWebsiteStatus> {
  return {
    status: faker.helpers.arrayElement<WebsiteOverallStatus>(["good", "bad"]),
    timedOut: modelData.datatype.boolean(),
    database: modelData.datatype.boolean(),
    redis: faker.helpers.arrayElement<RedisStatus>(["PONG", ""]),
    storage: faker.helpers.arrayElement<StorageStatus>([
      `${modelData.datatype.number()} audio recording storage directory available.`,
      "No audio recording storage directories are available.",
    ]),
    upload: faker.helpers.arrayElement<UploadStatus>(["Alive", "Dead"]),
    ...data,
  };
}

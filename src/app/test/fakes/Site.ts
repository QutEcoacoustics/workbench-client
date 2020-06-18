import { Id } from "@interfaces/apiInterfaces";
import { ISite } from "@models/Site";
import { modelData } from "@test/helpers/faker";

export function generateSite(id?: Id): ISite {
  return {
    id: modelData.id(id),
    name: modelData.param(),
    imageUrl: modelData.imageUrl(),
    description: modelData.description(),
    locationObfuscated: modelData.boolean(),
    creatorId: modelData.id(),
    updaterId: modelData.id(),
    createdAt: modelData.timestamp(),
    updatedAt: modelData.timestamp(),
    projectIds: modelData.ids(),
    customLatitude: modelData.latitude(),
    customLongitude: modelData.longitude(),
    timezoneInformation: modelData.timezone(),
  };
}

import { Id } from "@interfaces/apiInterfaces";
import { ISite } from "@models/Site";
import { modelData } from "@test/helpers/faker";

export function generateSite(id?: Id): Required<ISite> {
  return {
    id: modelData.id(id),
    name: modelData.param(),
    imageUrl: modelData.imageUrl(),
    description: modelData.description(),
    descriptionHtml: modelData.descriptionHtml(),
    descriptionHtmlTagline: modelData.descriptionHtml(),
    locationObfuscated: modelData.boolean(),
    creatorId: modelData.id(),
    updaterId: modelData.id(),
    deleterId: modelData.id(),
    createdAt: modelData.timestamp(),
    updatedAt: modelData.timestamp(),
    deletedAt: modelData.timestamp(),
    projectIds: modelData.ids(),
    latitude: modelData.latitude(),
    customLatitude: modelData.latitude(),
    longitude: modelData.longitude(),
    customLongitude: modelData.longitude(),
    timezoneInformation: modelData.timezone(),
    tzinfoTz: modelData.tzInfoTz(),
  };
}

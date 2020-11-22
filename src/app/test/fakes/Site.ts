import { Id } from "@interfaces/apiInterfaces";
import { ISite } from "@models/Site";
import { modelData } from "@test/helpers/faker";

export function generateSite(id?: Id, hasRegion?: boolean): Required<ISite> {
  return {
    id: modelData.id(id),
    name: modelData.param(),
    imageUrl: modelData.imageUrl(),
    locationObfuscated: modelData.boolean(),
    projectIds: modelData.ids(),
    // This is purposefully disabled by default as it changes the behavior of the model
    regionId: hasRegion ? modelData.id() : undefined,
    latitude: modelData.latitude(),
    customLatitude: modelData.latitude(),
    longitude: modelData.longitude(),
    customLongitude: modelData.longitude(),
    timezoneInformation: modelData.timezone(),
    tzinfoTz: modelData.tzInfoTz(),
    notes: modelData.notes(),
    ...modelData.model.generateDescription(),
    ...modelData.model.generateAllUsers(),
  };
}

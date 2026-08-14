import { ISite } from "@models/Site";
import { modelData } from "@test/helpers/faker";

export function generateSite(
  data?: Partial<ISite>,
  hasRegion?: boolean
): Required<ISite> {
  return {
    id: modelData.id(),
    name: modelData.param(),
    imageUrls: modelData.imageUrls(),
    // @ts-ignore: TODO: remove once strict mode is fully enabled, see https://github.com/QutEcoacoustics/workbench-client/issues/2686
    image: undefined,
    locationObfuscated: modelData.bool(),
    projectIds: modelData.ids(),
    // This is purposefully disabled by default as it changes the behavior of the model
    // @ts-ignore: TODO: remove once strict mode is fully enabled, see https://github.com/QutEcoacoustics/workbench-client/issues/2686
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
    ...data,
  };
}

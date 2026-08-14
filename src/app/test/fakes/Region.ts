import { IRegion } from "@models/Region";
import { modelData } from "@test/helpers/faker";

export function generateRegion(data?: Partial<IRegion>): Required<IRegion> {
  return {
    id: modelData.id(),
    name: modelData.param(),
    imageUrls: modelData.imageUrls(),
    // @ts-ignore: TODO: remove once strict mode is fully enabled, see https://github.com/QutEcoacoustics/workbench-client/issues/2686
    image: undefined,
    projectId: modelData.id(),
    siteIds: modelData.ids(),
    notes: modelData.notes(),
    ...modelData.model.generateDescription(),
    ...modelData.model.generateAllUsers(),
    ...data,
  };
}

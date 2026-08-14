import { Meta } from "@baw-api/baw-api.service";
import { IProject, ProjectCapabilities } from "@models/Project";
import { modelData } from "@test/helpers/faker";
import { generateMeta } from "./Meta";

export function generateProjectMeta(
  meta?: Partial<Meta<IProject, ProjectCapabilities>>
): Meta {
  const capability = {
    can: false,
    details: "Capability is unset by generateProjectMeta",
  };
  const temp: Meta<IProject, ProjectCapabilities> = {
    ...generateMeta(),
    capabilities: {
      createHarvest: capability,
      updateAllowAudioUpload: capability,
    },
    ...meta,
  };
  return temp as Meta;
}

export function generateProject(data?: Partial<IProject>): Required<IProject> {
  return {
    id: modelData.id(),
    name: modelData.param(),
    imageUrls: modelData.imageUrls(),
    // @ts-ignore: TODO: remove once strict mode is fully enabled, see https://github.com/QutEcoacoustics/workbench-client/issues/2686
    image: undefined,
    accessLevel: modelData.permissionLevel(),
    ownerIds: modelData.ids(),
    siteIds: modelData.ids(),
    regionIds: modelData.ids(),
    notes: modelData.notes(),
    allowOriginalDownload: modelData.permissionLevel(),
    license: modelData.licenseName(),
    ...modelData.model.generateDescription(),
    ...modelData.model.generateAllUsers(),
    ...data,
  };
}

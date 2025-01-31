import { IScript } from "@models/Script";
import { modelData } from "@test/helpers/faker";

export function generateScript(data?: Partial<IScript>): Required<IScript> {
  return {
    id: modelData.id(),
    name: modelData.param(),
    analysisIdentifier: "script machine identifier", // TODO Implement with random values
    version: parseFloat(modelData.system.semver()),
    verified: modelData.bool(),
    groupId: modelData.id(),
    provenanceId: modelData.id(),
    executableCommand: "executive command", // TODO Implement with random values
    executableSettings: "executive settings", // TODO Implement with random values
    executableSettingsName: "executive settings name", // TODO Implement with random values
    executableSettingsMediaType: "text/plain", // TODO Implement with random values
    resources: modelData.pbsResources(),
    isLastVersion: modelData.bool(),
    isFirstVersion: modelData.bool(),
    ...modelData.model.generateDescription(),
    ...modelData.model.generateCreator(),
    ...data,
  };
}

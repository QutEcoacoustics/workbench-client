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
    executableCommand: "executive command", // TODO Implement with random values
    executableSettings: "executive settings", // TODO Implement with random values
    executableSettingsMediaType: "text/plain", // TODO Implement with random values
    analysisActionParams: {
      fileExecutable: "./AnalysisPrograms/AnalysisPrograms.exe",
      copyPaths: ["./programs/AnalysisPrograms/Logs/log.txt"],
      subFolders: [],
      customSettings: {},
    }, // TODO Implement with random values
    ...modelData.model.generateDescription(),
    ...modelData.model.generateCreator(),
    ...data,
  };
}

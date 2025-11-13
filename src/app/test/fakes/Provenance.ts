import { IProvenance } from "@models/Provenance";
import { modelData } from "@test/helpers/faker";

export function generateProvenance(
  data?: Partial<IProvenance>
): Required<IProvenance> {
  return {
    id: modelData.id(),
    name: modelData.name.jobTitle(),
    version: modelData.version(),
    url: modelData.internet.url(),
    description: modelData.description(),
    scoreMinimum: modelData.datatype.number(),
    scoreMaximum: modelData.datatype.number(),
    ...modelData.model.generateDescription(),
    ...modelData.model.generateAllUsers(),
    ...data,
  };
}

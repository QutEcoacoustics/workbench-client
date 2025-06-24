import { ISiteSetting } from "@models/SiteSetting";
import { modelData } from "@test/helpers/faker";

export function generateSiteSetting(
  data?: Partial<ISiteSetting>,
): Required<ISiteSetting> {
  return {
    id: modelData.id(),
    name: modelData.name.firstName(),
    value: modelData.datatype.number(),
    description: modelData.lorem.sentence(),
    ...data,
  };
}

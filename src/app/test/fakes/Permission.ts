import { IPermission } from "@models/Permission";
import { modelData } from "@test/helpers/faker";

export function generatePermission(data?: Partial<IPermission>): Required<IPermission> {
  return {
    id: modelData.id(),
    projectId: modelData.id(),
    userId: modelData.id(),
    level: modelData.permissionLevel(),
    allowAnonymous: false,
    allowLoggedIn: false,
    ...modelData.model.generateCreatorAndUpdater(),
    ...data,
  };
}

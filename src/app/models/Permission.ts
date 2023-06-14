import { ACCOUNT, PROJECT } from "@baw-api/ServiceTokens";
import { editProjectPermissionsRoute } from "@components/projects/projects.routes";
import {
  PermissionLevel,
  HasCreatorAndUpdater,
  Id,
} from "@interfaces/apiInterfaces";
import { AbstractModel } from "./AbstractModel";
import { creator, hasOne, updater } from "./AssociationDecorators";
import { bawPersistAttr } from "./AttributeDecorators";
import { Project } from "./Project";
import { User } from "./User";

export interface IPermission extends HasCreatorAndUpdater {
  id?: Id;
  projectId?: Id;
  userId?: Id;
  level?: PermissionLevel;
  allowAnonymous?: boolean;
  allowLoggedIn?: boolean;
}

export class Permission
  extends AbstractModel<IPermission>
  implements IPermission
{
  public readonly kind = "Permission";
  public declare id?: Id;
  public projectId?: Id;
  @bawPersistAttr({ create: true })
  public userId?: Id;
  @bawPersistAttr()
  public level?: PermissionLevel;
  @bawPersistAttr()
  public allowAnonymous?: boolean;
  @bawPersistAttr()
  public allowLoggedIn?: boolean;

  // Associations
  @hasOne<Permission, Project>(PROJECT, "projectId")
  public project?: Project;
  @hasOne<Permission, User>(ACCOUNT, "userId")
  public user?: User;
  @creator<Permission>()
  public creator?: User;
  @updater<Permission>()
  public updater?: User;

  public get viewUrl(): string {
    return editProjectPermissionsRoute.format({
      projectId: this.projectId,
    });
  }
}

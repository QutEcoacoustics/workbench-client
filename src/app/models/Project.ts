import { Capability } from "@baw-api/baw-api.service";
import { ACCOUNT, SHALLOW_REGION, SHALLOW_SITE } from "@baw-api/ServiceTokens";
import { projectRoute } from "@components/projects/projects.routes";
import {
  PermissionLevel,
  DateTimeTimezone,
  Description,
  HasAllUsers,
  HasDescription,
  Hash,
  hasRequiredAccessLevelOrHigher,
  Id,
  Ids,
  ImageUrl,
  Param,
} from "@interfaces/apiInterfaces";
import { assetRoot } from "@services/config/config.service";
import { AbstractModel } from "./AbstractModel";
import { creator, deleter, hasMany, updater } from "./AssociationDecorators";
import { bawCollection, bawDateTime, bawImage, bawPersistAttr } from "./AttributeDecorators";
import type { Region } from "./Region";
import type { Site } from "./Site";
import type { User } from "./User";

export type ProjectCapabilities = "updateAllowAudioUpload" | "createHarvest";

/**
 * A project model.
 */
export interface IProject extends HasAllUsers, HasDescription {
  id?: Id;
  name?: Param;
  imageUrls?: ImageUrl[];
  image?: File;
  accessLevel?: PermissionLevel;
  ownerIds?: Ids | Id[];
  siteIds?: Ids | Id[];
  regionIds?: Ids | Id[];
  notes?: Hash;
  allowOriginalDownload?: PermissionLevel;
}

/**
 * A project model.
 */
export class Project extends AbstractModel<IProject> implements IProject {
  public readonly kind = "Project";
  public readonly id?: Id;
  @bawPersistAttr()
  public readonly name?: Param;
  @bawPersistAttr()
  public readonly description?: Description;
  public readonly descriptionHtml?: Description;
  public readonly descriptionHtmlTagline?: Description;
  @bawImage<IProject>(`${assetRoot}/images/project/project_span4.png`)
  public readonly imageUrls!: ImageUrl[];
  @bawPersistAttr({ supportedFormats: ["formData", "json"] })
  public readonly image?: File;
  public readonly accessLevel?: PermissionLevel;
  public readonly creatorId?: Id;
  public readonly updaterId?: Id;
  public readonly deleterId?: Id;
  @bawDateTime()
  public readonly createdAt?: DateTimeTimezone;
  @bawDateTime()
  public readonly updatedAt?: DateTimeTimezone;
  @bawDateTime()
  public readonly deletedAt?: DateTimeTimezone;
  @bawCollection()
  public readonly ownerIds?: Ids;
  @bawCollection()
  public readonly siteIds?: Ids;
  @bawCollection()
  public readonly regionIds?: Ids;
  @bawPersistAttr()
  public readonly notes?: Hash;
  @bawPersistAttr()
  public readonly allowOriginalDownload?: PermissionLevel;
  @bawPersistAttr()
  public readonly allowAudioUpload?: boolean;

  // Associations
  @hasMany<Project, Site>(SHALLOW_SITE, "siteIds")
  public sites?: Site[];
  @hasMany<Project, Region>(SHALLOW_REGION, "regionIds")
  public regions?: Region[];
  @hasMany<Project, User>(ACCOUNT, "ownerIds")
  public owners?: User[];
  @creator<Project>()
  public creator?: User;
  @updater<Project>()
  public updater?: User;
  @deleter<Project>()
  public deleter?: User;

  public override can(capability: ProjectCapabilities): Capability {
    return super.can(capability);
  }

  /**
   * Returns true if user has the permissions to edit this model
   */
  public get canEdit(): boolean {
    return hasRequiredAccessLevelOrHigher(PermissionLevel.owner, this.accessLevel);
  }

  /**
   * Returns true if user can contribute to this model. Ie Adding
   * annotations/tags
   */
  public get canContribute(): boolean {
    return hasRequiredAccessLevelOrHigher(PermissionLevel.writer, this.accessLevel);
  }

  public get viewUrl(): string {
    return projectRoute.format({ projectId: this.id });
  }
}

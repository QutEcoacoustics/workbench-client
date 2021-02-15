import { Injector } from "@angular/core";
import { ACCOUNT, SHALLOW_REGION, SHALLOW_SITE } from "@baw-api/ServiceTokens";
import { projectMenuItem } from "@components/projects/projects.menus";
import {
  AccessLevel,
  DateTimeTimezone,
  Description,
  HasAllUsers,
  HasDescription,
  Hash,
  Id,
  Ids,
  ImageUrl,
  Param,
} from "@interfaces/apiInterfaces";
import { assetRoot } from "@services/config/config.service";
import { Card } from "@shared/cards/cards.component";
import { AbstractModel } from "./AbstractModel";
import {
  creator,
  deleter,
  hasMany,
  hasOne,
  updater,
} from "./AssociationDecorators";
import {
  bawCollection,
  bawDateTime,
  bawImage,
  bawPersistAttr,
} from "./AttributeDecorators";
import type { Region } from "./Region";
import type { Site } from "./Site";
import type { User } from "./User";

/**
 * A project model.
 */
export interface IProject extends HasAllUsers, HasDescription {
  id?: Id;
  name?: Param;
  imageUrl?: string;
  accessLevel?: AccessLevel;
  ownerId?: Id;
  siteIds?: Ids | Id[];
  regionIds?: Ids | Id[];
  notes?: Hash;
}

/**
 * A project model.
 */
export class Project extends AbstractModel implements IProject {
  public readonly kind = "Project";
  @bawPersistAttr
  public readonly id?: Id;
  @bawPersistAttr
  public readonly name?: Param;
  @bawPersistAttr
  public readonly description?: Description;
  public readonly descriptionHtml?: Description;
  public readonly descriptionHtmlTagline?: Description;
  public readonly imageUrl?: string;
  @bawImage<Project>(`${assetRoot}/images/project/project_span4.png`, {
    key: "imageUrl",
  })
  public readonly image: ImageUrl[];
  public readonly accessLevel?: AccessLevel;
  public readonly creatorId?: Id;
  public readonly updaterId?: Id;
  public readonly deleterId?: Id;
  @bawDateTime()
  public readonly createdAt?: DateTimeTimezone;
  @bawDateTime()
  public readonly updatedAt?: DateTimeTimezone;
  @bawDateTime()
  public readonly deletedAt?: DateTimeTimezone;
  public readonly ownerId?: Id;
  @bawCollection({ persist: true })
  public readonly siteIds?: Ids;
  @bawCollection({ persist: true })
  public readonly regionIds?: Ids;
  @bawPersistAttr
  public readonly notes?: Hash;

  // Associations
  @hasMany<Project, Site>(SHALLOW_SITE, "siteIds")
  public sites?: Site[];
  @hasMany<Project, Region>(SHALLOW_REGION, "regionIds")
  public regions?: Region[];
  @hasOne<Project, User>(ACCOUNT, "ownerId")
  public owner?: User;
  @creator<Project>()
  public creator?: User;
  @updater<Project>()
  public updater?: User;
  @deleter<Project>()
  public deleter?: User;

  public constructor(project: IProject, injector?: Injector) {
    super(project, injector);
  }

  /**
   * Generate card-item details
   */
  public getCard(): Card {
    return {
      title: this.name,
      description: this.descriptionHtmlTagline,
      model: this,
      route: this.viewUrl,
    };
  }

  public get viewUrl(): string {
    return projectMenuItem.route.format({ projectId: this.id });
  }
}

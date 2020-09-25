import { Injector } from "@angular/core";
import { SHALLOW_SITE } from "@baw-api/ServiceTokens";
import { projectMenuItem } from "@components/projects/projects.menus";
import {
  AccessLevel,
  DateTimeTimezone,
  Description,
  HasAllUsers,
  HasDescription,
  Id,
  Ids,
  ImageUrl,
  Notes,
  Param,
} from "@interfaces/apiInterfaces";
import { assetRoot } from "@services/app-config/app-config.service";
import { Card } from "@shared/cards/cards.component";
import { AbstractModel } from "./AbstractModel";
import { Creator, HasMany, Owner, Updater } from "./AssociationDecorators";
import {
  BawCollection,
  BawDateTime,
  BawImage,
  BawPersistAttr,
} from "./AttributeDecorators";
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
  notes?: Notes;
}

/**
 * A project model.
 */
export class Project extends AbstractModel implements IProject {
  public readonly kind = "Project";
  @BawPersistAttr
  public readonly id?: Id;
  @BawPersistAttr
  public readonly name?: Param;
  @BawPersistAttr
  public readonly description?: Description;
  public readonly descriptionHtml?: Description;
  public readonly descriptionHtmlTagline?: Description;
  public readonly imageUrl?: string;
  @BawImage<Project>(`${assetRoot}/images/project/project_span4.png`, {
    key: "imageUrl",
  })
  public readonly image: ImageUrl[];
  public readonly accessLevel?: AccessLevel;
  public readonly creatorId?: Id;
  public readonly updaterId?: Id;
  public readonly deleterId?: Id;
  @BawDateTime()
  public readonly createdAt?: DateTimeTimezone;
  @BawDateTime()
  public readonly updatedAt?: DateTimeTimezone;
  @BawDateTime()
  public readonly deletedAt?: DateTimeTimezone;
  public readonly ownerId?: Id;
  @BawCollection({ persist: true })
  public readonly siteIds?: Ids;
  @BawPersistAttr
  public readonly notes?: Notes;

  // Associations
  @HasMany<Project>(SHALLOW_SITE, "siteIds")
  public sites?: Site[];
  @Creator<Project>()
  public creator?: User;
  @Updater<Project>()
  public updater?: User;
  @Owner<Project>()
  public owner?: User;

  constructor(project: IProject, injector?: Injector) {
    super(project, injector);
  }

  /**
   * Generate card-item details
   * TODO Extract this out, should not be implemented here
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

import { Injector } from "@angular/core";
import { SHALLOW_SITE } from "@baw-api/ServiceTokens";
import { projectMenuItem } from "@component/projects/projects.menus";
import {
  DateTimeTimezone,
  Description,
  Id,
  Ids,
  Param,
} from "@interfaces/apiInterfaces";
import { Card } from "@shared/cards/cards.component";
import { modelData, randomArray } from "@test/helpers/faker";
import faker from "faker";
import { AbstractModel } from "./AbstractModel";
import { Creator, HasMany, Owner, Updater } from "./AssociationDecorators";
import {
  BawCollection,
  BawDateTime,
  BawPersistAttr,
} from "./AttributeDecorators";
import type { Site } from "./Site";
import type { User } from "./User";

/**
 * A project model.
 */
export interface IProject {
  id?: Id;
  name?: Param;
  description?: Description;
  imageUrl?: string;
  creatorId?: Id;
  createdAt?: DateTimeTimezone | string;
  updaterId?: Id;
  updatedAt?: DateTimeTimezone | string;
  ownerId?: Id;
  siteIds?: Ids | Id[];
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
  public readonly imageUrl?: string;
  public readonly creatorId?: Id;
  @BawDateTime()
  public readonly createdAt?: DateTimeTimezone;
  public readonly updaterId?: Id;
  @BawDateTime()
  public readonly updatedAt?: DateTimeTimezone;
  public readonly ownerId?: Id;
  @BawCollection({ persist: true })
  public readonly siteIds?: Ids;

  // Associations
  @HasMany<Project>(SHALLOW_SITE, "siteIds")
  public sites?: Site[];
  @Creator<Project>()
  public creator?: User;
  @Updater<Project>()
  public updater?: User;
  @Owner<Project>()
  public owner?: User;

  public static generate(id?: Id): IProject {
    return {
      id: modelData.id(id),
      name: modelData.param(),
      description: modelData.description(),
      imageUrl: modelData.imageUrl(),
      creatorId: modelData.id(),
      updaterId: modelData.id(),
      ownerId: modelData.id(),
      createdAt: modelData.timestamp(),
      updatedAt: modelData.timestamp(),
      siteIds: modelData.ids(),
    };
  }

  constructor(project: IProject, injector?: Injector) {
    super(project, injector);

    this.imageUrl =
      project.imageUrl || "/assets/images/project/project_span4.png";
  }

  /**
   * Generate card-item details
   * TODO Extract this out, should not be implemented here
   */
  public getCard(): Card {
    return {
      title: this.name,
      description: this.description,
      image: {
        url: this.imageUrl,
        alt: this.name,
      },
      route: this.viewUrl,
    };
  }

  public get viewUrl(): string {
    return projectMenuItem.route.format({ projectId: this.id });
  }
}

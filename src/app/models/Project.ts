import { Injector } from "@angular/core";
import { ACCOUNT, SHALLOW_SITE } from "@baw-api/ServiceTokens";
import { Observable } from "rxjs";
import { projectMenuItem } from "../component/projects/projects.menus";
import { Card } from "../component/shared/cards/cards.component";
import {
  DateTimeTimezone,
  Description,
  Id,
  Ids,
  Param,
} from "../interfaces/apiInterfaces";
import {
  AbstractModel,
  BawCollection,
  BawDateTime,
  BawPersistAttr,
  HasMany,
  HasOne,
} from "./AbstractModel";
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
  public readonly kind: "Project" = "Project";
  @BawPersistAttr
  public readonly id?: Id;
  @BawPersistAttr
  public readonly name?: Param;
  @BawPersistAttr
  public readonly description?: Description;
  public readonly imageUrl?: string;
  public readonly creatorId?: Id;
  @BawDateTime()
  public createdAt?: DateTimeTimezone;
  public readonly updaterId?: Id;
  @BawDateTime()
  public readonly updatedAt?: DateTimeTimezone;
  public readonly ownerId?: Id;
  @BawCollection({ persist: true })
  public readonly siteIds?: Ids;

  // Associations
  @HasMany(SHALLOW_SITE, (m: Project) => m.siteIds)
  public sites?: Observable<Site[]>;
  @HasOne(ACCOUNT, (m: Project) => m.creatorId)
  public creator?: Observable<User>;
  @HasOne(ACCOUNT, (m: Project) => m.updaterId)
  public updater?: Observable<User>;
  @HasOne(ACCOUNT, (m: Project) => m.ownerId)
  public owner?: Observable<User>;

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

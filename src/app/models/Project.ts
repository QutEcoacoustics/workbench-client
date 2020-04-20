import { Injector } from "@angular/core";
import { AccountService } from "@baw-api/account.service";
import { ACCOUNT_SERVICE, SHALLOW_SITES_SERVICE } from "@baw-api/ServiceTokens";
import type { ShallowSitesService } from "@baw-api/sites.service";
import { Observable, of } from "rxjs";
import { projectMenuItem } from "../component/projects/projects.menus";
import { Card } from "../component/shared/cards/cards.component";
import {
  DateTimeTimezone,
  dateTimeTimezone,
  Description,
  Id,
  Ids,
  Param,
} from "../interfaces/apiInterfaces";
import { AbstractModel, HasMany, HasOne } from "./AbstractModel";
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
  siteIds?: Ids;
}

/**
 * A project model.
 */
export class Project extends AbstractModel implements IProject {
  public readonly kind: "Project" = "Project";
  public readonly id?: Id;
  public readonly name?: Param;
  public readonly description?: Description;
  public readonly imageUrl?: string;
  @HasOne<User, AccountService>(ACCOUNT_SERVICE)
  public readonly creatorId?: Id;
  public readonly createdAt?: DateTimeTimezone;
  @HasOne<User, AccountService>(ACCOUNT_SERVICE)
  public readonly updaterId?: Id;
  public readonly updatedAt?: DateTimeTimezone;
  @HasOne<User, AccountService>(ACCOUNT_SERVICE)
  public readonly ownerId?: Id;
  @HasMany<Site, ShallowSitesService>(SHALLOW_SITES_SERVICE)
  public readonly siteIds?: Ids;

  // Associations
  public readonly sites?: Observable<Site[]>;
  public readonly creator?: Observable<Id>;
  public readonly updater?: Observable<Id>;
  public readonly owner?: Observable<Id>;

  constructor(project: IProject, injector?: Injector) {
    super(project, injector);

    this.imageUrl =
      project.imageUrl || "/assets/images/project/project_span4.png";
    this.createdAt = dateTimeTimezone(project.createdAt as string);
    this.updatedAt = dateTimeTimezone(project.updatedAt as string);
    this.siteIds = new Set(project.siteIds || []);
  }

  public toJSON() {
    // TODO Add image key
    return {
      id: this.id,
      name: this.name,
      description: this.description,
    };
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

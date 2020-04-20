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
import { AbstractModel } from "./AbstractModel";
import type { Site } from "./Site";
import { User } from "./User";

/**
 * A project model.
 */
export interface IProject {
  id?: Id;
  name?: Param;
  imageUrl?: string;
  creatorId?: Id;
  createdAt?: DateTimeTimezone | string;
  updaterId?: Id;
  updatedAt?: DateTimeTimezone | string;
  ownerId?: Id;
  description?: Description;
  siteIds?: Ids;
}

/**
 * A project model.
 */
export class Project extends AbstractModel implements IProject {
  public readonly kind: "Project" = "Project";
  public readonly id?: Id;
  public readonly name?: Param;
  public readonly imageUrl?: string;
  public readonly siteIds?: Ids;
  public readonly creatorId?: Id;
  public readonly createdAt?: DateTimeTimezone;
  public readonly updaterId?: Id;
  public readonly updatedAt?: DateTimeTimezone;
  public readonly ownerId?: Id;
  public readonly description?: Description;
  private _sites?: Site[];
  private _creator?: User;
  private _updater?: User;

  constructor(project: IProject, injector?: Injector) {
    super(project, injector);

    this.imageUrl =
      project.imageUrl || "/assets/images/project/project_span4.png";
    this.createdAt = dateTimeTimezone(project.createdAt as string);
    this.updatedAt = dateTimeTimezone(project.updatedAt as string);
    this.siteIds = new Set(project.siteIds || []);
  }

  public get sites(): Observable<Site[]> {
    // Returned cached sites
    if (this._sites) {
      return of(this._sites);
    }

    // Get sites
    return this.getModels<Site, ShallowSitesService>(
      SHALLOW_SITES_SERVICE,
      (sites) => (this._sites = sites),
      this.siteIds
    );
  }

  public get creator(): Observable<User> {
    // Returned cached creator
    if (this._creator) {
      return of(this._creator);
    }

    // Get creator
    return this.getModel<User, AccountService>(
      ACCOUNT_SERVICE,
      (creator) => (this._creator = creator),
      this.creatorId
    );
  }

  public get updater(): Observable<User> {
    // Returned cached creator
    if (this._updater) {
      return of(this._updater);
    }

    // Get creator
    return this.getModel<User, AccountService>(
      ACCOUNT_SERVICE,
      (updater) => (this._updater = updater),
      this.updaterId
    );
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

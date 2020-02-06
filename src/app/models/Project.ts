import { DateTime } from "luxon";
import { projectMenuItem } from "../component/projects/projects.menus";
import { Card } from "../component/shared/cards/cards.component";
import {
  DateTimeTimezone,
  defaultDateTimeTimezone,
  Description,
  Id,
  Ids,
  Param
} from "../interfaces/apiInterfaces";
import { AbstractModel } from "./AbstractModel";

/**
 * A project model.
 */
export interface ProjectInterface {
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
export class Project extends AbstractModel implements ProjectInterface {
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

  constructor(project: ProjectInterface) {
    super(project);

    // TODO: most of these are redundant - reimplement with properties?
    this.imageUrl =
      project.imageUrl || "/assets/images/project/project_span4.png";
    this.createdAt = project.createdAt
      ? DateTime.fromISO(project.createdAt as string, {
          setZone: true
        })
      : defaultDateTimeTimezone;
    this.updatedAt = project.updatedAt
      ? DateTime.fromISO(project.updatedAt as string, {
          setZone: true
        })
      : defaultDateTimeTimezone;
    this.siteIds = new Set(project.siteIds || []);
  }

  static fromJSON = (obj: any) => {
    if (typeof obj === "string") {
      obj = JSON.parse(obj);
    }

    return new Project(obj);
  };

  // TODO Implement
  toJSON = () => {
    return { test: true };
  };

  /**
   * Generate card-item details
   * TODO Extract this out, should not be implemented here
   */
  getCard(): Card {
    return {
      title: this.name,
      description: this.description,
      image: {
        url: this.imageUrl,
        alt: this.name
      },
      route: this.redirectPath()
    };
  }

  redirectPath(): string {
    return projectMenuItem.route.format({ projectId: this.id });
  }
}

Project.prototype.toJSON = () => {
  return this.toJSON();
};

export const mockProject = new Project({
  id: 1,
  name: "name",
  description: "description",
  creatorId: 1,
  siteIds: new Set([1])
});

import { DateTime } from "luxon";
import { projectMenuItem } from "../component/projects/projects.menus";
import { Card } from "../component/shared/cards/cards.component";
import {
  DateTimeTimezone,
  defaultDateTimeTimezone,
  Description,
  ID,
  IDs,
  Name
} from "../interfaces/apiInterfaces";

/**
 * A project model.
 */
export interface ProjectInterface {
  kind?: "Project";
  id: ID;
  name: Name;
  imageUrl?: string;
  creatorId: ID;
  createdAt?: DateTimeTimezone | string;
  updaterId?: ID;
  updatedAt?: DateTimeTimezone | string;
  ownerId?: ID;
  description?: Description;
  siteIds: IDs;
}

/**
 * A project model.
 */
export class Project implements ProjectInterface {
  public readonly kind: "Project";
  public readonly id: ID;
  public readonly name: Name;
  public readonly imageUrl: string;
  public readonly siteIds: IDs;
  public readonly creatorId: ID;
  public readonly createdAt?: DateTimeTimezone;
  public readonly updaterId?: ID;
  public readonly updatedAt?: DateTimeTimezone;
  public readonly ownerId?: ID;
  public readonly description?: Description;

  constructor(project: ProjectInterface) {
    this.kind = "Project";

    this.id = project.id;
    this.name = project.name;
    this.imageUrl =
      project.imageUrl || "/assets/images/project/project_span4.png";
    this.creatorId = project.creatorId;
    this.createdAt = project.createdAt
      ? DateTime.fromISO(project.createdAt as string, {
          setZone: true
        })
      : defaultDateTimeTimezone;
    this.updaterId = project.updaterId;
    this.updatedAt = project.updatedAt
      ? DateTime.fromISO(project.updatedAt as string, {
          setZone: true
        })
      : defaultDateTimeTimezone;
    this.ownerId = project.ownerId;
    this.description = project.description;
    this.siteIds = new Set(project.siteIds);
  }

  get projectUrl(): string {
    return projectMenuItem.route.format({ projectId: this.id });
  }

  /**
   * Generate card-item details
   */
  get card(): Card {
    return {
      title: this.name,
      description: this.description,
      image: {
        url: this.imageUrl,
        alt: this.name
      },
      route: this.projectUrl
    };
  }
}

export const mockProject = new Project({
  id: 1,
  name: "name",
  description: "description",
  creatorId: 1,
  siteIds: new Set([1])
});

import { projectMenuItem } from "../component/projects/projects.menus";
import { Card } from "../component/shared/cards/cards.component";
import {
  DateTime,
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
  createdAt?: DateTime | string;
  updaterId?: ID;
  updatedAt?: DateTime | string;
  ownerId?: ID;
  description: Description;
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
  public readonly creatorId: ID;
  public readonly createdAt?: DateTime;
  public readonly updaterId?: ID;
  public readonly updatedAt?: DateTime;
  public readonly ownerId?: ID;
  public readonly description: Description;
  public readonly siteIds: IDs;

  constructor(project: ProjectInterface) {
    this.kind = "Project";

    this.id = project.id;
    this.name = project.name;
    this.imageUrl =
      project.imageUrl || "/assets/images/project/project_span4.png";
    this.creatorId = project.creatorId;
    this.createdAt = project.createdAt
      ? new Date(project.createdAt)
      : new Date("1970-01-01T00:00:00.000");
    this.updaterId = project.updaterId;
    this.updatedAt = project.updatedAt
      ? new Date(project.updatedAt)
      : new Date("1970-01-01T00:00:00.000");
    this.ownerId = project.ownerId;
    this.description = project.description;
    this.siteIds = new Set(project.siteIds);
  }

  get projectUrl(): string {
    return projectMenuItem.route
      .toString()
      .replace(":projectId", this.id.toString());
  }

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

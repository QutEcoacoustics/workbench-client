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
      route: this.navigationPath(),
    };
  }

  public navigationPath(): string {
    return projectMenuItem.route.format({ projectId: this.id });
  }
}

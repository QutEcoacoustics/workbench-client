import { projectMenuItem } from "../component/projects/projects.menus";
import { Card } from "../component/shared/cards/cards.component";

/**
 * A project model.
 */
export interface ProjectInterface {
  creatorId: number;
  description: string;
  id: number;
  name: string;
  siteIds: Set<number>;
  imageUrl?: string;
}

/**
 * A project model.
 */
export class Project implements ProjectInterface {
  public readonly id: number;
  public readonly name: string;
  public readonly imageUrl: string;
  public readonly creatorId: number;
  public readonly description: string;
  public readonly siteIds: Set<number>;

  constructor(project: ProjectInterface) {
    this.id = project.id;
    this.name = project.name;
    this.imageUrl =
      project.imageUrl || "/assets/images/project/project_span4.png";
    this.creatorId = project.creatorId;
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

/**
 * A project model.
 */
export interface ProjectInterface {
  creatorId: number;
  description: string;
  id: number;
  name: string;
  siteIds: Set<number>;
}

/**
 * A project model.
 */
export class Project implements ProjectInterface {
  public readonly id: number;
  public readonly name: string;
  public readonly creatorId: number;
  public readonly description: string;
  public readonly siteIds: Set<number>;

  constructor(project: ProjectInterface) {
    this.id = project.id;
    this.name = project.name;
    this.creatorId = project.creatorId;
    this.description = project.description;
    this.siteIds = new Set(project.siteIds);
  }
}

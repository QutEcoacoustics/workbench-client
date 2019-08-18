/**
 * A project model.
 */
export interface ProjectInterface {
  creatorId: number;
  description: string;
  id: number;
  name: string;
  siteIds: number[];
}

/**
 * A project model.
 */
export class Project implements ProjectInterface {
  /**
   * Constructor
   * @param id Project ID
   * @param name Project name
   * @param creatorId Project creator user ID
   * @param description Project description
   * @param siteIds List of associated site ID's
   */
  constructor(
    public readonly id: number,
    public readonly name: string,
    public readonly creatorId: number,
    public readonly description: string,
    public readonly siteIds: number[]
  ) {}
}

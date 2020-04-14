import {
  DateTimeTimezone,
  dateTimeTimezone,
  Description,
  Id,
  Param,
} from "@interfaces/apiInterfaces";
import { AbstractModel } from "./AbstractModel";

export interface IDataset {
  id?: Id;
  creatorId?: Id;
  updaterId?: Id;
  name?: Param;
  description?: Description;
  createdAt?: DateTimeTimezone | string;
  updatedAt?: DateTimeTimezone | string;
}

export class Dataset extends AbstractModel implements IDataset {
  public readonly kind: "Dataset" = "Dataset";
  public readonly id?: Id;
  public readonly creatorId?: Id;
  public readonly updaterId?: Id;
  public readonly name?: Param;
  public readonly description?: Description;
  public readonly createdAt?: DateTimeTimezone;
  public readonly updatedAt?: DateTimeTimezone;

  constructor(dataset: IDataset) {
    super(dataset);

    this.createdAt = dateTimeTimezone(dataset.createdAt as string);
    this.updatedAt = dateTimeTimezone(dataset.updatedAt as string);
  }

  public toJSON() {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
    };
  }

  public navigationPath(): string {
    return "/BROKEN_LINK";
  }
}

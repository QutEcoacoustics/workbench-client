import { DATASET } from "@baw-api/ServiceTokens";
import { citSciAboutMenuItem } from "@components/citizen-science/citizen-science.menus";
import {
  DateTimeTimezone,
  HasCreatorAndUpdater,
  Id,
  Param,
} from "@interfaces/apiInterfaces";
import { AbstractModel } from "./AbstractModel";
import { creator, hasOne, updater } from "./AssociationDecorators";
import { bawDateTime, bawPersistAttr } from "./AttributeDecorators";
import type { Dataset } from "./Dataset";
import type { User } from "./User";

export interface IStudy extends HasCreatorAndUpdater {
  id?: Id;
  name?: Param;
  datasetId?: Id;
}

export class Study extends AbstractModel<IStudy> implements IStudy {
  public readonly kind = "Studies";
  @bawPersistAttr
  public readonly id?: Id;
  @bawPersistAttr
  public readonly name?: Param;
  public readonly creatorId?: Id;
  public readonly updaterId?: Id;
  @bawPersistAttr
  public readonly datasetId?: Id;
  @bawDateTime()
  public readonly createdAt?: DateTimeTimezone;
  @bawDateTime()
  public readonly updatedAt?: DateTimeTimezone;

  // Associations
  @creator<Study>()
  public creator?: User;
  @updater<Study>()
  public updater?: User;
  @hasOne<Study, Dataset>(DATASET, "datasetId")
  public dataset?: Dataset;

  public get viewUrl(): string {
    return citSciAboutMenuItem.route.format({ studyName: this.name });
  }
}

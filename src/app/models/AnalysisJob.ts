import { Injector } from "@angular/core";
import { SAVED_SEARCH, SCRIPT } from "@baw-api/ServiceTokens";
import { Duration } from "luxon";
import { Observable } from "rxjs";
import {
  DateTimeTimezone,
  Description,
  Id,
  Param,
} from "../interfaces/apiInterfaces";
import {
  AbstractModel,
  BawDateTime,
  BawDuration,
  BawPersistAttr,
  Creator,
  Deleter,
  HasOne,
  Updater,
} from "./AbstractModel";
import type { SavedSearch } from "./SavedSearch";
import type { Script } from "./Script";
import type { User } from "./User";

/**
 * An analysis job model.
 */
export interface IAnalysisJob {
  id?: Id;
  name?: Param;
  annotationName?: string;
  customSettings?: Blob;
  scriptId?: Id;
  creatorId?: Id;
  updaterId?: Id;
  deleterId?: Id;
  createdAt?: DateTimeTimezone | string;
  updatedAt?: DateTimeTimezone | string;
  deletedAt?: DateTimeTimezone | string;
  description?: Description;
  savedSearchId?: Id;
  startedAt?: DateTimeTimezone | string;
  overallStatus?: Status;
  overallStatusModifiedAt?: DateTimeTimezone | string;
  overallProgress?: object;
  overallProgressModifiedAt?: DateTimeTimezone | string;
  overallCount?: number;
  overallDurationSeconds?: number;
  overallDataLengthBytes?: number;
}

export class AnalysisJob extends AbstractModel implements IAnalysisJob {
  public readonly kind: "AnalysisJob" = "AnalysisJob";
  @BawPersistAttr
  public readonly id?: Id;
  @BawPersistAttr
  public readonly name?: Param;
  @BawPersistAttr
  public readonly annotationName?: string;
  @BawPersistAttr
  public readonly customSettings?: Blob;
  @BawPersistAttr
  public readonly description?: Description;
  public readonly scriptId?: Id;
  public readonly creatorId?: Id;
  public readonly updaterId?: Id;
  public readonly deleterId?: Id;
  @BawDateTime()
  public readonly createdAt?: DateTimeTimezone;
  @BawDateTime()
  public readonly updatedAt?: DateTimeTimezone;
  @BawDateTime()
  public readonly deletedAt?: DateTimeTimezone;
  public readonly savedSearchId?: Id;
  @BawDateTime()
  public readonly startedAt?: DateTimeTimezone;
  public readonly overallStatus?: Status;
  @BawDateTime()
  public readonly overallStatusModifiedAt?: DateTimeTimezone;
  public readonly overallProgress?: object;
  @BawDateTime()
  public readonly overallProgressModifiedAt?: DateTimeTimezone;
  public readonly overallCount?: number;
  @BawDuration({ key: "overallDurationSeconds" })
  public readonly overallDuration?: Duration;
  public readonly overallDurationSeconds?: number;
  public readonly overallDataLengthBytes?: number;

  // Associations
  @Creator<AnalysisJob>()
  public creator: Observable<User>;
  @Updater<AnalysisJob>()
  public updater?: Observable<User>;
  @Deleter<AnalysisJob>()
  public deleter?: Observable<User>;
  @HasOne(SCRIPT, (m: AnalysisJob) => m.scriptId)
  public script?: Observable<Script>;
  @HasOne(SAVED_SEARCH, (m: AnalysisJob) => m.savedSearchId)
  public savedSearch?: Observable<SavedSearch>;

  constructor(analysisJob: IAnalysisJob, injector?: Injector) {
    super(analysisJob, injector);
  }

  public get viewUrl(): string {
    throw new Error("AnalysisJob viewUrl not implemented.");
  }

  public toString(): string {
    return this.name;
  }
}

type Status =
  | "before_save"
  | "new"
  | "preparing"
  | "processing"
  | "suspended"
  | "completed";

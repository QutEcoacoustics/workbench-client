import { Injector } from "@angular/core";
import { SAVED_SEARCH, SCRIPT } from "@baw-api/ServiceTokens";
import { adminAnalysisJobMenuItem } from "@components/admin/analysis-jobs/analysis-jobs.menus";
import { audioAnalysisMenuItem } from "@components/audio-analysis/audio-analysis.menus";
import { Duration } from "luxon";
import {
  DateTimeTimezone,
  Description,
  HasAllUsers,
  HasDescription,
  Hash,
  Id,
  Param,
} from "../interfaces/apiInterfaces";
import { AbstractModel } from "./AbstractModel";
import { creator, deleter, hasOne, updater } from "./AssociationDecorators";
import {
  bawDateTime,
  bawDuration,
  bawPersistAttr,
} from "./AttributeDecorators";
import type { SavedSearch } from "./SavedSearch";
import type { Script } from "./Script";
import type { User } from "./User";

/**
 * An analysis job model.
 */
export interface IAnalysisJob extends HasAllUsers, HasDescription {
  id?: Id;
  name?: Param;
  annotationName?: Param;
  customSettings?: Hash;
  scriptId?: Id;
  savedSearchId?: Id;
  startedAt?: DateTimeTimezone | string;
  overallStatus?: AnalysisJobStatus;
  overallStatusModifiedAt?: DateTimeTimezone | string;
  overallProgress?: Hash;
  overallProgressModifiedAt?: DateTimeTimezone | string;
  overallCount?: number;
  overallDurationSeconds?: number;
  overallDataLengthBytes?: number;
}

export class AnalysisJob extends AbstractModel implements IAnalysisJob {
  public readonly kind = "analysis_job";
  public readonly id?: Id;
  @bawPersistAttr()
  public readonly name?: Param;
  @bawPersistAttr()
  public readonly annotationName?: Param;
  @bawPersistAttr()
  public readonly customSettings?: Hash;
  @bawPersistAttr()
  public readonly description?: Description;
  public readonly descriptionHtml?: Description;
  public readonly descriptionHtmlTagline?: Description;
  public readonly scriptId?: Id;
  public readonly creatorId?: Id;
  public readonly updaterId?: Id;
  public readonly deleterId?: Id;
  @bawDateTime()
  public readonly createdAt?: DateTimeTimezone;
  @bawDateTime()
  public readonly updatedAt?: DateTimeTimezone;
  @bawDateTime()
  public readonly deletedAt?: DateTimeTimezone;
  public readonly savedSearchId?: Id;
  @bawDateTime()
  public readonly startedAt?: DateTimeTimezone;
  public readonly overallStatus?: AnalysisJobStatus;
  @bawDateTime()
  public readonly overallStatusModifiedAt?: DateTimeTimezone;
  public readonly overallProgress?: Hash;
  @bawDateTime()
  public readonly overallProgressModifiedAt?: DateTimeTimezone;
  public readonly overallCount?: number;
  @bawDuration<AnalysisJob>({ key: "overallDurationSeconds" })
  public readonly overallDuration?: Duration;
  public readonly overallDurationSeconds?: number;
  public readonly overallDataLengthBytes?: number;

  // Associations
  @creator<AnalysisJob>()
  public creator: User;
  @updater<AnalysisJob>()
  public updater?: User;
  @deleter<AnalysisJob>()
  public deleter?: User;
  @hasOne<AnalysisJob, Script>(SCRIPT, "scriptId")
  public script?: Script;
  @hasOne<AnalysisJob, SavedSearch>(SAVED_SEARCH, "savedSearchId")
  public savedSearch?: SavedSearch;

  public constructor(analysisJob: IAnalysisJob, injector?: Injector) {
    super(analysisJob, injector);
  }

  public get viewUrl(): string {
    return audioAnalysisMenuItem.route.format({
      analysisJobId: this.id,
    });
  }

  /**
   * Gets the route path for the admin details page for this model
   */
  public get adminViewUrl(): string {
    return adminAnalysisJobMenuItem.route.format({
      analysisJobId: this.id,
    });
  }
}

export type AnalysisJobStatus =
  | "before_save"
  | "new"
  | "preparing"
  | "processing"
  | "suspended"
  | "completed";

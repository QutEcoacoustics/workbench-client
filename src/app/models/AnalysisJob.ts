import { AUDIO_EVENT_IMPORT, PROJECT, SCRIPT } from "@baw-api/ServiceTokens";
import { adminAnalysisJobMenuItem } from "@components/admin/analysis-jobs/analysis-jobs.menus";
import { audioAnalysisMenuJobItem } from "@components/audio-analysis/audio-analysis.menus";
import { Duration } from "luxon";
import { InnerFilter } from "@baw-api/baw-api.service";
import {
  DateTimeTimezone,
  Description,
  HasAllUsers,
  HasDescription,
  HasFilter,
  Id,
  Ids,
  Param,
} from "../interfaces/apiInterfaces";
import { AbstractModel } from "./AbstractModel";
import { creator, deleter, hasMany, hasOne, updater } from "./AssociationDecorators";
import {
  bawBytes,
  bawCollection,
  bawDateTime,
  bawDuration,
  bawPersistAttr,
} from "./AttributeDecorators";
import type { Script } from "./Script";
import type { User } from "./User";
import { AssociationInjector } from "./ImplementsInjector";
import { AudioEventImport } from "./AudioEventImport";
import { Project } from "./Project";

export type AnalysisJobStatus =
  | "beforeSave"
  | "new"
  | "preparing"
  | "processing"
  | "suspended"
  | "completed";

export interface OverallProgress {
  statusNewCount?: number;

  resultSuccessCount?: number;
  resultFailedCount?: number;
  resultKilledCount?: number;
  resultCancelledCount?: number;
  resultEmptyCount?: number;

  statusQueuedCount?: number;
  statusWorkingCount?: number;
  statusFinishedCount?: number;

  transitionQueueCount?: number;
  transitionFinishedCount?: number;
  transitionRetryCount?: number;
  transitionCancelCount?: number;
  transitionEmptyCount?: number;
}

/**
 * An analysis job model.
 */
export interface IAnalysisJob extends HasAllUsers, HasDescription, HasFilter {
  id?: Id;
  name?: Param;
  scriptIds?: Id[] | Ids;
  audioEventImportIds?: Id[] | Ids;
  projectId?: Id;

  ongoing?: boolean;
  systemJob?: boolean;

  startedAt?: DateTimeTimezone | string;

  overallStatus?: AnalysisJobStatus;
  overallStatusModifiedAt?: DateTimeTimezone | string;
  overallProgress?: OverallProgress;
  overallProgressModifiedAt?: DateTimeTimezone | string;
  overallCount?: number;
  overallDurationSeconds?: number;
  overallDataLengthBytes?: number;

  amendCount?: number;
  resumeCount?: number;
  retryCount?: number;
  suspendCount?: number;
}

export class AnalysisJob extends AbstractModel implements IAnalysisJob {
  public readonly kind = "Analysis Job";
  public readonly id?: Id;
  @bawPersistAttr()
  public readonly name?: Param;
  public readonly filter?: InnerFilter;
  @bawPersistAttr()
  public readonly description?: Description;
  public readonly descriptionHtml?: Description;
  public readonly descriptionHtmlTagline?: Description;
  @bawCollection({ persist: false })
  public readonly scriptIds?: Ids;
  public readonly audioEventImportIds?: Id[] | Ids;
  public readonly creatorId?: Id;
  public readonly updaterId?: Id;
  public readonly deleterId?: Id;
  @bawPersistAttr()
  public readonly projectId?: Id;
  @bawDateTime()
  public readonly createdAt?: DateTimeTimezone;
  @bawDateTime()
  public readonly updatedAt?: DateTimeTimezone;
  @bawDateTime()
  public readonly deletedAt?: DateTimeTimezone;
  @bawDateTime()
  public readonly startedAt?: DateTimeTimezone;
  @bawPersistAttr({ create: true, update: true, convertCase: true })
  public readonly overallStatus?: AnalysisJobStatus;

  public readonly amendCount?: number;
  public readonly ongoing?: boolean;
  public readonly systemJob?: boolean;
  public readonly resumeCount?: number;
  public readonly retryCount?: number;
  public readonly suspendCount?: number;
  @bawDateTime()
  public readonly overallStatusModifiedAt?: DateTimeTimezone;
  public readonly overallProgress?: OverallProgress;
  @bawDateTime()
  public readonly overallProgressModifiedAt?: DateTimeTimezone;
  public readonly overallCount?: number;
  @bawDuration<AnalysisJob>({ key: "overallDurationSeconds" })
  public readonly overallDuration?: Duration;
  public readonly overallDurationSeconds?: number;
  public readonly overallDataLengthBytes?: number;
  @bawBytes({ key: "overallDataLengthBytes" })
  public readonly overallDataLength?: string;

  // Associations
  @creator<AnalysisJob>()
  public creator: User;
  @updater<AnalysisJob>()
  public updater?: User;
  @deleter<AnalysisJob>()
  public deleter?: User;
  @hasOne<AnalysisJob, Project>(PROJECT, "projectId")
  public project?: Project;
  @hasMany<AnalysisJob, Script>(SCRIPT, "scriptIds")
  public scripts?: Script[];
  @hasMany<AnalysisJob, AudioEventImport>(AUDIO_EVENT_IMPORT, "audioEventImportIds")
  public audioEventImports?: AudioEventImport[];

  public constructor(analysisJob: IAnalysisJob, injector?: AssociationInjector) {
    super(analysisJob, injector);
  }

  public get viewUrl(): string {
    if (this.systemJob || this.projectId === null) {
      return this.adminViewUrl;
    }

    return audioAnalysisMenuJobItem.route.format({
      analysisJobId: this.id,
      projectId: this.projectId,
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

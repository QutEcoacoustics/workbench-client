import { Injector } from '@angular/core';
import { SAVED_SEARCH, SCRIPT } from '@baw-api/ServiceTokens';
import { adminAnalysisJobMenuItem } from '@components/admin/analysis-jobs/analysis-jobs.menus';
import { analysisJobMenuItem } from '@helpers/page/externalMenus';
import { Duration } from 'luxon';
import {
  DateTimeTimezone,
  Description,
  HasAllUsers,
  HasDescription,
  Id,
  Param,
} from '../interfaces/apiInterfaces';
import { AbstractModel } from './AbstractModel';
import { Creator, Deleter, HasOne, Updater } from './AssociationDecorators';
import {
  BawDateTime,
  BawDuration,
  BawPersistAttr,
} from './AttributeDecorators';
import type { SavedSearch } from './SavedSearch';
import type { Script } from './Script';
import type { User } from './User';

/**
 * An analysis job model.
 */
export interface IAnalysisJob extends HasAllUsers, HasDescription {
  id?: Id;
  name?: Param;
  annotationName?: Param;
  customSettings?: Blob | object;
  scriptId?: Id;
  savedSearchId?: Id;
  startedAt?: DateTimeTimezone | string;
  overallStatus?: AnalysisJobStatus;
  overallStatusModifiedAt?: DateTimeTimezone | string;
  overallProgress?: object;
  overallProgressModifiedAt?: DateTimeTimezone | string;
  overallCount?: number;
  overallDurationSeconds?: number;
  overallDataLengthBytes?: number;
}

export class AnalysisJob extends AbstractModel implements IAnalysisJob {
  public readonly kind = 'AnalysisJob';
  @BawPersistAttr
  public readonly id?: Id;
  @BawPersistAttr
  public readonly name?: Param;
  @BawPersistAttr
  public readonly annotationName?: Param;
  @BawPersistAttr
  public readonly customSettings?: Blob;
  @BawPersistAttr
  public readonly description?: Description;
  public readonly descriptionHtml?: Description;
  public readonly descriptionHtmlTagline?: Description;
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
  public readonly overallStatus?: AnalysisJobStatus;
  @BawDateTime()
  public readonly overallStatusModifiedAt?: DateTimeTimezone;
  public readonly overallProgress?: object;
  @BawDateTime()
  public readonly overallProgressModifiedAt?: DateTimeTimezone;
  public readonly overallCount?: number;
  @BawDuration<AnalysisJob>({ key: 'overallDurationSeconds' })
  public readonly overallDuration?: Duration;
  public readonly overallDurationSeconds?: number;
  public readonly overallDataLengthBytes?: number;

  // Associations
  @Creator<AnalysisJob>()
  public creator: User;
  @Updater<AnalysisJob>()
  public updater?: User;
  @Deleter<AnalysisJob>()
  public deleter?: User;
  @HasOne<AnalysisJob, Script>(SCRIPT, 'scriptId')
  public script?: Script;
  @HasOne<AnalysisJob, SavedSearch>(SAVED_SEARCH, 'savedSearchId')
  public savedSearch?: SavedSearch;

  constructor(analysisJob: IAnalysisJob, injector?: Injector) {
    super(analysisJob, injector);
  }

  public get viewUrl(): string {
    return analysisJobMenuItem.uri(undefined);
  }

  /**
   * Gets the route path for the admin details page for this model
   */
  public get adminViewUrl(): string {
    return adminAnalysisJobMenuItem.route.format({ analysisJobId: this.id });
  }
}

export type AnalysisJobStatus =
  | 'before_save'
  | 'new'
  | 'preparing'
  | 'processing'
  | 'suspended'
  | 'completed';

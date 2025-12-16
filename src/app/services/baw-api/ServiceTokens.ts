/**
 * Purpose of this file is to create a disconnect between the services
 * and being able to call them from the models. If the disconnect does not
 * exist, when you attempt to add association loading to the model it
 * will cause a circular dependency.
 */

import { InjectionToken } from "@angular/core";
import type { AbstractModel } from "@models/AbstractModel";
import type { AnalysisJob } from "@models/AnalysisJob";
import type { AnalysisJobItem } from "@models/AnalysisJobItem";
import type { AnalysisJobItemResult } from "@models/AnalysisJobItemResult";
import type { AudioEvent } from "@models/AudioEvent";
import type { AudioEventImport } from "@models/AudioEventImport";
import type { AudioEventImportFile } from "@models/AudioEventImportFile";
import type { AudioRecording } from "@models/AudioRecording";
import type { Bookmark } from "@models/Bookmark";
import type { Annotation } from "@models/data/Annotation";
import type { ContactUs } from "@models/data/ContactUs";
import type { DataRequest } from "@models/data/DataRequest";
import type { ReportProblem } from "@models/data/ReportProblem";
import type { Dataset } from "@models/Dataset";
import type { DatasetItem } from "@models/DatasetItem";
import type { EventSummaryReport } from "@models/EventSummaryReport";
import type { Harvest } from "@models/Harvest";
import type { HarvestItem } from "@models/HarvestItem";
import type { Permission } from "@models/Permission";
import type { ProgressEvent } from "@models/ProgressEvent";
import type { Project } from "@models/Project";
import { Provenance } from "@models/Provenance";
import type { Question } from "@models/Question";
import type { Region } from "@models/Region";
import type { Response } from "@models/Response";
import type { SavedSearch } from "@models/SavedSearch";
import type { Script } from "@models/Script";
import type { Site } from "@models/Site";
import type { SiteSetting } from "@models/SiteSetting";
import type { Statistics } from "@models/Statistics";
import type { Study } from "@models/Study";
import type { Tag } from "@models/Tag";
import type { Tagging } from "@models/Tagging";
import type { TagGroup } from "@models/TagGroup";
import type { User } from "@models/User";
import type { Verification } from "@models/Verification";
import type { WebsiteStatus } from "@models/WebsiteStatus";
import type { MediaService } from "@services/media/media.service";
import type { AnnotationService } from "@services/models/annotations/annotation.service";
import type { AccountsService } from "./account/accounts.service";
import type { AnalysisJobItemResultsService } from "./analysis/analysis-job-item-result.service";
import type { AnalysisJobItemsService } from "./analysis/analysis-job-items.service";
import type { AnalysisJobsService } from "./analysis/analysis-jobs.service";
import type {
  AudioEventImportFileService,
  ShallowAudioEventImportFileService,
} from "./audio-event-import-file/audio-event-import-file.service";
import type { AudioEventImportService } from "./audio-event-import/audio-event-import.service";
import type {
  AudioEventsService,
  ShallowAudioEventsService,
} from "./audio-event/audio-events.service";
import type { AudioRecordingsService } from "./audio-recording/audio-recordings.service";
import type { BookmarksService } from "./bookmark/bookmarks.service";
import type { DataRequestService } from "./data-request/data-request.service";
import type { DatasetItemsService } from "./dataset/dataset-items.service";
import type { DatasetsService } from "./dataset/datasets.service";
import { GroupedAudioEventsService } from "./grouped-audio-events/grouped-audio-events.service";
import type {
  HarvestItemsService,
  ShallowHarvestItemsService,
} from "./harvest/harvest-items.service";
import type {
  HarvestsService,
  ShallowHarvestsService,
} from "./harvest/harvest.service";
import type { PermissionsService } from "./permissions/permissions.service";
import type { ProgressEventsService } from "./progress-event/progress-events.service";
import type { ProjectsService } from "./project/projects.service";
import { ProvenanceService } from "./provenance/provenance.service";
import type {
  RegionsService,
  ShallowRegionsService,
} from "./region/regions.service";
import type { ContactUsService } from "./report/contact-us.service";
import type { ReportProblemService } from "./report/report-problem.service";
import type { EventSummaryReportService } from "./reports/event-report/event-summary-report.service";
import type { SavedSearchesService } from "./saved-search/saved-searches.service";
import type { ScriptsService } from "./script/scripts.service";
import type { SiteSettingsService } from "./site-settings/site-settings.service";
import { ShallowSitesService, SitesService } from "./site/sites.service";
import type { StatisticsService } from "./statistics/statistics.service";
import type {
  QuestionsService,
  ShallowQuestionsService,
} from "./study/questions.service";
import type {
  ResponsesService,
  ShallowResponsesService,
} from "./study/responses.service";
import type { StudiesService } from "./study/studies.service";
import type { TagGroupsService } from "./tag/tag-group.service";
import type { TaggingsService } from "./tag/taggings.service";
import type { TagsService } from "./tag/tags.service";
import type { UserService } from "./user/user.service";
import type { ShallowVerificationService, VerificationService } from "./verification/verification.service";
import type { WebsiteStatusService } from "./website-status/website-status.service";

/**
 * Wrapper for InjectionToken class. This is required because of
 * https://github.com/angular/angular/issues/36736.
 */
export class ServiceToken<
  Service,
  Child extends AbstractModel = AbstractModel,
  Params extends any[] = []
> {
  public kind: Readonly<string>;
  public model: Child;
  public params: Params;
  public token: InjectionToken<Service>;

  public constructor(_desc: string) {
    this.kind = _desc;
    this.token = new InjectionToken<Service>(_desc);
  }
}

export const ACCOUNT = new ServiceToken<AccountsService, User>("ACCOUNT");
export const ANALYSIS_JOB = new ServiceToken<AnalysisJobsService, AnalysisJob>("ANALYSIS_JOB");
export const ANALYSIS_JOB_ITEM = new ServiceToken<AnalysisJobItemsService, AnalysisJobItem>("ANALYSIS_JOB_ITEM");
export const ANALYSIS_JOB_ITEM_RESULTS = new ServiceToken<AnalysisJobItemResultsService, AnalysisJobItemResult>("A_JOB_ITEM_RESULTS");
export const AUDIO_EVENT = new ServiceToken<AudioEventsService, AudioEvent>("AUDIO");
export const SHALLOW_AUDIO_EVENT = new ServiceToken<ShallowAudioEventsService, AudioEvent>("S_AUDIO");
export const AUDIO_RECORDING = new ServiceToken<AudioRecordingsService, AudioRecording>("RECORDING");
export const CONTACT_US = new ServiceToken<ContactUsService, ContactUs>("CONTACT_US");
export const BOOKMARK = new ServiceToken<BookmarksService, Bookmark>("BOOKMARK");
export const DATASET = new ServiceToken<DatasetsService, Dataset>("DATASET");
export const DATASET_ITEM = new ServiceToken<DatasetItemsService, DatasetItem>("D_ITEM");
export const DATA_REQUEST = new ServiceToken<DataRequestService, DataRequest>("DATA_REQUEST");
export const HARVEST = new ServiceToken<HarvestsService, Harvest>("HARVEST");
export const SHALLOW_HARVEST = new ServiceToken<ShallowHarvestsService, Harvest>("SHALLOW_HARVEST");
export const HARVEST_ITEM = new ServiceToken<HarvestItemsService, HarvestItem>("HARVEST_ITEM");
export const SHALLOW_HARVEST_ITEM = new ServiceToken<ShallowHarvestItemsService, HarvestItem>("SHALLOW_HARVEST_ITEM");
export const PERMISSION = new ServiceToken<PermissionsService, Permission>("PROGRESS");
export const PROGRESS_EVENT = new ServiceToken<ProgressEventsService, ProgressEvent>("PROGRESS");
export const PROJECT = new ServiceToken<ProjectsService, Project>("PROJECT");
export const QUESTION = new ServiceToken<QuestionsService, Question>("QUESTION");
export const SHALLOW_QUESTION = new ServiceToken<ShallowQuestionsService, Question>("S_QUESTION");
export const REGION = new ServiceToken<RegionsService, Region>("REGION");
export const SHALLOW_REGION = new ServiceToken<ShallowRegionsService, Region>("S_REGION");
export const REPORT_PROBLEM = new ServiceToken<ReportProblemService, ReportProblem>("REPORT_PROBLEM");
export const RESPONSE = new ServiceToken<ResponsesService, Response>("RESPONSE");
export const SHALLOW_RESPONSE = new ServiceToken<ShallowResponsesService, Response>("S_RESPONSE");
export const SAVED_SEARCH = new ServiceToken<SavedSearchesService, SavedSearch>("SAVED_SEARCH");
export const SCRIPT = new ServiceToken<ScriptsService, Script>("SCRIPT");
export const SHALLOW_SITE = new ServiceToken<ShallowSitesService, Site>("S_SITE");
export const SITE = new ServiceToken<SitesService, Site>("SITE");
export const STATISTICS = new ServiceToken<StatisticsService, Statistics>("STATISTICS");
export const STUDY = new ServiceToken<StudiesService, Study>("STUDY");
export const TAG = new ServiceToken<TagsService, Tag>("TAG");
export const TAG_GROUP = new ServiceToken<TagGroupsService, TagGroup>("TAG_GROUP");
export const TAGGING = new ServiceToken<TaggingsService, Tagging>("TAGGING");
export const USER = new ServiceToken<UserService, User>("USER");
export const AUDIO_EVENT_PROVENANCE = new ServiceToken<ProvenanceService, Provenance>("AUDIO_EVENT_PROVENANCE");
export const AUDIO_EVENT_SUMMARY_REPORT = new ServiceToken<EventSummaryReportService, EventSummaryReport>(
  "AUDIO_EVENT_SUMMARY_REPORT",
);
export const WEBSITE_STATUS = new ServiceToken<WebsiteStatusService, WebsiteStatus>("WEBSITE_STATUS");
export const ANNOTATION = new ServiceToken<AnnotationService, Annotation>("ANNOTATION");
export const VERIFICATION = new ServiceToken<VerificationService, Verification>("VERIFICATION");
export const SHALLOW_VERIFICATION = new ServiceToken<ShallowVerificationService, Verification>("S_VERIFICATION");
export const MEDIA = new ServiceToken<MediaService, never>("MEDIA");
export const SITE_SETTINGS = new ServiceToken<SiteSettingsService, SiteSetting>("SITE_SETTINGS");
export const GROUPED_AUDIO_EVENTS = new ServiceToken<GroupedAudioEventsService, AudioEvent>("GROUPED_AUDIO_EVENTS");
export const AUDIO_EVENT_IMPORT = new ServiceToken<AudioEventImportService, AudioEventImport>("AUDIO_EVENT_IMPORT");
export const AUDIO_EVENT_IMPORT_FILE = new ServiceToken<AudioEventImportFileService, AudioEventImportFile>(
  "AUDIO_EVENT_IMPORT_FILE",
);
export const SHALLOW_AUDIO_EVENT_IMPORT_FILE = new ServiceToken<ShallowAudioEventImportFileService, AudioEventImportFile>(
  "SHALLOW_AUDIO_EVENT_IMPORT_FILE",
);

import { AnnotationService } from "@services/models/annotations/annotation.service";
import { MediaService } from "@services/media/media.service";
import { Provider } from "@angular/core";
import { annotationResolvers } from "@services/models/annotations/annotation.resolver";
import { accountResolvers, AccountsService } from "./account/accounts.service";
import {
  analysisJobItemResultResolvers,
  AnalysisJobItemResultsService,
} from "./analysis/analysis-job-item-result.service";
import {
  analysisJobItemResolvers,
  AnalysisJobItemsService,
} from "./analysis/analysis-job-items.service";
import {
  analysisJobResolvers,
  AnalysisJobsService,
} from "./analysis/analysis-jobs.service";
import {
  AudioEventImportService,
  audioEventImportResolvers,
} from "./audio-event-import/audio-event-import.service";
import {
  audioEventResolvers,
  AudioEventsService,
  ShallowAudioEventsService,
} from "./audio-event/audio-events.service";
import {
  audioRecordingResolvers,
  AudioRecordingsService,
} from "./audio-recording/audio-recordings.service";
import {
  bookmarkResolvers,
  BookmarksService,
} from "./bookmark/bookmarks.service";
import { DataRequestService } from "./data-request/data-request.service";
import {
  datasetItemResolvers,
  DatasetItemsService,
} from "./dataset/dataset-items.service";
import { datasetResolvers, DatasetsService } from "./dataset/datasets.service";
import {
  harvestItemResolvers,
  HarvestItemsService,
  shallowHarvestItemResolvers,
  ShallowHarvestItemsService,
} from "./harvest/harvest-items.service";
import {
  harvestResolvers,
  HarvestsService,
  shallowHarvestResolvers,
  ShallowHarvestsService,
} from "./harvest/harvest.service";
import {
  permissionResolvers,
  PermissionsService,
} from "./permissions/permissions.service";
import {
  progressEventResolvers,
  ProgressEventsService,
} from "./progress-event/progress-events.service";
import { projectResolvers, ProjectsService } from "./project/projects.service";
import {
  audioEventProvenanceResolvers,
  AudioEventProvenanceService,
} from "./AudioEventProvenance/AudioEventProvenance.service";
import {
  regionResolvers,
  RegionsService,
  shallowRegionResolvers,
  ShallowRegionsService,
} from "./region/regions.service";
import { ContactUsService } from "./report/contact-us.service";
import { ReportProblemService } from "./report/report-problem.service";
import { BawProvider } from "./resolver-common";
import {
  SavedSearchesService,
  savedSearchResolvers,
} from "./saved-search/saved-searches.service";
import { scriptResolvers, ScriptsService } from "./script/scripts.service";
import * as Tokens from "./ServiceTokens";
import {
  shallowSiteResolvers,
  ShallowSitesService,
  siteResolvers,
  SitesService,
} from "./site/sites.service";
import { StatisticsService } from "./statistics/statistics.service";
import {
  questionResolvers,
  QuestionsService,
  shallowQuestionResolvers,
  ShallowQuestionsService,
} from "./study/questions.service";
import {
  responseResolvers,
  ResponsesService,
  shallowResponseResolvers,
  ShallowResponsesService,
} from "./study/responses.service";
import { StudiesService, studyResolvers } from "./study/studies.service";
import { tagGroupResolvers, TagGroupsService } from "./tag/tag-group.service";
import { taggingResolvers, TaggingsService } from "./tag/taggings.service";
import { tagResolvers, TagsService } from "./tag/tags.service";
import { userResolvers, UserService } from "./user/user.service";
import {
  EventSummaryReportService,
  eventSummaryResolvers,
} from "./reports/event-report/event-summary-report.service";
import { WebsiteStatusService } from "./website-status/website-status.service";
import { AudioEventImportFileService } from "./audio-event-import-file/audio-event-import-file.service";
import {
  shallowVerificationResolvers,
  ShallowVerificationService,
  verificationResolvers,
  VerificationService,
} from "./verification/verification.service";
import { SiteSettingsService } from "./site-settings/site-settings.service";

interface ServiceProvider<T> {
  serviceToken: Tokens.ServiceToken<T>;
  service: T;
  resolvers?: unknown;
}

const serviceList = [
  {
    serviceToken: Tokens.ACCOUNT,
    service: AccountsService,
    resolvers: accountResolvers,
  },
  {
    serviceToken: Tokens.ANALYSIS_JOB,
    service: AnalysisJobsService,
    resolvers: analysisJobResolvers,
  },
  {
    serviceToken: Tokens.ANALYSIS_JOB_ITEM,
    service: AnalysisJobItemsService,
    resolvers: analysisJobItemResolvers,
  },
  {
    serviceToken: Tokens.ANALYSIS_JOB_ITEM_RESULTS,
    service: AnalysisJobItemResultsService,
    resolvers: analysisJobItemResultResolvers,
  },
  {
    serviceToken: Tokens.AUDIO_EVENT,
    service: AudioEventsService,
    resolvers: audioEventResolvers,
  },
  {
    serviceToken: Tokens.SHALLOW_AUDIO_EVENT,
    service: ShallowAudioEventsService,
  },
  {
    serviceToken: Tokens.AUDIO_RECORDING,
    service: AudioRecordingsService,
    resolvers: audioRecordingResolvers,
  },
  {
    serviceToken: Tokens.BOOKMARK,
    service: BookmarksService,
    resolvers: bookmarkResolvers,
  },
  {
    serviceToken: Tokens.CONTACT_US,
    service: ContactUsService,
  },
  {
    serviceToken: Tokens.DATASET,
    service: DatasetsService,
    resolvers: datasetResolvers,
  },
  {
    serviceToken: Tokens.DATASET_ITEM,
    service: DatasetItemsService,
    resolvers: datasetItemResolvers,
  },
  {
    serviceToken: Tokens.DATA_REQUEST,
    service: DataRequestService,
  },
  {
    serviceToken: Tokens.HARVEST,
    service: HarvestsService,
    resolvers: harvestResolvers,
  },
  {
    serviceToken: Tokens.SHALLOW_HARVEST,
    service: ShallowHarvestsService,
    resolvers: shallowHarvestResolvers,
  },
  {
    serviceToken: Tokens.HARVEST_ITEM,
    service: HarvestItemsService,
    resolvers: harvestItemResolvers,
  },
  {
    serviceToken: Tokens.SHALLOW_HARVEST_ITEM,
    service: ShallowHarvestItemsService,
    resolvers: shallowHarvestItemResolvers,
  },
  {
    serviceToken: Tokens.PERMISSION,
    service: PermissionsService,
    resolvers: permissionResolvers,
  },
  {
    serviceToken: Tokens.PROGRESS_EVENT,
    service: ProgressEventsService,
    resolvers: progressEventResolvers,
  },
  {
    serviceToken: Tokens.PROJECT,
    service: ProjectsService,
    resolvers: projectResolvers,
  },
  {
    serviceToken: Tokens.QUESTION,
    service: QuestionsService,
    resolvers: questionResolvers,
  },
  {
    serviceToken: Tokens.SHALLOW_QUESTION,
    service: ShallowQuestionsService,
    resolvers: shallowQuestionResolvers,
  },
  {
    serviceToken: Tokens.REGION,
    service: RegionsService,
    resolvers: regionResolvers,
  },
  {
    serviceToken: Tokens.SHALLOW_REGION,
    service: ShallowRegionsService,
    resolvers: shallowRegionResolvers,
  },
  {
    serviceToken: Tokens.REPORT_PROBLEM,
    service: ReportProblemService,
  },
  {
    serviceToken: Tokens.RESPONSE,
    service: ResponsesService,
    resolvers: responseResolvers,
  },
  {
    serviceToken: Tokens.SHALLOW_RESPONSE,
    service: ShallowResponsesService,
    resolvers: shallowResponseResolvers,
  },
  {
    serviceToken: Tokens.SAVED_SEARCH,
    service: SavedSearchesService,
    resolvers: savedSearchResolvers,
  },
  {
    serviceToken: Tokens.SCRIPT,
    service: ScriptsService,
    resolvers: scriptResolvers,
  },
  {
    serviceToken: Tokens.SITE,
    service: SitesService,
    resolvers: siteResolvers,
  },
  {
    serviceToken: Tokens.SHALLOW_SITE,
    service: ShallowSitesService,
    resolvers: shallowSiteResolvers,
  },
  {
    serviceToken: Tokens.STATISTICS,
    service: StatisticsService,
  },
  {
    serviceToken: Tokens.STUDY,
    service: StudiesService,
    resolvers: studyResolvers,
  },
  {
    serviceToken: Tokens.TAG,
    service: TagsService,
    resolvers: tagResolvers,
  },
  {
    serviceToken: Tokens.TAG_GROUP,
    service: TagGroupsService,
    resolvers: tagGroupResolvers,
  },
  {
    serviceToken: Tokens.TAGGING,
    service: TaggingsService,
    resolvers: taggingResolvers,
  },
  {
    serviceToken: Tokens.USER,
    service: UserService,
    resolvers: userResolvers,
  },
  {
    serviceToken: Tokens.AUDIO_EVENT_PROVENANCE,
    service: AudioEventProvenanceService,
    resolvers: audioEventProvenanceResolvers,
  },
  {
    serviceToken: Tokens.AUDIO_EVENT_SUMMARY_REPORT,
    service: EventSummaryReportService,
    resolvers: eventSummaryResolvers,
  },
  {
    serviceToken: Tokens.AUDIO_EVENT_IMPORT,
    service: AudioEventImportService,
    resolvers: audioEventImportResolvers,
  },
  {
    serviceToken: Tokens.AUDIO_EVENT_IMPORT_FILE,
    service: AudioEventImportFileService,
  },
  {
    serviceToken: Tokens.WEBSITE_STATUS,
    service: WebsiteStatusService,
  },
  {
    serviceToken: Tokens.ANNOTATION,
    service: AnnotationService,
    resolvers: annotationResolvers,
  },
  {
    serviceToken: Tokens.MEDIA,
    service: MediaService,
  },
  {
    serviceToken: Tokens.VERIFICATION,
    service: VerificationService,
    resolvers: verificationResolvers,
  },
  {
    serviceToken: Tokens.SHALLOW_VERIFICATION,
    service: ShallowVerificationService,
    resolvers: shallowVerificationResolvers,
  },
  {
    serviceToken: Tokens.SITE_SETTINGS,
    service: SiteSettingsService,
  },
] satisfies ServiceProvider<unknown>[];

const services = serviceList.map(({ service }) => service) satisfies Provider[];
const serviceTokens = serviceList.map(({ service, serviceToken }) => ({
  provide: serviceToken.token,
  useExisting: service,
})) satisfies Provider[];

const serviceResolvers: BawProvider[] = [];
serviceList.forEach(({ resolvers }) => {
  if (resolvers) {
    serviceResolvers.push(...resolvers.providers);
  }
});

export { services, serviceTokens, serviceResolvers };

import { AppConfigService } from "@services/app-config/app-config.service";
import { accountResolvers, AccountsService } from "./account/accounts.service";
import {
  analysisJobItemResolvers,
  AnalysisJobItemsService,
} from "./analysis/analysis-job-items.service";
import {
  analysisJobResolvers,
  AnalysisJobsService,
} from "./analysis/analysis-jobs.service";
import { AudioEventTagsService } from "./audio-event/audio-event-tags.service";
import {
  audioEventResolvers,
  AudioEventsService,
} from "./audio-event/audio-events.service";
import {
  audioRecordingResolvers,
  AudioRecordingsService,
} from "./audio-recording/audio-recordings.service";
import {
  bookmarkResolvers,
  BookmarksService,
} from "./bookmark/bookmarks.service";
import {
  datasetItemResolvers,
  DatasetItemsService,
} from "./dataset/dataset-items.service";
import { datasetResolvers, DatasetsService } from "./dataset/datasets.service";
import { MockFilterApiService } from "./mock/filterMock.service";
import { MockImmutableApiService } from "./mock/immutableApiMock.service";
import { MockNonDestructibleApiService } from "./mock/nonDestructibleApiMock.service";
import { MockReadAndCreateApiService } from "./mock/readAndCreateMock.service";
import { MockReadAndUpdateApiService } from "./mock/readAndUpdateMock.service";
import { MockReadonlyApiService } from "./mock/readonlyApiMock.service";
import { MockShallowSitesService } from "./mock/shallowSitesMock.service";
import { MockShowApiService } from "./mock/showApiMock.service";
import { MockStandardApiService } from "./mock/standardApiMock.service";
import {
  progressEventResolvers,
  ProgressEventsService,
} from "./progress-event/progress-events.service";
import { projectResolvers, ProjectsService } from "./project/projects.service";
import {
  SavedSearchesService,
  savedSearchResolvers,
} from "./saved-search/saved-searches.service";
import { scriptResolvers, ScriptsService } from "./script/scripts.service";
import { SecurityService } from "./security/security.service";
import * as Tokens from "./ServiceTokens";
import {
  shallowSiteResolvers,
  ShallowSitesService,
  siteResolvers,
  SitesService,
} from "./site/sites.service";
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
import { tagResolvers, TagsService } from "./tag/tags.service";
import { taggingResolvers, TaggingsService } from "./tagging/taggings.service";
import { userResolvers, UserService } from "./user/user.service";

const serviceList = [
  {
    serviceToken: Tokens.ACCOUNT,
    service: AccountsService,
    resolvers: accountResolvers,
    mock: MockStandardApiService,
  },
  {
    serviceToken: Tokens.ANALYSIS_JOB,
    service: AnalysisJobsService,
    resolvers: analysisJobResolvers,
    mock: MockReadAndUpdateApiService,
  },
  {
    serviceToken: Tokens.ANALYSIS_JOB_ITEM,
    service: AnalysisJobItemsService,
    resolvers: analysisJobItemResolvers,
    mock: MockReadonlyApiService,
  },
  {
    serviceToken: Tokens.AUDIO_EVENT,
    service: AudioEventsService,
    resolvers: audioEventResolvers,
    mock: MockStandardApiService,
  },
  {
    serviceToken: Tokens.AUDIO_EVENT_TAG,
    service: AudioEventTagsService,
    resolvers: null,
    mock: MockFilterApiService,
  },
  {
    serviceToken: Tokens.AUDIO_RECORDING,
    service: AudioRecordingsService,
    resolvers: audioRecordingResolvers,
    mock: MockReadonlyApiService,
  },
  {
    serviceToken: Tokens.BOOKMARK,
    service: BookmarksService,
    resolvers: bookmarkResolvers,
    mock: MockStandardApiService,
  },
  {
    serviceToken: Tokens.DATASET,
    service: DatasetsService,
    resolvers: datasetResolvers,
    mock: MockStandardApiService,
  },
  {
    serviceToken: Tokens.DATASET_ITEM,
    service: DatasetItemsService,
    resolvers: datasetItemResolvers,
    mock: MockImmutableApiService,
  },
  {
    serviceToken: Tokens.PROGRESS_EVENT,
    service: ProgressEventsService,
    resolvers: progressEventResolvers,
    mock: MockReadAndCreateApiService,
  },
  {
    serviceToken: Tokens.PROJECT,
    service: ProjectsService,
    resolvers: projectResolvers,
    mock: MockStandardApiService,
  },
  {
    serviceToken: Tokens.QUESTION,
    service: QuestionsService,
    resolvers: questionResolvers,
    mock: MockStandardApiService,
  },
  {
    serviceToken: Tokens.SHALLOW_QUESTION,
    service: ShallowQuestionsService,
    resolvers: shallowQuestionResolvers,
    mock: MockStandardApiService,
  },
  {
    serviceToken: Tokens.RESPONSE,
    service: ResponsesService,
    resolvers: responseResolvers,
    mock: MockStandardApiService,
  },
  {
    serviceToken: Tokens.SHALLOW_RESPONSE,
    service: ShallowResponsesService,
    resolvers: shallowResponseResolvers,
    mock: MockStandardApiService,
  },
  {
    serviceToken: Tokens.SAVED_SEARCH,
    service: SavedSearchesService,
    resolvers: savedSearchResolvers,
    mock: MockImmutableApiService,
  },
  {
    serviceToken: Tokens.SCRIPT,
    service: ScriptsService,
    resolvers: scriptResolvers,
    mock: MockNonDestructibleApiService,
  },
  {
    serviceToken: Tokens.SITE,
    service: SitesService,
    resolvers: siteResolvers,
    mock: MockStandardApiService,
  },
  {
    serviceToken: Tokens.SHALLOW_SITE,
    service: ShallowSitesService,
    resolvers: shallowSiteResolvers,
    mock: MockShallowSitesService,
  },
  {
    serviceToken: Tokens.STUDY,
    service: StudiesService,
    resolvers: studyResolvers,
    mock: MockStandardApiService,
  },
  {
    serviceToken: Tokens.TAG,
    service: TagsService,
    resolvers: tagResolvers,
    mock: MockStandardApiService,
  },
  {
    serviceToken: Tokens.TAG_GROUP,
    service: TagGroupsService,
    resolvers: tagGroupResolvers,
    mock: MockStandardApiService,
  },
  {
    serviceToken: Tokens.TAGGING,
    service: TaggingsService,
    resolvers: taggingResolvers,
    mock: MockStandardApiService,
  },
  {
    serviceToken: Tokens.USER,
    service: UserService,
    resolvers: userResolvers,
    mock: MockShowApiService,
  },
];

/**
 * Stores all of the service providers, their service tokens, and resolvers
 */
const serviceProviders: any[] = [AppConfigService, SecurityService];

/**
 * Stores all of the service providers, their service tokens, and resolvers using mock classes
 */
const serviceMockProviders: any[] = [];

for (const service of serviceList) {
  const providers = [
    service.service,
    { provide: service.serviceToken.token, useExisting: service.service },
    ...(service.resolvers?.providers || []),
  ];

  const mockProviders = [
    { provide: service.service, useClass: service.mock },
    { provide: service.serviceToken.token, useClass: service.mock },
    ...(service.resolvers?.providers || []),
  ];

  serviceProviders.push(...providers);
  serviceMockProviders.push(...mockProviders);
}

export { serviceProviders, serviceMockProviders };

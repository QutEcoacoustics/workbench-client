import { AppConfigService } from "@services/app-config/app-config.service";
import { accountResolvers, AccountService } from "./account.service";
import {
  analysisJobResolvers,
  AnalysisJobsService,
} from "./analysis-jobs.service";
import {
  audioEventResolvers,
  AudioEventsService,
} from "./audio-events.service";
import { bookmarkResolvers, BookmarksService } from "./bookmarks.service";
import {
  datasetItemResolvers,
  DatasetItemsService,
} from "./dataset-items.service";
import { datasetResolvers, DatasetsService } from "./datasets.service";
import { MockImmutableApiService } from "./mock/immutableApiMock.service";
import { MockShowApiService } from "./mock/showApiMock.service";
import { MockStandardApiService } from "./mock/standardApiMock.service";
import {
  progressEventResolvers,
  ProgressEventsService,
} from "./progress-events.service";
import { projectResolvers, ProjectsService } from "./projects.service";
import {
  questionResolvers,
  QuestionsService,
  shallowQuestionResolvers,
  ShallowQuestionsService,
} from "./questions.service";
import {
  responseResolvers,
  ResponsesService,
  shallowResponseResolvers,
  ShallowResponsesService,
} from "./responses.service";
import {
  SavedSearchesService,
  savedSearchResolvers,
} from "./saved-searches.service";
import { scriptResolvers, ScriptsService } from "./scripts.service";
import { SecurityService } from "./security.service";
import * as Tokens from "./ServiceTokens";
import {
  shallowSiteResolvers,
  ShallowSitesService,
  siteResolvers,
  SitesService,
} from "./sites.service";
import { StudiesService, studyResolvers } from "./studies.service";
import { tagGroupResolvers, TagGroupService } from "./tag-group.service";
import { tagResolvers, TagsService } from "./tags.service";
import { userResolvers, UserService } from "./user.service";

const serviceList = [
  {
    serviceToken: Tokens.ACCOUNT,
    service: AccountService,
    resolvers: accountResolvers,
    mock: MockStandardApiService,
  },
  {
    serviceToken: Tokens.ANALYSIS_JOB,
    service: AnalysisJobsService,
    resolvers: analysisJobResolvers,
    mock: MockStandardApiService,
  },
  {
    serviceToken: Tokens.AUDIO_EVENT,
    service: AudioEventsService,
    resolvers: audioEventResolvers,
    mock: MockStandardApiService,
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
    mock: MockStandardApiService,
  },
  {
    serviceToken: Tokens.PROGRESS_EVENT,
    service: ProgressEventsService,
    resolvers: progressEventResolvers,
    mock: MockStandardApiService,
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
    mock: MockStandardApiService,
  },
  {
    serviceToken: Tokens.SCRIPT,
    service: ScriptsService,
    resolvers: scriptResolvers,
    mock: MockImmutableApiService,
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
    mock: MockStandardApiService,
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
    service: TagGroupService,
    resolvers: tagGroupResolvers,
    mock: MockStandardApiService,
  },
  {
    serviceToken: Tokens.USER,
    service: UserService,
    resolvers: userResolvers,
    mock: MockShowApiService,
  },
];

const serviceProviders: any[] = [AppConfigService, SecurityService];

for (const service of serviceList) {
  serviceProviders.push(
    ...[
      service.service,
      { provide: service.serviceToken.token, useExisting: service.service },
      ...service.resolvers.providers,
    ]
  );
}

export { serviceProviders, serviceList };

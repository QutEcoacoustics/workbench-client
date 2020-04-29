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
    token: Tokens.ACCOUNT,
    service: AccountService,
    resolvers: accountResolvers,
    mock: MockStandardApiService,
  },
  {
    token: Tokens.ANALYSIS_JOB,
    service: AnalysisJobsService,
    resolvers: analysisJobResolvers,
    mock: MockStandardApiService,
  },
  {
    token: Tokens.AUDIO_EVENT,
    service: AudioEventsService,
    resolvers: audioEventResolvers,
    mock: MockStandardApiService,
  },
  {
    token: Tokens.BOOKMARK,
    service: BookmarksService,
    resolvers: bookmarkResolvers,
    mock: MockStandardApiService,
  },
  {
    token: Tokens.DATASET,
    service: DatasetsService,
    resolvers: datasetResolvers,
    mock: MockStandardApiService,
  },
  {
    token: Tokens.DATASET_ITEM,
    service: DatasetItemsService,
    resolvers: datasetItemResolvers,
    mock: MockStandardApiService,
  },
  {
    token: Tokens.PROGRESS_EVENT,
    service: ProgressEventsService,
    resolvers: progressEventResolvers,
    mock: MockStandardApiService,
  },
  {
    token: Tokens.PROJECT,
    service: ProjectsService,
    resolvers: projectResolvers,
    mock: MockStandardApiService,
  },
  {
    token: Tokens.QUESTION,
    service: QuestionsService,
    resolvers: questionResolvers,
    mock: MockStandardApiService,
  },
  {
    token: Tokens.SHALLOW_QUESTION,
    service: ShallowQuestionsService,
    resolvers: shallowQuestionResolvers,
    mock: MockStandardApiService,
  },
  {
    token: Tokens.RESPONSE,
    service: ResponsesService,
    resolvers: responseResolvers,
    mock: MockStandardApiService,
  },
  {
    token: Tokens.SHALLOW_RESPONSE,
    service: ShallowResponsesService,
    resolvers: shallowResponseResolvers,
    mock: MockStandardApiService,
  },
  {
    token: Tokens.SAVED_SEARCH,
    service: SavedSearchesService,
    resolvers: savedSearchResolvers,
    mock: MockStandardApiService,
  },
  {
    token: Tokens.SCRIPT,
    service: ScriptsService,
    resolvers: scriptResolvers,
    mock: MockImmutableApiService,
  },
  {
    token: Tokens.SITE,
    service: SitesService,
    resolvers: siteResolvers,
    mock: MockStandardApiService,
  },
  {
    token: Tokens.SHALLOW_SITE,
    service: ShallowSitesService,
    resolvers: shallowSiteResolvers,
    mock: MockStandardApiService,
  },
  {
    token: Tokens.STUDY,
    service: StudiesService,
    resolvers: studyResolvers,
    mock: MockStandardApiService,
  },
  {
    token: Tokens.TAG,
    service: TagsService,
    resolvers: tagResolvers,
    mock: MockStandardApiService,
  },
  {
    token: Tokens.TAG_GROUP,
    service: TagGroupService,
    resolvers: tagGroupResolvers,
    mock: MockStandardApiService,
  },
  {
    token: Tokens.USER,
    service: UserService,
    resolvers: userResolvers,
    mock: MockShowApiService,
  },
];

const serviceProviders: any[] = [AppConfigService, SecurityService];

serviceList.forEach((service) => {
  serviceProviders.push(
    ...[
      service.service,
      { provide: service.token, useExisting: service.service },
      ...service.resolvers.providers,
    ]
  );
});

export { serviceProviders, serviceList };

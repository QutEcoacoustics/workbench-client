import { accountResolvers, AccountsService } from "./account/accounts.service";
import {
  analysisJobItemResolvers,
  AnalysisJobItemsService,
} from "./analysis/analysis-job-items.service";
import {
  analysisJobResolvers,
  AnalysisJobsService,
} from "./analysis/analysis-jobs.service";
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
import {
  progressEventResolvers,
  ProgressEventsService,
} from "./progress-event/progress-events.service";
import { projectResolvers, ProjectsService } from "./project/projects.service";
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
    serviceToken: Tokens.AUDIO_EVENT,
    service: AudioEventsService,
    resolvers: audioEventResolvers,
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
];

const services = serviceList.map(({ service }) => service);
const serviceTokens = serviceList.map(({ service, serviceToken }) => ({
  provide: serviceToken.token,
  useExisting: service,
}));
const serviceResolvers: BawProvider[] = [];
serviceList.forEach(({ resolvers }) => {
  if (resolvers) {
    serviceResolvers.push(...resolvers.providers);
  }
});

export { services, serviceTokens, serviceResolvers };

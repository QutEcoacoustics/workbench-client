import { Question } from "@models/Question";
import { AppConfigService } from "@services/app-config/app-config.service";
import { accountResolvers, AccountService } from "./account.service";
import {
  analysisJobResolvers,
  AnalysisJobsService,
} from "./analysis-jobs.service";
import {
  audioEventCommentResolvers,
  AudioEventCommentsService,
} from "./audio-event-comments.service";
import {
  audioEventResolvers,
  AudioEventsService,
} from "./audio-events.service";
import { bookmarkResolvers, BookmarksService } from "./bookmarks.service";
import { projectResolvers, ProjectsService } from "./projects.service";
import {
  questionResolvers,
  QuestionsService,
  shallowQuestionResolvers,
  ShallowQuestionsService,
} from "./questions.service";
import {
  SavedSearchesService,
  savedSearchResolvers,
} from "./saved-searches.service";
import { scriptResolvers, ScriptsService } from "./scripts.service";
import { SecurityService } from "./security.service";
import {
  ACCOUNT,
  ANALYSIS_JOB,
  AUDIO_EVENT,
  AUDIO_EVENT_COMMENT,
  BOOKMARK,
  PROJECT,
  QUESTION,
  SAVED_SEARCH,
  SCRIPT,
  SECURITY,
  SHALLOW_QUESTION,
  SHALLOW_SITE,
  SITE,
  STUDY,
  TAG,
  TAG_GROUP,
  USER,
} from "./ServiceTokens";
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

const services = [
  AppConfigService,
  AccountService,
  AnalysisJobsService,
  AudioEventCommentsService,
  AudioEventsService,
  BookmarksService,
  ProjectsService,
  QuestionsService,
  ShallowQuestionsService,
  SavedSearchesService,
  ScriptsService,
  SecurityService,
  ShallowSitesService,
  SitesService,
  StudiesService,
  TagsService,
  TagGroupService,
  UserService,
  { provide: ACCOUNT.token, useExisting: AccountService },
  { provide: ANALYSIS_JOB.token, useExisting: AnalysisJobsService },
  {
    provide: AUDIO_EVENT_COMMENT.token,
    useExisting: AudioEventCommentsService,
  },
  { provide: AUDIO_EVENT.token, useExisting: AudioEventsService },
  { provide: BOOKMARK.token, useExisting: BookmarksService },
  { provide: PROJECT.token, useExisting: ProjectsService },
  { provide: QUESTION.token, useExisting: Question },
  { provide: SHALLOW_QUESTION.token, useExisting: ShallowQuestionsService },
  { provide: SAVED_SEARCH.token, useExisting: SavedSearchesService },
  { provide: SCRIPT.token, useExisting: ScriptsService },
  { provide: SECURITY.token, useExisting: SecurityService },
  { provide: SHALLOW_SITE.token, useExisting: ShallowSitesService },
  { provide: SITE.token, useExisting: SitesService },
  { provide: STUDY.token, useExisting: StudiesService },
  { provide: TAG.token, useExisting: TagsService },
  { provide: TAG_GROUP.token, useExisting: TagGroupService },
  { provide: USER.token, useExisting: UserService },
];

const resolvers = [
  ...accountResolvers.providers,
  ...analysisJobResolvers.providers,
  ...audioEventCommentResolvers.providers,
  ...audioEventResolvers.providers,
  ...bookmarkResolvers.providers,
  ...projectResolvers.providers,
  ...questionResolvers.providers,
  ...shallowQuestionResolvers.providers,
  ...savedSearchResolvers.providers,
  ...scriptResolvers.providers,
  ...siteResolvers.providers,
  ...shallowSiteResolvers.providers,
  ...studyResolvers.providers,
  ...tagResolvers.providers,
  ...tagGroupResolvers.providers,
  ...userResolvers.providers,
];

export const serviceProviders = [...services, ...resolvers];

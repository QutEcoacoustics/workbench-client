/**
 * Purpose of this file is to create a disconnect between the services
 * and being able to call them from the models. If the disconnect does not
 * exist, when you attempt to add association loading to the model it
 * will cause a circular dependency.
 */

import { InjectionToken } from "@angular/core";
import type { AccountsService } from "./account/accounts.service";
import type { AnalysisJobItemsService } from "./analysis/analysis-job-items.service";
import type { AnalysisJobsService } from "./analysis/analysis-jobs.service";
import type { AnnotationsService } from "./annotation/annotations.service";
import type { AudioEventTagsService } from "./audio-event/audio-event-tags.service";
import type {
  AudioEventsService,
  ShallowAudioEventsService,
} from "./audio-event/audio-events.service";
import type { AudioRecordingsService } from "./audio-recording/audio-recordings.service";
import type { BookmarksService } from "./bookmark/bookmarks.service";
import type { DatasetItemsService } from "./dataset/dataset-items.service";
import type { DatasetsService } from "./dataset/datasets.service";
import type { ProgressEventsService } from "./progress-event/progress-events.service";
import type { ProjectsService } from "./project/projects.service";
import type { SavedSearchesService } from "./saved-search/saved-searches.service";
import type { ScriptsService } from "./script/scripts.service";
import type { ShallowSitesService, SitesService } from "./site/sites.service";
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
import type { TagsService } from "./tag/tags.service";
import type { UserService } from "./user/user.service";

/**
 * Wrapper for InjectionToken class. This is required because of
 * https://github.com/angular/angular/issues/36736.
 */
export class ServiceToken<T> {
  kind: T;
  token: InjectionToken<T>;

  constructor(_desc: string) {
    this.kind = (_desc as unknown) as T;
    this.token = new InjectionToken<T>(_desc);
  }
}

export const ACCOUNT = new ServiceToken<AccountsService>("ACCOUNTS_SERVICE");
export const ANALYSIS_JOB = new ServiceToken<AnalysisJobsService>(
  "ANALYSIS_JOBS_SERVICE"
);
export const ANALYSIS_JOB_ITEM = new ServiceToken<AnalysisJobItemsService>(
  "ANALYSIS_JOB_ITEMS_SERVICE"
);
export const ANNOTATION = new ServiceToken<AnnotationsService>(
  "ANNOTATIONS_SERVICE"
);
export const AUDIO_EVENT = new ServiceToken<AudioEventsService>(
  "AUDIO_EVENTS_SERVICE"
);
export const SHALLOW_AUDIO_EVENT = new ServiceToken<ShallowAudioEventsService>(
  "SHALLOW_AUDIO_EVENTS_SERVICE"
);
export const AUDIO_EVENT_TAG = new ServiceToken<AudioEventTagsService>(
  "AUDIO_EVENT_TAGS_SERVICE"
);
export const AUDIO_RECORDING = new ServiceToken<AudioRecordingsService>(
  "AUDIO_RECORDINGS_SERVICE"
);
export const BOOKMARK = new ServiceToken<BookmarksService>("BOOKMARKS_SERVICE");
export const DATASET = new ServiceToken<DatasetsService>("DATASETS_SERVICE");
export const DATASET_ITEM = new ServiceToken<DatasetItemsService>(
  "DATASET_ITEMS_SERVICE"
);
export const PROGRESS_EVENT = new ServiceToken<ProgressEventsService>(
  "PROGRESS_EVENTS_SERVICE"
);
export const PROJECT = new ServiceToken<ProjectsService>("PROJECTS_SERVICE");
export const QUESTION = new ServiceToken<QuestionsService>("QUESTIONS_SERVICE");
export const SHALLOW_QUESTION = new ServiceToken<ShallowQuestionsService>(
  "SHALLOW_QUESTIONS_SERVICE"
);
export const RESPONSE = new ServiceToken<ResponsesService>("RESPONSES_SERVICE");
export const SHALLOW_RESPONSE = new ServiceToken<ShallowResponsesService>(
  "SHALLOW_RESPONSES_SERVICE"
);
export const SAVED_SEARCH = new ServiceToken<SavedSearchesService>(
  "SAVED_SEARCHES_SERVICE"
);
export const SCRIPT = new ServiceToken<ScriptsService>("SCRIPTS_SERVICE");
export const SHALLOW_SITE = new ServiceToken<ShallowSitesService>(
  "SHALLOW_SITES_SERVICE"
);
export const SITE = new ServiceToken<SitesService>("SITES_SERVICE");
export const STUDY = new ServiceToken<StudiesService>("STUDIES_SERVICE");
export const TAG = new ServiceToken<TagsService>("TAGS_SERVICE");
export const TAG_GROUP = new ServiceToken<TagGroupsService>(
  "TAG_GROUPS_SERVICE"
);
export const TAGGING = new ServiceToken<TagGroupsService>("TAGGINGS_SERVICE");
export const USER = new ServiceToken<UserService>("USER_SERVICE");

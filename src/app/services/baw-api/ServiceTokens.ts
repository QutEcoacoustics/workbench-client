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
import type { AudioEvent } from "@models/AudioEvent";
import type { AudioRecording } from "@models/AudioRecording";
import type { Bookmark } from "@models/Bookmark";
import type { ContactUs } from "@models/data/ContactUs";
import type { ReportProblem } from "@models/data/ReportProblem";
import type { Dataset } from "@models/Dataset";
import type { DatasetItem } from "@models/DatasetItem";
import type { ProgressEvent } from "@models/ProgressEvent";
import type { Project } from "@models/Project";
import type { Question } from "@models/Question";
import type { Region } from "@models/Region";
import type { Response } from "@models/Response";
import type { SavedSearch } from "@models/SavedSearch";
import type { Script } from "@models/Script";
import type { Site } from "@models/Site";
import type { Study } from "@models/Study";
import type { Tag } from "@models/Tag";
import type { Tagging } from "@models/Tagging";
import type { TagGroup } from "@models/TagGroup";
import type { User } from "@models/User";
import type { AccountsService } from "./account/accounts.service";
import type { AnalysisJobItemsService } from "./analysis/analysis-job-items.service";
import type { AnalysisJobsService } from "./analysis/analysis-jobs.service";
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
import type {
  RegionsService,
  ShallowRegionsService,
} from "./region/regions.service";
import type { ContactUsService } from "./report/contact-us.service";
import type { ReportProblemService } from "./report/report-problem.service";
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
import type { TaggingsService } from "./tag/taggings.service";
import type { TagsService } from "./tag/tags.service";
import type { UserService } from "./user/user.service";

/**
 * Wrapper for InjectionToken class. This is required because of
 * https://github.com/angular/angular/issues/36736.
 */
export class ServiceToken<
  Service,
  Child extends AbstractModel = AbstractModel,
  Params extends any[] = []
> {
  public kind: Service;
  public model: Child;
  public params: Params;
  public token: InjectionToken<Service>;

  public constructor(_desc: string) {
    this.kind = (_desc as unknown) as Service;
    this.token = new InjectionToken<Service>(_desc);
  }
}

export const ACCOUNT = new ServiceToken<AccountsService, User>("ACCOUNT");
export const ANALYSIS_JOB = new ServiceToken<AnalysisJobsService, AnalysisJob>(
  "A_JOB"
);
export const ANALYSIS_JOB_ITEM = new ServiceToken<
  AnalysisJobItemsService,
  AnalysisJobItem
>("A_JOB_ITEM");
export const AUDIO_EVENT = new ServiceToken<AudioEventsService, AudioEvent>(
  "AUDIO"
);
export const SHALLOW_AUDIO_EVENT = new ServiceToken<
  ShallowAudioEventsService,
  AudioEvent
>("S_AUDIO");
export const AUDIO_RECORDING = new ServiceToken<
  AudioRecordingsService,
  AudioRecording
>("RECORDING");
export const CONTACT_US = new ServiceToken<ContactUsService, ContactUs>(
  "CONTACT_US"
);
export const BOOKMARK = new ServiceToken<BookmarksService, Bookmark>(
  "BOOKMARK"
);
export const DATASET = new ServiceToken<DatasetsService, Dataset>("DATASET");
export const DATASET_ITEM = new ServiceToken<DatasetItemsService, DatasetItem>(
  "D_ITEM"
);
export const PROGRESS_EVENT = new ServiceToken<
  ProgressEventsService,
  ProgressEvent
>("PROGRESS");
export const PROJECT = new ServiceToken<ProjectsService, Project>("PROJECT");
export const QUESTION = new ServiceToken<QuestionsService, Question>(
  "QUESTION"
);
export const SHALLOW_QUESTION = new ServiceToken<
  ShallowQuestionsService,
  Question
>("S_QUESTION");
export const REGION = new ServiceToken<RegionsService, Region>("REGION");
export const SHALLOW_REGION = new ServiceToken<ShallowRegionsService, Region>(
  "S_REGION"
);
export const REPORT_PROBLEM = new ServiceToken<
  ReportProblemService,
  ReportProblem
>("REPORT_PROBLEM");
export const RESPONSE = new ServiceToken<ResponsesService, Response>(
  "RESPONSE"
);
export const SHALLOW_RESPONSE = new ServiceToken<
  ShallowResponsesService,
  Response
>("S_RESPONSE");
export const SAVED_SEARCH = new ServiceToken<SavedSearchesService, SavedSearch>(
  "SAVED_SEARCH"
);
export const SCRIPT = new ServiceToken<ScriptsService, Script>("SCRIPT");
export const SHALLOW_SITE = new ServiceToken<ShallowSitesService, Site>(
  "S_SITE"
);
export const SITE = new ServiceToken<SitesService, Site>("SITE");
export const STUDY = new ServiceToken<StudiesService, Study>("STUDY");
export const TAG = new ServiceToken<TagsService, Tag>("TAG");
export const TAG_GROUP = new ServiceToken<TagGroupsService, TagGroup>(
  "TAG_GROUP"
);
export const TAGGING = new ServiceToken<TaggingsService, Tagging>("TAGGING");
export const USER = new ServiceToken<UserService, User>("USER");

import { InjectionToken } from "@angular/core";
import type { AccountService } from "./account.service";
import type { ProjectsService } from "./projects.service";
import type { ScriptsService } from "./scripts.service";
import type { SecurityService } from "./security.service";
import type { ShallowSitesService, SitesService } from "./sites.service";
import type { TagGroupService } from "./tag-group.service";
import type { TagsService } from "./tags.service";
import type { UserService } from "./user.service";
import type { AnalysisJobsService } from "./analysis-jobs.service";

// Wrapper because of https://github.com/angular/angular/issues/36736
export class ServiceToken<T> {
  kind: T;
  token: InjectionToken<T>;

  constructor(_desc: string) {
    this.kind = (_desc as unknown) as T;
    this.token = new InjectionToken<T>(_desc);
  }
}

export const ACCOUNT = new ServiceToken<AccountService>("ACCOUNT_SERVICE");
export const ANALYSIS_JOB = new ServiceToken<AnalysisJobsService>(
  "ANALYSIS_JOBS_SERVICE"
);
export const PROJECT = new ServiceToken<ProjectsService>("PROJECTS_SERVICE");
export const SCRIPT = new ServiceToken<ScriptsService>("SCRIPTS_SERVICE");
export const SECURITY = new ServiceToken<SecurityService>("SECURITY_SERVICE");
export const SHALLOW_SITE = new ServiceToken<ShallowSitesService>(
  "SHALLOW_SITES_SERVICE"
);
export const SITE = new ServiceToken<SitesService>("SITES_SERVICE");
export const TAG = new ServiceToken<TagsService>("TAGS_SERVICE");
export const TAG_GROUP = new ServiceToken<TagGroupService>("TAG_GROUP_SERVICE");
export const USER = new ServiceToken<UserService>("USER_SERVICE");

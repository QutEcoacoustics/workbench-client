import { InjectionToken } from "@angular/core";
import type { AccountService } from "./account.service";
import type { ProjectsService } from "./projects.service";
import type { ScriptsService } from "./scripts.service";
import type { SecurityService } from "./security.service";
import type { ShallowSitesService, SitesService } from "./sites.service";
import type { TagGroupService } from "./tag-group.service";
import type { TagsService } from "./tags.service";
import type { UserService } from "./user.service";

export const ACCOUNT = new InjectionToken<AccountService>("ACCOUNT_SERVICE");
export const PROJECT = new InjectionToken<ProjectsService>("PROJECTS_SERVICE");
export const SCRIPT = new InjectionToken<ScriptsService>("SCRIPTS_SERVICE");
export const SECURITY = new InjectionToken<SecurityService>("SECURITY_SERVICE");
export const SHALLOW_SITE = new InjectionToken<ShallowSitesService>(
  "SHALLOW_SITES_SERVICE"
);
export const SITE = new InjectionToken<SitesService>("SITES_SERVICE");
export const TAG = new InjectionToken<TagsService>("TAGS_SERVICE");
export const TAG_GROUP = new InjectionToken<TagGroupService>(
  "TAG_GROUP_SERVICE"
);
export const USER = new InjectionToken<UserService>("USER_SERVICE");

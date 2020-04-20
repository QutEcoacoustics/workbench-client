import { AppConfigService } from "@services/app-config/app-config.service";
import { accountResolvers, AccountService } from "./account.service";
import { projectResolvers, ProjectsService } from "./projects.service";
import { scriptResolvers, ScriptsService } from "./scripts.service";
import { SecurityService } from "./security.service";
import {
  ACCOUNT_SERVICE,
  PROJECTS_SERVICE,
  SCRIPTS_SERVICE,
  SECURITY_SERVICE,
  SHALLOW_SITES_SERVICE,
  SITES_SERVICE,
  TAGS_SERVICE,
  TAG_GROUP_SERVICE,
  USER_SERVICE,
} from "./ServiceTokens";
import {
  shallowSiteResolvers,
  ShallowSitesService,
  siteResolvers,
  SitesService,
} from "./sites.service";
import { tagGroupResolvers, TagGroupService } from "./tag-group.service";
import { tagResolvers, TagsService } from "./tags.service";
import { userResolvers, UserService } from "./user.service";

const services = [
  AppConfigService,
  AccountService,
  ProjectsService,
  ScriptsService,
  SecurityService,
  ShallowSitesService,
  SitesService,
  TagsService,
  TagGroupService,
  UserService,
  { provide: ACCOUNT_SERVICE, useExisting: AccountService },
  { provide: PROJECTS_SERVICE, useExisting: ProjectsService },
  { provide: SCRIPTS_SERVICE, useExisting: ScriptsService },
  { provide: SECURITY_SERVICE, useExisting: SecurityService },
  { provide: SHALLOW_SITES_SERVICE, useExisting: ShallowSitesService },
  { provide: SITES_SERVICE, useExisting: SitesService },
  { provide: TAGS_SERVICE, useExisting: TagsService },
  { provide: TAG_GROUP_SERVICE, useExisting: TagGroupService },
  { provide: USER_SERVICE, useExisting: UserService },
];

const resolvers = [
  ...accountResolvers.providers,
  ...projectResolvers.providers,
  ...scriptResolvers.providers,
  ...siteResolvers.providers,
  ...shallowSiteResolvers.providers,
  ...tagResolvers.providers,
  ...tagGroupResolvers.providers,
  ...userResolvers.providers,
];

export const serviceProviders = [...services, ...resolvers];

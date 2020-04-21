import { AppConfigService } from "@services/app-config/app-config.service";
import { accountResolvers, AccountService } from "./account.service";
import { projectResolvers, ProjectsService } from "./projects.service";
import { scriptResolvers, ScriptsService } from "./scripts.service";
import { SecurityService } from "./security.service";
import {
  ACCOUNT,
  PROJECT,
  SCRIPT,
  SECURITY,
  SHALLOW_SITE,
  SITE,
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
  { provide: ACCOUNT.token, useExisting: AccountService },
  { provide: PROJECT.token, useExisting: ProjectsService },
  { provide: SCRIPT.token, useExisting: ScriptsService },
  { provide: SECURITY.token, useExisting: SecurityService },
  { provide: SHALLOW_SITE.token, useExisting: ShallowSitesService },
  { provide: SITE.token, useExisting: SitesService },
  { provide: TAG.token, useExisting: TagsService },
  { provide: TAG_GROUP.token, useExisting: TagGroupService },
  { provide: USER.token, useExisting: UserService },
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

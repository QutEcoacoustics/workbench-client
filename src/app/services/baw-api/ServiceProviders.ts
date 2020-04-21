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
  { provide: ACCOUNT, useExisting: AccountService },
  { provide: PROJECT, useExisting: ProjectsService },
  { provide: SCRIPT, useExisting: ScriptsService },
  { provide: SECURITY, useExisting: SecurityService },
  { provide: SHALLOW_SITE, useExisting: ShallowSitesService },
  { provide: SITE, useExisting: SitesService },
  { provide: TAG, useExisting: TagsService },
  { provide: TAG_GROUP, useExisting: TagGroupService },
  { provide: USER, useExisting: UserService },
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

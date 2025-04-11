import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { IPageInfo } from "@helpers/page/pageInfo";
import { environment } from "src/environments/environment";
import { Project } from "./models/Project";
import { User } from "./models/User";
import { retrieveResolvedModel } from "./services/baw-api/resolver-common";

export const defaultAudioIcon: IconProp = ["fas", "file-audio"];
export const defaultDeleteIcon: IconProp = ["fas", "trash"];
export const defaultEditIcon: IconProp = ["fas", "edit"];
export const defaultNewIcon: IconProp = ["fas", "plus"];
export const defaultPermissionsIcon: IconProp = ["fas", "key"];
export const defaultUserIcon: IconProp = ["fas", "user"];
export const defaultAnnotationDownloadIcon: IconProp = ["fas", "file-download"];

/**
 * Returns true only if user is a guest
 *
 * @param user Session User Data
 */
export const isGuestPredicate = (user: User): boolean => !user;

/**
 * Returns true only if user is logged in
 *
 * @param user Session User Data
 */
export const isLoggedInPredicate = (user: User): boolean => !!user;

/**
 * Returns true only if user is an admin or user id matches project owner id
 *
 * @param user Session User Data
 * @param data Page Data
 */
export const isProjectEditorPredicate = (user: User, data: IPageInfo): boolean => {
  const project = retrieveResolvedModel(data, Project);
  return isAdminPredicate(user) || !!project?.canEdit;
};

/**
 * Returns true only if user is an admin or user has write access to the project
 *
 * @param user Session User Data
 * @param data Page Data
 */
export const isProjectWriterPredicate = (user: User, data: IPageInfo): boolean => {
  const project = retrieveResolvedModel(data, Project);
  return isAdminPredicate(user) || !!project?.canContribute;
};

/**
 * Returns true only if user is an admin
 *
 * @param user Session User Data
 */
export const isAdminPredicate = (user: User): boolean => isLoggedInPredicate(user) && user.isAdmin;

/**
 * Returns true only if the user is an admin and is not in a production environment
 * This predicate exists so that we can implement work in progress menu items
 *
 * @param user User session data. This will be used to check if the user is an admin
 */
export const isWorkInProgressPredicate = (user: User): boolean => !environment.production || isAdminPredicate(user);

import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { Project } from "./models/Project";
import { SessionUser } from "./models/User";
import { ResolvedModel } from "./services/baw-api/resolver-common";

export const defaultAudioIcon: IconProp = ["fas", "file-audio"];
export const defaultDeleteIcon: IconProp = ["fas", "trash"];
export const defaultEditIcon: IconProp = ["fas", "edit"];
export const defaultNewIcon: IconProp = ["fas", "plus"];
export const defaultPermissionsIcon: IconProp = ["fas", "key"];
export const defaultUserIcon: IconProp = ["fas", "user"];

/**
 * Returns true only if user is a guest
 * @param user Session User Data
 */
export const isGuestPredicate = (user: SessionUser): boolean => !user;

/**
 * Returns true only if user is logged in
 * @param user Session User Data
 */
export const isLoggedInPredicate = (user: SessionUser): boolean => !!user;

/**
 * Returns true only if user is an admin or user id matches project owner id
 * @param user Session User Data
 * @param data Page Data
 */
export const isProjectOwnerPredicate = (
  user: SessionUser,
  data: any
): boolean => {
  const project: ResolvedModel<Project> = data?.project;
  return (
    isLoggedInPredicate(user) &&
    (isAdminPredicate(user) || user.id === project?.model?.ownerId)
  );
};

/**
 * Returns true only if user is an admin
 * @param user Session User Data
 */
export const isAdminPredicate = (user: SessionUser): boolean =>
  isLoggedInPredicate(user) && user.isAdmin;

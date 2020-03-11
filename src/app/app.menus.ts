import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { SessionUser } from "./models/User";

export const defaultAudioIcon: IconProp = ["fas", "file-audio"];
export const defaultDeleteIcon: IconProp = ["fas", "trash"];
export const defaultEditIcon: IconProp = ["fas", "edit"];
export const defaultNewIcon: IconProp = ["fas", "plus"];
export const defaultPermissionsIcon: IconProp = ["fas", "key"];
export const defaultUserIcon: IconProp = ["fas", "user"];

export const isGuestPredicate = (user: SessionUser) => !user;
export const isLoggedInPredicate = (user: SessionUser) => !!user;
export const isOwnerPredicate = (user: SessionUser) => !!user;
export const isAdminPredicate = (user: SessionUser) => !!user && user.isAdmin;

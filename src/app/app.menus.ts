import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { SessionUser } from "./models/User";

export const defaultNewIcon: IconProp = ["fas", "plus"];
export const defaultPermissionsIcon: IconProp = ["fas", "key"];
export const defaultEditIcon: IconProp = ["fas", "edit"];
export const defaultDeleteIcon: IconProp = ["fas", "trash"];

export const isGuestPredicate = (user: SessionUser) => !user;
export const isLoggedInPredicate = (user: SessionUser) => !!user;
export const isOwnerPredicate = (user: SessionUser) => !!user;
export const isAdminPredicate = (user: SessionUser) => !!user;

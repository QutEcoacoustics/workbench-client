import { Injector } from "@angular/core";
import { assetRoot } from "@services/config/config.service";
import {
  myAccountMenuItem,
  theirProfileMenuItem,
} from "../components/profile/profile.menus";
import {
  AuthToken,
  DateTimeTimezone,
  Id,
  ImageUrl,
  TimezoneInformation,
  UserName,
} from "../interfaces/apiInterfaces";
import { AbstractModel } from "./AbstractModel";
import { bawDateTime, bawImage, bawPersistAttr } from "./AttributeDecorators";

const deletedUserId = -1;
const unknownUserId = -2;

/**
 * A user model.
 */
export interface IUser {
  id?: Id;
  email?: string;
  userName?: UserName;
  signInCount?: number;
  failedAttempts?: number;
  rolesMask?: number;
  rolesMaskNames?: string[];
  tzinfoTz?: string;
  timezoneInformation?: TimezoneInformation;
  imageUrls?: ImageUrl[];
  preferences?: any;
  isConfirmed?: boolean;
  resetPasswordSentAt?: DateTimeTimezone | string;
  rememberCreatedAt?: DateTimeTimezone | string;
  currentSignInAt?: DateTimeTimezone | string;
  lastSignInAt?: DateTimeTimezone | string;
  confirmedAt?: DateTimeTimezone | string;
  confirmationSentAt?: DateTimeTimezone | string;
  lockedAt?: DateTimeTimezone | string;
  createdAt?: DateTimeTimezone | string;
  updatedAt?: DateTimeTimezone | string;
  lastSeenAt?: DateTimeTimezone | string;
}

/**
 * A user model.
 */
export class User extends AbstractModel<IUser> implements IUser {
  /**
   * Deleted User. This is used when a user has been soft deleted
   * from the API.
   */
  public static get deletedUser(): User {
    return new User({
      id: deletedUserId,
      email: "deleted-user@noreply.com.au",
      userName: "Deleted User",
    });
  }
  /**
   * Unknown User. This is used when the current logged in user/guest
   * does not have the permissions to view a user.
   */
  public static get unknownUser(): User {
    return new User({
      id: unknownUserId,
      email: "unknown-user@noreply.com.au",
      userName: "Unknown User",
    });
  }

  public readonly kind = "User";
  public readonly id?: Id;
  public readonly email?: string;
  @bawPersistAttr()
  public readonly userName?: UserName;
  public readonly signInCount?: number;
  public readonly failedAttempts?: number;
  @bawPersistAttr()
  public readonly imageUrls?: ImageUrl[];
  @bawImage<IUser>(`${assetRoot}/images/user/user_span4.png`, {
    key: "imageUrls",
  })
  public readonly images: ImageUrl[];
  @bawPersistAttr()
  public readonly preferences?: any;
  public readonly isConfirmed?: boolean;
  public readonly rolesMask?: number;
  public readonly rolesMaskNames?: string[];
  @bawPersistAttr()
  public readonly tzinfoTz?: string;
  @bawPersistAttr()
  public readonly timezoneInformation?: TimezoneInformation;
  @bawDateTime()
  public readonly resetPasswordSentAt?: DateTimeTimezone;
  @bawDateTime()
  public readonly rememberCreatedAt?: DateTimeTimezone;
  @bawDateTime()
  public readonly currentSignInAt?: DateTimeTimezone;
  @bawDateTime()
  public readonly lastSignInAt?: DateTimeTimezone;
  @bawDateTime()
  public readonly confirmedAt?: DateTimeTimezone;
  @bawDateTime()
  public readonly confirmationSentAt?: DateTimeTimezone;
  @bawDateTime()
  public readonly lockedAt?: DateTimeTimezone;
  @bawDateTime()
  public readonly createdAt?: DateTimeTimezone;
  @bawDateTime()
  public readonly updatedAt?: DateTimeTimezone;
  @bawDateTime()
  public readonly lastSeenAt?: DateTimeTimezone;

  public constructor(user: IUser, injector?: Injector) {
    super(user, injector);
    this.tzinfoTz = this.tzinfoTz ?? this.timezoneInformation?.identifier;
  }

  public get isAdmin(): boolean {
    return isModelAdmin(this);
  }

  public get viewUrl(): string {
    return theirProfileMenuItem.route.format({ accountId: this.id });
  }

  public toString(): string {
    return super.toString(this.userName);
  }
}
/**
 * A user model for the website user
 */
export interface ISessionUser extends IUser {
  userName?: UserName;
  authToken?: AuthToken;
}

/**
 * A user model for the website user
 */
export class SessionUser
  extends AbstractModel<ISessionUser>
  implements ISessionUser
{
  public readonly kind = "SessionUser";
  public readonly id?: Id;
  public readonly authToken?: AuthToken;
  public readonly userName?: UserName;
  public readonly imageUrls?: ImageUrl[];
  @bawImage<ISessionUser>(`${assetRoot}/images/user/user_span4.png`, {
    key: "imageUrls",
  })
  public readonly images: ImageUrl[];
  public readonly preferences?: any;
  public readonly rolesMask?: number;
  public readonly tzinfoTz?: string;
  public readonly timezoneInformation?: TimezoneInformation;

  public constructor(user: ISessionUser & Partial<IUser>, injector?: Injector) {
    super(user, injector);
    this.tzinfoTz = this.tzinfoTz ?? this.timezoneInformation?.identifier;
  }

  public get isAdmin(): boolean {
    return isModelAdmin(this);
  }

  public get viewUrl(): string {
    return myAccountMenuItem.route.format();
  }
}

/**
 * Determines if user is admin. Role mask stores user roles
 * as a power of 2 integer so that roles can be combined.
 * The admin role is 1, therefore a role mask of 1 (0001) or
 * 3 (0011) indicate an admin account.
 */
function isModelAdmin(model: User | SessionUser): boolean {
  // eslint-disable-next-line no-bitwise
  return !!(model.rolesMask & 1);
}

/**
 * Determines if user is a deleted user
 *
 * @param model User to evaluate
 */
export function isDeletedUser(model: User): boolean {
  return model.id === deletedUserId;
}

/**
 * Determines if user is an unknown user
 *
 * @param model User to evaluate
 */
export function isUnknownUser(model: User): boolean {
  return model.id === unknownUserId;
}

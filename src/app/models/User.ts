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
import { AbstractModel, AbstractModelWithoutId } from "./AbstractModel";
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
  public static getDeletedUser(injector: Injector): User {
    return new User(
      {
        id: deletedUserId,
        email: "deleted-user@noreply.com.au",
        userName: "Deleted User",
      },
      injector
    );
  }
  /**
   * Unknown User. This is used when the current logged in user/guest
   * does not have the permissions to view a user.
   */
  public static getUnknownUser(injector: Injector): User {
    return new User(
      {
        id: unknownUserId,
        email: "unknown-user@noreply.com.au",
        userName: "Unknown User",
      },
      injector
    );
  }

  public readonly kind = "User";
  public readonly email?: string;
  @bawPersistAttr()
  public readonly userName?: UserName;
  public readonly signInCount?: number;
  public readonly failedAttempts?: number;
  @bawImage<IUser>(`${assetRoot}/images/user/user_span4.png`)
  public readonly imageUrls?: ImageUrl[];
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

  /**
   * Determines if user is admin. Role mask stores user roles
   * as a power of 2 integer so that roles can be combined.
   * The admin role is 1, therefore a role mask of 1 (0001) or
   * 3 (0011) indicate an admin account.
   */
  public get isAdmin(): boolean {
    // eslint-disable-next-line no-bitwise
    return !!(this.rolesMask & 1);
  }

  public get isUnknown(): boolean {
    return this.id === unknownUserId;
  }

  public get isDeleted(): boolean {
    return this.id === deletedUserId;
  }

  public get isGhost(): boolean {
    return this.isUnknown || this.isDeleted;
  }

  public get viewUrl(): string {
    return theirProfileMenuItem.route.format({ accountId: this.id });
  }

  public toString(): string {
    if (this.id === unknownUserId) {
      return `${this.kind}: Unknown User`;
    } else if (this.id === deletedUserId) {
      return `${this.kind}: Deleted User`;
    }
    return super.toString(this.userName);
  }
}
/**
 * A user model for the website user
 */
export interface ISession {
  userName?: UserName;
  authToken?: AuthToken;
}

/**
 * A user model for the website user
 */
export class Session
  extends AbstractModelWithoutId<ISession>
  implements ISession
{
  public readonly kind = "Session User";
  public readonly authToken?: AuthToken;
  public readonly userName?: UserName;

  public get viewUrl(): string {
    return myAccountMenuItem.route.format();
  }
}

import {
  myAccountMenuItem,
  theirProfileMenuItem,
} from "../component/profile/profile.menus";
import {
  AuthToken,
  DateTimeTimezone,
  Id,
  ImageUrl,
  TimezoneInformation,
  UserName,
} from "../interfaces/apiInterfaces";
import { AbstractModel } from "./AbstractModel";
import { BawDateTime, BawImage, BawPersistAttr } from "./AttributeDecorators";

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
export class User extends AbstractModel implements IUser {
  public readonly kind = "User";
  @BawPersistAttr
  public readonly id?: Id;
  @BawPersistAttr
  public readonly email?: string;
  @BawPersistAttr
  public readonly userName?: UserName;
  public readonly signInCount?: number;
  public readonly failedAttempts?: number;
  @BawPersistAttr
  public readonly imageUrls?: ImageUrl[];
  @BawImage<User>("/assets/images/user/user_span4.png", { key: "imageUrls" })
  public readonly image: ImageUrl[];
  @BawPersistAttr
  public readonly preferences?: any;
  public readonly isConfirmed?: boolean;
  @BawPersistAttr
  public readonly rolesMask?: number;
  public readonly rolesMaskNames?: string[];
  @BawPersistAttr
  public readonly tzinfoTz?: string;
  @BawPersistAttr
  public readonly timezoneInformation?: TimezoneInformation;
  @BawDateTime()
  public readonly resetPasswordSentAt?: DateTimeTimezone;
  @BawDateTime()
  public readonly rememberCreatedAt?: DateTimeTimezone;
  @BawDateTime()
  public readonly currentSignInAt?: DateTimeTimezone;
  @BawDateTime()
  public readonly lastSignInAt?: DateTimeTimezone;
  @BawDateTime()
  public readonly confirmedAt?: DateTimeTimezone;
  @BawDateTime()
  public readonly confirmationSentAt?: DateTimeTimezone;
  @BawDateTime()
  public readonly lockedAt?: DateTimeTimezone;
  @BawDateTime()
  public readonly createdAt?: DateTimeTimezone;
  @BawDateTime()
  public readonly updatedAt?: DateTimeTimezone;
  @BawDateTime()
  public readonly lastSeenAt?: DateTimeTimezone;

  constructor(user: IUser) {
    super(user);

    this.userName = user.userName ?? "Deleted User";
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
export class SessionUser extends AbstractModel implements ISessionUser {
  // ! All fields are persisted because model is saved to, and read from, localstorage
  public readonly kind = "SessionUser";
  @BawPersistAttr
  public readonly id?: Id;
  @BawPersistAttr
  public readonly authToken?: AuthToken;
  @BawPersistAttr
  public readonly userName?: UserName;
  @BawPersistAttr
  public readonly imageUrls?: ImageUrl[];
  @BawImage<SessionUser>("/assets/images/user/user_span4.png", {
    key: "imageUrls",
  })
  public readonly image: ImageUrl[];
  @BawPersistAttr
  public readonly preferences?: any;
  @BawPersistAttr
  public readonly rolesMask?: number;
  @BawPersistAttr
  public readonly tzinfoTz?: string;
  @BawPersistAttr
  public readonly timezoneInformation?: TimezoneInformation;

  constructor(user: ISessionUser & Partial<IUser>) {
    super(user);

    this.tzinfoTz = this.tzinfoTz ?? this.timezoneInformation?.identifier;
  }

  public get isAdmin(): boolean {
    return isModelAdmin(this);
  }

  public get viewUrl(): string {
    return myAccountMenuItem.route.toString();
  }
}

/**
 * Determines if user is admin. Role mask stores user roles
 * as a power of 2 integer so that roles can be combined.
 * The admin role is 1, therefore a role mask of 1 (0001) or
 * 3 (0011) indicate an admin account.
 */
function isModelAdmin(model: User | SessionUser): boolean {
  // tslint:disable-next-line: no-bitwise
  return !!(model.rolesMask & 1);
}

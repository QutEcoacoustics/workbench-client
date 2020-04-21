import {
  myAccountMenuItem,
  theirProfileMenuItem,
} from "../component/profile/profile.menus";
import {
  AuthToken,
  DateTimeTimezone,
  Id,
  ImageSizes,
  ImageURL,
  TimezoneInformation,
  UserName,
} from "../interfaces/apiInterfaces";
import { AbstractModel, BawDateTime, BawPersistAttr } from "./AbstractModel";

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
  timezoneInformation?: TimezoneInformation;
  imageUrls?: ImageURL[];
  preferences?: Blob;
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
  public readonly kind: "User" | "SessionUser" = "User";
  @BawPersistAttr
  public readonly id?: Id;
  @BawPersistAttr
  public readonly email?: string;
  @BawPersistAttr
  public readonly userName?: UserName;
  @BawPersistAttr
  public readonly signInCount?: number;
  @BawPersistAttr
  public readonly failedAttempts?: number;
  @BawPersistAttr
  public readonly imageUrls?: ImageURL[];
  @BawPersistAttr
  public readonly preferences?: any;
  @BawPersistAttr
  public readonly isConfirmed?: boolean;
  @BawPersistAttr
  public readonly rolesMask?: number;
  @BawPersistAttr
  public readonly rolesMaskNames?: string[];
  @BawPersistAttr
  public readonly timezoneInformation?: TimezoneInformation;
  @BawDateTime({ persist: true })
  public readonly resetPasswordSentAt?: DateTimeTimezone;
  @BawDateTime({ persist: true })
  public readonly rememberCreatedAt?: DateTimeTimezone;
  @BawDateTime({ persist: true })
  public readonly currentSignInAt?: DateTimeTimezone;
  @BawDateTime({ persist: true })
  public readonly lastSignInAt?: DateTimeTimezone;
  @BawDateTime({ persist: true })
  public readonly confirmedAt?: DateTimeTimezone;
  @BawDateTime({ persist: true })
  public readonly confirmationSentAt?: DateTimeTimezone;
  @BawDateTime({ persist: true })
  public readonly lockedAt?: DateTimeTimezone;
  @BawDateTime({ persist: true })
  public readonly createdAt?: DateTimeTimezone;
  @BawDateTime({ persist: true })
  public readonly updatedAt?: DateTimeTimezone;
  @BawDateTime({ persist: true })
  public lastSeenAt?: DateTimeTimezone;

  constructor(user: IUser) {
    super(user);

    this.userName = user.userName || "Deleted User";
    this.imageUrls = user.imageUrls
      ? user.imageUrls.map((imageUrl) => {
          // TODO Add /assets by default from the API so this check doesn't need to occur
          // Default values from API need to have /assets prepended
          if (
            imageUrl.url.startsWith("/") &&
            !imageUrl.url.startsWith("/assets/")
          ) {
            imageUrl.url = "/assets" + imageUrl.url;
          }
          return imageUrl;
        })
      : [
          {
            size: "extralarge",
            url: "/assets/images/user/user_span4.png",
            width: 300,
            height: 300,
          },
          {
            size: "large",
            url: "/assets/images/user/user_span3.png",
            width: 220,
            height: 220,
          },
          {
            size: "medium",
            url: "/assets/images/user/user_span2.png",
            width: 140,
            height: 140,
          },
          {
            size: "small",
            url: "/assets/images/user/user_span1.png",
            width: 60,
            height: 60,
          },
          {
            size: "tiny",
            url: "/assets/images/user/user_spanhalf.png",
            width: 30,
            height: 30,
          },
        ];
  }

  /**
   * Determines if user is admin. Role mask stores user roles
   * as a power of 2 integer so that roles can be combined.
   * The admin role is 1, therefore a role mask of 1 (0001) or
   * 3 (0011) indicate an admin account.
   */
  public get isAdmin(): boolean {
    // tslint:disable-next-line: no-bitwise
    return !!(this.rolesMask & 1);
  }
  /**
   * Get image from imageUrls which relates to the given size
   * @param size Size of image
   * @returns Image URL
   */
  public getImage(size: ImageSizes): string {
    for (const imageUrl of this.imageUrls) {
      if (imageUrl.size === size) {
        return imageUrl.url;
      }
    }

    return "/assets/images/user/user_span4.png";
  }

  public get viewUrl(): string {
    return theirProfileMenuItem.route.format({ accountId: this.id });
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
export class SessionUser extends User implements ISessionUser {
  public readonly kind: "User" | "SessionUser" = "SessionUser";
  @BawPersistAttr
  public readonly id?: Id;
  @BawPersistAttr
  public readonly authToken?: AuthToken;
  @BawPersistAttr
  public readonly userName?: UserName;

  constructor(user: ISessionUser) {
    super(user);
  }

  public toJSON() {
    return {
      authToken: this.authToken,
      userName: this.userName,
      ...super.toJSON(),
    };
  }

  public get viewUrl(): string {
    return myAccountMenuItem.route.toString();
  }
}

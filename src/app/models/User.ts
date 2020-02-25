import { DateTime } from "luxon";
import { theirProfileMenuItem } from "../component/profile/profile.menus";
import {
  AuthToken,
  DateTimeTimezone,
  defaultDateTimeTimezone,
  Id,
  ImageSizes,
  ImageURL,
  TimezoneInformation,
  UserName
} from "../interfaces/apiInterfaces";
import { AbstractModel } from "./AbstractModel";

/**
 * A user model.
 */
export interface UserInterface {
  id?: Id;
  userName?: UserName;
  rolesMask?: number;
  rolesMaskNames?: string[];
  timezoneInformation?: TimezoneInformation;
  imageUrls?: ImageURL[];
  lastSeenAt?: DateTimeTimezone | string;
  preferences?: any;
  isConfirmed?: boolean;
}

/**
 * A user model.
 */
export class User extends AbstractModel implements UserInterface {
  public readonly kind: "User" = "User";
  public readonly id?: Id;
  public readonly userName?: UserName;
  public readonly timezoneInformation?: TimezoneInformation;
  public readonly imageUrls?: ImageURL[];
  public readonly lastSeenAt?: DateTimeTimezone | string;
  public readonly preferences?: any;
  public readonly isConfirmed?: boolean;
  public readonly rolesMask?: number;
  public readonly rolesMaskNames?: string[];

  constructor(user: UserInterface) {
    super(user);

    this.userName = user.userName || "Deleted User";
    this.lastSeenAt = user.lastSeenAt
      ? DateTime.fromISO(user.lastSeenAt as string, {
          setZone: true
        })
      : defaultDateTimeTimezone;

    this.imageUrls = user.imageUrls
      ? user.imageUrls.map(imageUrl => {
          // Default values from API need to have /assets prepended
          if (imageUrl.url.startsWith("/")) {
            imageUrl.url = "/assets" + imageUrl.url;
          }
          return imageUrl;
        })
      : [
          {
            size: "extralarge",
            url: "/assets/images/user/user_span4.png",
            width: 300,
            height: 300
          },
          {
            size: "large",
            url: "/assets/images/user/user_span3.png",
            width: 220,
            height: 220
          },
          {
            size: "medium",
            url: "/assets/images/user/user_span2.png",
            width: 140,
            height: 140
          },
          {
            size: "small",
            url: "/assets/images/user/user_span1.png",
            width: 60,
            height: 60
          },
          {
            size: "tiny",
            url: "/assets/images/user/user_spanhalf.png",
            width: 30,
            height: 30
          }
        ];
  }

  /**
   * Determines if user is admin. Role mask stores user roles
   * as a power of 2 integer so that roles can be combined.
   * The admin role is 1, therefore a role mask of 1 (0001) or
   * 3 (0011) indicate an admin account.
   */
  get isAdmin(): boolean {
    // tslint:disable-next-line: no-bitwise
    return (this.rolesMask & 1) === 1;
  }

  static fromJSON = (obj: any) => {
    if (typeof obj === "string") {
      obj = JSON.parse(obj);
    }

    return new User(obj);
  };

  toJSON() {
    // TODO Add register details

    return {
      id: this.id,
      userName: this.userName
    };
  }

  /**
   * Get image from imageUrls which relates to the given size
   * @param size Size of image
   * @returns Image URL
   */
  getImage(size: ImageSizes): string {
    for (const imageUrl of this.imageUrls) {
      if (imageUrl.size === size) {
        return imageUrl.url;
      }
    }

    return "/assets/images/user/user_span4.png";
  }

  redirectPath(): string {
    return theirProfileMenuItem.route
      .toString()
      .replace(":userId", this.id.toString());
  }
}

/**
 * A user model for the website user
 */
export interface SessionUserInterface {
  id?: Id;
  userName?: UserName;
  authToken?: AuthToken;
}

/**
 * A user model for the website user
 */
export class SessionUser extends AbstractModel implements SessionUserInterface {
  public readonly kind?: "SessionUser" = "SessionUser";
  public readonly id?: Id;
  public readonly authToken?: AuthToken;
  public readonly userName?: UserName;

  /**
   * Constructor
   */
  constructor(user: SessionUserInterface) {
    super(user);
  }

  static fromJSON = (obj: any) => {
    if (typeof obj === "string") {
      obj = JSON.parse(obj);
    }

    return new SessionUser(obj);
  };

  toJSON() {
    return {
      id: this.id,
      authToken: this.authToken,
      userName: this.userName
    };
  }
}

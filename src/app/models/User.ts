import { DateTime } from "luxon";
import { theirProfileMenuItem } from "../component/profile/profile.menus";
import {
  AuthToken,
  DateTimeTimezone,
  defaultDateTimeTimezone,
  ID,
  ImageSizes,
  ImageURL,
  TimezoneInformation,
  UserName
} from "../interfaces/apiInterfaces";

/**
 * A user model.
 */
export interface UserInterface {
  kind?: "User";
  id: ID;
  userName: UserName;
  rolesMask: number;
  rolesMaskNames: string[];
  timezoneInformation?: TimezoneInformation;
  imageUrls?: ImageURL[];
  lastSeenAt: DateTimeTimezone | string;
  preferences?: any;
  isConfirmed?: boolean;
}

/**
 * A user model for the website user
 */
export interface SessionUserInterface {
  userName: UserName;
  authToken: AuthToken;
}

/**
 * A user model.
 */
export class User implements UserInterface {
  public readonly kind: "User";
  public readonly id: ID;
  public readonly userName: UserName;
  public readonly timezoneInformation: TimezoneInformation;
  public readonly imageUrls: ImageURL[];
  public readonly lastSeenAt: DateTimeTimezone | string;
  public readonly preferences: any;
  public readonly isConfirmed: boolean;
  public readonly rolesMask: number;
  public readonly rolesMaskNames: string[];

  constructor(user: UserInterface) {
    this.kind = "User";

    this.id = user.id;
    this.userName = user.userName || "Deleted User";
    this.timezoneInformation = user.timezoneInformation;
    this.lastSeenAt = user.lastSeenAt
      ? DateTime.fromISO(user.lastSeenAt as string, {
          setZone: true
        })
      : defaultDateTimeTimezone;
    this.preferences = user.preferences;
    this.isConfirmed = user.isConfirmed;
    this.rolesMask = user.rolesMask;
    this.rolesMaskNames = user.rolesMaskNames;

    this.imageUrls = user.imageUrls
      ? user.imageUrls.map(imageUrl => {
          // Default values from API need to have /assets prepended
          if (imageUrl.url.charAt(0) === "/") {
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

  get url(): string {
    return theirProfileMenuItem.route
      .toString()
      .replace(":userId", this.id.toString());
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
}

/**
 * A user model for the website user
 */
export class SessionUser implements SessionUserInterface {
  public readonly authToken: AuthToken;
  public readonly userName: UserName;

  /**
   * Constructor
   */
  constructor(user: SessionUserInterface) {
    this.authToken = user.authToken;
    this.userName = user.userName;
  }
}

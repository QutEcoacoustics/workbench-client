import { modelData } from "@test/helpers/faker";
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
import { AbstractModel } from "./AbstractModel";
import { BawDateTime, BawPersistAttr } from "./AttributeDecorators";

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
  public readonly imageUrls?: ImageURL[];
  @BawPersistAttr
  public readonly preferences?: any;
  public readonly isConfirmed?: boolean;
  @BawPersistAttr
  public readonly rolesMask?: number;
  public readonly rolesMaskNames?: string[];
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

  public static generate(id?: Id): IUser {
    return {
      id: modelData.id(id),
      email: modelData.internet.email(),
      userName: modelData.internet.userName(),
      signInCount: modelData.random.number(100),
      failedAttempts: modelData.random.number(100),
      imageUrls: modelData.imageUrls(),
      preferences: modelData.randomObject(0, 5),
      isConfirmed: modelData.boolean(),
      timezoneInformation: modelData.timezone(),
      resetPasswordSentAt: modelData.timestamp(),
      rememberCreatedAt: modelData.timestamp(),
      currentSignInAt: modelData.timestamp(),
      lastSignInAt: modelData.timestamp(),
      confirmedAt: modelData.timestamp(),
      confirmationSentAt: modelData.timestamp(),
      lockedAt: modelData.timestamp(),
      createdAt: modelData.timestamp(),
      updatedAt: modelData.timestamp(),
      lastSeenAt: modelData.timestamp(),
      ...modelData.random.arrayElement([
        { rolesMask: 1, rolesMaskNames: ["Admin"] },
        { rolesMask: 2, rolesMaskNames: ["User"] },
      ]),
    };
  }

  constructor(user: IUser) {
    super(user);

    this.userName = user.userName || "Deleted User";
    this.imageUrls = userImageUrls(user);
  }

  public get isAdmin(): boolean {
    return isModelAdmin(this);
  }

  public get viewUrl(): string {
    return theirProfileMenuItem.route.format({ accountId: this.id });
  }

  /**
   * Get image from imageUrls which relates to the given size
   * @param size Size of image
   * @returns Image URL
   */
  public getImage(size: ImageSizes): string {
    return getModelImage(this, size);
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
  public readonly imageUrls?: ImageURL[];
  @BawPersistAttr
  public readonly preferences?: any;
  @BawPersistAttr
  public readonly rolesMask?: number;
  @BawPersistAttr
  public readonly timezoneInformation?: TimezoneInformation;

  public static generate(): ISessionUser {
    return {
      authToken: modelData.random.alphaNumeric(20),
      userName: modelData.internet.userName(),
    };
  }

  constructor(user: ISessionUser & Partial<IUser>) {
    super(user);

    this.imageUrls = userImageUrls(user);
  }

  public get isAdmin(): boolean {
    return isModelAdmin(this);
  }

  public get viewUrl(): string {
    return myAccountMenuItem.route.toString();
  }

  /**
   * Get image from imageUrls which relates to the given size
   * @param size Size of image
   * @returns Image URL
   */
  public getImage(size: ImageSizes): string {
    return getModelImage(this, size);
  }
}

const defaultUserImages: ImageURL[] = [
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

function userImageUrls(model: IUser | ISessionUser) {
  return model.imageUrls
    ? model.imageUrls.map((imageUrl) => {
        // TODO https://github.com/QutEcoacoustics/baw-server/issues/452
        // Default values from API need to have /assets prepended
        if (
          imageUrl.url.startsWith("/") &&
          !imageUrl.url.startsWith("/assets/")
        ) {
          imageUrl.url = "/assets" + imageUrl.url;
        }
        return imageUrl;
      })
    : defaultUserImages;
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

/**
 * Get image from imageUrls which relates to the given size
 * @param size Size of image
 * @returns Image URL
 */
function getModelImage(model: User | SessionUser, size: ImageSizes): string {
  for (const imageUrl of model.imageUrls) {
    if (imageUrl.size === size) {
      return imageUrl.url;
    }
  }

  return "/assets/images/user/user_span4.png";
}

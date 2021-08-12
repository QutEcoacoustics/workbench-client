import { ISessionUser, IUser } from "@models/User";
import { modelData } from "@test/helpers/faker";

export function generateUser(
  data?: Partial<IUser>,
  isAdmin?: boolean
): Required<IUser> {
  return {
    id: modelData.id(),
    email: modelData.internet.email(),
    userName: modelData.internet.userName(),
    signInCount: modelData.datatype.number(100),
    failedAttempts: modelData.datatype.number(100),
    rolesMask: isAdmin ? 1 : 2,
    rolesMaskNames: isAdmin ? ["admin"] : ["user"],
    imageUrls: modelData.imageUrls(),
    preferences: modelData.randomObject(0, 5),
    isConfirmed: modelData.bool(),
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
    tzinfoTz: modelData.tzInfoTz(),
    ...data,
  };
}

export function generateSessionUser(
  data?: Partial<ISessionUser>,
  userData?: Partial<IUser>
): ISessionUser {
  return {
    authToken: modelData.authToken(),
    userName: modelData.internet.userName(),
    ...userData,
    ...data,
  };
}

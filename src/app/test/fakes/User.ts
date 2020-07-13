import { Id } from "@interfaces/apiInterfaces";
import { ISessionUser, IUser } from "@models/User";
import { modelData } from "@test/helpers/faker";

export function generateUser(id?: Id, isAdmin?: boolean): IUser {
  return {
    id: modelData.id(id),
    email: modelData.internet.email(),
    userName: modelData.internet.userName(),
    signInCount: modelData.random.number(100),
    failedAttempts: modelData.random.number(100),
    rolesMask: isAdmin ? 1 : 2,
    rolesMaskNames: isAdmin ? ["admin"] : ["user"],
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

export function generateSessionUser(): ISessionUser {
  return {
    authToken: modelData.random.alphaNumeric(20),
    userName: modelData.internet.userName(),
  };
}

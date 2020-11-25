import { Pipe, PipeTransform } from "@angular/core";
import { isDeletedUser, isUnknownUser, User } from "@models/User";

/**
 * Evaluate if a model is a ghost user or undefined
 */
@Pipe({
  name: "isGhostUser",
})
export class IsGhostUserPipe implements PipeTransform {
  /**
   * @param value User to evaluate
   * @param type Type of user to evaluate.
   * - `"unknown"` = Unknown user,
   * - `"deleted"` = Deleted user,
   * - `"all"` = Both unknown and deleted users
   */
  public transform(
    value: User,
    type: "unknown" | "deleted" | "all" = "all"
  ): boolean {
    if (!value) {
      return true;
    }

    const isDeleted = isDeletedUser(value);
    const isUnknown = isUnknownUser(value);

    switch (type) {
      case "all":
        return isDeleted || isUnknown;
      case "unknown":
        return isUnknown;
      case "deleted":
        return isDeleted;
    }
  }
}

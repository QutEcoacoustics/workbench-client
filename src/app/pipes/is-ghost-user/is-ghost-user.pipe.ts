import { Pipe, PipeTransform } from "@angular/core";
import { AbstractModel } from "@models/AbstractModel";
import { User } from "@models/User";

/**
 * Evaluate if a model is a ghost user or undefined
 */
@Pipe({ name: "isGhostUser" })
export class IsGhostUserPipe implements PipeTransform {
  /**
   * @param value User to evaluate
   * @param type Type of user to evaluate.
   * - `"unknown"` = Unknown user,
   * - `"deleted"` = Deleted user,
   * - `"all"` = Both unknown and deleted users
   */
  public transform(value: AbstractModel, type: "unknown" | "deleted" | "all" = "all"): boolean {
    if (!value || !(value instanceof User)) {
      return true;
    }

    switch (type) {
      case "all":
        return value.isGhost;
      case "unknown":
        return value.isUnknown;
      case "deleted":
        return value.isDeleted;
    }
  }
}

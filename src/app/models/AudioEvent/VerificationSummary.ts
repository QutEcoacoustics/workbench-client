import { Id } from "@interfaces/apiInterfaces";
import { AbstractData } from "@models/AbstractData";
import { Tag } from "@models/Tag";

export interface IVerificationSummary {
  tagId: Id<Tag>;
  count: number;
  correct: number;
  incorrect: number;
  unsure: number;
  skip: number;
}

export class VerificationSummary
  extends AbstractData<IVerificationSummary>
  implements IVerificationSummary
{
  public readonly tagId: Id<Tag>;
  /**
   * A count of the total number of verifications seen by the server.
   *
   * This should be equal to the sum of
   * {@linkcode correct} + {@linkcode incorrect} + {@linkcode unsure} + {@linkcode skip}
   */
  public readonly count: number;
  /** Count of "correct" verifications applied to the tag + audio event */
  public readonly correct: number;
  /** Count of "incorrect" verifications applied to the tag + audio event */
  public readonly incorrect: number;
  /** Count of "unsure" verifications applied to the tag + audio event */
  public readonly unsure: number;
  /** Count of "skip" verifications applied to the tag + audio event */
  public readonly skip: number;

  /**
   * @description
   * The total number of resolved verifications (correct + incorrect).
   */
  public get resolvedDecisionCount(): number {
    return this.correct + this.incorrect;
  }

  /**
   * @description
   * A percentage (0-1) of resolved verifications (correct + incorrect) that
   * were marked as correct.
   */
  public get correctConsensus(): number {
    // Store the resolvedDecisionCount in a variable so that the getter is only
    // called once, meaning if there is a bug where the getter returns different
    // values on subsequent calls it won't affect the outcome of this method and
    // the resolvedCount === 0 check will be over the same value as used in the
    // division.
    const resolvedCount = this.resolvedDecisionCount;
    if (resolvedCount === 0) {
      // We return a 0% consensus if there are no resolved verifications to
      // prevent a divide by zero bug which would return NaN.
      return 0;
    }

    return this.correct / resolvedCount;
  }
}

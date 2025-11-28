import { AbstractData } from "@models/AbstractData";

// This is used in the jsdoc comment for the ConsensusDecision enum below.
// The problem is that TypeScript enums cannot extend other enums.
// Therefore, the best that I can do is reference the ConfirmedStatus enum in a
// JsDoc comment documenting that the ConsensusDecision enum should extend
// ConfirmedStatus.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { ConfirmedStatus } from "@models/Verification";

/**
 * @description
 * Possible decisions that can be
 *
 * @extends {ConfirmedStatus}
 */
export enum ConsensusDecision {
  Correct = "correct",
  Incorrect = "incorrect",
  Unsure = "unsure",
  Skip = "skip",

  /**
   * A value that can be used when there is low-consensus or no verification
   * decisions applied to a tag + audio event pair.
   */
  None = "none",
}

export interface IConsensus {
  count: number;
  correct: number;
  incorrect: number;
}

/**
 * @description
 * Consensus information about a set of verifications attached to an audio
 * event + tag combination.
 */
export class Consensus extends AbstractData<IConsensus> {
  /** Total number of "correct" verifications */
  private readonly correct: number;
  /** Total number of "incorrect" verifications */
  private readonly incorrect: number;

  // Returns the consensus decision based on the highest vote count
  // If all counts are 0, returns None
  public get decision(): ConsensusDecision {
    if (this.correct === 0 && this.incorrect === 0) {
      return ConsensusDecision.None;
    }

    // In the event of a tie, default to "Correct"
    if (this.correct >= this.incorrect) {
      return ConsensusDecision.Correct;
    } else {
      return ConsensusDecision.Incorrect;
    }
  }

  /**
   * @returns
   * A number between 0 and 1 representing the ratio of verifications that agree
   * with the consensus decision.
   */
  public get ratio(): number {
    const totalResolved = this.correct + this.incorrect;
    const maxCount = Math.max(this.correct, this.incorrect);

    return maxCount / totalResolved;
  }
}

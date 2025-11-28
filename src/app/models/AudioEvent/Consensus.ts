import { AbstractData } from "@models/AbstractData";

export enum ConsensusDecision {
  Correct = "correct",
  Incorrect = "incorrect",
  Unsure = "unsure",
  Skip = "skip",
  None = "none",
}

export interface IConsensus {
  count: number;
  correct: number;
  incorrect: number;
  unsure: number;
  skip: number;
}

// TODO: Refactor this once API support is added
export class Consensus extends AbstractData<IConsensus> {
  public readonly count: number;
  public readonly correct: number;
  public readonly incorrect: number;
  public readonly unsure: number;
  public readonly skip: number;

  // Returns the consensus decision based on the highest vote count
  // If all counts are 0, returns None
  public get decision(): ConsensusDecision {
    if (this.count === 0 || (this.correct === 0 && this.incorrect === 0)) {
      return ConsensusDecision.None;
    }

    // In the event of a tie, default to Correct
    if (this.correct >= this.incorrect) {
      return ConsensusDecision.Correct;
    } else {
      return ConsensusDecision.Incorrect;
    }
  }

  /**
   * Returns how many of the "decision" votes there were as a ratio of total
   * votes.
   */
  public get ratio(): number {
    const totalResolved = this.correct + this.incorrect;
    const maxResolved = Math.max(this.correct, this.incorrect);

    return maxResolved / totalResolved;
  }
}

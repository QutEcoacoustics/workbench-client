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

  // TODO: Refactor this
  public get decision(): ConsensusDecision {
    const max = Math.max(
      this.correct,
      this.incorrect,
      this.unsure,
      this.skip
    ) || -1;

    switch (max) {
      case this.correct:
        return ConsensusDecision.Correct;
      case this.incorrect:
        return ConsensusDecision.Incorrect;
      case this.unsure:
        return ConsensusDecision.Unsure;
      case this.skip:
        return ConsensusDecision.Skip;
      default: {
        return ConsensusDecision.None;
      }
    }
  }

  /**
   * Returns how many of the "decision" votes there were as a ratio of total
   * votes.
   */
  public get ratio(): number {
    let decisionVotes = 0;
    switch (this.decision) {
      case ConsensusDecision.Correct:
        decisionVotes = this.correct;
        break;
      case ConsensusDecision.Incorrect:
        decisionVotes = this.incorrect;
        break;
      case ConsensusDecision.Unsure:
        decisionVotes = this.unsure;
        break;
      case ConsensusDecision.Skip:
        decisionVotes = this.skip;
        break;
    }

    return (decisionVotes ?? 0) / (this.count ?? 1);
  }
}

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
      if (this.count === 0) {
        return ConsensusDecision.None;
      }

      const decisions = [
        { decision: ConsensusDecision.Correct, count: this.correct },
        { decision: ConsensusDecision.Incorrect, count: this.incorrect },
        { decision: ConsensusDecision.Unsure, count: this.unsure },
        { decision: ConsensusDecision.Skip, count: this.skip },
      ];

      const orderedDecisions = decisions.sort((a, b) => b.count - a.count);

      return orderedDecisions[0].decision;
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

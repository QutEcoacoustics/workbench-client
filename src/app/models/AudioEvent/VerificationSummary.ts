import { Id } from "@interfaces/apiInterfaces";
import { AbstractData } from "@models/AbstractData";
import { Tag } from "@models/Tag";
import { Consensus } from "./Consensus";

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

  public get consensus(): Consensus {
    return new Consensus(this);
  }
}

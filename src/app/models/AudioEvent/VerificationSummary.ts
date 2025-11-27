import { Id } from "@interfaces/apiInterfaces";
import { AbstractModelWithoutId } from "@models/AbstractModel";
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
  extends AbstractModelWithoutId<IVerificationSummary>
  implements IVerificationSummary
{
  public readonly tagId: Id<Tag>;
  public readonly count: number;
  public readonly correct: number;
  public readonly incorrect: number;
  public readonly unsure: number;
  public readonly skip: number;

  public get consensus(): Consensus {
    return new Consensus({
      count: this.count,
      correct: this.correct,
      incorrect: this.incorrect,
      unsure: this.unsure,
      skip: this.skip,
    });
  }

  public get viewUrl(): string {
    throw new Error("Method not implemented.");
  }
}

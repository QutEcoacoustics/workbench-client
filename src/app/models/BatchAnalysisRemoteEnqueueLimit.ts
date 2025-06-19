import { AbstractSetting } from "./AbstractSetting";
import { bawPersistAttr } from "./AttributeDecorators";

export interface IBatchAnalysisRemoteEnqueueLimit {
  name: string;
  value: number;
  description: string;

}

export class BatchAnalysisRemoteEnqueueLimit extends AbstractSetting
  implements IBatchAnalysisRemoteEnqueueLimit
{
  public readonly kind = "batch_analysis_remote_enqueue_limit";
  @bawPersistAttr()
  public readonly name: string;
  @bawPersistAttr()
  public readonly value: number;
  public readonly description: string;

  public get viewUrl(): string {
    throw new Error("Method not implemented.");
  }
}

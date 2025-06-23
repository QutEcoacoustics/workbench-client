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
  public readonly kind = "site_setting";
  @bawPersistAttr({ update: true })
  public readonly name: string;
  @bawPersistAttr({ update: true })
  public readonly value: number;
  public readonly description: string;

  public get viewUrl(): string {
    throw new Error("Method not implemented.");
  }
}

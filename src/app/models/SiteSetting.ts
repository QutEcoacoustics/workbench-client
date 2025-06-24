import { Id } from "@interfaces/apiInterfaces";
import { bawPersistAttr } from "./AttributeDecorators";
import { AbstractModel } from "./AbstractModel";

export interface ISiteSetting {
  id?: Id;
  name: string;
  value: number;
  description: string;
}
export class SiteSetting
  extends AbstractModel<ISiteSetting>
  implements ISiteSetting
{
  public readonly kind = "site_setting";
  public readonly id?: Id;
  @bawPersistAttr({ update: true })
  public readonly name: string;
  @bawPersistAttr({ update: true })
  public readonly value: number;
  public readonly description: string;

  public get viewUrl(): string {
    throw new Error("Method not implemented.");
  }
}

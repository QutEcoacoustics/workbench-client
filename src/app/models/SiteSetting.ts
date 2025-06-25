import { DateTimeTimezone, Id } from "@interfaces/apiInterfaces";
import { adminRoute } from "@components/admin/admin.menus";
import { bawPersistAttr } from "./AttributeDecorators";
import { AbstractModel } from "./AbstractModel";

export interface ISiteSetting {
  id?: Id;
  name: string;
  value: number;
  description: string;
  typeSpecification: string;
  createdAt?: DateTimeTimezone | string;
  updatedAt?: DateTimeTimezone | string;
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
  public readonly typeSpecification: string;

  public readonly createdAt?: DateTimeTimezone | string;
  public readonly updatedAt?: DateTimeTimezone | string;

  public get viewUrl(): string {
    return adminRoute.format();
  }
}

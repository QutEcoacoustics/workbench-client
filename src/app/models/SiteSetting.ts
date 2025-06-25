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

  /** Humanizes the name of the setting to be disabled in the UI */
  public get humanizedName(): string {
    // Site setting names are returned from the server as snake_case.
    // Therefore, we replace all of the underscores with spaces to create a
    // humanized name.
    // We return a space separated string instead of something like Title Case
    // because the formatting of the setting name should be done inside a
    // components template.
    //
    // E.g. If you want Title Case, you can use something like
    // {{ siteSetting.humanizedName | titleCase }}
    return this.name.replaceAll("_", " ")
  }
}

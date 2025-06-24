import { Injectable } from "@angular/core";
import {
  ApiCreate,
  ApiDestroy,
  ApiList,
  ApiShow,
  ApiUpdate,
  emptyParam,
  idOrName,
  IdOrName,
} from "@baw-api/api-common";
import { BawApiService } from "@baw-api/baw-api.service";
import { stringTemplate } from "@helpers/stringTemplate/stringTemplate";
import { Param } from "@interfaces/apiInterfaces";
import { SiteSetting } from "@models/SiteSetting";

type SettingsIdentifierParam = (_: IdOrName<SiteSetting>) => Param;

const settingIdentifier: SettingsIdentifierParam = idOrName;
const endpoint = stringTemplate`/admin/site_settings/${settingIdentifier}`;

@Injectable()
export class SiteSettingsService
  implements
    ApiList<SiteSetting>,
    ApiShow<SiteSetting>,
    ApiCreate<SiteSetting>,
    ApiUpdate<SiteSetting>,
    ApiDestroy<SiteSetting>
{
  public constructor(private api: BawApiService<SiteSetting>) {}

  public list() {
    return this.api.list(SiteSetting, endpoint(emptyParam));
  }

  public show(model: IdOrName<SiteSetting>) {
    return this.api.show(SiteSetting, endpoint(model));
  }

  public create(model: SiteSetting) {
    return this.api.create(
      SiteSetting,
      endpoint(emptyParam),
      (responseModel) => endpoint(responseModel),
      model,
    );
  }

  public update(model: SiteSetting) {
    return this.api.update(
      SiteSetting,
      endpoint(model),
      model,
    );
  }

  public destroy(model: IdOrName<SiteSetting>) {
    return this.api.destroy(endpoint(model));
  }
}

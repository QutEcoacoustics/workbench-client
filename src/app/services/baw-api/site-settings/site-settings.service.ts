import { Injectable, inject } from "@angular/core";
import {
  ApiCreate,
  ApiDestroy,
  ApiList,
  ApiShow,
  ApiUpdate,
  emptyParam,
  nameOrId,
  IdOrName,
} from "@baw-api/api-common";
import { BawApiService } from "@baw-api/baw-api.service";
import { stringTemplate } from "@helpers/stringTemplate/stringTemplate";
import { Param } from "@interfaces/apiInterfaces";
import { SiteSetting } from "@models/SiteSetting";

type SettingsIdentifierParam = (_: IdOrName<SiteSetting>) => Param;

const settingIdentifier: SettingsIdentifierParam = nameOrId;
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
  private readonly api = inject<BawApiService<SiteSetting>>(BawApiService);

  public list() {
    // @ts-expect-error: strict mode fix
    return this.api.list(SiteSetting, endpoint(emptyParam));
  }

  public show(model: IdOrName<SiteSetting>) {
    // @ts-expect-error: strict mode fix
    return this.api.show(SiteSetting, endpoint(model));
  }

  public create(model: SiteSetting) {
    return this.api.create(
      // @ts-expect-error: strict mode fix
      SiteSetting,
      endpoint(emptyParam),
      (responseModel) => endpoint(responseModel),
      model,
    );
  }

  public update(model: SiteSetting) {
    return this.api.update(
      // @ts-expect-error: strict mode fix
      SiteSetting,
      endpoint(model),
      model,
    );
  }

  // @ts-expect-error: strict mode override
  public destroy(model: IdOrName<SiteSetting>) {
    return this.api.destroy(endpoint(model));
  }
}

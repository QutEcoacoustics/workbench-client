import { Injectable } from "@angular/core";
import {
  ApiCreate,
  ApiDestroy,
  ApiList,
  ApiShow,
  ApiUpdate,
  Empty,
  emptyParam,
} from "@baw-api/api-common";
import { BawApiService } from "@baw-api/baw-api.service";
import { isInstantiated } from "@helpers/isInstantiated/isInstantiated";
import { stringTemplate } from "@helpers/stringTemplate/stringTemplate";
import { Id } from "@interfaces/apiInterfaces";
import { AbstractSetting } from "@models/AbstractSetting";
import { BatchAnalysisRemoteEnqueueLimit } from "@models/BatchAnalysisRemoteEnqueueLimit";

type IdOrName<T extends AbstractSetting> = T | Id | string;
type SettingsIdentifierParam = (_: IdOrName<AbstractSetting>) => string;

function idOrName<T extends AbstractSetting>(x: IdOrName<T> | Empty) {
  if (x === emptyParam || !isInstantiated(x)) {
    return x;
  } else if (isInstantiated(x?.["id"])) {
    return x?.["id"].toString();
  } else if (isInstantiated(x?.["name"])) {
    return x?.["name"];
  } else {
    return x.toString();
  }
}

const settingIdentifier: SettingsIdentifierParam = idOrName;
const endpoint = stringTemplate`/admin/site_settings/${settingIdentifier}`;

@Injectable()
export class SiteSettingsService
  implements
    ApiList<AbstractSetting>,
    ApiShow<AbstractSetting>,
    ApiCreate<AbstractSetting>,
    ApiUpdate<AbstractSetting>,
    ApiDestroy<AbstractSetting>
{
  public constructor(private api: BawApiService<AbstractSetting>) {}

  public list() {
    return this.api.list(BatchAnalysisRemoteEnqueueLimit, endpoint(emptyParam));
  }

  public show(model: IdOrName<AbstractSetting>) {
    return this.api.show(BatchAnalysisRemoteEnqueueLimit, endpoint(model));
  }

  public create(model: AbstractSetting) {
    return this.api.create(
      BatchAnalysisRemoteEnqueueLimit,
      endpoint(emptyParam),
      (responseModel) => endpoint(responseModel),
      model,
    );
  }

  public update(model: AbstractSetting) {
    return this.api.update(
      BatchAnalysisRemoteEnqueueLimit,
      endpoint(model),
      model,
    );
  }

  public destroy(model: IdOrName<AbstractSetting>) {
    return this.api.destroy(endpoint(model));
  }
}

import { HttpClient } from "@angular/common/http";
import { Inject, Injectable, Injector } from "@angular/core";
import { ApiShow } from "@baw-api/api-common";
import { BawApiService } from "@baw-api/baw-api.service";
import { API_ROOT } from "@helpers/app-initializer/app-initializer";
import { stringTemplate } from "@helpers/stringTemplate/stringTemplate";
import { Statistics } from "@models/Statistics";
import { Observable } from "rxjs";

const endpoint = stringTemplate`/stats`;

@Injectable()
export class StatisticsService
  extends BawApiService<Statistics>
  implements ApiShow<Statistics>
{
  public constructor(
    http: HttpClient,
    @Inject(API_ROOT) apiRoot: string,
    injector: Injector
  ) {
    super(http, apiRoot, Statistics, injector);
  }

  public show(): Observable<Statistics> {
    return this.apiShow(endpoint());
  }
}

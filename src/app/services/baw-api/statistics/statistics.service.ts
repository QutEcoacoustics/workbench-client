import { HttpClient } from "@angular/common/http";
import { Inject, Injectable, Injector } from "@angular/core";
import { BawApiService } from "@baw-api/baw-api.service";
import { API_ROOT } from "@helpers/app-initializer/app-initializer";

@Injectable()
export class StatisticsService extends BawApiService<any> {
  public constructor(
    http: HttpClient,
    @Inject(API_ROOT) apiRoot: string,
    injector: Injector
  ) {
    super(http, apiRoot, undefined, injector);
  }
}

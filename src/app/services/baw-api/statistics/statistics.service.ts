import { Injectable, inject } from "@angular/core";
import { ApiShow } from "@baw-api/api-common";
import { BawApiService } from "@baw-api/baw-api.service";
import { stringTemplate } from "@helpers/stringTemplate/stringTemplate";
import { Statistics } from "@models/Statistics";
import { Observable } from "rxjs";

const endpoint = stringTemplate`/stats`;

@Injectable()
export class StatisticsService implements ApiShow<Statistics> {
  private readonly api = inject<BawApiService<Statistics>>(BawApiService);

  public show(): Observable<Statistics> {
    return this.api.show(Statistics, endpoint());
  }
}

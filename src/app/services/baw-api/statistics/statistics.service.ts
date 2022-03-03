import { Injectable } from "@angular/core";
import { ApiShow } from "@baw-api/api-common";
import { BawApiService } from "@baw-api/baw-api.service";
import { stringTemplate } from "@helpers/stringTemplate/stringTemplate";
import { Statistics } from "@models/Statistics";
import { Observable } from "rxjs";

const endpoint = stringTemplate`/stats`;

@Injectable()
export class StatisticsService implements ApiShow<Statistics> {
  public constructor(private api: BawApiService<Statistics>) {}

  public show(): Observable<Statistics> {
    return this.api.show(Statistics, endpoint());
  }
}

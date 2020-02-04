import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Project } from "src/app/models/Project";
import { Site } from "src/app/models/Site";
import { AppConfigService } from "../../app-config/app-config.service";
import { IdOr, StandardApi } from "../api-common";

@Injectable({
  providedIn: "root"
})
export class MockSitesService extends StandardApi<Site, [IdOr<Project>]> {
  constructor(http: HttpClient, config: AppConfigService) {
    super(http, config, Site);
  }

  public list() {
    return new Observable<Site[]>();
  }

  public filter() {
    return new Observable<Site[]>();
  }

  public show() {
    return new Observable<Site>();
  }

  public create() {
    return new Observable<Site>();
  }

  public update() {
    return new Observable<Site>();
  }

  public destroy() {
    return new Observable<null>();
  }
}

@Injectable({
  providedIn: "root"
})
export class MockSitesServiceShallow extends StandardApi<
  Site,
  [IdOr<Project>]
> {
  constructor(http: HttpClient, config: AppConfigService) {
    super(http, config, Site);
  }

  public list() {
    return new Observable<Site[]>();
  }

  public filter() {
    return new Observable<Site[]>();
  }

  public show() {
    return new Observable<Site>();
  }

  public create() {
    return new Observable<Site>();
  }

  public update() {
    return new Observable<Site>();
  }

  public destroy() {
    return new Observable<null>();
  }
}

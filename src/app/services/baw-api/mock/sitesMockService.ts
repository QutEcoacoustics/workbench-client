import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { BawApiService } from "../base-api.service";

@Injectable({
  providedIn: "root"
})
export class MockSitesService extends BawApiService {
  public getSite() {
    return new Subject();
  }

  public getProjectSite() {
    return new Subject();
  }

  public getProjectSites() {
    return new Subject();
  }

  public getFilteredSites() {
    return new Subject();
  }

  public updateProjectSite() {
    return new Subject();
  }

  public newProjectSite() {
    return new Subject();
  }
}

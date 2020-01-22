import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { Site } from "src/app/models/Site";
import { MockApiCommon } from "./api-commonMock";

@Injectable({
  providedIn: "root"
})
export class MockSitesService extends MockApiCommon<Site> {
  public getSites() {
    return new Subject();
  }

  public getSite() {
    return new Subject();
  }

  public getProjectSites() {
    return new Subject();
  }

  public getProjectSite() {
    return new Subject();
  }

  public newProjectSite() {
    return new Subject();
  }

  public updateProjectSite() {
    return new Subject();
  }

  public deleteProjectSite() {
    return new Subject();
  }
}

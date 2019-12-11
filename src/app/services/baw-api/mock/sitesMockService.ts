import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { ID } from "src/app/interfaces/apiInterfaces";
import { Site } from "src/app/models/Site";
import { BawApiService } from "../base-api.service";
import { SiteFilters } from "../sites.service";

@Injectable({
  providedIn: "root"
})
export class MockSitesService extends BawApiService {
  constructor(http: HttpClient) {
    super(http);
  }

  /**
   * Get site data available to the user
   * @param id Site ID
   * @returns Observable returning singular site
   */
  public getSite(id: ID): Subject<Site> {
    const subject = new Subject<Site>();

    setTimeout(() => {
      subject.next(
        new Site({
          id,
          name: "Site",
          creatorId: 1,
          description: "A sample site",
          projectIds: new Set([1, 2, 3]),
          locationObfuscated: true,
          customLatitude: 0,
          customLongitude: 0,
          timezoneInformation: {
            identifierAlt: "Paris",
            identifier: "Europe/Paris",
            friendlyIdentifier: "Europe - Paris",
            utcOffset: 3600,
            utcTotalOffset: 3600
          }
        })
      );
    }, 50);

    return subject;
  }

  /**
   * Get site data available to the user
   * @param projectId Project ID
   * @param siteId Site ID
   * @returns Observable returning singular site
   */
  public getProjectSite(projectId: ID, siteId: ID): Subject<Site> {
    const subject = new Subject<Site>();

    setTimeout(() => {
      subject.next(
        new Site({
          id: siteId,
          name: "Site",
          creatorId: 1,
          description: "A sample site",
          projectIds: new Set([projectId, 2, 3]),
          locationObfuscated: true,
          customLatitude: 0,
          customLongitude: 0,
          timezoneInformation: {
            identifierAlt: "Paris",
            identifier: "Europe/Paris",
            friendlyIdentifier: "Europe - Paris",
            utcOffset: 3600,
            utcTotalOffset: 3600
          }
        })
      );
    }, 50);

    return subject;
  }

  /**
   * Get list of sites for a project
   * @returns Observable list of sites
   * @param id Project ID
   * @returns Observable list of sites for a project
   */
  public getProjectSites(id: ID): Subject<Site[]> {
    const subject = new Subject<Site[]>();

    setTimeout(() => {
      subject.next([
        new Site({
          id: 1,
          name: "Site",
          creatorId: 1,
          description: "A sample site",
          projectIds: new Set([id, 2, 3]),
          locationObfuscated: true,
          customLatitude: 0,
          customLongitude: 0,
          timezoneInformation: {
            identifierAlt: "Paris",
            identifier: "Europe/Paris",
            friendlyIdentifier: "Europe - Paris",
            utcOffset: 3600,
            utcTotalOffset: 3600
          }
        }),
        new Site({
          id: 2,
          name: "Site",
          creatorId: 2,
          description: "A sample site",
          projectIds: new Set([id, 4, 5]),
          locationObfuscated: true,
          customLatitude: 0,
          customLongitude: 0,
          timezoneInformation: {
            identifierAlt: "Paris",
            identifier: "Europe/Paris",
            friendlyIdentifier: "Europe - Paris",
            utcOffset: 3600,
            utcTotalOffset: 3600
          }
        })
      ]);
    }, 50);

    return subject;
  }

  /**
   * Get list of filtered sites
   * @param filters Filters
   * @returns Observable list of sites
   */
  public getFilteredSites(filters: SiteFilters): Subject<Site[]> {
    const subject = new Subject<Site[]>();

    setTimeout(() => {
      subject.next([
        new Site({
          id: 1,
          name: "Site",
          creatorId: 1,
          description: "A sample site",
          projectIds: new Set([1, 2, 3]),
          locationObfuscated: true,
          customLatitude: 0,
          customLongitude: 0,
          timezoneInformation: {
            identifierAlt: "Paris",
            identifier: "Europe/Paris",
            friendlyIdentifier: "Europe - Paris",
            utcOffset: 3600,
            utcTotalOffset: 3600
          }
        }),
        new Site({
          id: 2,
          name: "Site",
          creatorId: 2,
          description: "A sample site",
          projectIds: new Set([4, 5, 6]),
          locationObfuscated: true,
          customLatitude: 0,
          customLongitude: 0,
          timezoneInformation: {
            identifierAlt: "Paris",
            identifier: "Europe/Paris",
            friendlyIdentifier: "Europe - Paris",
            utcOffset: 3600,
            utcTotalOffset: 3600
          }
        })
      ]);
    }, 50);

    return subject;
  }
}

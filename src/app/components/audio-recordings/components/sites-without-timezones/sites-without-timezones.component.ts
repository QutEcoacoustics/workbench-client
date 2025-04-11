import { Component, Input } from "@angular/core";
import { isInstantiated } from "@helpers/isInstantiated/isInstantiated";
import { isUnresolvedModel } from "@models/AbstractModel";
import { Project } from "@models/Project";
import { Region } from "@models/Region";
import { Site } from "@models/Site";
import { UrlDirective } from "../../../../directives/url/url.directive";

@Component({
  selector: "baw-sites-without-timezones",
  template: `
    <!-- Warn users about limitations of time of day filter -->
    @if (sitesWithoutTimezones(site, region?.sites, project?.sites); as sitesWithoutTimezone) {
      @if (sitesWithoutTimezone.length > 0) {
        <div class="alert alert-danger">
          Warning, this batch download includes site/s which do not have their timezones set. Any time of day filtering
          will not work on these sites until the site owner or editors update them. The list of sites can be seen below:
          @for (siteWithoutTimezone of sitesWithoutTimezone; track siteWithoutTimezone) {
            <ul class="mb-0">
              <li>
                <a [bawUrl]="project ? siteWithoutTimezone.getViewUrl(project) : siteWithoutTimezone.viewUrl">
                  {{ siteWithoutTimezone.name }}
                </a>
              </li>
            </ul>
          }
        </div>
      }
    }
  `,
  imports: [UrlDirective],
})
export class SitesWithoutTimezonesComponent {
  @Input() public site?: Site;
  @Input() public region?: Region;
  @Input() public project!: Project;

  public sitesWithoutTimezones(site?: Site, regionSites?: Site[], projectSites?: Site[]): Site[] {
    if (site) {
      return site.timezoneInformation ? [] : [site];
    }

    if (regionSites) {
      if (!isInstantiated(regionSites) || isUnresolvedModel(regionSites)) {
        return [];
      } else {
        return regionSites.filter((s) => !s.timezoneInformation);
      }
    }

    if (projectSites) {
      if (!isInstantiated(projectSites) || isUnresolvedModel(projectSites)) {
        return [];
      } else {
        return projectSites.filter((s) => !s.timezoneInformation);
      }
    }
  }
}

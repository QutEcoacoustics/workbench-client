import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";
import { MenuRoute } from "@interfaces/menusInterfaces";
import { ConfigService } from "@services/config/config.service";
import { websiteStatusMenuItem } from "@components/website-status/website-status.menu";
import {
  contactUsMenuItem,
  creditsMenuItem,
  dataSharingPolicyMenuItem,
  disclaimersMenuItem,
  ethicsMenuItem,
} from "../../about/about.menus";
import { statisticsMenuItem } from "../../statistics/statistics.menus";
import { StrongRouteActiveDirective } from "../../../directives/strongRoute/strong-route-active.directive";
import { StrongRouteDirective } from "../../../directives/strongRoute/strong-route.directive";

/**
 * Footer Component
 */
@Component({
    selector: "baw-footer",
    template: `
    <footer class="container-fluid text-bg-light">
      <nav class="container navbar navbar-expand-lg navbar-light text-bg-light">
        <ul class="nav me-auto align-items-center m-auto">
          <li class="nav-item">
            <p id="copyright" class="nav-link disabled m-0">
              &#169; QUT {{ year }}
            </p>
          </li>
          <li class="nav-item">
            <p id="version" class="nav-link disabled m-0">{{ version }}</p>
          </li>
    
          @for (link of links; track link) {
            <li class="nav-item">
              <a
                class="nav-link rounded-link-default"
                strongRouteActive="active"
                [strongRoute]="link.route"
                >
                {{ link.label }}
              </a>
            </li>
          }
        </ul>
      </nav>
    </footer>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [StrongRouteActiveDirective, StrongRouteDirective]
})
export class FooterComponent implements OnInit {
  public version: string;
  public year = new Date().getFullYear();
  public links: MenuRoute[] = [
    statisticsMenuItem,
    websiteStatusMenuItem,
    disclaimersMenuItem,
    creditsMenuItem,
    ethicsMenuItem,
    dataSharingPolicyMenuItem,
    contactUsMenuItem,
  ];

  public constructor(private configService: ConfigService) {}

  public ngOnInit(): void {
    this.version = this.configService.environment.version;
  }
}

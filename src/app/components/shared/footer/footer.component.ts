import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";
import { MenuRoute } from "@interfaces/menusInterfaces";
import { ConfigService } from "@services/config/config.service";
import {
  contactUsMenuItem,
  creditsMenuItem,
  disclaimersMenuItem,
  ethicsMenuItem,
} from "../../about/about.menus";
import { statisticsMenuItem } from "../../statistics/statistics.menus";

/**
 * Footer Component
 */
@Component({
  selector: "baw-footer",
  template: `
    <footer class="container-fluid bg-light">
      <nav class="container navbar navbar-expand-lg navbar-light bg-light">
        <ul class="nav me-auto align-items-center m-auto">
          <li class="nav-item">
            <p id="copyright" class="nav-link disabled m-0">
              &#169; QUT {{ year }}
            </p>
          </li>
          <li class="nav-item">
            <p id="version" class="nav-link disabled m-0">{{ version }}</p>
          </li>

          <li *ngFor="let link of links" class="nav-item">
            <a
              class="nav-link rounded-link-default"
              strongRouteActive="active"
              [strongRoute]="link.route"
            >
              {{ link.label }}
            </a>
          </li>
        </ul>
      </nav>
    </footer>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FooterComponent implements OnInit {
  public version: string;
  public year = new Date().getFullYear();
  public links: MenuRoute[] = [
    statisticsMenuItem,
    disclaimersMenuItem,
    creditsMenuItem,
    ethicsMenuItem,
    contactUsMenuItem,
  ];

  public constructor(private configService: ConfigService) {}

  public ngOnInit() {
    this.version = this.configService.config.version;
  }
}

import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";
import { version } from "package.json";
import { AppConfigService } from "src/app/services/app-config/app-config.service";
import {
  contactUsMenuItem,
  creditsMenuItem,
  disclaimersMenuItem,
  ethicsMenuItem
} from "../../about/about.menus";
import { statisticsMenuItem } from "../../statistics/statistics.menus";

@Component({
  selector: "app-footer",
  templateUrl: "./footer.component.html",
  styleUrls: ["./footer.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FooterComponent implements OnInit {
  public version: string = version;

  // TODO Update this to the internal routes
  routes = {
    contactUs: contactUsMenuItem,
    ethics: ethicsMenuItem,
    credits: creditsMenuItem,
    disclaimers: disclaimersMenuItem,
    statistics: statisticsMenuItem
  };

  constructor(private config: AppConfigService) {}

  ngOnInit() {}
}

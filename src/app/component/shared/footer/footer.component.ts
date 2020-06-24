import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";
import { AppConfigService } from "src/app/services/app-config/app-config.service";
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
  templateUrl: "./footer.component.html",
  styleUrls: ["./footer.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FooterComponent implements OnInit {
  version: string;
  year: number = new Date().getFullYear();

  routes = {
    contactUs: contactUsMenuItem,
    ethics: ethicsMenuItem,
    credits: creditsMenuItem,
    disclaimers: disclaimersMenuItem,
    statistics: statisticsMenuItem,
  };

  constructor(private env: AppConfigService) {}

  ngOnInit() {
    this.version = this.env.config.version;
  }
}

import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";
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
  templateUrl: "./footer.component.html",
  styleUrls: ["./footer.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FooterComponent implements OnInit {
  public version: string;
  public year: number = new Date().getFullYear();

  public routes = {
    contactUs: contactUsMenuItem,
    ethics: ethicsMenuItem,
    credits: creditsMenuItem,
    disclaimers: disclaimersMenuItem,
    statistics: statisticsMenuItem,
  };

  public constructor(private config: ConfigService) {}

  public ngOnInit() {
    this.version = this.config.config.version;
  }
}

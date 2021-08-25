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
  public year = new Date().getFullYear();
  public links = [
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

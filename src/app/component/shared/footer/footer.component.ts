import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";
import { version } from "package.json";
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

  routes = {
    contactUs: contactUsMenuItem,
    ethics: ethicsMenuItem,
    credits: creditsMenuItem,
    disclaimers: disclaimersMenuItem,
    statistics: statisticsMenuItem
  };

  constructor() {}

  ngOnInit() {}
}

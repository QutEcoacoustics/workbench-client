import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";
import { version } from "package.json";
import { contactUsMenuItem } from "../../about/about.menus";

@Component({
  selector: "app-footer",
  templateUrl: "./footer.component.html",
  styleUrls: ["./footer.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FooterComponent implements OnInit {
  public version: string = version;
  routes = {
    contactUs: contactUsMenuItem
  };

  constructor() {}

  ngOnInit() {}
}

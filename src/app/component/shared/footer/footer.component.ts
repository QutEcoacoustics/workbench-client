import { Component, OnInit, ChangeDetectionStrategy } from "@angular/core";
import { version } from "package.json";

@Component({
  selector: "app-footer",
  templateUrl: "./footer.component.html",
  styleUrls: ["./footer.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FooterComponent implements OnInit {
  public version: string = version;

  constructor() {}

  ngOnInit() {}
}

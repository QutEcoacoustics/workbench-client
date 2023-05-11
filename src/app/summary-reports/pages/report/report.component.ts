import { Component } from "@angular/core";
import { PageComponent } from "@helpers/page/pageComponent";

@Component({
  selector: "baw-summary-report",
  templateUrl: "./report.component.html",
  styleUrls: ["./report.component.css"]
})
class SummaryReportComponent extends PageComponent {
  public constructor() {
    super();
  }
}

export { SummaryReportComponent }

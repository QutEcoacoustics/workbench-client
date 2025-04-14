import { Component } from "@angular/core";
import { reportProblemMenuItem } from "@components/report-problem/report-problem.menus";
import { StrongRouteDirective } from "../../../../directives/strongRoute/strong-route.directive";

@Component({
  selector: "baw-harvest-error",
  template: `
    <h3>Uploading Error</h3>

    <p>
      An unknown error occurred during the uploading process. Please go to the
      <a [strongRoute]="reportProblem.route">{{ reportProblem.label }}</a> page
      and report the issue so it can be resolved.
    </p>
  `,
  imports: [StrongRouteDirective],
})
export class ErrorComponent {
  public reportProblem = reportProblemMenuItem;
}

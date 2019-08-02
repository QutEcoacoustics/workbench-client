import { Component } from "@angular/core";
import { Router, NavigationEnd, ActivatedRoute } from "@angular/router";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"]
})
export class AppComponent {
  menuLayout: boolean;

  constructor(private router: Router, private route: ActivatedRoute) {
    this.menuLayout = true;

    // TODO Check this logic
    this.router.events.subscribe(val => {
      if (val instanceof NavigationEnd) {
        // Find the primary router component
        console.log(this.route);

        let displayComponent = this.route.snapshot.firstChild;
        let search = true;
        let count = 0;
        while (search && count < 50) {
          if (
            displayComponent.component !== undefined &&
            displayComponent.component !== null
          ) {
            search = false;
          } else {
            displayComponent = displayComponent.firstChild;
          }

          count++;
        }

        this.menuLayout = !!(displayComponent.component as any).pageInfo;
      }
    });
  }
}

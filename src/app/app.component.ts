import { Component } from "@angular/core";
import { Router, NavigationEnd, ActivatedRoute } from "@angular/router";
import { UpdateUriForPages } from "./interfaces/Page";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"]
})
export class AppComponent {
  menuLayout: boolean;

  constructor(private router: Router, private route: ActivatedRoute) {
    this.menuLayout = true;

    UpdateUriForPages(this.router);

    this.router.events.subscribe(val => {
      if (val instanceof NavigationEnd) {
        // Find the primary router component
        let displayComponent = this.route.snapshot.firstChild;
        let search = true;
        let count = 0;
        while (search && count < 50) {
          if (!!displayComponent.component) {
            search = false;
          } else {
            displayComponent = displayComponent.firstChild;
          }

          count++;
        }

        console.log("Current component: ", displayComponent.component);
        this.menuLayout = !!(displayComponent.component as any).pageInfo;
      }
    });
  }
}

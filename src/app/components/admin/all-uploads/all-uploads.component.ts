import { Component } from "@angular/core";
import { List } from "immutable";
import { ListComponent } from "@components/harvest/pages/list/list.component";
import { adminCategory, adminUploadsMenuItem } from "../admin.menus";
import { adminMenuItemActions } from "../dashboard/dashboard.component";

@Component({
  selector: "baw-all-uploads",
  templateUrl: "../../harvest/pages/list/list.component.html",
  standalone: false,
})
class AllUploadsComponent extends ListComponent {
  public override get project() {
    return null;
  }
}

AllUploadsComponent.linkToRoute({
  category: adminCategory,
  pageRoute: adminUploadsMenuItem,
  menus: { actions: List(adminMenuItemActions) },
});

export { AllUploadsComponent };

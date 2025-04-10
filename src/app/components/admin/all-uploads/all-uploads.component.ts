import { Component } from "@angular/core";
import { List } from "immutable";
import { ListComponent } from "@components/harvest/pages/list/list.component";
import { adminCategory, adminUploadsMenuItem } from "../admin.menus";
import { adminMenuItemActions } from "../dashboard/dashboard.component";
import { NgIf } from "@angular/common";
import { StrongRouteDirective } from "../../../directives/strongRoute/strong-route.directive";
import { NgxDatatableModule } from "@swimlane/ngx-datatable";
import { DatatableDefaultsDirective } from "../../../directives/datatable/defaults/defaults.directive";
import { DatatablePaginationDirective } from "../../../directives/datatable/pagination/pagination.directive";
import { DatetimeComponent } from "../../shared/datetime-formats/datetime/datetime/datetime.component";
import { UserLinkComponent } from "../../shared/user-link/user-link/user-link.component";
import { LoadingComponent } from "../../shared/loading/loading.component";
import { UrlDirective } from "../../../directives/url/url.directive";
import { ConfirmationComponent } from "../../harvest/components/modal/confirmation.component";
import { IsUnresolvedPipe } from "../../../pipes/is-unresolved/is-unresolved.pipe";

@Component({
    selector: "baw-all-uploads",
    templateUrl: "../../harvest/pages/list/list.component.html",
    imports: [NgIf, StrongRouteDirective, NgxDatatableModule, DatatableDefaultsDirective, DatatablePaginationDirective, DatetimeComponent, UserLinkComponent, LoadingComponent, UrlDirective, ConfirmationComponent, IsUnresolvedPipe]
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

import { NgModule } from "@angular/core";
import { RouterTestingModule } from "@angular/router/testing";
import { MockDirectives } from "ng-mocks";
import { BawDatatableModule } from "./datatable/datatable.module";
import { AuthenticatedImageDirective } from "./image/image.directive";
import { StrongRouteActiveDirective } from "./strongRoute/strong-route-active.directive";
import { StrongRouteDirective } from "./strongRoute/strong-route.directive";
import { UrlActiveDirective } from "./url/url-active.directive";
import { UrlDirective } from "./url/url.directive";
import { RequireLoggedInDirective } from "./logged-in/logged-in.directive";

const directives = [
  AuthenticatedImageDirective,
  ...MockDirectives(
    StrongRouteDirective,
    StrongRouteActiveDirective,
    UrlDirective,
    UrlActiveDirective,
    RequireLoggedInDirective,
  ),
];

/**
 * App Shared Directives
 */
@NgModule({
  declarations: directives,
  imports: [RouterTestingModule],
  exports: [...directives, BawDatatableModule],
})
export class MockDirectivesModule {}

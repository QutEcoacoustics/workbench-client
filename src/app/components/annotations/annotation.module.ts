import { getRouteConfigForPage } from "@helpers/page/pageRouting";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { StrongRoute } from "@interfaces/strongRoute";
import { verificationRoute } from "./annotation.routes";
import { VerificationComponent } from "./pages/verification/verification.component";
import { AnnotationSearchComponent } from "./pages/search/search.component";

const pages = [VerificationComponent, AnnotationSearchComponent];
const routes = Object.values(verificationRoute)
  .map((route: StrongRoute) => route.compileRoutes(getRouteConfigForPage))
  .flat();

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    ...pages,
  ],
  exports: [RouterModule, ...pages],
})
export class AnnotationModule {}

import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

const routes: Routes = [
  {
    path: "research",
    children: [
      { path: "about", redirectTo: "https://research.ecosounds.org/" },
      {
        path: "articles",
        redirectTo: "https://research.ecosounds.org/articles.html",
      },
      {
        path: "resources",
        redirectTo: "https://research.ecosounds.org/resources.html",
      },
      {
        path: "people",
        redirectTo: "https://research.ecosounds.org/people/people.html",
      },
      {
        path: "publications",
        redirectTo:
          "https://research.ecosounds.org/publications/publications.html",
      },
    ],
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      initialNavigation: "enabled",
      scrollPositionRestoration: "enabled",
      // Reload the page if navigating to the same route, this is required for
      // auth changes to reload resolvers
      onSameUrlNavigation: "reload",
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}

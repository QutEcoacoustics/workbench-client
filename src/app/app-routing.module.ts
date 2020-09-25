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
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}

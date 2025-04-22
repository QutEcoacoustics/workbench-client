import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

const routes = [
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
] as const satisfies Routes;

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      /*
       * Initial navigation triggers resolvers before APP_INITIALIZER which
       * means that the config has not been loaded. Disabling this fixes the
       * problem. https://github.com/angular/angular/issues/14588
       */
      initialNavigation: "disabled",
      scrollPositionRestoration: "enabled",
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './component/home/home.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', component: HomeComponent },
  { path: 'home', pathMatch: 'full', redirectTo: '' },
  {
    path: 'research',
    children: [
      { path: 'about', redirectTo: 'https://research.ecosounds.org/' },
      {
        path: 'articles',
        redirectTo: 'https://research.ecosounds.org/articles.html'
      },
      {
        path: 'resources',
        redirectTo: 'https://research.ecosounds.org/resources.html'
      },
      {
        path: 'people',
        redirectTo: 'https://research.ecosounds.org/people/people.html'
      },
      {
        path: 'publications',
        redirectTo:
          'https://research.ecosounds.org/publications/publications.html'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}

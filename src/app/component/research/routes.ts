import { Routes } from '@angular/router';

import { ResearchAboutComponent } from './pages/about/about.component';
import { ResearchArticlesComponent } from './pages/articles/articles.component';
import { ResearchPeopleComponent } from './pages/people/people.component';
import { ResearchPublicationsComponent } from './pages/publications/publications.component';
import { ResearchResourcesComponent } from './pages/resources/resources.component';

export const researchRoutes: Routes = [
  { path: 'about', component: ResearchAboutComponent },
  { path: 'articles', component: ResearchArticlesComponent },
  { path: 'people', component: ResearchPeopleComponent },
  { path: 'publications', component: ResearchPublicationsComponent },
  { path: 'resources', component: ResearchResourcesComponent }
];

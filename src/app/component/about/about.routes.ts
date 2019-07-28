import { Route } from '@angular/router';

import { AboutContactComponent } from './pages/contact/contact.component';
import { AboutCreditsComponent } from './pages/credits/credits.component';
import { AboutDisclaimersComponent } from './pages/disclaimers/disclaimers.component';
import { AboutEthicsComponent } from './pages/ethics/ethics.component';
import { AboutReportComponent } from './pages/report/report.component';

export const aboutRoutes: Route = {
  path: 'about',
  children: [
    { path: 'contact', component: AboutContactComponent },
    { path: 'credits', component: AboutCreditsComponent },
    { path: 'disclaimers', component: AboutDisclaimersComponent },
    { path: 'ethics', component: AboutEthicsComponent },
    { path: 'report', component: AboutReportComponent }
  ]
};

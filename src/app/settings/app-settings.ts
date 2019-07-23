import { HomeComponent } from '../component/home/home.component';
import { ProjectsComponent } from '../component/projects/pages/home/home.component';
import { ListenComponent } from '../component/listen/pages/home/home.component';
import { AnalysisSubmitComponent } from '../component/analysis/pages/submit/submit.component';
import { AnalysisRequestComponent } from '../component/analysis/pages/request/request.component';
import { AboutReportComponent } from '../component/about/pages/report/report.component';
import { AboutContactComponent } from '../component/about/pages/contact/contact.component';
import { AboutDisclaimersComponent } from '../component/about/pages/disclaimers/disclaimers.component';
import { AboutEthicsComponent } from '../component/about/pages/ethics/ethics.component';
import { LibraryComponent } from '../component/library/pages/library/home.component';
import { ResearchAboutComponent } from '../component/research/pages/about/about.component';
import { ResearchArticlesComponent } from '../component/research/pages/articles/articles.component';
import { ResearchResourcesComponent } from '../component/research/pages/resources/resources.component';
import { ResearchPeopleComponent } from '../component/research/pages/people/people.component';
import { ResearchPublicationsComponent } from '../component/research/pages/publications/publications.component';
import { AnalysisAudioComponent } from '../component/analysis/pages/audio/audio.component';
import { AnalysisStatisticsComponent } from '../component/analysis/pages/statistics/statistics.component';
import { AboutCreditsComponent } from '../component/about/pages/credits/credits.component';
import { Type } from '@angular/core';

export const settings: RouteSettings = {
  path: '',
  authenticated: false,
  component: HomeComponent,
  dropdown: false,
  nav: 'Ecosounds',
  title: 'Ecosounds',
  production: true,
  routes: [
    {
      path: 'projects',
      authenticated: false,
      component: ProjectsComponent,
      dropdown: false,
      nav: 'Projects',
      title: 'Projects',
      production: true
    },
    {
      path: 'listen',
      authenticated: true,
      component: ListenComponent,
      dropdown: false,
      nav: 'Listen',
      title: 'Listen',
      production: true
    },
    {
      path: 'library',
      authenticated: true,
      component: LibraryComponent,
      dropdown: false,
      nav: 'Library',
      title: 'Library',
      production: false
    },
    {
      path: 'research',
      dropdown: true,
      nav: 'Research',
      title: 'Research',
      production: false,
      routes: [
        {
          path: 'about',
          authenticated: false,
          component: ResearchAboutComponent,
          dropdown: false,
          nav: 'About',
          title: 'About',
          production: false
        },
        {
          path: 'articles',
          authenticated: false,
          component: ResearchArticlesComponent,
          dropdown: false,
          nav: 'Articles',
          title: 'Articles',
          production: false
        },
        {
          path: 'resources',
          authenticated: false,
          component: ResearchResourcesComponent,
          dropdown: false,
          nav: 'Resources',
          title: 'Resources',
          production: false
        },
        {
          path: 'people',
          authenticated: false,
          component: ResearchPeopleComponent,
          dropdown: false,
          nav: 'People',
          title: 'People',
          production: false
        },
        {
          path: 'publications',
          authenticated: false,
          component: ResearchPublicationsComponent,
          dropdown: false,
          nav: 'Publications',
          title: 'Publications',
          production: false
        }
      ]
    },
    {
      path: 'analysis',
      dropdown: true,
      nav: 'Analysis',
      title: 'Analysis',
      production: true,
      routes: [
        {
          path: 'submit',
          authenticated: false,
          component: AnalysisSubmitComponent,
          dropdown: false,
          nav: 'Submit Audio',
          title: 'Submit Audio',
          production: true
        },
        {
          path: 'request',
          authenticated: false,
          component: AnalysisRequestComponent,
          dropdown: false,
          nav: 'Data Request',
          title: 'Data Request',
          production: true
        },
        {
          path: 'audio',
          authenticated: true,
          component: AnalysisAudioComponent,
          dropdown: false,
          nav: 'Audio Analysis',
          title: 'Audio Analysis',
          production: false
        },
        {
          path: 'statistics',
          authenticated: false,
          component: AnalysisStatisticsComponent,
          dropdown: false,
          nav: 'Website Statistics',
          title: 'Website Statistics',
          production: false
        }
      ]
    },
    {
      path: 'about',
      dropdown: true,
      nav: 'About',
      title: 'About',
      production: true,
      routes: [
        {
          path: 'report',
          authenticated: false,
          component: AboutReportComponent,
          dropdown: false,
          nav: 'Report Problem',
          title: 'Report Problem',
          production: true
        },
        {
          path: 'contact',
          authenticated: false,
          component: AboutContactComponent,
          dropdown: false,
          nav: 'Contact',
          title: 'Contact',
          production: true
        },
        {
          path: 'credits',
          authenticated: false,
          component: AboutCreditsComponent,
          dropdown: false,
          nav: 'Credits',
          title: 'Credits',
          production: true
        },
        {
          path: 'disclaimers',
          authenticated: false,
          component: AboutDisclaimersComponent,
          dropdown: false,
          nav: 'Disclaimers',
          title: 'Disclaimers',
          production: true
        },
        {
          path: 'ethics',
          authenticated: false,
          component: AboutEthicsComponent,
          dropdown: false,
          nav: 'Ethics',
          title: 'Ethics',
          production: true
        }
      ]
    }
  ]
};

export interface RouteSettings {
  path: string;
  authenticated?: boolean;
  component?: Type<any>;
  dropdown: boolean;
  nav: string;
  title: string;
  production: boolean;
  routes?: RouteSettings[];
}

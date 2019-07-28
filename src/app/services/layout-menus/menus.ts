import { LayoutMenusInterface, Route, Href } from './layout-menus.interface';
import { HomeComponent } from 'src/app/component/home/home.component';
import { AboutReportComponent } from 'src/app/component/about/pages/report/report.component';
import { AudioAnalysisComponent } from 'src/app/component/audio-analysis/audio-analysis.component';
import { AuthenticationLoginComponent } from 'src/app/component/authentication/pages/login/login.component';
import { AuthenticationRegisterComponent } from 'src/app/component/authentication/pages/register/register.component';
import { DataRequestComponent } from 'src/app/component/data-request/data-request.component';
import { LibraryComponent } from 'src/app/component/library/pages/home/home.component';
import { ProfileComponent } from 'src/app/component/profile/pages/home/home.component';
import { SendAudioComponent } from 'src/app/component/send-audio/send-audio.component';
import { WebStatisticsComponent } from 'src/app/component/web-statistics/web-statistics.component';

/**
 * Default secondary and action menu links
 */
export const menus: LayoutMenusInterface = {
  secondary: {
    links: [
      HomeComponent.prototype.getSecondaryItem(),
      AuthenticationLoginComponent.prototype.getSecondaryItem(),
      AuthenticationRegisterComponent.prototype.getSecondaryItem(),
      ProfileComponent.prototype.getSecondaryItem(),
      {
        uri: new Href(
          'https://www.ecosounds.org/user_accounts/741/audio_events'
        ),
        icon: ['fas', 'list'],
        label: 'My Annotations',
        tooltip: 'View my recent annotations',
        predicate: loggedin => loggedin
      },
      ProfileComponent.prototype.getSecondaryItem(),
      AudioAnalysisComponent.prototype.getSecondaryItem(),
      LibraryComponent.prototype.getSecondaryItem(),
      DataRequestComponent.prototype.getSecondaryItem(),
      SendAudioComponent.prototype.getSecondaryItem(),
      AboutReportComponent.prototype.getSecondaryItem(),
      WebStatisticsComponent.prototype.getSecondaryItem()
    ]
  },
  action: {
    list_title: HomeComponent.prototype.getActionListTitle(),
    links: []
  }
};

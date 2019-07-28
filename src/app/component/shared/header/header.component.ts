import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { BawApiService } from 'src/app/services/baw-api/baw-api.service';
import { AboutContactComponent } from '../../about/pages/contact/contact.component';
import { AboutCreditsComponent } from '../../about/pages/credits/credits.component';
import { AboutDisclaimersComponent } from '../../about/pages/disclaimers/disclaimers.component';
import { AboutEthicsComponent } from '../../about/pages/ethics/ethics.component';
import { AboutReportComponent } from '../../about/pages/report/report.component';
import { HeaderItemInterface } from './header.interface';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  activeLink: string;
  collapsed: boolean;
  loggedIn: boolean;
  user_name: string;
  research: any;
  about: {
    contact: HeaderItemInterface;
    credits: HeaderItemInterface;
    disclaimers: HeaderItemInterface;
    ethics: HeaderItemInterface;
    report: HeaderItemInterface;
  };

  constructor(private router: Router, private api: BawApiService) {}

  ngOnInit() {
    this.collapsed = true;
    this.activeLink = 'projects';
    this.loggedIn = false;

    this.router.events.subscribe(val => {
      if (val instanceof NavigationEnd) {
        this.updateActiveLink(val.url);
        this.checkAuthenticated();
        this.toggleCollapse(true);
      }
    });

    this.research = {
      about: ['fas', 'users'],
      articles: ['fas', 'newspaper'],
      resources: ['fas', 'briefcase'],
      people: ['fas', 'user-circle'],
      publications: ['fas', 'globe-asia']
    };

    this.about = {
      contact: AboutContactComponent.prototype.getHeaderItem(),
      credits: AboutCreditsComponent.prototype.getHeaderItem(),
      disclaimers: AboutDisclaimersComponent.prototype.getHeaderItem(),
      ethics: AboutEthicsComponent.prototype.getHeaderItem(),
      report: AboutReportComponent.prototype.getHeaderItem()
    };
  }

  /**
   * Check if navbar link is active
   * @param link Navbar link
   * @returns True if navbar is active
   */
  isActive(link: string): boolean {
    return this.activeLink.toLowerCase() === link.toLowerCase();
  }

  /**
   * Update the active link variable using the router url
   * @param url Router url
   */
  updateActiveLink(url: string) {
    this.activeLink = url.split('/')[1];
  }

  /**
   * Check if user is authenticated
   */
  checkAuthenticated() {
    this.loggedIn = this.api.loggedIn;
    if (this.loggedIn) {
      this.user_name = this.api.user_name;
    }
  }

  /**
   * Toggle the collapse of the navbar
   * @param setState Set the state of the navbar
   */
  toggleCollapse(setState?: boolean) {
    if (setState) {
      this.collapsed = setState;
    } else {
      this.collapsed = !this.collapsed;
    }
  }

  /**
   * Toggle the collapse of a dropdown element
   * @param el Dropdown element
   */
  toggleDropdown(el: HTMLAnchorElement) {
    el.classList.toggle('show');
  }

  /**
   * Logout user
   */
  logout() {
    this.api.logout();
    this.checkAuthenticated();
  }
}

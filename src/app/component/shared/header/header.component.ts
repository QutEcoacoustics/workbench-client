import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { BawApiService } from 'src/app/services/baw-api/baw-api.service';
import { ResearchAboutIcon } from '../../research/pages/about/about.component.menu';
import { ResearchArticlesIcon } from '../../research/pages/articles/articles.component.menu';
import { ResearchResourcesIcon } from '../../research/pages/resources/resources.component.menu';
import { ResearchPeopleIcon } from '../../research/pages/people/people.component.menu';
import { ResearchPublicationsIcon } from '../../research/pages/publications/publications.component.menu';
import { AboutContactIcon } from '../../about/pages/contact/contact.component.menus';
import { AboutCreditsIcon } from '../../about/pages/credits/credits.component.menus';
import { AboutDisclaimersIcon } from '../../about/pages/disclaimers/disclaimers.component.menus';
import { AboutEthicsIcon } from '../../about/pages/ethics/ethics.component.menus';
import { AboutReportIcon } from '../../about/pages/report/report.component.menus';

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
  about: any;

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
      about: ResearchAboutIcon,
      articles: ResearchArticlesIcon,
      resources: ResearchResourcesIcon,
      people: ResearchPeopleIcon,
      publications: ResearchPublicationsIcon
    };

    this.about = {
      contact: AboutContactIcon,
      credits: AboutCreditsIcon,
      disclaimers: AboutDisclaimersIcon,
      ethics: AboutEthicsIcon,
      report: AboutReportIcon
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

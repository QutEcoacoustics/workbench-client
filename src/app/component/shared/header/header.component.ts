import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { BawApiService } from 'src/app/services/baw-api.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  activeLink: string;
  collapsed: boolean;
  loggedIn: boolean;

  constructor(private router: Router, private api: BawApiService) {}

  ngOnInit() {
    this.collapsed = true;
    this.activeLink = 'projects';
    this.loggedIn = false;

    this.router.events.subscribe(val => {
      if (val instanceof NavigationEnd) {
        this.updateActiveLink(val.url);
        this.checkAuthenticated();
      }
    });
  }

  isActive(link: string) {
    return this.activeLink.toLowerCase() === link.toLowerCase();
  }

  updateActiveLink(url: string) {
    this.activeLink = url.split('/')[1];
  }

  checkAuthenticated() {
    console.debug('Checking authentication');
    this.loggedIn = this.api.loggedIn;
  }

  toggleCollapse() {
    this.collapsed = !this.collapsed;
  }

  toggleDropdown(el: HTMLAnchorElement) {
    el.classList.toggle('show');
  }
}

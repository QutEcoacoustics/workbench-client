import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  activeLink: string;
  collapsed: boolean;

  constructor(private router: Router) {}

  ngOnInit() {
    this.collapsed = true;
    this.activeLink = 'projects';

    this.router.events.subscribe(val => {
      if (val instanceof NavigationEnd) {
        this.updateActiveLink(val.url);
      }
    });
  }

  isActive(link: string) {
    return this.activeLink.toLowerCase() === link.toLowerCase();
  }

  updateActiveLink(url: string) {
    this.activeLink = url.split('/')[1];
  }

  toggleCollapse() {
    this.collapsed = !this.collapsed;
  }

  toggleDropdown(el: HTMLAnchorElement) {
    el.classList.toggle('show');
  }
}

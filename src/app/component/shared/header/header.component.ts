import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  href: string;
  activeLink: string;
  collapsed: boolean;

  constructor(private router: Router) {}

  ngOnInit() {
    this.collapsed = true;
    this.href = this.router.url;
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

  // TODO Update this to determine the URL more accurately for subpages (eg. /projects/Cooloola)
  updateActiveLink(url: string) {
    this.href = url;

    this.activeLink = url;
  }

  toggleCollapse() {
    this.collapsed = !this.collapsed;
  }

  toggleDropdown(el: HTMLAnchorElement) {
    el.classList.toggle('show');
  }
}

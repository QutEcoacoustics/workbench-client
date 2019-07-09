import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss']
})
export class NavBarComponent implements OnInit {
  collapsed: boolean;

  constructor() {}

  ngOnInit() {
    this.collapsed = true;
  }

  toggleNavBar() {
    this.collapsed = !this.collapsed;
  }

  toggleDropdown(el: HTMLAnchorElement) {
    el.classList.toggle('show');
  }
}

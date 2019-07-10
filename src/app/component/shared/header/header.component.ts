import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
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

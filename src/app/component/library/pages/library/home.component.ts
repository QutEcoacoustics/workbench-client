import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-library',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class LibraryComponent implements OnInit {
  constructor() {}

  ngOnInit() {
    document.location.href = 'https://www.ecosounds.org/library';
  }
}

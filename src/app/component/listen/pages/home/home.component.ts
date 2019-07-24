import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-listen',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class ListenComponent implements OnInit {
  constructor() {}

  ngOnInit() {
    document.location.href = 'https://www.ecosounds.org/listen';
  }
}

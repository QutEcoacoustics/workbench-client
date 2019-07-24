import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-web-statistics',
  templateUrl: './web-statistics.component.html',
  styleUrls: ['./web-statistics.component.scss']
})
export class WebStatisticsComponent implements OnInit {
  constructor() {}

  ngOnInit() {
    window.location.href = 'https://www.ecosounds.org/website_status';
  }
}

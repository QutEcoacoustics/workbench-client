import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-research-resources',
  templateUrl: './resources.component.html',
  styleUrls: ['./resources.component.scss']
})
export class ResearchResourcesComponent implements OnInit {
  constructor() {}

  ngOnInit() {
    document.location.href = 'https://research.ecosounds.org/resources.html';
  }
}

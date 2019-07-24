import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-research-publications',
  templateUrl: './publications.component.html',
  styleUrls: ['./publications.component.scss']
})
export class ResearchPublicationsComponent implements OnInit {
  constructor() {}

  ngOnInit() {
    document.location.href =
      'https://research.ecosounds.org/publications/publications.html';
  }
}

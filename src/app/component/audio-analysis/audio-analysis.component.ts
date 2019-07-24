import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-audio-analysis',
  templateUrl: './audio-analysis.component.html',
  styleUrls: ['./audio-analysis.component.scss']
})
export class AudioAnalysisComponent implements OnInit {
  constructor() {}

  ngOnInit() {
    document.location.href = 'https://staging.ecosounds.org/audio_analysis';
  }
}

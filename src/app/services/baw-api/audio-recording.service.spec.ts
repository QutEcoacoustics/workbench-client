import { TestBed } from '@angular/core/testing';

import { AudioRecordingService } from './audio-recording.service';

describe('AudioRecordingService', () => {
  let service: AudioRecordingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AudioRecordingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

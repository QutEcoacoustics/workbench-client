import { TestBed } from '@angular/core/testing';

import { AudioRecordingsService } from './audio-recordings.service';

describe('AudioRecordingsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AudioRecordingsService = TestBed.get(AudioRecordingsService);
    expect(service).toBeTruthy();
  });
});

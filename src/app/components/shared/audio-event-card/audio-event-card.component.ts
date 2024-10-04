import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from "@angular/core";
import { Verification } from "@models/Verification";
import { MediaControlsComponent } from "@ecoacoustics/web-components/@types/components/media-controls/media-controls";

@Component({
  selector: "baw-audio-event-card",
  templateUrl: "audio-event-card.component.html",
  styleUrl: "audio-event-card.component.scss",
})
export class AudioEventCardComponent implements OnInit, AfterViewInit {
  @Input({ required: true }) public audioEvent: Verification;
  protected spectrogramId: string;

  @ViewChild("mediaControls")
  private mediaControls: ElementRef<MediaControlsComponent>;

  public ngOnInit(): void {
    this.spectrogramId = `spectrogram-${this.audioEvent.id}`;
  }

  public ngAfterViewInit(): void {
    this.mediaControls.nativeElement.for = this.spectrogramId;
  }
}

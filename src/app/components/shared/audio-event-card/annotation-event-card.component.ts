import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from "@angular/core";
import { MediaControlsComponent } from "@ecoacoustics/web-components/@types/components/media-controls/media-controls";
import { Annotation } from "@models/data/Annotation";

@Component({
  selector: "baw-annotation-event-card",
  templateUrl: "annotation-event-card.component.html",
  styleUrl: "annotation-event-card.component.scss",
})
export class AnnotationEventCardComponent implements OnInit, AfterViewInit {
  @Input({ required: true })
  public annotation: Annotation;

  protected spectrogramId: string;

  @ViewChild("mediaControls")
  private mediaControls: ElementRef<MediaControlsComponent>;

  public ngOnInit(): void {
    this.spectrogramId = `spectrogram-${this.annotation.id}`;
  }

  public ngAfterViewInit(): void {
    this.mediaControls.nativeElement.for = this.spectrogramId;
  }
}

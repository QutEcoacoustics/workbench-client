import {
  AfterViewInit,
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  ElementRef,
  input,
  OnInit,
  ViewChild,
} from "@angular/core";
import { MediaControlsComponent } from "@ecoacoustics/web-components/@types/components/media-controls/media-controls";
import { Annotation } from "@models/data/Annotation";
import { FaIconComponent } from "@fortawesome/angular-fontawesome";
import { ZonedDateTimeComponent } from "../datetime-formats/datetime/zoned-datetime/zoned-datetime.component";
import { IsUnresolvedPipe } from "../../../pipes/is-unresolved/is-unresolved.pipe";

@Component({
  selector: "baw-annotation-event-card",
  templateUrl: "./annotation-event-card.component.html",
  styleUrl: "./annotation-event-card.component.scss",
  imports: [FaIconComponent, ZonedDateTimeComponent, IsUnresolvedPipe],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AnnotationEventCardComponent implements OnInit, AfterViewInit {
  public annotation = input.required<Annotation>();

  protected spectrogramId: string;

  @ViewChild("mediaControls", { static: true })
  private mediaControls: ElementRef<MediaControlsComponent>;

  public ngOnInit(): void {
    this.spectrogramId = `spectrogram-${this.annotation().id}`;
  }

  public ngAfterViewInit(): void {
    this.mediaControls.nativeElement.for = this.spectrogramId;
  }
}

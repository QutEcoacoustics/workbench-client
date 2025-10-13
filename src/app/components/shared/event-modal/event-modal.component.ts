import { AsyncPipe } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  Input,
} from "@angular/core";
import { ModalComponent } from "@menu/widget.component";
import { AudioEvent } from "@models/AudioEvent";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { AnnotationService } from "@services/models/annotations/annotation.service";
import { AnnotationEventCardComponent } from "@shared/audio-event-card/annotation-event-card.component";

@Component({
  selector: "baw-event-modal",
  templateUrl: "./event-modal.component.html",
  styleUrl: "./event-modal.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AnnotationEventCardComponent, AsyncPipe],
})
export class EventModalComponent implements ModalComponent {
  private readonly annotationService = inject(AnnotationService);

  @Input() public modal: NgbActiveModal;
  @Input() public event: AudioEvent;

  protected readonly annotation = computed(() => {
    return this.annotationService.show(this.event, []);
  });

  public closeModal() {
    this.modal.close();
  }
}

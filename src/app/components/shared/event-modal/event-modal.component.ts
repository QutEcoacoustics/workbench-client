import { AsyncPipe } from "@angular/common";
import {
  Component,
  computed,
  inject,
  Input,
} from "@angular/core";
import { UrlDirective } from "@directives/url/url.directive";
import { ModalComponent } from "@menu/widget.component";
import { AudioEvent } from "@models/AudioEvent";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { AnnotationService } from "@services/models/annotations/annotation.service";
import { AnnotationEventCardComponent } from "@shared/audio-event-card/annotation-event-card.component";

@Component({
  selector: "baw-event-modal",
  templateUrl: "./event-modal.component.html",
  styleUrl: "./event-modal.component.scss",
  imports: [AnnotationEventCardComponent, AsyncPipe, UrlDirective],
})
export class EventModalComponent implements ModalComponent {
  private readonly annotationService = inject(AnnotationService);

  // TODO: Migrate these to input signals once the ModalComponent interface
  // supports signals.
  @Input() public modal: NgbActiveModal;
  @Input() public event: AudioEvent;

  protected readonly annotation = computed(() => {
    return this.annotationService.show(this.event, []);
  });

  public closeModal() {
    this.modal.close();
  }
}

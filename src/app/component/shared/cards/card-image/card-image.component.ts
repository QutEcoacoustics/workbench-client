import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from "@angular/core";
import { Card } from "../cards.component";

/**
 * Card Image Component
 */
@Component({
  selector: "baw-card-image",
  templateUrl: "./card-image.component.html",
  styleUrls: ["./card-image.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardImageComponent implements OnInit {
  @Input() card: Card;

  constructor() {}

  ngOnInit() {}
}

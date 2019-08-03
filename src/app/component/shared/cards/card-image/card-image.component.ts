import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input
} from "@angular/core";

@Component({
  selector: "app-card-image",
  templateUrl: "./card-image.component.html",
  styleUrls: ["./card-image.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CardImageComponent implements OnInit {
  @Input() title: string;
  @Input() image: { url: string; alt: string };
  @Input() link?: string;
  @Input() description?: string;

  constructor() {}

  ngOnInit() {
    this.checkRequiredFields("title", this.title);
    this.checkRequiredFields("image", this.image);
  }

  /**
   * Check input field is provided
   * @param name Input variable name
   * @param input Input variable
   */
  checkRequiredFields(name: string, input: any) {
    if (input === null || input === undefined) {
      throw new Error("Attribute " + name + " is required");
    }
  }
}

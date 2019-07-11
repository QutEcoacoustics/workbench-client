import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input
} from '@angular/core';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CardComponent implements OnInit {
  @Input() title: string;
  @Input() description?: string;
  @Input() link?: string;

  constructor() {}

  ngOnInit() {
    this.checkRequiredFields('title', this.title);
  }

  checkRequiredFields(name: string, input: any) {
    if (input === null || input === undefined) {
      throw new Error('Attribute ' + name + ' is required');
    }
  }
}

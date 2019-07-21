import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input
} from '@angular/core';
import { List } from 'immutable';

@Component({
  selector: 'app-profile-tags',
  templateUrl: './tags.component.html',
  styleUrls: ['./tags.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProfileTagsComponent implements OnInit {
  @Input() tags: List<{ tag: string; link: string; value: number }>;

  constructor() {}

  ngOnInit() {}
}

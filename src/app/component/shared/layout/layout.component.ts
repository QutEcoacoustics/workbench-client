import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input
} from '@angular/core';
import { Link, ActionTitle } from 'src/app/services/layout-menus/menus';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LayoutComponent implements OnInit {
  @Input() secondaryLinks: Link[];
  @Input() actionLinks: Link[];
  @Input() actionTitle: ActionTitle;

  constructor() {}

  ngOnInit() {}
}

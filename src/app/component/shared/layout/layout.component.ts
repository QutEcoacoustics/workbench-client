import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input
} from '@angular/core';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LayoutComponent implements OnInit {
  @Input() secondaryLinks: {
    route: string;
    icon: [string, string];
    label: string;
    tooltip: string;
  }[];
  @Input() actionTitle: {
    icon: [string, string];
    label: string;
  };
  @Input() actionLinks: {
    route: string;
    icon: [string, string];
    label: string;
  }[];

  constructor() {}

  ngOnInit() {}
}

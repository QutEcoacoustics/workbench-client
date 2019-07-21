import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input
} from '@angular/core';
import { List } from 'immutable';

@Component({
  selector: 'app-profile-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProfileStatisticsComponent implements OnInit {
  @Input() stats: List<{
    stat: string;
    value: number;
    icon: { style: string; name: string };
  }>;
  firstCol: {
    stat: string;
    value: number;
    icon: { style: string; name: string };
  }[];
  secondCol: {
    stat: string;
    value: number;
    icon: { style: string; name: string };
  }[];

  constructor() {}

  ngOnInit() {
    const temp = this.stats.toArray();
    const midpoint = Math.ceil(temp.length / 2);
    this.firstCol = temp.slice(0, midpoint);
    this.secondCol = temp.slice(midpoint, temp.length);
  }
}

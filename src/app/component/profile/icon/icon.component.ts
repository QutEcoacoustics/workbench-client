import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input
} from '@angular/core';

@Component({
  selector: 'app-profile-icon',
  templateUrl: './icon.component.html',
  styleUrls: ['./icon.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProfileIconComponent implements OnInit {
  @Input() icon: string;
  @Input() user_name: string;
  @Input() seen: Date;
  @Input() joined: Date;

  lastSeen: string;
  membershipDuration: string;

  constructor() {}

  ngOnInit() {}
}

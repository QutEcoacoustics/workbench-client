import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MockBawApiModule } from '@baw-api/baw-apiMock.module';
import { CMS } from '@baw-api/cms/cms.service';
import { createComponentFactory, Spectator } from '@ngneat/spectator';
import { SharedModule } from '@shared/shared.module';
import { assertCms } from '@test/helpers/api-common';
import { DisclaimersComponent } from './disclaimers.component';

describe('AboutDisclaimersComponent', () => {
  let spectator: Spectator<DisclaimersComponent>;
  const createComponent = createComponentFactory({
    component: DisclaimersComponent,
    imports: [SharedModule, HttpClientTestingModule, MockBawApiModule],
  });

  beforeEach(() => (spectator = createComponent({ detectChanges: false })));

  assertCms<DisclaimersComponent>(() => spectator, CMS.PRIVACY);
});

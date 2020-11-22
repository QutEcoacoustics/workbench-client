import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MockBawApiModule } from '@baw-api/baw-apiMock.module';
import { CMS } from '@baw-api/cms/cms.service';
import { createComponentFactory, Spectator } from '@ngneat/spectator';
import { SharedModule } from '@shared/shared.module';
import { assertCms } from '@test/helpers/api-common';
import { EthicsComponent } from './ethics.component';

describe('AboutEthicsComponent', () => {
  let spectator: Spectator<EthicsComponent>;
  const createComponent = createComponentFactory({
    component: EthicsComponent,
    imports: [SharedModule, HttpClientTestingModule, MockBawApiModule],
  });

  beforeEach(() => (spectator = createComponent({ detectChanges: false })));

  assertCms<EthicsComponent>(() => spectator, CMS.ETHICS);
});

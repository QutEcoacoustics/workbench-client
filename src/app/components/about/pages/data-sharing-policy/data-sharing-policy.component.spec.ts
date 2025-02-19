import { HttpClientTestingModule } from "@angular/common/http/testing";
import { MockBawApiModule } from "@baw-api/baw-apiMock.module";
import { CMS } from "@baw-api/cms/cms.service";
import { createComponentFactory, Spectator } from "@ngneat/spectator";
import { SharedModule } from "@shared/shared.module";
import { assertCms } from "@test/helpers/api-common";
import { DataSharingPolicyComponent } from "./data-sharing-policy.component";

describe("DataSharingPolicyComponent", () => {
  let spectator: Spectator<DataSharingPolicyComponent>;
  const createComponent = createComponentFactory({
    component: DataSharingPolicyComponent,
    imports: [SharedModule, HttpClientTestingModule, MockBawApiModule],
  });

  beforeEach(() => (spectator = createComponent({ detectChanges: false })));

  assertCms<DataSharingPolicyComponent>(() => spectator, CMS.dataSharingPolicy);
});

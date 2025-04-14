import { provideHttpClientTesting } from "@angular/common/http/testing";
import { MockBawApiModule } from "@baw-api/baw-apiMock.module";
import { CMS } from "@baw-api/cms/cms.service";
import { createComponentFactory, Spectator } from "@ngneat/spectator";
import { assertCms } from "@test/helpers/api-common";
import { provideHttpClient, withInterceptorsFromDi } from "@angular/common/http";
import { DataSharingPolicyComponent } from "./data-sharing-policy.component";

describe("DataSharingPolicyComponent", () => {
  let spectator: Spectator<DataSharingPolicyComponent>;
  const createComponent = createComponentFactory({
    component: DataSharingPolicyComponent,
    imports: [MockBawApiModule],
    providers: [
      provideHttpClient(withInterceptorsFromDi()),
      provideHttpClientTesting(),
    ],
  });

  beforeEach(() => (spectator = createComponent({ detectChanges: false })));

  assertCms<DataSharingPolicyComponent>(() => spectator, CMS.dataSharingPolicy);
});

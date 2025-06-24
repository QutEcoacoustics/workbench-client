import { createComponentFactory, Spectator } from "@ngneat/spectator";
import { provideMockBawApi } from "@baw-api/provide-baw-ApiMock";
import { SITE_SETTINGS } from "@baw-api/ServiceTokens";
import { of } from "rxjs";
import { AdminDashboardComponent } from "./dashboard.component";
import { InstanceSettingsComponent } from "./components/site-settings/instance-settings.component";

describe("AdminDashboardComponent", () => {
  let spec: Spectator<AdminDashboardComponent>;

  const createComponent = createComponentFactory({
    component: AdminDashboardComponent,
    providers:  [provideMockBawApi()],
  });

  beforeEach(() => {
    spec = createComponent({ detectChanges: false });

    const settingsApi = spec.inject(SITE_SETTINGS.token);
    settingsApi.show.and.returnValue(of())

    spec.detectChanges();
  });

  it("should create", () => {
    expect(spec.component).toBeInstanceOf(AdminDashboardComponent);
  });

  it("should have the instance settings on the dashboard", () => {
    expect(spec.query(InstanceSettingsComponent)).toExist();
  });
});

import { provideMockBawApi } from "@baw-api/provide-baw-ApiMock";
import { FaIconLibrary } from "@fortawesome/angular-fontawesome";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { createRoutingFactory, Spectator } from "@ngneat/spectator";
import { assertPageInfo } from "@test/helpers/pageRoute";
import { of } from "rxjs";
import { WebsiteStatusWarningComponent } from "@menu/website-status-warning/website-status-warning.component";
import { AudioRecordingsListComponent } from "./list.component";

describe("AudioRecordingsListComponent", () => {
  let spectator: Spectator<AudioRecordingsListComponent>;

  const createComponent = createRoutingFactory({
    component: AudioRecordingsListComponent,
    shallow: true,
    imports: [WebsiteStatusWarningComponent],
    providers: [provideMockBawApi()],
  });

  function setup(): void {
    spectator = createComponent({ detectChanges: false });
    spectator.inject(FaIconLibrary).addIconPacks(fas);
  }

  beforeEach(() => setup());

  assertPageInfo(AudioRecordingsListComponent, "Audio Recordings");

  it("should create", () => {
    expect(spectator.component).toBeInstanceOf(AudioRecordingsListComponent);
  });

  it("should wrap the datatable in a horizontal scroll container", () => {
    spyOn<any>(spectator.component, "apiAction").and.returnValue(of([]));
    spectator.detectChanges();

    const wrapper = spectator.query(".audio-recordings-table-scroll");
    expect(wrapper).toBeTruthy();
  });
});

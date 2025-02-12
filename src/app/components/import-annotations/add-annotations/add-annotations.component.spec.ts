import { createRoutingFactory, Spectator } from "@ngneat/spectator";
import { SharedModule } from "@shared/shared.module";
import { MockBawApiModule } from "@baw-api/baw-apiMock.module";
import { InlineListComponent } from "@shared/inline-list/inline-list.component";
import { TypeaheadInputComponent } from "@shared/typeahead-input/typeahead-input.component";
import { LoadingComponent } from "@shared/loading/loading.component";
import { ToastrService } from "ngx-toastr";
import { AudioEventImport } from "@models/AudioEventImport";
import { AddAnnotationsComponent } from "./add-annotations.component";

describe("AddAnnotationsComponent", () => {
  let spectator: Spectator<AddAnnotationsComponent>;

  let audioEventImport: AudioEventImport;

  const createComponent = createRoutingFactory({
    component: AddAnnotationsComponent,
    declarations: [
      InlineListComponent,
      TypeaheadInputComponent,
      LoadingComponent,
    ],
    imports: [SharedModule, MockBawApiModule],
    mocks: [ToastrService],
    data: {
      resolvers: { model: audioEventImport },
    }
  });

  function setup(): void {
    spectator = createComponent({ detectChanges: false });
    spectator.detectChanges();
  }

  beforeEach(() => {
    setup();
  });

  it("should create", () => {
    expect(spectator.component).toBeInstanceOf(AddAnnotationsComponent);
  });
});

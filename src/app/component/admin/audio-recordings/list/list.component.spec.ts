import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { SharedModule } from "@shared/shared.module";
import { appLibraryImports } from "src/app/app.module";
import { testBawServices } from "src/app/test/helpers/testbed";
import { AdminAudioRecordingsComponent } from "./list.component";

describe("AdminAudioRecordingsComponent", () => {
  let component: AdminAudioRecordingsComponent;
  let fixture: ComponentFixture<AdminAudioRecordingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [...appLibraryImports, SharedModule, RouterTestingModule],
      declarations: [AdminAudioRecordingsComponent],
      providers: [...testBawServices],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminAudioRecordingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
  // TODO Write Tests
});

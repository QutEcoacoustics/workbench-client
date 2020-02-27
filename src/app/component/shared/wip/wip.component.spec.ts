import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { appLibraryImports } from "src/app/app.module";
import { SharedModule } from "../shared.module";
import { WIPComponent } from "./wip.component";
import { testAppInitializer } from "src/app/test.helper";

describe("WIPComponent", () => {
  let component: WIPComponent;
  let fixture: ComponentFixture<WIPComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [...appLibraryImports, SharedModule],
      declarations: [WIPComponent],
      providers: [...testAppInitializer]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WIPComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  // TODO Add tests
});

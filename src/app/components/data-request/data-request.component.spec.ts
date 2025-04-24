import { ComponentFixture, TestBed } from "@angular/core/testing";
import { provideMockConfig } from "@services/config/provide-configMock";
import { appLibraryImports } from "src/app/app.config";
import { DataRequestComponent } from "./data-request.component";

xdescribe("DataRequestComponent", () => {
  let component: DataRequestComponent;
  let fixture: ComponentFixture<DataRequestComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [...appLibraryImports, DataRequestComponent],
      providers: [provideMockConfig()],
    }).compileComponents();

    fixture = TestBed.createComponent(DataRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});

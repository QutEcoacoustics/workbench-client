import { ComponentFixture, TestBed } from "@angular/core/testing";
import { MockConfigModule } from "@services/config/configMock.module";
import { appLibraryImports } from "src/app/app.module";
import { DataRequestComponent } from "./data-request.component";

xdescribe("DataRequestComponent", () => {
  let component: DataRequestComponent;
  let fixture: ComponentFixture<DataRequestComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        ...appLibraryImports,
        MockConfigModule,
        DataRequestComponent,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DataRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});

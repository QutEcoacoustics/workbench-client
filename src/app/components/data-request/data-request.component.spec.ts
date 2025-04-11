import { provideHttpClientTesting } from "@angular/common/http/testing";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { MockConfigModule } from "@services/config/configMock.module";
import { SharedModule } from "@shared/shared.module";
import { appLibraryImports } from "src/app/app.module";
import {
  provideHttpClient,
  withInterceptorsFromDi,
} from "@angular/common/http";
import { DataRequestComponent } from "./data-request.component";

xdescribe("DataRequestComponent", () => {
  let component: DataRequestComponent;
  let fixture: ComponentFixture<DataRequestComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [
        ...appLibraryImports,
        SharedModule,
        RouterTestingModule,
        MockConfigModule,
        DataRequestComponent,
    ],
    providers: [
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
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

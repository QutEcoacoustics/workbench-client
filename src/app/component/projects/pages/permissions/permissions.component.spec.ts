import { HttpClientTestingModule } from "@angular/common/http/testing";
import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { testBawServices } from "src/app/app.helper";
import { SharedModule } from "src/app/component/shared/shared.module";
import { PermissionsComponent } from "./permissions.component";

describe("PermissionsComponent", () => {
  let component: PermissionsComponent;
  let fixture: ComponentFixture<PermissionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PermissionsComponent],
      imports: [SharedModule, RouterTestingModule, HttpClientTestingModule],
      providers: [...testBawServices]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PermissionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  // TODO Write unit tests
});

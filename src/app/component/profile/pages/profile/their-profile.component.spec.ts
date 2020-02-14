import { HttpClientTestingModule } from "@angular/common/http/testing";
import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { SharedModule } from "src/app/component/shared/shared.module";
import { testBawServices } from "src/app/test.helper";
import { TheirProfileComponent } from "./their-profile.component";

describe("TheirProfileComponent", () => {
  let component: TheirProfileComponent;
  let fixture: ComponentFixture<TheirProfileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [SharedModule, HttpClientTestingModule, RouterTestingModule],
      declarations: [TheirProfileComponent],
      providers: [...testBawServices]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TheirProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});

import { HttpClientTestingModule } from "@angular/common/http/testing";
import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { testAppInitializer } from "src/app/app.helper";
import { CmsComponent } from "./cms.component";

describe("CmsComponent", () => {
  let component: CmsComponent;
  let fixture: ComponentFixture<CmsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [CmsComponent],
      providers: [...testAppInitializer]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CmsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});

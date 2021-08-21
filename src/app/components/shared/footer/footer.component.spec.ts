import { ComponentFixture, TestBed } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { MockAppConfigModule } from "@services/config/configMock.module";
import { appLibraryImports } from "src/app/app.module";
import { FooterComponent } from "./footer.component";

//TODO Test links in footer highlight depending on page
describe("FooterComponent", () => {
  let component: FooterComponent;
  let fixture: ComponentFixture<FooterComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [...appLibraryImports, RouterTestingModule, MockAppConfigModule],
      declarations: [FooterComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});

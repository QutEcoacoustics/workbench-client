import { ComponentFixture, TestBed } from "@angular/core/testing";
import { provideMockBawApi } from "@baw-api/provide-baw-ApiMock";
import { appLibraryImports } from "src/app/app.config";
import { ContactUsComponent } from "./contact-us.component";

// TODO Implement tests

xdescribe("ContactUsComponent", () => {
  let component: ContactUsComponent;
  let fixture: ComponentFixture<ContactUsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [...appLibraryImports, ContactUsComponent],
      providers: [provideMockBawApi()],
    }).compileComponents();

    fixture = TestBed.createComponent(ContactUsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from "@angular/core/testing";
import { MockBawApiModule } from "@baw-api/baw-apiMock.module";
import { appLibraryImports } from "src/app/app.module";
import { ContactUsComponent } from "./contact-us.component";

// TODO Implement tests

xdescribe("ContactUsComponent", () => {
  let component: ContactUsComponent;
  let fixture: ComponentFixture<ContactUsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        ...appLibraryImports,
        MockBawApiModule,
        ContactUsComponent,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ContactUsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});

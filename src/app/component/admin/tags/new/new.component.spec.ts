import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { appLibraryImports } from "src/app/app.module";
import { SharedModule } from "src/app/component/shared/shared.module";
import { testBawServices } from "src/app/test.helper";
import { AdminTagsNewComponent } from "./new.component";

describe("AdminTagsNewComponent", () => {
  let component: AdminTagsNewComponent;
  let fixture: ComponentFixture<AdminTagsNewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [...appLibraryImports, SharedModule, RouterTestingModule],
      declarations: [AdminTagsNewComponent],
      providers: [...testBawServices]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminTagsNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // TODO Write Tests
});

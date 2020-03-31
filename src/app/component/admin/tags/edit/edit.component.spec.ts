import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { appLibraryImports } from "src/app/app.module";
import { SharedModule } from "src/app/component/shared/shared.module";
import { testBawServices } from "src/app/test.helper";
import { AdminTagsEditComponent } from "./edit.component";

describe("AdminTagsEditComponent", () => {
  let component: AdminTagsEditComponent;
  let fixture: ComponentFixture<AdminTagsEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [...appLibraryImports, SharedModule, RouterTestingModule],
      declarations: [AdminTagsEditComponent],
      providers: [...testBawServices]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminTagsEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // TODO Write Tests
});

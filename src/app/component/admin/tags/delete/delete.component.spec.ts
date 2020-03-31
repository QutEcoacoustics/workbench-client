import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { appLibraryImports } from "src/app/app.module";
import { SharedModule } from "src/app/component/shared/shared.module";
import { testBawServices } from "src/app/test.helper";
import { AdminTagsDeleteComponent } from "./delete.component";

describe("AdminTagsDeleteComponent", () => {
  let component: AdminTagsDeleteComponent;
  let fixture: ComponentFixture<AdminTagsDeleteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [...appLibraryImports, SharedModule, RouterTestingModule],
      declarations: [AdminTagsDeleteComponent],
      providers: [...testBawServices]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminTagsDeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // TODO Write Tests
});

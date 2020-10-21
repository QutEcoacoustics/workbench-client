import {
  HttpClientTestingModule,
  HttpTestingController,
} from "@angular/common/http/testing";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { MockBawApiModule } from "@baw-api/baw-apiMock.module";
import { SharedModule } from "@shared/shared.module";
import { PointHarvestComponent } from "./point.component";

describe("PointHarvestComponent", () => {
  let httpMock: HttpTestingController;
  let component: PointHarvestComponent;
  let fixture: ComponentFixture<PointHarvestComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        SharedModule,
        RouterTestingModule,
        HttpClientTestingModule,
        MockBawApiModule,
      ],
      declarations: [PointHarvestComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PointHarvestComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});

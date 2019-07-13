import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormGenerationComponent } from './form-generation.component';

describe('FormGenerationComponent', () => {
  let component: FormGenerationComponent;
  let fixture: ComponentFixture<FormGenerationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormGenerationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormGenerationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormlyEmailInput } from './email.component';

describe('FormlyEmailInput', () => {
  let component: FormlyEmailInput;
  let fixture: ComponentFixture<FormlyEmailInput>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [FormlyEmailInput]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormlyEmailInput);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactDisclaimersComponent } from './disclaimers.component';

describe('ContactDisclaimersComponent', () => {
  let component: ContactDisclaimersComponent;
  let fixture: ComponentFixture<ContactDisclaimersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ContactDisclaimersComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContactDisclaimersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

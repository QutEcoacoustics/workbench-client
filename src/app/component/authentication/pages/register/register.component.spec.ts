import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthenticationRegisterComponent } from './register.component';
import { HttpClientModule } from '@angular/common/http';

describe('AuthenticationRegisterComponent', () => {
  let component: AuthenticationRegisterComponent;
  let fixture: ComponentFixture<AuthenticationRegisterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AuthenticationRegisterComponent],
      imports: [HttpClientModule]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AuthenticationRegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

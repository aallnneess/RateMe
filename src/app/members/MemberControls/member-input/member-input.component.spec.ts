import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MemberInputComponent } from './member-input.component';

describe('MemberInputComponent', () => {
  let component: MemberInputComponent;
  let fixture: ComponentFixture<MemberInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MemberInputComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MemberInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MemberNavComponent } from './member-nav.component';

describe('MemberNavComponent', () => {
  let component: MemberNavComponent;
  let fixture: ComponentFixture<MemberNavComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MemberNavComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MemberNavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

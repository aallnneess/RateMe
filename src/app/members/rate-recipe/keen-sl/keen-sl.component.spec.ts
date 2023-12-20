import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KeenSLComponent } from './keen-sl.component';

describe('KeenSLComponent', () => {
  let component: KeenSLComponent;
  let fixture: ComponentFixture<KeenSLComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [KeenSLComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(KeenSLComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FullscreenSpinnerComponent } from './fullscreen-spinner.component';

describe('FullscreenSpinnerComponent', () => {
  let component: FullscreenSpinnerComponent;
  let fixture: ComponentFixture<FullscreenSpinnerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FullscreenSpinnerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FullscreenSpinnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

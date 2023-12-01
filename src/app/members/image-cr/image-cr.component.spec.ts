import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImageCrComponent } from './image-cr.component';

describe('ImageCrComponent', () => {
  let component: ImageCrComponent;
  let fixture: ComponentFixture<ImageCrComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ImageCrComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ImageCrComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

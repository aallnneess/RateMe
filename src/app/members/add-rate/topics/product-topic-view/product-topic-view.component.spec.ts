import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductTopicViewComponent } from './product-topic-view.component';

describe('ProductTopicViewComponent', () => {
  let component: ProductTopicViewComponent;
  let fixture: ComponentFixture<ProductTopicViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProductTopicViewComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ProductTopicViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

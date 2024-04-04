import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecipeCardDetailsComponent } from './recipe-card-details.component';

describe('RecipeCardDetailsComponent', () => {
  let component: RecipeCardDetailsComponent;
  let fixture: ComponentFixture<RecipeCardDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RecipeCardDetailsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RecipeCardDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SpinnerComponent } from './spinner/spinner.component';
import { FullscreenSpinnerComponent } from './fullscreen-spinner/fullscreen-spinner.component';



@NgModule({
  declarations: [
    SpinnerComponent,
    FullscreenSpinnerComponent
  ],
  exports: [
    SpinnerComponent,
    FullscreenSpinnerComponent
  ],
  imports: [
    CommonModule
  ]
})
export class SharedModule { }

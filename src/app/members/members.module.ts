import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MembersRoutingModule } from './members-routing.module';
import { MembersComponent } from './members.component';
import { RateRecipeComponent } from './rate-recipe/rate-recipe.component';


@NgModule({
  declarations: [
    MembersComponent,
    RateRecipeComponent
  ],
  exports: [],
  imports: [
    CommonModule,
    MembersRoutingModule
  ]
})
export class MembersModule { }

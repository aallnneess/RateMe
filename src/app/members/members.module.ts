import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MembersRoutingModule } from './members-routing.module';
import { MembersComponent } from './members.component';
import { RateRecipeComponent } from './rate-recipe/rate-recipe.component';
import {ImageCropperModule} from "ngx-image-cropper";
import { ImageCrComponent } from './image-cr/image-cr.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import { MemberInputComponent } from './MemberControls/member-input/member-input.component';


@NgModule({
  declarations: [
    MembersComponent,
    RateRecipeComponent,
    ImageCrComponent,
    MemberInputComponent
  ],
  exports: [],
  imports: [
    CommonModule,
    MembersRoutingModule,
    ImageCropperModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class MembersModule { }

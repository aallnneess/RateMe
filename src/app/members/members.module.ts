import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {MembersRoutingModule} from './members-routing.module';
import {MembersComponent} from './members.component';
import {RateRecipeComponent} from './rate-recipe/rate-recipe.component';
import {ImageCropperModule} from "ngx-image-cropper";
import {ImageCrComponent} from './image-cr/image-cr.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MemberInputComponent} from './MemberControls/member-input/member-input.component';
import {ImageGalleryComponent} from './image-cr/image-gallery/image-gallery.component';
import { GalleryModule} from "ng-gallery";
import {SpinnerComponent} from "./MemberControls/spinner/spinner.component";
import { RecipeCardComponent } from './rate-recipe/recipe-card/recipe-card.component';


@NgModule({
  declarations: [
    MembersComponent,
    RateRecipeComponent,
    ImageCrComponent,
    MemberInputComponent,
    ImageGalleryComponent,
    SpinnerComponent,
    RecipeCardComponent
  ],
  exports: [],
  imports: [
    CommonModule,
    MembersRoutingModule,
    ImageCropperModule,
    FormsModule,
    ReactiveFormsModule,
    GalleryModule

  ]
})
export class MembersModule { }

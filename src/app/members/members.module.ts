import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {MembersRoutingModule} from './members-routing.module';
import {MembersComponent} from './members.component';
import {ImageCropperModule} from "ngx-image-cropper";
import {ImageCrComponent} from './image-cr/image-cr.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MemberInputComponent} from './MemberControls/member-input/member-input.component';
import {ImageGalleryComponent} from './image-cr/image-gallery/image-gallery.component';
import {GalleryModule} from "ng-gallery";
import {RateCardDetailsComponent} from './rate-card-details/rate-card-details.component';
import {AddRateComponent} from './add-rate/add-rate.component';
import {RateCardComponent} from "./rate-card/recipe-card.component";
import {KeenSLComponent} from "./add-rate/keen-sl/keen-sl.component";
import {LightboxDirective} from "ng-gallery/lightbox";
import {NoteComponent} from './rate-card-details/note/note.component';
import {ScrollToBottomOnFocusDirective} from './directives/scroll-to-bottom-on-focus.directive';
import {RecipeTopicViewComponent} from './add-rate/topics/recipe-topic-view/recipe-topic-view.component';
import {RecipeViewComponent} from "./rate-card-details/recipe-view/recipe-view.component";
import {ProductTopicViewComponent} from './add-rate/topics/product-topic-view/product-topic-view.component';
import {ProductViewComponent} from './rate-card-details/product-view/product-view.component';
import {MemberNavComponent} from "./member-nav/member-nav.component";
import {StartComponent} from './start/start.component';
import {FilterPopupComponent} from './filter-popup/filter-popup.component';
import {SharedModule} from "../shared/shared.module";
import {RouterOutlet} from "@angular/router";
import {FoodtruckTopicViewComponent} from "./add-rate/topics/foodtruck-topic-view/foodtruck-topic-view.component";
import { FoodtruckViewComponent } from './rate-card-details/foodtruck-view/foodtruck-view.component';

@NgModule({
    declarations: [
        MembersComponent,
        ImageCrComponent,
        MemberInputComponent,
        ImageGalleryComponent,
        RateCardComponent,
        RateCardDetailsComponent,
        AddRateComponent,
        KeenSLComponent,
        NoteComponent,
        ScrollToBottomOnFocusDirective,
        RecipeTopicViewComponent,
        RecipeViewComponent,
        ProductTopicViewComponent,
        ProductViewComponent,
        MemberNavComponent,
        StartComponent,
        FilterPopupComponent,
      FoodtruckTopicViewComponent,
      FoodtruckViewComponent
    ],
  exports: [],
  imports: [
    CommonModule,
    MembersRoutingModule,
    ImageCropperModule,
    FormsModule,
    ReactiveFormsModule,
    GalleryModule,
    LightboxDirective,
    SharedModule,
    RouterOutlet

  ]
})
export class MembersModule { }

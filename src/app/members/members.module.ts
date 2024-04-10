import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {MembersRoutingModule} from './members-routing.module';
import {MembersComponent} from './members.component';
import {ImageCropperModule} from "ngx-image-cropper";
import {ImageCrComponent} from './image-cr/image-cr.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MemberInputComponent} from './MemberControls/member-input/member-input.component';
import {ImageGalleryComponent} from './image-cr/image-gallery/image-gallery.component';
import { GalleryModule} from "ng-gallery";
import {SpinnerComponent} from "./MemberControls/spinner/spinner.component";
import { RateCardDetailsComponent } from './rate-card-details/rate-card-details.component';
import { AddRateComponent } from './add-rate/add-rate.component';
import {RateCardComponent} from "./rate-card/recipe-card.component";
import {KeenSLComponent} from "./add-rate/keen-sl/keen-sl.component";
import {LightboxDirective} from "ng-gallery/lightbox";


@NgModule({
  declarations: [
    MembersComponent,
    ImageCrComponent,
    MemberInputComponent,
    ImageGalleryComponent,
    SpinnerComponent,
    RateCardComponent,
    RateCardDetailsComponent,
    AddRateComponent,
    KeenSLComponent
  ],
  exports: [],
    imports: [
        CommonModule,
        MembersRoutingModule,
        ImageCropperModule,
        FormsModule,
        ReactiveFormsModule,
        GalleryModule,
        LightboxDirective

    ]
})
export class MembersModule { }

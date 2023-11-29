import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MembersRoutingModule } from './members-routing.module';
import { MembersComponent } from './members.component';


@NgModule({
  declarations: [
    MembersComponent
  ],
  exports: [],
  imports: [
    CommonModule,
    MembersRoutingModule
  ]
})
export class MembersModule { }

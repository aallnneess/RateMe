import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './core/home/home.component';
import { TopNavComponent } from './core/top-nav/top-nav.component';
import { LoginComponent } from './core/login/login.component';
import {ReactiveFormsModule} from "@angular/forms";
import { InputComponent } from './core/Controls/input/input.component';
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {HttpClientModule} from "@angular/common/http";
import { PopupComponent } from './core/popup/popup.component';
import {SharedModule} from "./shared/shared.module";

@NgModule({
    declarations: [
        AppComponent,
        HomeComponent,
        TopNavComponent,
        LoginComponent,
        InputComponent,
        PopupComponent
    ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    SharedModule
  ],
    providers: [],
  exports: [
    InputComponent,
    PopupComponent
  ],
    bootstrap: [AppComponent]
})
export class AppModule { }

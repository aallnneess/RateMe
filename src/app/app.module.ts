import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './core/home/home.component';
import { TopNavComponent } from './core/top-nav/top-nav.component';
import { LoginComponent } from './core/login/login.component';
import {ReactiveFormsModule} from "@angular/forms";
import { InputComponent } from './core/Controls/input/input.component';
import { MemberNavComponent } from './core/top-nav/member-nav/member-nav.component';
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";

@NgModule({
    declarations: [
        AppComponent,
        HomeComponent,
        TopNavComponent,
        LoginComponent,
        InputComponent,
        MemberNavComponent
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        AppRoutingModule,
        ReactiveFormsModule
    ],
    providers: [],
    exports: [
        InputComponent
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }

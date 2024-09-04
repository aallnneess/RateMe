import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {HomeComponent} from "./core/home/home.component";
import {LoginComponent} from "./core/login/login.component";
import {isUserAuthenticated} from "./core/guards/auth.guard";
import {checkLogin} from "./core/guards/login.guard";

const routes: Routes = [
  { path: '', component: HomeComponent},
  { path: 'login', component: LoginComponent, canActivate: [checkLogin]},
  { path: 'members',
    loadChildren: () => import('./members/members.module').then(m => m.MembersModule),
    canActivate: [isUserAuthenticated]
  },
  { path: '**', component: HomeComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }




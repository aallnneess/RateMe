import {inject, NgModule} from '@angular/core';
import {CanMatchFn, RouterModule, Routes} from '@angular/router';
import {HomeComponent} from "./core/home/home.component";
import {LoginComponent} from "./core/login/login.component";
import {NotFoundComponent} from "./core/not-found/not-found.component";
import {AuthService} from "./core/Services/auth.service";

const canMatchUser: CanMatchFn = () => {
  console.log('canMatchFn');

  const authService = inject(AuthService);

  return authService.loggedIn() !== null;
};

const routes: Routes = [
  { path: '', component: HomeComponent},
  { path: 'login', component: LoginComponent},
  { path: 'members',
    loadChildren: () => import('./members/members.module').then(m => m.MembersModule),
    canMatch: [canMatchUser]
  },
   { path: '**', component: NotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }




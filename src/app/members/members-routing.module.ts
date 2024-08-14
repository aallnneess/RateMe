import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {RateCardDetailsComponent} from "./rate-card-details/rate-card-details.component";
import {AddRateComponent} from "./add-rate/add-rate.component";
import {StartComponent} from "./start/start.component";
import {MembersComponent} from "./members.component";
import {rateRecipeGuard} from "../core/guards/rateRecipe.guard";



const routes: Routes = [
  { path: '', component: StartComponent, children: [
      { path: '', redirectTo: 'cards', pathMatch: 'full' },
      { path: 'cards', component: MembersComponent},
      { path: 'addRate/:id', component: AddRateComponent},
      { path: 'rateRecipe/:id', component: RateCardDetailsComponent, canActivate: [rateRecipeGuard]}
    ]},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MembersRoutingModule { }

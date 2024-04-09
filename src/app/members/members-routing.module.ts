import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {MembersComponent} from './members.component';
import {RateCardDetailsComponent} from "./rate-card-details/rate-card-details.component";
import {AddRateComponent} from "./add-rate/add-rate.component";

const routes: Routes = [
  { path: '', component: MembersComponent },
  { path: 'addRate/:id', component: AddRateComponent },
  { path: 'rateRecipe/:id', component: RateCardDetailsComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MembersRoutingModule { }

import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {MembersComponent} from './members.component';
import {RecipeCardDetailsComponent} from "./rate-card-details/recipe-card-details.component";
import {AddRateComponent} from "./add-rate/add-rate.component";

const routes: Routes = [
  { path: '', component: MembersComponent },
  { path: 'addRate/:id', component: AddRateComponent },
  { path: 'rateRecipe/:id', component: RecipeCardDetailsComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MembersRoutingModule { }

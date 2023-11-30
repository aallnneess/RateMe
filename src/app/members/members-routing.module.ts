import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MembersComponent } from './members.component';
import {RateRecipeComponent} from "./rate-recipe/rate-recipe.component";

const routes: Routes = [
  { path: '', component: MembersComponent },
  { path: 'rateRecipe', component: RateRecipeComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MembersRoutingModule { }

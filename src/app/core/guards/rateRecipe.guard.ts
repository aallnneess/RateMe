import {ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot} from "@angular/router";
import {inject} from "@angular/core";
import {DataStoreService} from "../../members/Service/data-store.service";

export const rateRecipeGuard: CanActivateFn = async (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot) => {

  const dataStoreService = inject(DataStoreService);
  const router = inject(Router);

  if (dataStoreService.getRatesSize() === 0) {
    return  router.navigate(['/members']);
  } else {
    return true;
  }
}



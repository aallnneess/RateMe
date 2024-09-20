import {ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot} from "@angular/router";
import {inject} from "@angular/core";
import {AuthService} from "../Services/auth.service";
import {UserService} from "../Services/user.service";

export const isUserAuthenticated: CanActivateFn = async (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot) => {

  const authService = inject(AuthService);
  const userService = inject(UserService);
  const router = inject(Router);

  console.log('Guard');

  // If the user is not logged in, a current session is checked
  // if there is one, the user is logged in
  if (!authService.loggedIn()) {
    try {
      const session = await authService.lookForSession();
      if (session) {
        await userService.loadUser(session.userId);
      }
    } catch (err) {
      console.error('isUserAuthenticated Error: ', err);
    }

  }


  if (authService.loggedIn()) {
    //console.log('return true');
    return true;
  }

  else {
    //console.log('return false');
    return router.navigate(['/login']);
  }
}




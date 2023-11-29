import {Component, inject, signal} from '@angular/core';
import {AuthService} from "../Services/auth.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-top-nav',
  templateUrl: './top-nav.component.html',
  styleUrl: './top-nav.component.css'
})
export class TopNavComponent {

  authService = inject(AuthService);
  router = inject(Router);

  autoLogin() {

    this.authService.getSession().subscribe({
      complete: () => {
        console.log('complete');

        console.log(this.router.url);

        // Checks if the current URL is '/members'
        if (this.router.url === '/members') {
          // If true, navigates to the root URL and then back to '/members'
          // This ensures that route guards are re-evaluated
          this.router.navigateByUrl('/').then(() => {
            this.router.navigateByUrl('members', {
              skipLocationChange: true
            });
          })
          return;
        }
        // If the current URL is not '/members', navigates directly to 'members'
        this.router.navigateByUrl('members', {
          skipLocationChange: true
        });
      },
      error: () => this.router.navigateByUrl('login', {
        skipLocationChange: true
      })
    })

  }

}

import {Component, inject} from '@angular/core';
import {AuthService} from "../Services/auth.service";

@Component({
  selector: 'app-top-nav',
  templateUrl: './top-nav.component.html',
  styleUrl: './top-nav.component.css'
})
export class TopNavComponent {

  authService = inject(AuthService);

}

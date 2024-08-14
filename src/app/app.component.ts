import {Component, inject} from '@angular/core';
import {AuthService} from "./core/Services/auth.service";
import {UserService} from "./core/Services/user.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  authService = inject(AuthService);
  userService = inject(UserService);

  constructor() {
    this.checkLogin();
  }

  async checkLogin()
  {
    if (!this.authService.loggedIn()) {
      try {
        const session = await this.authService.lookForSession();
        if (session) {
          await this.userService.loadUser(session.userId);
        }
      } catch (err) {
        console.error('isUserAuthenticated Error: ', err);
      }

    }
  }
  // SEHR WICHTIG
  // TODO: image loader
  // TODO: Versions Nummern einführen bzw. DIREKT vor dem upload nach EDIT erneut prüfen ob aktuellstes objekt (appwrite changed at....)
  // Sonst kann e sja sein das dass aktuellste dokument in den edit view gekommen ist, aber es zu lange gedauert hat, es zu editieren und wer anders schneller war !


  // Normal Wichtig
  // TODO: Pagination-Loading Animation
  // TODO : Komplette Image verarbeiten neu gestalten......
  // TODO: User-Back von Recipe-Detail-Card zurück zum Grid -> keine neue Datenbankanfrage !
  // TODO: addRates..... Es gibt Probleme bei den Bildern...es wird immer versucht eins zu löschen bei parents....auch auch wenn garkein bild geändert wurde werden bilder gelöscht
  // TODO: Ab und zu merkt "er" sich nicht die scroll position ?!

  // Wäre schön
  // TODO: Fullscreen Button
  // TODO: Rezept-Löschen möglichkeit mit bestätigung von random key
  // TODO: User-Bereich
  // TODO: Login-Button loader....
  // TODO: Pagination-Service
  // TODO: Mehrere Bilder gleichzeitig hochladen

}

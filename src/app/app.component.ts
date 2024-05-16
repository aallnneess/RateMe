import {Component} from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  // TODO: this.router.navigate(['members/addRate', this.rate.rateTopic, {editRate: JSON.stringify(this.rate)}]);
  // Rate-card-details......auf service umbauen ! String zu lang

  // TODO: Tags lassen sich nicht editieren
  // TODO: Fullscreen Button
  // Todo: Sortierfunktion
  // TODO: Loader bei Edit/New/Rate Rate nicht als Button Loader sondern als Popup damit es besser wahrgenommen wird
  // TODO: User-Back von Recipe-Detail-Card zurück zum Grid -> keine neue Datenbankanfrage !
  // TODO: Login-Button disablen wenn einmal geklickt

}

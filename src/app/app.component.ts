import {Component} from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  // SEHR WICHTIG
  // TODO: Login-Loading Animation
  // TODO: Pagination-Loading Animation
  // TODO: Versions Nummern einführen bzw. DIREKT vor dem upload nach EDIT erneut prüfen ob aktuellstes bild (appwrite changed at....)
  // Sonst kann e sja sein das dass aktuellste dokument in den edit view gekommen ist, aber es zu lange gedauert hat, es zu editieren und wer anders schneller war !


  // Normal Wichtig
  // TODO : Komplette Image verarbeiten neu gestalten......
  // TODO: User-Back von Recipe-Detail-Card zurück zum Grid -> keine neue Datenbankanfrage !
  // TODO: Loader bei Edit/New/Rate Rate nicht als Button Loader sondern als Popup damit es besser wahrgenommen wird
  // TODO: addRates..... Es gibt Probleme bei den Bildern...es wird immer versucht eins zu löschen bei parents....auch auch wenn garkein bild geändert wurde werden bilder gelöscht
  // TODO: Ab und zu merkt "er" sich nicht die scroll position ?!

  // Wäre schön
  // TODO: Fullscreen Button
  // TODO: Rezept-Löschen möglichkeit mit bestätigung von random key
  // TODO: User-Bereich
  // TODO: Login-Button loader....
  // TODO: Pagination-Service

}

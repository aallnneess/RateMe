import {Component} from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  // SEHR WICHTIG
  // TODO: man kann nach tags/boughtAt suchen, es werden aber mom. nur parentRates berücksichtigt da es keine globaltags mehr gibt
  // TODO: image loader
  // TODO: Fehlerbehandlung Add/Update/Edit Rate mit retry rxjs (siehe checkGlobalRate): Zurück zur Eingabe-Maske, Info an User: später probieren.
      // TODO: Evtl. automatische reinigung einmal die Stunde durchführen wo nicht vollständige rates gelöscht werden.
  // TODO: Bilder Anzahl begrenzt da die bucket objekte als string gespeichert werden (maximale chars...) eig. Datenbank _______(!?) wär besser
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

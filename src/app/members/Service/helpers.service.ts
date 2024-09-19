import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class HelpersService {

  formatDateToGermanDate(dateString: string): string {
    // Neues Date-Objekt aus dem String erzeugen
    const date = new Date(dateString);

    // Tag, Monat und Jahr extrahieren
    const day = String(date.getDate()).padStart(2, '0'); // Zwei Ziffern für den Tag
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Monate sind 0-basiert, daher +1
    const year = date.getFullYear();

    // Ergebnis als DD.MM.YYYY formatieren
    return `${day}.${month}.${year}`;
  }

}

import {Directive, ElementRef, HostListener, inject, Renderer2} from '@angular/core';

@Directive({
  selector: '[appScrollToBottomOnFocus]'
})
export class ScrollToBottomOnFocusDirective {

  elementRef = inject(ElementRef);
  renderer = inject(Renderer2);

  @HostListener('focus') onFocus() {
    this.scrollToBottom();
  }

  private scrollToBottom() {

    setTimeout(() => {

      let counter = 0;

      const scrollInterval = setInterval(() => {

        const currentPosition = window.scrollY;
        const targetPosition = document.body.scrollHeight;
        const distance = targetPosition - currentPosition;

        // Bestimme die Schrittweite basierend auf der verbleibenden Distanz
        const step = Math.max(1, distance / 50); // 10 Schritte für das Herunterfahren

        // Führe das Scrollen um die Schrittweite aus
        window.scrollBy(0, step);

        counter += step;

        // Überprüfe, ob das Scrollen abgeschlossen ist
        if (counter > 200) {
           clearInterval(scrollInterval); // Stoppe das Intervall, wenn das Scrollen abgeschlossen ist
          counter = 0;
        }
      }, 50); // Intervallzeit in Millisekunden

    },300);
  }
}


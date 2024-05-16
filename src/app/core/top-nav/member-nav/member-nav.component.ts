import {Component, ElementRef, inject, ViewChild} from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'app-member-nav',
  templateUrl: './member-nav.component.html',
  styleUrl: './member-nav.component.css'
})
export class MemberNavComponent {

  // TODO: Update Rates Button....

  isMobile!: boolean;

  router = inject(Router);

  constructor() {
    this.isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  }

  @ViewChild('popupMenu') popupMenu!: ElementRef;

  togglePopupMenu() {
    this.popupMenu.nativeElement.classList.toggle('popup-menu-show');
  }

  reloadComponent(route: string[]) {
    this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
      this.router.navigate(route);
    });
  }

}

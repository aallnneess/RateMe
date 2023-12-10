import {Component, ElementRef, ViewChild} from '@angular/core';

@Component({
  selector: 'app-member-nav',
  templateUrl: './member-nav.component.html',
  styleUrl: './member-nav.component.css'
})
export class MemberNavComponent {

  isMobile!: boolean;

  constructor() {
    this.isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  }

  @ViewChild('popupMenu') popupMenu!: ElementRef;

  togglePopupMenu() {
    this.popupMenu.nativeElement.classList.toggle('popup-menu-show');
  }

}

import {Component, ElementRef, inject, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {PopupService} from "../../core/Services/popup.service";
import {FilterService} from "../Service/filter.service";

@Component({
  selector: 'app-member-nav',
  templateUrl: './member-nav.component.html',
  styleUrl: './member-nav.component.css'
})
export class MemberNavComponent {

  // TODO: Update Rates Button....

  isMobile!: boolean;

  router = inject(Router);
  route = inject(ActivatedRoute);
  filterService = inject(FilterService);

  constructor() {
    // TODO: isMobile reagiert nicht responsive
    this.isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  }

  @ViewChild('popupMenu') popupMenu!: ElementRef;

  togglePopupMenu() {
    this.popupMenu.nativeElement.classList.toggle('popup-menu-show');
  }

  reloadComponent(routeIn: string[]) {
    this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {

     this.router.navigate(routeIn, {relativeTo: this.route});

    });
  }

}

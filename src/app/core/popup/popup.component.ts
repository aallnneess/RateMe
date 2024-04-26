import {AfterViewInit, Component, ElementRef, inject, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {PopupService} from "../Services/popup.service";
import {filter, Subscription} from "rxjs";

@Component({
  selector: 'app-popup',
  templateUrl: './popup.component.html',
  styleUrl: './popup.component.css'
})
export class PopupComponent implements OnInit, OnDestroy, AfterViewInit {

  @ViewChild('section') section!: ElementRef<HTMLElement>;

  errorString = '';
  popupService = inject(PopupService);
  sub$!: Subscription;

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    console.log('destroy');
    this.sub$.unsubscribe();
  }

  ngAfterViewInit(): void {
    this.sub$ = this.popupService.errorMessage$.pipe(
      filter((error) => !!error)
    ).subscribe(error => {
      this.errorString = error;
      this.section.nativeElement.classList.toggle('show-section');
      console.log('toggle popup');
    });
  }

}

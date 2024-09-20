import {AfterViewInit, Component, ElementRef, inject, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Subscription} from "rxjs";
import {FilterService} from "../Service/filter.service";
import {FormBuilder, FormControl, FormGroup} from "@angular/forms";
import {MemberInputComponent} from "../MemberControls/member-input/member-input.component";

@Component({
  selector: 'app-filter-popup',
  templateUrl: './filter-popup.component.html',
  styleUrl: './filter-popup.component.css'
})
export class FilterPopupComponent implements OnInit, OnDestroy, AfterViewInit{

  @ViewChild('section') section!: ElementRef<HTMLElement>;
  @ViewChild('searchInput') searchInput!: MemberInputComponent;

  filterService = inject(FilterService);
  fb = inject(FormBuilder);

  sub$!: Subscription;

  form!: FormGroup;

  ngOnInit(): void {
    this.form = this.fb.group({
      // search: new FormControl(this.filterService.getSearch()),
      search: [this.filterService.getSearch()],
      rezept: [true],
      produkt: [true]
    });
  }

  ngAfterViewInit(): void {
    this.sub$ = this.filterService.showPopupOb$.subscribe(openOrClose => {

      if (openOrClose) {
        this.section.nativeElement.classList.add('show-section');
        setTimeout(() => {
          this.searchInput.setFocus();
        },100);
      } else {
        this.section.nativeElement.classList.remove('show-section');
      }
      //console.log('toggle popup');
    });
  }

  getFormControl(name: string) {
    return this.form.get(name) as FormControl;
  }

  ngOnDestroy(): void {
    this.filterService.closePopup();
    this.sub$.unsubscribe();
  }

  submitForm() {
    console.log(this.form);
  }

  search(search: string) {
    this.filterService.setSearch(search);
  }

  updateCheckbox(formName: string, checked: boolean) {
    this.form.get(formName)?.setValue(checked);

    switch (formName) {

      case 'rezept': this.filterService.setCheckedRecipe(checked); break;
      case 'produkt': this.filterService.setCheckedProduct(checked); break;
    }

    this.filterService.setSearch(this.form.get('search')?.value);

  }

  removeSearchWord(item: string) {
    this.filterService.removeSearchFromSearchArray(item);
  }
}

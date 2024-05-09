import {Component, ElementRef, EventEmitter, inject, Input, Output, ViewChild} from '@angular/core';
import {GalleryLoadService} from "../../../Service/gallery-load.service";
import {FormControl, FormGroup} from "@angular/forms";
import {Rate} from "../../../../core/common/rate";

@Component({
  selector: 'app-product-topic-view',
  templateUrl: './product-topic-view.component.html',
  styleUrl: './product-topic-view.component.css'
})
export class ProductTopicViewComponent {

  galleryLoadService: GalleryLoadService = inject(GalleryLoadService);

  @Output() submitButtonForParent = new EventEmitter<ElementRef<HTMLButtonElement>>();

  @ViewChild('submitButton')
  submitButton!: ElementRef<HTMLButtonElement>;

  @Input() form!: FormGroup;
  @Input() editRate!: Rate|null;
  @Input() parentRate!: Rate|null;

  @Output() sendDataToParent = new EventEmitter<Blob[]>();

  ngOnInit(): void {
    console.log(this.editRate);
  }

  getFormControl(name: string) {
    return this.form.get(name) as FormControl;
  }

  changeButtonCssClass() {
    if (this.submitButton) {
      return this.submitButton.nativeElement.disabled;
    }
    return false;
  }

  sendData(blobs: Blob[]) {
    this.submitButtonForParent.emit(this.submitButton);
    this.sendDataToParent.emit(blobs);
  }

}

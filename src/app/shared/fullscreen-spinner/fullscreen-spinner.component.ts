import {Component, inject} from '@angular/core';
import {FullScreenLoaderService} from "../services/full-screen-loader.service";

@Component({
  selector: 'app-fullscreen-spinner',
  templateUrl: './fullscreen-spinner.component.html',
  styleUrl: './fullscreen-spinner.component.css'
})
export class FullscreenSpinnerComponent {

  fullScreenLoaderService = inject(FullScreenLoaderService);


}

import {TopicsInterface} from "../../../core/common/topics-interface";
import {StateService, Status} from "../../Service/state.service";
import {Rate} from "../../../core/common/rate";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";

export class ProductTopic implements TopicsInterface {

  statesService!: StateService;

  constructor(statesService: StateService, rateTopic: string, parentRate: Rate | null, editRate: Rate | null) {
    this.statesService = statesService;
    this.rateTopic = rateTopic;
    this.parentRate = parentRate;
    this.editRate = editRate;
  }

  rateTopic= '';
  parentRate!: Rate|null;
  editRate!: Rate|null;

  generateForm(fb: FormBuilder, form: FormGroup) {
    if (this.parentRate) {
      form = fb.group({
        title: [this.parentRate.title, [Validators.required, Validators.minLength(2), Validators.maxLength(100), Validators.pattern(/^[a-zA-Z0-9\sÄäÖöÜü]*$/)]],
        rating: [this.parentRate.rating, [Validators.required, Validators.minLength(2), Validators.pattern(/^[a-zA-Z0-9\sÄäÖöÜü]*$/)]],
        notes: ['', [Validators.required, Validators.maxLength(2000)]],
        tags: [this.parentRate.tags, [Validators.required]],
        manufacturer: [this.parentRate.manufacturer, [Validators.required, Validators.minLength(2)]],
        boughtAt: ['', [Validators.required, Validators.minLength(2)]]
      });
    } else if (this.editRate) {

      this.statesService.setStatus(Status.Edit);
      form = fb.group({
        title: [this.editRate.title, [Validators.required, Validators.minLength(2), Validators.maxLength(100), Validators.pattern(/^[a-zA-Z0-9\sÄäÖöÜü]*$/)]],
        rating: [this.editRate.rating, [Validators.required, Validators.minLength(2), Validators.pattern(/^[a-zA-Z0-9\sÄäÖöÜü]*$/)]],
        notes: [' ', [Validators.required, Validators.maxLength(2000)]],
        tags: [this.editRate.tags, [Validators.required]],
        manufacturer: [this.editRate.manufacturer, [Validators.required, Validators.minLength(2)]],
        boughtAt: [this.editRate.boughtAt, [Validators.required, Validators.minLength(2)]]
      });
    } else {
      form = fb.group({
        title: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100), Validators.pattern(/^[a-zA-Z0-9\sÄäÖöÜü]*$/)]],
        rating: [0, [Validators.required, Validators.minLength(2), Validators.pattern(/^[a-zA-Z0-9\sÄäÖöÜü]*$/)]],
        notes: ['', [Validators.required, Validators.maxLength(2000)]],
        tags: ['', [Validators.required]],
        manufacturer: ['', [Validators.required, Validators.minLength(2)]],
        boughtAt: ['', [Validators.required, Validators.minLength(2)]]
      });
    }

    return form;
  }



}

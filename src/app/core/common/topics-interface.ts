import {Rate} from "./rate";
import {FormBuilder, FormGroup} from "@angular/forms";
import {StateService} from "../../members/Service/state.service";

export interface TopicsInterface {
  rateTopic: string;
  parentRate: Rate | null;
  editRate: Rate | null;
  statesService: StateService;

  generateForm(fb: FormBuilder, form: FormGroup): FormGroup;
}

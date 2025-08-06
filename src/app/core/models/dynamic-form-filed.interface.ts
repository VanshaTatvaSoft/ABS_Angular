import { CustomInputInterface } from "./custom-input.interface";

export interface DynamicFormField {
  key: string; // formControlName
  customInput: CustomInputInterface; // your UI input
  validations?: {
    name: string; // 'required' | 'minLength' | etc.
    value?: any;  // value for the validator (e.g., 5 for minlength)
    message: string;
  }[];
}

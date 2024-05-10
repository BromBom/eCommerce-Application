export interface OptionsListener {
  capture?: boolean;
  once?: boolean;
  passive?: boolean;
}

export type InputType =
  | 'text'
  | 'button'
  | 'email'
  | 'password'
  | 'checkbox'
  | 'color'
  | 'checkbox'
  | 'color'
  | 'date'
  | 'number'
  | 'search'
  | 'submit'
  | 'time';

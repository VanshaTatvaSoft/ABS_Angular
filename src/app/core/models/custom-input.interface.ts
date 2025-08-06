export interface CustomInputInterface {
  appearance: 'outline' | 'fill';
  type: string;
  placeholder: string;
  value?: string;
  id: string;
  name: string;
  icon?: string | null;
  label: string;
  hint?: string | null;
  disabled: boolean | false | null;
  options?: { value: string; label: string }[];
  class?: string;
}

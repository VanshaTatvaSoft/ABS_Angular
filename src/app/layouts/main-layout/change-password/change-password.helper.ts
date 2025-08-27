import { GenericInputInterface } from "@vanshasomani/generic-input"

export const ChangePasswordFormConfig: {
  currentPassword: GenericInputInterface;
  newPassword: GenericInputInterface;
  confirmPassword: GenericInputInterface;
} = {
  currentPassword: {
    appearance: 'outline',
    label: 'Password',
    type: 'password',
    class: 'w-100',
    placeholder: 'Enter Password',
    id: 'currentPassword',
    name: 'currentPassword',
    customErrorMessages: {
      required: 'Password is required'
    }
  },
  newPassword: {
    appearance: 'outline',
    label: 'New Password',
    type: 'password',
    class: 'w-100',
    placeholder: 'Enter New Password',
    id: 'newPassword',
    name: 'password',
    customErrorMessages: {
      required: 'Password is required',
      noUpperCase: 'Must contain at least 1 uppercase letter',
      noLowerCase: 'Must contain at least 1 lowercase letter',
      noSpecialChar: 'Must contain at least 1 special character',
      tooShort: 'Must be at least 8 characters long'
    }
  },
  confirmPassword: {
    appearance: 'outline',
    label: 'Confirm Password',
    type: 'password',
    placeholder: 'Confirm Password',
    id: 'confirmPassword',
    name: 'confirmPassword',
    class: 'w-100',
    disabled: false,
    customErrorMessages: {
      required: 'Confirm Password is required',
      passwordsMismatch: 'Password and Confirm Password must match',
      noUpperCase: 'Must contain at least 1 uppercase letter',
      noLowerCase: 'Must contain at least 1 lowercase letter',
      noSpecialChar: 'Must contain at least 1 special character',
      tooShort: 'Must be at least 8 characters long'
    }
  }
}
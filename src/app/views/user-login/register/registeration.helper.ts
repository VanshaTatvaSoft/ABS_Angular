import { GenericInputInterface } from "@vanshasomani/generic-input"
import { RoleOptions } from "../../../shared/constants/role-options.constant";

export const RegisterFormConfig: {
  name: GenericInputInterface;
  email: GenericInputInterface;
  password: GenericInputInterface;
  confirmPassword: GenericInputInterface;
  phoneNo: GenericInputInterface;
  role: GenericInputInterface;
} = {
  name: {
    appearance: 'outline',
    label: 'Name',
    type: 'text',
    class: 'w-100',
    placeholder: 'Enter Name',
    id: 'name',
    name: 'name',
    icon: 'person',
    customErrorMessages: {
      required: 'Name is required'
    }
  },
  email: {
    appearance: 'outline',
    label: 'Email',
    type: 'email',
    class: 'w-100',
    placeholder: 'Enter Email',
    id: 'email',
    name: 'email',
    icon: 'email',
    customErrorMessages: {
      required: 'Email is required',
      email: 'Enter a valid email address',
      notFound: 'User with this email already exist'
    }
  },
  password: {
    appearance: 'outline',
    label: 'Password',
    type: 'password',
    class: 'w-100',
    placeholder: 'Enter Password',
    id: 'password',
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
  },
  phoneNo: {
    appearance: 'outline',
    label: 'Phone No',
    type: 'text',
    placeholder: 'Enter Phone No',
    id: 'phoneNo',
    name: 'phoneNo',
    disabled: false,
    icon: 'phone',
    customErrorMessages: {
      required: 'Phone No is required',
      invalidPhone: 'Enter a valid phone number',
      invalidLength: 'Phone number must be 10 digits long'
    },
    class: 'w-100'
  },
  role: {
    appearance: 'outline',
    label: 'Role',
    type: 'select',
    placeholder: '',
    id: 'role',
    name: 'role',
    disabled: false,
    options: RoleOptions,
    icon: 'settings',
    value: '',
    class: 'w-100'
  }
}

import { GenericInputInterface } from "@vanshasomani/generic-input"

export const LoginFormConfig: {
  email: GenericInputInterface;
  password: GenericInputInterface;
} = {
  email: {
    appearance: 'outline',
    class: 'w-100',
    label: 'Email',
    type: 'email',
    placeholder: 'Enter your email',
    id: 'userEmail',
    name: 'userEmail',
    disabled: false,
    icon: 'email',
    customErrorMessages: {
      required: 'Email is required',
      email: 'Enter a valid email',
      notFound: 'There is no such user'
    }
  },
  password: {
    appearance: 'outline',
    class: 'w-100',
    label: 'Password',
    type: 'password',
    placeholder: 'Enter your password',
    id: 'userPassword',
    name: 'userPassword',
    disabled: false,
    customErrorMessages: {
      required: 'password is required'
    }
  }
}
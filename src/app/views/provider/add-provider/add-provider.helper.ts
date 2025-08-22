import { GenericInputInterface } from "@vanshasomani/generic-input";

export const AddProviderForm: {
  providerName: GenericInputInterface;
  providerEmail: GenericInputInterface;
  phoneNo: GenericInputInterface;
} = {
  providerName : {
    appearance: 'outline',
    class: 'w-100',
    label: 'Provider Name',
    type: 'text',
    name: 'providerName',
    id: 'providerName',
    placeholder: 'Enter provider name',
    icon: 'person',
    customErrorMessages: {
      required: 'Provider name is required'
    }
  },
  providerEmail : {
    appearance: 'outline',
    class: 'w-100',
    label: 'Provider Email',
    type: 'email',
    name: 'providerEmail',
    id: 'providerEmail',
    placeholder: 'Enter provider email',
    icon: 'email',
    customErrorMessages: {
      required: 'Provider email is required',
      email: 'Provider email is invalid'
    }
  },
  phoneNo : {
    appearance: 'outline',
    class: 'w-100',
    label: 'Phone Number',
    type: 'text',
    name: 'providerPhoneNo',
    id: 'providerPhoneNo',
    icon: 'phone',
    placeholder: 'Enter phone number',
    customErrorMessages: {
      required: 'Phone number is required',
      invalidPhone: 'Phone number is invalid'
    }
  }
}
